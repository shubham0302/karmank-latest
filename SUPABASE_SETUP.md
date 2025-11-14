# Supabase Setup Guide for KarmAnk

This guide will walk you through setting up Supabase authentication for the KarmAnk numerology application.

## Prerequisites

- A Supabase account (free tier is sufficient)
- The KarmAnk application codebase

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create a new account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: KarmAnk (or your preferred name)
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Select the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for getting started
5. Click **"Create new project"**
6. Wait for the project to be provisioned (this may take 1-2 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in the sidebar)
2. Navigate to **API** section
3. You'll see two important values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")
4. **Copy these values** - you'll need them in Step 5

## Step 3: Configure Email Authentication

### Enable Email OTP (6-Digit Code) - CRITICAL STEP

**⚠️ IMPORTANT:** This step is REQUIRED or you'll receive magic links instead of OTP codes!

1. In your Supabase project dashboard, go to **Authentication** (in the left sidebar)
2. Click on **Providers**
3. Find **Email** in the list of providers and click on it to expand
4. Ensure **Email** provider is enabled (toggle should be ON)
5. **Scroll down** to find **Email Auth Settings** section
6. Look for the toggle **"Enable email OTP"**
7. Turn **"Enable email OTP"** to **ON** (this is the critical step!)
   - This toggle changes the email from sending magic links to sending 6-digit codes
   - When ON, emails will contain `{{ .Token }}` (the code) instead of `{{ .ConfirmationURL }}` (the link)
