# Admin Portal Troubleshooting Guide

## Step 1: Set Your Admin Email

Add this line to your `.env` file:
```
ADMIN_EMAIL=your-actual-email@example.com
```

**Important:** Use the EXACT email address you use to log in!

## Step 2: Restart the Server

After adding ADMIN_EMAIL to .env, you MUST restart the server:

1. Stop the current server (Ctrl+C in the terminal)
2. Run: `npm run dev`

## Step 3: Log In

1. Go to http://localhost:3000
2. Log in with the email you set as ADMIN_EMAIL
3. After login, you should see an orange "Admin" button with a shield icon in the header

## Step 4: Check the Console

Open your browser's Developer Tools (F12) and check the Console tab. You should see:
```
🔍 Admin check for user: your-email@example.com
   - ADMIN_EMAIL env: your-email@example.com
   - User metadata role: none
   - Has admin role: false
   - Matches admin email: true
   - Final result: ✅ IS ADMIN
```

Also check the server terminal for similar logs.

## Common Issues

### Issue 1: "Admin button not showing"
**Solution:** 
- Make sure ADMIN_EMAIL is set in `.env`
- Restart the server after adding it
- Log out and log back in

### Issue 2: "ADMIN_EMAIL env: NOT SET" in console
**Solution:**
- The .env file wasn't loaded
- Make sure the file is named `.env` (not `.env.txt`)
- Restart the server

### Issue 3: "Matches admin email: false"
**Solution:**
- The email in .env doesn't match your login email
- Check for typos or extra spaces
- Make sure you're using the exact same email

## Quick Test

Run this in your browser console after logging in:
```javascript
fetch('/api/admin/check', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Admin status:', d))
```

You should see: `Admin status: { isAdmin: true }`

## Still Not Working?

Check your server terminal logs - they will show exactly what's happening with the admin check.
