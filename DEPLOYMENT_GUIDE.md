# PriceSmart - Deployment Guide

## Quick Deployment Checklist

### Pre-Deployment Setup

#### 1. Supabase Setup (5 minutes)
- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Go to SQL Editor
- [ ] Copy and run `supabase/migrations/001_initial_schema.sql`
- [ ] Go to Settings > API
- [ ] Copy Project URL
- [ ] Copy `anon` public key
- [ ] Copy `service_role` secret key

#### 2. Stripe Setup (10 minutes)
- [ ] Create account at [stripe.com](https://stripe.com)
- [ ] Go to Products
- [ ] Create product: "PriceSmart Premium"
- [ ] Add price: $9.99/month, recurring
- [ ] Copy Price ID (starts with `price_`)
- [ ] Go to Developers > API keys
- [ ] Copy Publishable key (starts with `pk_test_`)
- [ ] Copy Secret key (starts with `sk_test_`)
- [ ] Note: Webhook secret comes after deployment

#### 3. Get E-commerce API Keys (15 minutes)

**Etsy API:**
- [ ] Go to [developers.etsy.com](https://www.etsy.com/developers/)
- [ ] Register application
- [ ] Copy API Key

**eBay API:**
- [ ] Go to [developer.ebay.com](https://developer.ebay.com/)
- [ ] Create developer account
- [ ] Create application
- [ ] Copy Client ID
- [ ] Copy Client Secret

**RapidAPI (Amazon):**
- [ ] Sign up at [rapidapi.com](https://rapidapi.com/)
- [ ] Search "Real-Time Amazon Data"
- [ ] Subscribe to free tier (500 requests/month)
- [ ] Copy API Key from "Code Snippets"

---

## Deploy to Vercel (10 minutes)

### Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: PriceSmart MVP"
```

### Step 2: Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/pricing-app.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 4: Add Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (add after Step 5)

ETSY_API_KEY=your_etsy_key
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
RAPIDAPI_KEY=your_rapidapi_key

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 5: Configure Stripe Webhook

After your first deployment:

1. Copy your Vercel app URL (e.g., `https://pricing-app-xyz.vercel.app`)
2. Go to Stripe Dashboard > Developers > Webhooks
3. Click "Add endpoint"
4. Set endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
5. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click "Add endpoint"
7. Copy the "Signing secret" (starts with `whsec_`)
8. Go back to Vercel project settings
9. Add/update environment variable: `STRIPE_WEBHOOK_SECRET=whsec_...`
10. Redeploy the app

### Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Click "Sign Up"
3. Create test account
4. Go to dashboard
5. Enter product details
6. Click "Analyze Pricing"
7. Verify results appear
8. Test upgrade flow with Stripe test card: `4242 4242 4242 4242`

---

## Post-Deployment Configuration

### Update SUBMISSION.md

1. Open `SUBMISSION.md`
2. Replace the placeholder at the top:
   ```markdown
   ## Deployed Application
   **Live URL:** https://your-actual-app.vercel.app
   ```
3. Commit and push:
   ```bash
   git add SUBMISSION.md
   git commit -m "Add deployed app URL"
   git push
   ```

### Test Production Endpoints

```bash
# Test competitors API
curl -X POST https://your-app.vercel.app/api/competitors \
  -H "Content-Type: application/json" \
  -d '{"keyword": "wooden cutting board", "category": "Home & Living"}'

# Test health (landing page)
curl https://your-app.vercel.app
```

---

## Common Deployment Issues

### Issue: Build Fails on Vercel

**Solution:**
- Check that all dependencies are in `package.json`
- Ensure TypeScript types are correct
- Review build logs in Vercel dashboard
- Try building locally: `npm run build`

### Issue: Environment Variables Not Working

**Solution:**
- Verify all variables are added in Vercel
- Check for typos in variable names
- Redeploy after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

### Issue: Database Connection Fails

**Solution:**
- Verify Supabase URL is correct
- Check that RLS policies are enabled
- Ensure service role key is used for server routes
- Test connection in Supabase SQL Editor

### Issue: Stripe Webhook Not Receiving Events

**Solution:**
- Verify webhook URL is correct
- Check that webhook secret is added
- Test webhook in Stripe Dashboard
- Review webhook logs in Stripe
- Ensure endpoint is publicly accessible

### Issue: API Rate Limits

**Solution:**
- Verify API keys are valid
- Check rate limit status in API dashboards
- Ensure caching is working (check logs)
- Consider upgrading API tiers if needed

---

## Monitoring & Maintenance

### Check Application Health

```bash
# Test authentication
curl https://your-app.vercel.app/auth/signin

# Test API endpoints (requires auth token)
curl https://your-app.vercel.app/api/analyze-price \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Monitor Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. View real-time logs
5. Filter by API route

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Test locally
npm run dev
npm run build

# Commit and push (triggers Vercel deploy)
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

## Scaling Considerations

### If You Get High Traffic

1. **Database**: Supabase scales automatically
2. **API Caching**: Consider Redis instead of in-memory cache
3. **Rate Limiting**: Add rate limiting to API routes
4. **CDN**: Vercel provides automatic edge caching
5. **API Limits**: Upgrade to paid tiers for Etsy/eBay/Amazon APIs

### Cost Estimates (After Free Tier)

- **Vercel**: Free for hobby projects, $20/month for Pro
- **Supabase**: Free up to 500MB, $25/month for Pro
- **Stripe**: No monthly fee, 2.9% + $0.30 per transaction
- **APIs**:
  - Etsy: Free tier sufficient for testing
  - eBay: Free tier sufficient for testing
  - RapidAPI: $0-50/month depending on usage

---

## Going Live Checklist

Before announcing to real users:

- [ ] App deployed and tested on Vercel
- [ ] All environment variables configured
- [ ] Stripe webhook configured and tested
- [ ] Test user signup and authentication
- [ ] Test free tier analysis (1 per month limit)
- [ ] Test premium upgrade flow
- [ ] Test with Stripe test cards
- [ ] Switch Stripe to live mode (not test mode)
- [ ] Update Stripe webhook to use live keys
- [ ] Test with real credit card (your own)
- [ ] Add custom domain (optional)
- [ ] Set up error monitoring (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Update README with live URL
- [ ] Update SUBMISSION.md with live URL

---

## Support & Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## Quick Redeploy

Anytime you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel automatically deploys on every push to `main` branch.

---

**You're ready to deploy!** 🚀

Once deployed, update SUBMISSION.md with your live URL and you're good to submit!
