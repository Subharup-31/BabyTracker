# Email Setup for Vaccine Reminders

## Overview
BabyTrack automatically sends email reminders to users when their baby's vaccines are due within 3 days.

## Gmail App Password Setup

Since you're using `pediatric168@gmail.com`, you need to create a Gmail App Password:

### Steps:

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/apppasswords
   - Sign in with `pediatric168@gmail.com`

2. **Enable 2-Step Verification** (if not already enabled)
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

3. **Create App Password**
   - Go back to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device and name it "BabyTrack"
   - Click "Generate"
   - Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

4. **Update .env File**
   ```
   EMAIL_USER=pediatric168@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```
   (Paste the app password you just generated)

5. **Restart the Server**
   ```bash
   npm run dev
   ```

## How It Works

- **Automatic Check**: The system checks every 24 hours for upcoming vaccines
- **Reminder Window**: Sends emails for vaccines due within the next 3 days
- **Email Content**: Beautiful HTML email with vaccine details and a link to the app
- **Only Pending Vaccines**: Only sends reminders for vaccines marked as "Pending"

## Testing

To test the email system:

1. Add a vaccine with a due date 1-3 days from today
2. Wait for the next scheduled check (or restart the server to trigger immediately)
3. Check the email inbox of the user who created the vaccine

## Email Template

The email includes:
- Baby's name
- Vaccine name
- Due date (formatted nicely)
- Direct link to vaccine schedule
- Professional BabyTrack branding

## Troubleshooting

If emails aren't sending:

1. **Check server logs** for email errors
2. **Verify Gmail App Password** is correct in .env
3. **Check 2-Step Verification** is enabled on the Gmail account
4. **Test email connection** - server logs will show "✅ Email service is ready" on startup
5. **Check spam folder** - first emails might go to spam

## Security Notes

- Never commit the .env file with the real password
- Use Gmail App Passwords, not your regular Gmail password
- The app password can be revoked anytime from Google Account settings
