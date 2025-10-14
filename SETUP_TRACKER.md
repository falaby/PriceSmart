# PriceSmart Setup Progress Tracker

Use this file to track your setup progress. Check off each item as you complete it.

## ☐ 1. Supabase Setup (Est. Time: 10 minutes)

**Status:** Not Started

### Steps:
- [ ] 1.1 Create Supabase account at https://supabase.com
- [ ] 1.2 Create new organization (if needed)
- [ ] 1.3 Create new project named "pricingsmart"
- [ ] 1.4 Save database password securely
- [ ] 1.5 Wait for project to finish provisioning
- [ ] 1.6 Go to SQL Editor
- [ ] 1.7 Copy contents of `supabase/migrations/001_initial_schema.sql`
- [ ] 1.8 Paste and run in SQL Editor
- [ ] 1.9 Verify 3 tables created (products, pricing_analyses, subscriptions)
- [ ] 1.10 Go to Project Settings > API
- [ ] 1.11 Copy Project URL → Save in notes
- [ ] 1.12 Copy anon/public key → Save in notes
- [ ] 1.13 Copy service_role key → Save in notes (KEEP SECRET!)

**My Supabase Credentials:**
```
Project URL: _________________________________
Anon Key: ____________________________________
Service Role: ________________________________ (KEEP SECRET!)
```

---

## ☐ 2. Stripe Setup (Est. Time: 10 minutes)

**Status:** Not Started

### Steps:
- [ ] 2.1 Create Stripe account at https://stripe.com
- [ ] 2.2 Complete account verification (if required)
- [ ] 2.3 Go to Products section
- [ ] 2.4 Click "Add Product"
- [ ] 2.5 Name: "PriceSmart Premium"
- [ ] 2.6 Add price: $9.99/month, recurring
- [ ] 2.7 Save product
- [ ] 2.8 Copy Price ID (starts with `price_`)
- [ ] 2.9 Go to Developers > API keys
- [ ] 2.10 Copy Publishable key (starts with `pk_test_`)
- [ ] 2.11 Copy Secret key (starts with `sk_test_`)
- [ ] 2.12 Note: Webhook secret comes after deployment

**My Stripe Credentials:**
```
Price ID: ____________________________________
Publishable Key: _____________________________
Secret Key: __________________________________ (KEEP SECRET!)
Webhook Secret: (add after deployment)
```

---

## ☐ 3. Etsy API Setup (Est. Time: 5 minutes)

**Status:** Not Started

### Steps:
- [ ] 3.1 Go to https://www.etsy.com/developers/
- [ ] 3.2 Sign in with Etsy account (or create one)
- [ ] 3.3 Click "Register as a Developer" (if needed)
- [ ] 3.4 Click "Create a New App"
- [ ] 3.5 Fill in app details:
  - Name: "PriceSmart"
  - Description: "Pricing analysis tool"
  - Website: Your Vercel URL (or placeholder)
- [ ] 3.6 Submit and wait for approval (usually instant)
- [ ] 3.7 Copy API Key (also called "Keystring")

**My Etsy Credentials:**
```
API Key: _____________________________________
```

---

## ☐ 4. eBay API Setup (Est. Time: 10 minutes)

**Status:** Not Started

### Steps:
- [ ] 4.1 Go to https://developer.ebay.com/
- [ ] 4.2 Sign in with eBay account (or create one)
- [ ] 4.3 Click "Get Started" or "My Account"
- [ ] 4.4 Click "Create Application"
- [ ] 4.5 Choose "Production" environment
- [ ] 4.6 Fill in details:
  - Name: "PriceSmart"
  - Description: "Product pricing tool"
- [ ] 4.7 Submit application
- [ ] 4.8 Go to Application Keys section
- [ ] 4.9 Copy Client ID (App ID)
- [ ] 4.10 Copy Client Secret (Cert ID)

**My eBay Credentials:**
```
Client ID: ___________________________________
Client Secret: _______________________________ (KEEP SECRET!)
```

---

## ☐ 5. RapidAPI Setup (Amazon Data) (Est. Time: 5 minutes)

**Status:** Not Started

### Steps:
- [ ] 5.1 Go to https://rapidapi.com/
- [ ] 5.2 Sign up for free account
- [ ] 5.3 Search for "Real-Time Amazon Data"
- [ ] 5.4 Select the API by "letscrape-6bRBa3QguO5"
- [ ] 5.5 Click "Subscribe to Test"
- [ ] 5.6 Choose "Basic" plan (free - 500 requests/month)
- [ ] 5.7 Complete subscription
- [ ] 5.8 Go to "Code Snippets" tab
- [ ] 5.9 Copy the X-RapidAPI-Key value

**My RapidAPI Credentials:**
```
API Key: _____________________________________
```

---

## ☐ 6. Create .env.local File (Est. Time: 2 minutes)

**Status:** Not Started

### Steps:
- [ ] 6.1 In your project folder, create file named `.env.local`
- [ ] 6.2 Copy all credentials from above sections
- [ ] 6.3 Paste into `.env.local` using this format:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_... (add after deployment)

