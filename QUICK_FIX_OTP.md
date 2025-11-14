# Quick Fix: Enable OTP Codes (Stop Receiving Magic Links)

## The Problem
✉️ You're getting **magic links** in email instead of **6-digit codes**

## The Solution (2 minutes)

### Step 1: Go to Supabase Dashboard
1. Open https://app.supabase.com
2. Select your KarmAnk project

### Step 2: Enable OTP
1. Click **Authentication** (left sidebar)
2. Click **Providers**
3. Click on **Email** to expand it
4. **Scroll down** to "Email Auth Settings"
5. Find **"Enable email OTP"** toggle
6. **Turn it ON** ✅
7. Click **Save** at the bottom

### Step 3: Test
1. Clear your browser cache
2. Try logging in again
3. Check your email - should now have a 6-digit code!

## Visual Steps

```
Step 1: Navigate
┌─────────────────────────────────────┐
│ Supabase Dashboard                  │
│ ├── Authentication ← Click here     │
│     └── Providers ← Then click here │
└─────────────────────────────────────┘

Step 2: Configure
┌─────────────────────────────────────┐
│ Email Provider Settings             │
│ ☑ Enable Email provider             │
│ ☐ Enable email confirmations        │
│ ☑ Enable email OTP ← TURN THIS ON!  │
│ ☑ Secure email change               │
│                                     │
│            [Save] ← Click           │
└─────────────────────────────────────┘
```

## Before vs After

### Before (Wrong - Magic Link)
```
Email Subject: "Confirm your signup"

Click this link to sign in:
https://example.supabase.co/auth/v1/verify?token=...

❌ This won't work with your app!
```

### After (Correct - OTP Code)
```
Email Subject: "Your verification code"

Your KarmAnk verification code is:

   1 2 3 4 5 6

This code expires in 60 minutes.

✅ Enter this code in the app!
```

## Troubleshooting

**Still getting magic links?**
1. Make sure you clicked **Save** after toggling the setting
2. Wait 1-2 minutes for changes to apply
3. Clear browser cache and try again

**No email arriving?**
1. Check spam/junk folder
2. Verify rate limits (Authentication → Rate Limits)
3. Check Supabase logs (Authentication → Logs)

**Code doesn't work?**
1. Make sure code is exactly 6 digits
2. No spaces before or after the code
3. Code expires after 60 minutes - get a new one

## Need More Help?

See full guide: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
See detailed fix: [SUPABASE_OTP_FIX.md](SUPABASE_OTP_FIX.md)

---

**TL;DR:** Go to Supabase → Authentication → Providers → Email → Turn ON "Enable email OTP" → Save
