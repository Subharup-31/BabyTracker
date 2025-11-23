# Admin Portal Setup Instructions

## Overview
An admin portal has been added to the BabyTracker application. Admins can view statistics and see all registered babies.

## Setting Up Admin Access

### Option 1: Using Environment Variable (Recommended for Development)
Add this to your `.env` file:
```
ADMIN_EMAIL=your-admin-email@example.com
```

Any user who logs in with this email will automatically have admin access.

### Option 2: Using Supabase User Metadata
You can manually set a user as admin in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click on the user you want to make admin
4. In the "User Metadata" section, add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save the changes

## Accessing the Admin Portal

1. Log in with an admin account
2. You'll see a shield icon (🛡️) in the top navigation bar
3. Click it to access the admin dashboard at `/admin`

## Admin Features

The admin portal shows:
- **Total Babies**: Number of registered baby profiles
- **Total Users**: Number of user accounts
- **Total Vaccines**: Number of vaccine records
- **Total Growth Records**: Number of growth tracking entries
- **Recent Registrations**: New babies registered in the last 30 days
- **Babies List**: Complete table of all registered babies with their details

## Security

- Admin routes are protected with middleware that checks user role
- Non-admin users will be redirected if they try to access `/admin`
- All admin API endpoints require authentication and admin privileges
