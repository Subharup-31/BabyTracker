import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'pediatric168@gmail.com',
    pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, ''), // Remove spaces from app password
  },
});

export interface VaccineReminderEmail {
  to: string;
  babyName: string;
  vaccineName: string;
  dueDate: string;
}

export async function sendVaccineReminder(data: VaccineReminderEmail): Promise<void> {
  const { to, babyName, vaccineName, dueDate } = data;

  const mailOptions = {
    from: '"BabyTrack - Vaccine Reminder" <pediatric168@gmail.com>',
    to: to,
    subject: `🩺 Vaccine Reminder: ${vaccineName} for ${babyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .vaccine-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🩺 Vaccine Reminder</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>This is a friendly reminder that <strong>${babyName}</strong> has an upcoming vaccine due soon!</p>
            
            <div class="vaccine-info">
              <h2 style="margin-top: 0; color: #667eea;">📅 Vaccine Details</h2>
              <p><strong>Vaccine:</strong> ${vaccineName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Baby:</strong> ${babyName}</p>
            </div>

            <p>Please schedule an appointment with your pediatrician to ensure ${babyName} receives this important vaccination on time.</p>
            
            <a href="http://localhost:3000/vaccines" class="button">View Vaccine Schedule</a>

            <div class="footer">
              <p>This is an automated reminder from BabyTrack</p>
              <p>© ${new Date().getFullYear()} BabyTrack - Your Baby's Health Companion</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Vaccine Reminder for ${babyName}

Vaccine: ${vaccineName}
Due Date: ${new Date(dueDate).toLocaleDateString()}

Please schedule an appointment with your pediatrician to ensure ${babyName} receives this important vaccination on time.

Visit http://localhost:3000/vaccines to view your complete vaccine schedule.

- BabyTrack Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Vaccine reminder email sent to ${to} for ${vaccineName}`);
  } catch (error) {
    console.error('❌ Error sending vaccine reminder email:', error);
    throw error;
  }
}

// Test email connection
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
}