8. Other settings:
   - **Enable email confirmations**: Can be OFF (we're using OTP codes)
   - **Secure email change**: Turn this ON (recommended)
9. **Click SAVE** at the bottom of the page

**What happens when "Enable email OTP" is ON:**
- ✅ Emails contain a 6-digit code (e.g., `123456`)
- ✅ Users enter the code in your app
- ❌ NO clickable links in the email

**What happens when "Enable email OTP" is OFF:**
- ❌ Emails contain a magic link (URL)
- ❌ Users must click the link (won't work with our frontend)
- ✅ Traditional magic link authentication

**Visual Guide - Where to Find the Setting:**
```
Supabase Dashboard
├── Authentication (sidebar)
│   ├── Providers
│   │   ├── Email (click to expand)
│   │   │   ├── ☑ Enable Email provider
│   │   │   ├── Email Auth Settings ⬇
│   │   │   │   ├── ☐ Enable email confirmations
│   │   │   │   ├── ☑ Enable email OTP  ← TURN THIS ON!
│   │   │   │   └── ☑ Secure email change
│   │   │   └── [Save] button (bottom of page)
```

**Quick Check:**
- If you see `{{ .ConfirmationURL }}` in your email → Magic Link mode (wrong)
- If you see `{{ .Token }}` or a 6-digit number → OTP mode (correct!)

### Configure Email Templates (Recommended)

1. Still in **Authentication** → **Email Templates**
2. Customize the **OTP** (or **Confirm signup**) email template:
   - Click on the appropriate template
   - You can customize the subject line and message
   - Make sure the `{{ .Token }}` variable is present in the template (this is the 6-digit code)
   - Example subject: "Your KarmAnk Sign-In Code"
   - Example message:
     ```
     Hi there!

     Your KarmAnk verification code is:

     {{ .Token }}

     This code will expire in 60 minutes.

     If you didn't request this code, you can safely ignore this email.

     Discover Your Cosmic Destiny,
     The KarmAnk Team
     ```
3. Click **Save** to apply your changes

### Configure Site URL (Optional for OTP)

1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL**: `http://localhost:5173` (for local development)
   - For production, change this to your deployed domain (e.g., `https://karmank.com`)
3. **Note**: Redirect URLs are not needed for OTP authentication since users enter the code directly in the app
4. Click **Save**

## Step 4: Configure Email Provider (For Production)

**Note**: For local development, Supabase's built-in email service works fine. For production, you should configure a custom SMTP provider for reliability.

### Using Custom SMTP (Production Recommended)

1. Go to **Project Settings** → **Authentication**
2. Scroll down to **SMTP Settings**
3. Toggle **Enable Custom SMTP**
4. Enter your SMTP credentials:
   - **Host**: Your SMTP server (e.g., `smtp.sendgrid.net`, `smtp.gmail.com`)
   - **Port**: Usually 587 or 465
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password
   - **Sender email**: The "from" email address
   - **Sender name**: "KarmAnk" (or your preferred sender name)
5. Click **Save**

### Popular SMTP Providers:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Pay as you go, very affordable)
- **Resend** (Free tier: 3,000 emails/month)

## Step 5: Configure Your Local Environment

1. Open your KarmAnk project directory
2. Locate the `.env` file (if it doesn't exist, copy `.env.example` to `.env`)
3. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Replace the placeholder values with the credentials from Step 2
5. **Important**: Never commit the `.env` file to version control!

## Step 6: Test the Authentication Flow

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open your browser to `http://localhost:5173`
3. You should be redirected to the **Login** page (since you're not authenticated)
4. Enter a valid email address and click **"Send Code"**
5. Check your email inbox for the **6-digit verification code**
6. Enter the code in the verification screen
7. Click **"Verify Code"** and you should be logged in!
8. Your email should appear in the top-right corner with a **"Sign Out"** button

**Note**: The OTP code is valid for 60 minutes by default.

## Step 7: Additional Security Settings (Recommended)

### Rate Limiting

1. Go to **Authentication** → **Rate Limits**
2. Configure appropriate limits to prevent abuse:
   - **Email sent per hour**: 4-6 (prevents email spam)
   - **SMS sent per hour**: Not applicable for this app

### Password Settings (If using password auth in the future)

1. Go to **Authentication** → **Policies**
2. Set minimum password requirements:
   - **Minimum length**: 8 characters (recommended)
   - **Require uppercase**: Optional
   - **Require lowercase**: Optional
   - **Require numbers**: Optional
   - **Require special characters**: Optional

## Troubleshooting

### "Invalid API key" Error
- Double-check that you copied the **anon/public** key (not the service_role key)
- Ensure there are no extra spaces in your `.env` file

### OTP Code Not Arriving
- Check your spam/junk folder
- Verify the email address is correct
- Check Supabase logs: **Authentication** → **Logs**
- For Gmail users: Sometimes emails are delayed by 1-2 minutes
- Ensure "Enable email OTP" is turned ON in Authentication settings

### "Email rate limit exceeded"
- Wait for the rate limit window to reset (usually 1 hour)
- Or increase rate limits in **Authentication** → **Rate Limits**

### Invalid or Expired OTP Code
- Make sure you're entering the most recent code (codes expire after 60 minutes)
- Request a new code if the current one has expired
- Ensure you're entering exactly 6 digits with no spaces

### Not Redirecting After Successful Verification
- Clear browser cache and cookies
- Check browser console for errors
- Verify the AuthContext is properly wrapping your app in App.jsx

### Environment Variables Not Loading
- Restart your dev server after changing `.env` file
- Vite requires `VITE_` prefix for environment variables to be exposed to the client
- Ensure the `.env` file is in the project root directory

## Production Deployment Checklist

Before deploying to production:

- [ ] Update **Site URL** in Supabase to your production domain
- [ ] Configure custom SMTP provider for reliable email delivery
- [ ] Set up appropriate **Rate Limits**
- [ ] Update `.env` file on production server with production Supabase credentials
- [ ] Test the authentication flow on production
- [ ] Enable RLS (Row Level Security) if you add database tables in the future
- [ ] Set up monitoring and logging for authentication events

## Next Steps

Now that authentication is set up, you can:

1. Customize the login page styling in [src/components/auth/LoginPage.jsx](src/components/auth/LoginPage.jsx)
2. Add additional authentication providers (Google, GitHub, etc.) in Supabase dashboard
3. Implement user profiles or saved reports by adding database tables
4. Add role-based access control (RBAC) for premium features

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email OTP Authentication Guide](https://supabase.com/docs/guides/auth/auth-email-otp)
- [React Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

## Support

If you encounter issues:

1. Check the Supabase logs: **Project** → **Logs** → **Auth Logs**
2. Review the [Supabase Discord Community](https://discord.supabase.com)
3. Search [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)

---

**Happy authenticating! May your cosmic journey be secure and seamless.** ✨
