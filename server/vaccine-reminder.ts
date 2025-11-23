import { supabaseAdmin } from './db';
import { sendVaccineReminder } from './email';

// Check for vaccines due in the next 3 days and send reminders
export async function checkAndSendVaccineReminders(): Promise<void> {
  try {
    console.log('🔍 Checking for upcoming vaccines...');

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    // Get all pending vaccines due in the next 3 days that haven't been reminded yet
    const { data: vaccines, error } = await supabaseAdmin
      .from('vaccines')
      .select('*')
      .eq('status', 'Pending')
      .eq('reminder_sent', false)
      .gte('due_date', today.toISOString().split('T')[0])
      .lte('due_date', threeDaysFromNow.toISOString().split('T')[0]);

    if (error) {
      console.error('❌ Error fetching vaccines:', error);
      return;
    }

    if (!vaccines || vaccines.length === 0) {
      console.log('✅ No upcoming vaccines found');
      return;
    }

    console.log(`📧 Found ${vaccines.length} upcoming vaccine(s)`);

    // Send reminder for each vaccine
    for (const vaccine of vaccines) {
      try {
        // Get baby profile for this vaccine
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('baby_profiles')
          .select('baby_name, user_id')
          .eq('user_id', vaccine.user_id)
          .single();

        if (profileError || !profile) {
          console.error(`❌ Could not get profile for user ${vaccine.user_id}`);
          continue;
        }

        // Get user email
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
          vaccine.user_id
        );

        if (userError || !userData.user?.email) {
          console.error(`❌ Could not get email for user ${vaccine.user_id}`);
          continue;
        }

        // Send reminder email
        await sendVaccineReminder({
          to: userData.user.email,
          babyName: profile.baby_name,
          vaccineName: vaccine.vaccine_name,
          dueDate: vaccine.due_date,
        });

        // Mark reminder as sent
        await supabaseAdmin
          .from('vaccines')
          .update({ reminder_sent: true })
          .eq('id', vaccine.id);

        console.log(`✅ Sent reminder for ${vaccine.vaccine_name} to ${userData.user.email}`);
      } catch (emailError) {
        console.error(`❌ Error sending reminder for vaccine ${vaccine.id}:`, emailError);
      }
    }

    console.log('✅ Vaccine reminder check completed');
  } catch (error) {
    console.error('❌ Error in vaccine reminder check:', error);
  }
}

// Start the reminder scheduler (runs every hour)
export function startVaccineReminderScheduler(): void {
  console.log('🕐 Starting vaccine reminder scheduler...');

  // Run immediately on startup
  checkAndSendVaccineReminders();

  // Then run every hour
  setInterval(() => {
    checkAndSendVaccineReminders();
  }, 60 * 60 * 1000); // 1 hour

  console.log('✅ Vaccine reminder scheduler started (runs every hour)');
}
