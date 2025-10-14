# Stripe Setup Guide - Create $1/month Product

## Step 1: Create Product in Stripe Dashboard

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/products
2. **Click "+ Add Product"** button (top right)
3. **Fill in Product Details:**
   - **Name**: `PriceSmart Premium`
   - **Description**: `Unlimited pricing analyses for small business and Etsy sellers`
   - **Image** (optional): You can skip this or upload a logo later

## Step 2: Add Pricing

1. **In the "Pricing" section:**
   - **Price**: Enter `1.00`
   - **Billing period**: Select **Monthly**
   - **Currency**: **USD**
2. **Click "Save product"**

## Step 3: Copy the Price ID

1. After saving, you'll see your product page
2. Scroll down to the **"Pricing"** section
3. You'll see your $1.00/month price listed
4. **Click on the price** to see details
5. **Copy the Price ID** - it starts with `price_` (example: `price_1Abc2DefGhi3Jkl`)
6. **This is VERY IMPORTANT** - you need this ID!

## Step 4: Add Price ID to Environment Variables

Once you have the Price ID, add it to your `.env.local` file:

```env
STRIPE_PRICE_ID=price_YOUR_ACTUAL_PRICE_ID_HERE
```

## Complete .env.local Setup

Your `.env.local` should now have:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE  # ← ADD THIS!

# E-commerce APIs (we'll add these next)
ETSY_API_KEY=your_etsy_api_key
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
RAPIDAPI_KEY=your_rapidapi_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## After You Have the Price ID

**Let me know the Price ID and I'll:**
1. ✅ Add it to your `.env.local`
2. ✅ Move on to getting the e-commerce API keys
3. ✅ Test the full application
4. ✅ Deploy to Vercel

---

## Quick Actions Now:

1. **Open**: https://dashboard.stripe.com/products
2. **Create** the product ($1.00/month)
3. **Copy** the Price ID (starts with `price_`)
4. **Paste** it here so I can add it to your config

**Then we'll get the API keys and you'll be ready to deploy!** 🚀
