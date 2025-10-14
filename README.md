# PriceSmart - AI-Powered Pricing for Sellers

A full-stack MVP web application that helps small business and Etsy sellers maximize profits by recommending optimal product prices using real competitor data and advanced regression analysis.

## Features

- **Real Competitor Data**: Fetches pricing data from Etsy, eBay, and Amazon APIs
- **Smart Pricing Algorithm**: Uses weighted linear regression to model demand curves
- **Profit Optimization**: Finds the price point that maximizes your expected profit
- **Visual Analytics**: Interactive charts showing price vs. profit relationships
- **User Authentication**: Secure signup/signin with Supabase
- **Subscription System**: Free tier (1 analysis/month) and Premium tier ($9.99/month unlimited)
- **Payment Integration**: Stripe checkout for premium subscriptions

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Charts**: Chart.js with react-chartjs-2
- **APIs**: Etsy API v3, eBay Browse API, Amazon Product Data (RapidAPI)
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

## Project Structure

```
PricingApp/
├── app/
│   ├── api/
│   │   ├── analyze-price/route.ts      # Main pricing analysis endpoint
│   │   ├── competitors/route.ts         # Competitor data fetching
│   │   └── stripe/
│   │       ├── create-checkout/route.ts # Stripe checkout session
│   │       └── webhook/route.ts         # Stripe webhook handler
│   ├── auth/
│   │   ├── signin/page.tsx              # Sign in page
│   │   └── signup/page.tsx              # Sign up page
│   ├── dashboard/page.tsx               # Main app dashboard
│   ├── page.tsx                         # Landing page
│   ├── layout.tsx                       # Root layout
│   └── globals.css                      # Global styles
├── components/
│   ├── CompetitorTable.tsx              # Competitor data table
│   ├── PriceInputForm.tsx               # Product input form
│   ├── PriceRecommendation.tsx          # Results display
│   └── ProfitChart.tsx                  # Price/profit chart
├── lib/
│   ├── competitor-apis.ts               # Real API integrations
│   ├── pricing-algorithm.ts             # Core regression logic
│   ├── stripe.ts                        # Stripe client
│   ├── supabase.ts                      # Supabase clients
│   └── utils.ts                         # Helper functions
├── types/
│   └── index.ts                         # TypeScript types
├── tests/
│   └── pricing-algorithm.test.ts        # Unit tests
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql       # Database schema
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- API keys for Etsy, eBay, and RapidAPI (Amazon)

### 1. Clone and Install

```bash
cd PricingApp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file: `supabase/migrations/001_initial_schema.sql`
3. Get your project URL and keys from Settings > API

### 3. Set Up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Create a product with a recurring price of $9.99/month
3. Copy the Price ID
4. Get your publishable and secret keys from Developers > API keys
5. Set up a webhook endpoint (after deployment):
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook secret

### 4. Get API Keys

