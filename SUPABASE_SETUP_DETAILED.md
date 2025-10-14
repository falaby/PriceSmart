# Supabase Setup - Detailed Step-by-Step Guide

## Step 1: Create Supabase Account

1. Open your browser and go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub (recommended - fastest)
   - OR email/password
4. Verify your email if using email signup

## Step 2: Create New Project

1. Once logged in, click **"New Project"**
2. You'll need to create an **Organization** first if you don't have one:
   - Click "New organization"
   - Name it (e.g., "PriceSmart" or your name)
   - Click "Create organization"
3. Now create the project:
   - **Name**: `pricingsmart` (or your preferred name)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., "US West" or "US East")
   - **Pricing Plan**: Free (sufficient for this project)
4. Click **"Create new project"**
5. Wait 1-2 minutes for setup to complete

## Step 3: Run Database Migration

1. In your Supabase project dashboard, look for the left sidebar
2. Click **"SQL Editor"** (looks like a database icon)
3. Click **"New query"** button
4. Copy the ENTIRE contents of this file: `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL editor
6. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
7. You should see success messages:
   - "Success. No rows returned"
   - OR a list of created tables

### Verify Migration Success

1. In the left sidebar, click **"Table Editor"**
2. You should see 3 new tables:
   - ✅ `products`
   - ✅ `pricing_analyses`
   - ✅ `subscriptions`
3. Click on each table to verify they have columns

## Step 4: Get API Keys

### Get Project URL:
1. In left sidebar, click **"Project Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. Scroll to **"Project URL"**
4. Copy the URL (looks like: `https://abcdefghijklmnop.supabase.co`)
5. **SAVE THIS** - you'll need it for `.env.local`

### Get Anonymous Key (anon, public):
1. Still in Project Settings > API
2. Scroll to **"Project API keys"**
3. Find **"anon" "public"** key
4. Click the copy icon
5. **SAVE THIS** - this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Get Service Role Key (secret):
1. Still in same section
2. Find **"service_role" "secret"** key
3. Click to reveal it
4. Click the copy icon
5. **SAVE THIS SECURELY** - this is your `SUPABASE_SERVICE_ROLE_KEY`
6. ⚠️ **NEVER commit this to Git or share publicly!**

## Step 5: Configure Environment Variables

1. Open your project folder in your code editor
2. Create a new file named `.env.local` (if it doesn't exist)
3. Add these lines with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...

# You'll add other keys later (Stripe, APIs, etc.)
```

4. Save the file
5. ⚠️ Make sure `.env.local` is in your `.gitignore` (it already is!)

## Step 6: Verify Supabase Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open browser to http://localhost:3000

3. Click **"Sign Up"**

4. Try to create an account with:
   - Email: test@example.com
   - Password: testpassword123

5. If successful, you should be redirected to the dashboard!

6. Check in Supabase:
   - Go to **Authentication** in left sidebar
   - Click **"Users"**
   - You should see your test user!
   - Go to **Table Editor > subscriptions**
   - You should see a subscription row created automatically!

## Step 7: Verify Row Level Security (RLS)

1. In Supabase, go to **Authentication > Policies**
2. You should see policies for each table:
   - `products`: 4 policies (select, insert, update, delete)
   - `pricing_analyses`: 2 policies (select, insert)
   - `subscriptions`: 2 policies (select, update)
3. All should show status: ✅ Enabled

## Troubleshooting

### Migration Failed?
- Check the SQL syntax in the error message
- Make sure you copied the ENTIRE file contents
- Try running it section by section (tables first, then policies)

### Can't See Tables?
- Wait a moment and refresh the page
- Check the SQL Editor for any error messages
- Make sure migration ran successfully (green checkmark)

### Authentication Not Working?
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Check browser console for errors (F12 > Console)
- Restart your dev server: Ctrl+C, then `npm run dev`

### Connection Refused?
- Make sure your Supabase project is fully provisioned (green status)
- Check your internet connection
- Try accessing Supabase dashboard - if it loads, project is online
- Verify environment variables have no extra spaces or quotes

---

## Quick Reference

**What you need from Supabase:**
1. ✅ Project URL (for NEXT_PUBLIC_SUPABASE_URL)
2. ✅ Anon/Public key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. ✅ Service Role key (for SUPABASE_SERVICE_ROLE_KEY)

**Where to find them:**
- All three: Project Settings > API

**Next steps:**
- Set up Stripe (see DEPLOYMENT_GUIDE.md)
- Get e-commerce API keys (Etsy, eBay, RapidAPI)
- Deploy to Vercel

---

## Success Checklist

- [x] ✅ Supabase account created
- [x] ✅ New project created
- [x] ✅ Database migration run successfully
- [x] ✅ Three tables visible (products, pricing_analyses, subscriptions)
- [x] ✅ Project URL copied
- [x] ✅ Anon key copied
- [x] ✅ Service role key copied
- [x] ✅ `.env.local` file created with keys
- [x] ✅ Test signup works
- [x] ✅ User appears in Supabase Authentication
- [x] ✅ Subscription row auto-created

**If all checked, you're ready to move on to Stripe setup!** 🎉
