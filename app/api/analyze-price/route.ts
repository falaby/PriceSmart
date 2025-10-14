import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { fetchCompetitorData } from '@/lib/competitor-apis';
import { analyzePricing } from '@/lib/pricing-algorithm';
import { ProductInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createServiceClient();

    // Extract token
    const token = authHeader.replace('Bearer ', '');

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Parse product data
    const productData: ProductInput = await request.json();

    // Validate required fields
    if (!productData.name || !productData.keyword || !productData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!productData.unitCost || !productData.variableCosts) {
      return NextResponse.json(
        { error: 'Unit cost and variable costs are required' },
        { status: 400 }
      );
    }

    // Check subscription and usage limits
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Check if user has exceeded their limit (free plan: 10/month)
    if (subscription.plan === 'free' && subscription.analyses_used_this_month >= 10) {
      return NextResponse.json(
        {
          error: 'Analysis limit reached',
          message: 'You have reached your monthly limit. Upgrade to Premium for unlimited analyses.',
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    // Fetch competitor data
    const competitors = await fetchCompetitorData({
      keyword: productData.keyword,
      category: productData.category,
      maxResults: 50
    });

    // Analyze pricing
    const analysis = analyzePricing(productData, competitors);

    // Save product to database
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        name: productData.name,
        description: productData.description,
        keyword: productData.keyword,
        category: productData.category,
        unit_cost: productData.unitCost,
        variable_costs: productData.variableCosts,
        photo_url: productData.photoUrl
      })
      .select()
      .single();

    // Save analysis to database
    if (product) {
      await supabase
        .from('pricing_analyses')
        .insert({
          user_id: user.id,
          product_id: product.id,
          recommended_price: analysis.recommendedPrice,
          predicted_sales: analysis.predictedSales,
          predicted_profit: analysis.predictedProfit,
          confidence: analysis.confidence,
          competitor_count: analysis.competitorCount,
          r_squared: analysis.rSquared
        });
    }

    // Increment usage counter
    await supabase
      .from('subscriptions')
      .update({
        analyses_used_this_month: subscription.analyses_used_this_month + 1
      })
      .eq('user_id', user.id);

    return NextResponse.json({
      success: true,
      analysis,
      analysesRemaining: subscription.plan === 'free'
        ? Math.max(0, 10 - (subscription.analyses_used_this_month + 1))
        : 'unlimited'
    });

  } catch (error) {
    console.error('Pricing analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze pricing' },
      { status: 500 }
    );
  }
}