#### Etsy API
1. Go to [Etsy Developers](https://www.etsy.com/developers/)
2. Create an app
3. Copy your API Key (no OAuth needed for public listings)

#### eBay API
1. Go to [eBay Developers](https://developer.ebay.com/)
2. Create an application
3. Get Client ID and Client Secret
4. We use application token (no user OAuth needed)

#### Amazon (via RapidAPI)
1. Create account at [RapidAPI](https://rapidapi.com/)
2. Subscribe to "Real-Time Amazon Data" API (free tier: 500 requests/month)
3. Copy your API key

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# E-commerce APIs
ETSY_API_KEY=your_etsy_api_key
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
RAPIDAPI_KEY=your_rapidapi_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 7. Run Tests

```bash
npm test
```

## How It Works

### 1. User Input
Users enter product details:
- Name, description, keyword, category
- Unit cost and variable costs (shipping, fees, etc.)
- Optional: current monthly sales

### 2. Competitor Data Collection
The app fetches similar products from:
- **Etsy**: Handmade and craft items
- **eBay**: General marketplace (provides ACTUAL sales data!)
- **Amazon**: Wide product selection

Data is cached for 24 hours to stay within API limits.

### 3. Demand Curve Analysis
Using weighted linear regression:
- Fits a demand curve: `sales = m × price + b`
- Prioritizes high-confidence data (eBay actual sales weighted 3x higher)
- Calculates R² to measure model quality
- Removes price outliers using IQR method

### 4. Profit Optimization
For a range of price points:
- Predicts sales at each price
- Calculates profit: `(price - cost) × sales`
- Finds the price that maximizes profit

### 5. Results Presentation
Users see:
- Recommended price with confidence level
- Predicted monthly sales and profit
- Interactive chart of price vs. profit
- Table of price scenarios
- Competitor data with sources

## API Endpoints

### `POST /api/competitors`
Fetch competitor data for a keyword and category.

**Request:**
```json
{
  "keyword": "wooden cutting board",
  "category": "Home & Living"
}
```

**Response:**
```json
{
  "competitors": [
    {
      "source": "ebay",
      "title": "Handmade Walnut Cutting Board",
      "price": 45.99,
      "salesVolume": 127,
      "url": "https://...",
      "confidence": "high"
    }
  ],
  "count": 25
}
```

### `POST /api/analyze-price`
Analyze pricing for a product.

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

**Request:**
```json
{
  "name": "My Cutting Board",
  "description": "Beautiful handmade board",
  "keyword": "wooden cutting board",
  "category": "Home & Living",
  "unitCost": 15.00,
  "variableCosts": 5.00
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "recommendedPrice": 42.50,
    "predictedSales": 85,
    "predictedProfit": 1912.50,
    "confidence": "high",
    "rSquared": 0.856,
    "competitorCount": 32,
    "scenarios": [...],
    "competitors": [...],
    "explanation": "Based on analysis of 32 competitors..."
  },
  "analysesRemaining": 0
}
```

### `POST /api/stripe/create-checkout`
Create a Stripe checkout session for premium upgrade.

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `POST /api/stripe/webhook`
Handle Stripe webhook events (subscriptions, cancellations).

## Database Schema

### `products`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `name`, `description`, `keyword`, `category`
- `unit_cost`, `variable_costs`
- `photo_url`
- `created_at`

### `pricing_analyses`
- `id` (UUID, primary key)
- `user_id`, `product_id` (foreign keys)
- `recommended_price`, `predicted_sales`, `predicted_profit`
- `confidence` (high/medium/low)
- `competitor_count`, `r_squared`
- `created_at`

### `subscriptions`
- `id` (UUID, primary key)
- `user_id` (foreign key, unique)
- `stripe_customer_id`, `stripe_subscription_id`
- `status` (active/canceled/past_due)
- `plan` (free/premium)
- `analyses_used_this_month`
- `period_start`, `period_end`
- `created_at`, `updated_at`

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables (copy from `.env.local`)
4. Deploy!

### 3. Update Stripe Webhook
After deployment, update your Stripe webhook URL to:
```
https://your-app.vercel.app/api/stripe/webhook
```

### 4. Update Environment Variables
Set `NEXT_PUBLIC_APP_URL` to your production URL:
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Testing the App

### Free Tier Test
1. Sign up with a test email
2. Go to dashboard
3. Enter product details
4. Click "Analyze Pricing"
5. View results
6. Try a second analysis - should show upgrade prompt

### Premium Upgrade Test
1. Click "Upgrade to Premium"
2. Use Stripe test card: `4242 4242 4242 4242`
3. Any future date and CVC
4. Complete checkout
5. Verify unlimited analyses work

### API Integration Test
The app will automatically try real APIs first, then fall back gracefully if:
- API keys are missing
- Rate limits are exceeded
- APIs return errors

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Secure token-based auth with Supabase
- **API Key Protection**: All keys in environment variables (never committed)
- **Stripe Webhook Verification**: Signature validation on all webhook events
- **Input Validation**: Both frontend and backend validation
- **Rate Limiting**: API caching to prevent abuse

## Future Enhancements

- Export analysis reports as PDF
- Historical price tracking over time
- A/B testing recommendations
- Multi-currency support
- Mobile app (React Native)
- Integration with Shopify stores
- Bulk product analysis
- Email notifications for price changes
- Team collaboration features

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check if RLS policies are properly set up
- Ensure migrations have been run

### Stripe Webhook Not Working
- Verify webhook secret is correct
- Check that webhook URL is publicly accessible
- Review Stripe webhook logs in dashboard

### API Errors
- Check API keys are valid
- Verify you haven't exceeded rate limits
- Review API response in browser console

### Test Failures
- Ensure all dependencies are installed
- Run `npm test` with verbose flag: `npm test -- --verbose`

## Contributing

This is a class project, but suggestions are welcome! Open an issue to discuss potential changes.

## License

MIT License - Feel free to use this for learning purposes.

## Author

Built for small business owners and Etsy sellers who want to maximize their profits with data-driven pricing.

---

**Questions?** Open an issue or contact support.
