# E-Commerce API Keys Setup Guide

## Quick Overview

You need 4 API keys total:
1. ✅ **Stripe** - DONE! (Already added)
2. ⏳ **Stripe Price ID** - Need to create product
3. ⏳ **Etsy API** - ~5 minutes
4. ⏳ **eBay API** - ~10 minutes
5. ⏳ **RapidAPI (Amazon)** - ~5 minutes

---

## 1. Stripe Price ID (Do This First!)

**See [STRIPE_SETUP_GUIDE.md](STRIPE_SETUP_GUIDE.md) for detailed steps.**

**Quick Steps:**
1. Go to: https://dashboard.stripe.com/products
2. Click "+ Add Product"
3. Name: "PriceSmart Premium"
4. Price: $1.00/month
5. Save and **copy the Price ID** (starts with `price_`)

---

## 2. Etsy API Key (~5 minutes)

### Steps:

1. **Go to Etsy Developers**: https://www.etsy.com/developers/
2. **Sign in** with your Etsy account (or create one - it's free!)
3. **Click "Register as a Developer"** (if first time)
4. **Click "Create a New App"** or "Apps" → "Create New App"
5. **Fill in App Details:**
   - **App Name**: `PriceSmart` (or your preferred name)
   - **App Description**: `Pricing analysis tool for sellers`
   - **Tell us a bit about your app**: `Educational project for pricing optimization`
   - **Permissions**: Leave defaults (read public data)
6. **Submit**
7. **Copy your API Key** (also called "Keystring")

**What you need:** Just the API Key (one string)

---

## 3. eBay API Credentials (~10 minutes)

### Steps:

1. **Go to eBay Developers**: https://developer.ebay.com/
2. **Sign in** with eBay account (or create - free)
3. **Click "Get Started"** or "Create Application"
4. **Go to "Application Keys"** section
5. **Create Production Keys:**
   - **Application Title**: `PriceSmart`
   - **Short Description**: `Pricing analysis for sellers`
6. **Submit and Wait** (may take a few minutes for approval)
7. **Once approved**, go to "Application Keys"
8. **Copy both:**
   - **App ID (Client ID)**
   - **Cert ID (Client Secret)**

**What you need:**
- Client ID (App ID)
- Client Secret (Cert ID)

**Note:** If production takes too long, you can start with **Sandbox keys** for testing!

---

## 4. RapidAPI for Amazon Data (~5 minutes)

### Steps:

1. **Go to RapidAPI**: https://rapidapi.com/
2. **Sign Up** (free - use Google/GitHub for fastest signup)
3. **Search for** "Real-Time Amazon Data" or "Amazon Product Data"
4. **Choose**: "Real-Time Amazon Data" API by "letscrape-6bRBa3QguO5"
5. **Click "Subscribe to Test"**
6. **Select "Basic" Plan** (FREE - 500 requests/month)
   - Price: $0.00
   - 500 requests/month
7. **Complete subscription** (no credit card for free tier!)
8. **Go to "Code Snippets" or "Endpoints" tab**
9. **Copy the X-RapidAPI-Key** from the code example

**What you need:** Just the RapidAPI Key (one string)

---

## Adding All Keys to .env.local

Once you have all keys, your `.env.local` should look like:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID=price_YOUR_ACTUAL_PRICE_ID

# E-commerce APIs
ETSY_API_KEY=your_actual_etsy_key_here
EBAY_CLIENT_ID=your_ebay_client_id_here
EBAY_CLIENT_SECRET=your_ebay_client_secret_here
RAPIDAPI_KEY=your_rapidapi_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## Checklist

- [ ] Stripe Price ID created and added
- [ ] Etsy API key obtained
- [ ] eBay Client ID and Secret obtained
- [ ] RapidAPI key obtained
- [ ] All keys added to `.env.local`
- [ ] Dev server restarted (`npm run dev`)
- [ ] Test pricing analysis works

---

## Tips

**If APIs are taking too long to approve:**
- **Etsy**: Usually instant
- **eBay**: Can take 10-30 minutes for production keys
  - Use **Sandbox keys** for testing in the meantime
- **RapidAPI**: Instant with free tier

**Can't get an API?**
- The app will still work! It falls back to cost-plus pricing
- You can deploy without some APIs and add them later

---

## Next Steps After Getting Keys

1. **Paste all your keys** (when ready) and I'll add them to `.env.local`
2. **Test the app** locally with real pricing analysis
3. **Deploy to Vercel**
4. **Configure Stripe webhook**
5. **Submit!**

**Ready? Start with the Stripe Price ID, then tackle the APIs!** 🚀
