// Core types for the pricing app

export interface ProductInput {
  name: string;
  description: string;
  keyword: string;
  category: string;
  unitCost: number;
  variableCosts: number;
  photoUrl?: string;
  monthlySales?: number;
}

export interface CompetitorListing {
  source: 'etsy' | 'ebay' | 'amazon' | 'shopify';
  title: string;
  price: number;
  salesVolume?: number;
  url?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface PriceScenario {
  price: number;
  expectedSales: number;
  expectedProfit: number;
}

export interface PricingAnalysis {
  recommendedPrice: number;
  predictedSales: number;
  predictedProfit: number;
  confidence: 'high' | 'medium' | 'low';
  rSquared: number;
  competitorCount: number;
  scenarios: PriceScenario[];
  competitors: CompetitorListing[];
  explanation: string;
  warning?: string;
}

export interface DemandCurve {
  slope: number;
  intercept: number;
  rSquared: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface User {
  id: string;
  email: string;
  subscription: {
    plan: 'free' | 'premium';
    status: 'active' | 'canceled' | 'past_due';
    analysesUsedThisMonth: number;
    periodEnd?: Date;
  };
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          keyword: string | null;
          category: string | null;
          unit_cost: number;
          variable_costs: number;
          photo_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      pricing_analyses: {
        Row: {
          id: string;
          user_id: string;
          product_id: string | null;
          recommended_price: number;
          predicted_sales: number;
          predicted_profit: number;
          confidence: string;
          competitor_count: number;
          r_squared: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pricing_analyses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['pricing_analyses']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: string;
          plan: string;
          analyses_used_this_month: number;
          period_start: string | null;
          period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
    };
  };
}
