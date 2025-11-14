# Fix: Receiving Magic Links Instead of OTP Codes

## Problem
The frontend is configured for OTP code entry, but emails contain magic links instead of 6-digit codes.

## Solution

### Step 1: Verify Email OTP is Enabled

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your KarmAnk project
3. Navigate to **Authentication** → **Providers** (left sidebar)
4. Find **Email** in the providers list
5. Click on **Email** to expand settings
6. Scroll down and ensure **"Enable email OTP"** is toggled **ON**

### Step 2: Configure the Correct Email Template

**Important:** Supabase uses different email templates for magic links vs OTP codes.

1. Go to **Authentication** → **Email Templates** (left sidebar)
2. You'll see multiple templates. Look for **"Magic Link"** template
3. **The key**: When "Enable email OTP" is ON, Supabase automatically uses the OTP template
4. Click on **"Confirm signup"** or **"Magic Link"** template (they may be combined)
5. Look for the template body - it should contain `{{ .Token }}` variable

**Correct OTP Template Example:**
```html
<h2>Your Verification Code</h2>
<p>Use this code to sign in to KarmAnk:</p>
<h1>{{ .Token }}</h1>
<p>This code will expire in 60 minutes.</p>
```

**Wrong Template (Magic Link):**
```html
<p>Click here to sign in:</p>
<a href="{{ .ConfirmationURL }}">Sign In</a>
```

### Step 3: Test Email Flow

After enabling "Enable email OTP", test the flow:

1. Clear your browser cache
2. Go to your app and try logging in
3. Check the email you receive

**Expected Email Content:**
- Subject: Something like "Confirm Your Signup" or "Your OTP Code"
- Body: Contains a 6-digit number like `123456`
- Should **NOT** contain a clickable link

### Step 4: If Still Receiving Magic Links

If you're still receiving magic links after enabling OTP:

1. **Double-check the setting:**
   - Go to **Authentication** → **Providers** → **Email**
   - Confirm "Enable email OTP" toggle is **ON** (blue/green)
   - Click **Save** at the bottom of the page

2. **Check Email Template Variables:**
   - Go to **Authentication** → **Email Templates**
   - Edit the template being used
   - Replace `{{ .ConfirmationURL }}` with `{{ .Token }}`
   - Example template:
     ```
     Your KarmAnk verification code is:

     {{ .Token }}

     Valid for 60 minutes.
     ```

3. **Wait a few minutes:**
   - Sometimes Supabase takes 1-2 minutes to apply configuration changes
   - Clear your browser cache and try again

### Step 5: Verify Configuration

To confirm OTP is working:

1. Send a test login request from your app
2. Check the Supabase **Logs**:
   - Go to **Authentication** → **Logs**
   - Look for recent authentication events
   - Should show "OTP sent" or similar

## Common Issues

### Issue: "Confirmation URL" in Email
**Cause:** Magic Link template is being used instead of OTP template
**Fix:** Ensure "Enable email OTP" is ON and template uses `{{ .Token }}`

### Issue: No Email Received
**Cause:** Email provider issues or rate limiting
**Fix:**
- Check spam folder
- Check Supabase logs for errors
- Verify email rate limits in Authentication → Rate Limits

### Issue: Code Not Working
**Cause:** May be using old magic link flow
**Fix:**
- Clear browser storage/cache
- Ensure frontend code uses `verifyOtp()` method (already implemented)

## Verification Checklist

After making changes:

- [ ] "Enable email OTP" is toggled ON in Email provider settings
- [ ] Email template contains `{{ .Token }}` variable
- [ ] Email template does NOT contain `{{ .ConfirmationURL }}`
- [ ] Saved all changes in Supabase dashboard
- [ ] Cleared browser cache
- [ ] Test email contains a 6-digit code (not a link)
- [ ] Code can be entered in the app and successfully logs you in

## Alternative: Quick Test Template

If you want a simple, working OTP email template, use this:

**Subject:**
```
Your KarmAnk Sign-In Code
```

**Body:**
```
Hello!

Your verification code is:

{{ .Token }}

This code is valid for 60 minutes.

If you didn't request this code, please ignore this email.

Best regards,
KarmAnk Team
```

**To apply this:**
1. Go to Authentication → Email Templates
2. Click on the active template (Magic Link or Confirm signup)
3. Paste the above content
4. Make sure `{{ .Token }}` is present
5. Click **Save**

## Screenshot Reference

When you enable "Enable email OTP", the setting should look like this:

```
Authentication > Providers > Email

☑ Enable Email provider
☑ Enable email confirmations
☑ Enable email OTP          ← THIS MUST BE ON
☑ Secure email change
```

## Still Having Issues?

If you're still receiving magic links after following all steps:

1. **Create a new test:**
   - Use a different email address
   - Clear all browser data
   - Try the signup flow again

2. **Check Supabase version:**
   - Some older projects may need to be updated
   - Check Supabase changelog for OTP support

3. **Contact Supabase support:**
   - Check their Discord: https://discord.supabase.com
   - Their support can verify your project settings

## What the Frontend Does

Your frontend is already correctly configured:

1. **Step 1:** Calls `signInWithOtp(email)` → Sends OTP request
2. **Step 2:** User receives 6-digit code via email
3. **Step 3:** User enters code in app
4. **Step 4:** Calls `verifyOtp(email, token)` → Verifies code
5. **Step 5:** User is authenticated

The issue is purely on the Supabase configuration side, not the frontend code.

---

**Summary:** Enable "Enable email OTP" toggle in Supabase dashboard → Email provider settings, and ensure the email template uses `{{ .Token }}` instead of `{{ .ConfirmationURL }}`.