# E-commerce APIs
ETSY_API_KEY=your_etsy_key_here
EBAY_CLIENT_ID=your_ebay_client_id_here
EBAY_CLIENT_SECRET=your_ebay_secret_here
RAPIDAPI_KEY=your_rapidapi_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] 6.4 Save the file
- [ ] 6.5 Verify `.env.local` is in `.gitignore` (it already is!)

---

## ☐ 7. Test Locally (Est. Time: 5 minutes)

**Status:** Not Started

### Steps:
- [ ] 7.1 Open terminal in project folder
- [ ] 7.2 Run: `npm install` (if not done already)
- [ ] 7.3 Run: `npm run dev`
- [ ] 7.4 Open browser to http://localhost:3000
- [ ] 7.5 Click "Sign Up"
- [ ] 7.6 Create test account (email: test@example.com)
- [ ] 7.7 Go to dashboard
- [ ] 7.8 Enter product details:
  - Name: Test Product
  - Keyword: wooden cutting board
  - Category: Home & Living
  - Unit Cost: 15.00
  - Variable Costs: 5.00
- [ ] 7.9 Click "Analyze Pricing"
- [ ] 7.10 Wait for results (may take 10-30 seconds)
- [ ] 7.11 Verify you see recommended price and charts
- [ ] 7.12 Success! ✅

---

## ☐ 8. Deploy to Vercel (Est. Time: 10 minutes)

**Status:** Not Started

### Steps:
- [ ] 8.1 Initialize Git: `git init`
- [ ] 8.2 Add files: `git add .`
- [ ] 8.3 Commit: `git commit -m "Initial commit"`
- [ ] 8.4 Create GitHub repository
- [ ] 8.5 Push to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/pricing-app.git
  git branch -M main
  git push -u origin main
  ```
- [ ] 8.6 Go to https://vercel.com
- [ ] 8.7 Sign up/Login with GitHub
- [ ] 8.8 Click "Add New Project"
- [ ] 8.9 Import your GitHub repository
- [ ] 8.10 Add ALL environment variables from `.env.local`
- [ ] 8.11 Click "Deploy"
- [ ] 8.12 Wait for deployment (2-3 minutes)
- [ ] 8.13 Copy your Vercel URL (e.g., https://pricing-app-xyz.vercel.app)
- [ ] 8.14 Test the deployed app!

**My Vercel URL:**
```
_________________________________________________
```

---

## ☐ 9. Configure Stripe Webhook (Est. Time: 5 minutes)

**Status:** Not Started

### Steps:
- [ ] 9.1 Go to Stripe Dashboard > Developers > Webhooks
- [ ] 9.2 Click "Add endpoint"
- [ ] 9.3 Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
- [ ] 9.4 Select events:
  - [x] checkout.session.completed
  - [x] customer.subscription.updated
  - [x] customer.subscription.deleted
- [ ] 9.5 Click "Add endpoint"
- [ ] 9.6 Copy "Signing secret" (starts with `whsec_`)
- [ ] 9.7 Go to Vercel project settings
- [ ] 9.8 Add environment variable: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] 9.9 Redeploy (Vercel does this automatically)
- [ ] 9.10 Test webhook by making a test purchase

**My Stripe Webhook Secret:**
```
whsec____________________________________________
```

---

## ☐ 10. Final Testing (Est. Time: 10 minutes)

**Status:** Not Started

### Steps:
- [ ] 10.1 Visit your deployed app
- [ ] 10.2 Sign up with new email
- [ ] 10.3 Complete pricing analysis
- [ ] 10.4 Click "Upgrade to Premium"
- [ ] 10.5 Use Stripe test card: 4242 4242 4242 4242
- [ ] 10.6 Complete checkout
- [ ] 10.7 Verify redirected to dashboard
- [ ] 10.8 Check subscription status (should show "Premium")
- [ ] 10.9 Do another analysis (should work - unlimited)
- [ ] 10.10 Check Stripe dashboard for successful payment
- [ ] 10.11 Check Supabase subscriptions table (should show premium)
- [ ] 10.12 Everything works! 🎉

---

## ☐ 11. Update Submission File (Est. Time: 2 minutes)

**Status:** Not Started

### Steps:
- [ ] 11.1 Open `SUBMISSION.md`
- [ ] 11.2 Update line 4 with your Vercel URL
- [ ] 11.3 Save file
- [ ] 11.4 Commit and push:
  ```bash
  git add SUBMISSION.md
  git commit -m "Add deployed URL"
  git push
  ```
- [ ] 11.5 Ready to submit! 📤

---

## Summary

**Total Estimated Time:** ~70 minutes (1 hour 10 minutes)

**Quick Status:**
- [ ] All APIs configured
- [ ] App running locally
- [ ] Deployed to Vercel
- [ ] Stripe payments working
- [ ] Ready to submit

**When all checked, you're done!** 🚀

---

## Need Help?

**Documentation:**
- [SUPABASE_SETUP_DETAILED.md](SUPABASE_SETUP_DETAILED.md) - Detailed Supabase guide
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full deployment guide
- [README.md](README.md) - Comprehensive project documentation

**Common Issues:**
- Can't connect to Supabase? Check your keys and URL
- Stripe not working? Make sure webhook is configured
- APIs failing? Verify API keys are correct
- Build fails? Run `npm run build` locally first

**Questions?** Check the troubleshooting sections in the guides!
