import { CompetitorListing, DemandCurve, PriceScenario, PricingAnalysis, ProductInput } from '@/types';

/**
 * Weighted Linear Regression
 * Fits a line: y = mx + b
 * Returns slope, intercept, and R²
 */
function weightedLinearRegression(
  x: number[],
  y: number[],
  weights: number[]
): { slope: number; intercept: number; rSquared: number } {
  const n = x.length;

  if (n < 2) {
    throw new Error('Need at least 2 data points for regression');
  }

  // Calculate weighted sums
  let sumWeights = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const w = weights[i];
    sumWeights += w;
    sumX += w * x[i];
    sumY += w * y[i];
    sumXY += w * x[i] * y[i];
    sumX2 += w * x[i] * x[i];
  }

  const meanX = sumX / sumWeights;
  const meanY = sumY / sumWeights;

  // Calculate slope and intercept
  const numerator = sumXY - sumWeights * meanX * meanY;
  const denominator = sumX2 - sumWeights * meanX * meanX;

  if (Math.abs(denominator) < 1e-10) {
    // Prices are too similar, can't fit a meaningful line
    throw new Error('Insufficient price variation in data');
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  // Calculate R² (coefficient of determination)
  let ssTotal = 0;
  let ssResidual = 0;

  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    ssResidual += weights[i] * Math.pow(y[i] - predicted, 2);
    ssTotal += weights[i] * Math.pow(y[i] - meanY, 2);
  }

  const rSquared = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;

  return { slope, intercept, rSquared };
}

/**
 * Remove outliers using IQR method
 */
function removeOutliers(competitors: CompetitorListing[]): CompetitorListing[] {
  if (competitors.length < 4) return competitors;

  const prices = competitors.map(c => c.price).sort((a, b) => a - b);
  const q1Index = Math.floor(prices.length * 0.25);
  const q3Index = Math.floor(prices.length * 0.75);
  const q1 = prices[q1Index];
  const q3 = prices[q3Index];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return competitors.filter(c => c.price >= lowerBound && c.price <= upperBound);
}

/**
 * Estimate sales from price when no sales data available
 * Uses average sales from high-confidence data
 */
function estimateSalesFromPrice(
  price: number,
  competitors: CompetitorListing[]
): number {
  const withSales = competitors.filter(c => c.salesVolume && c.salesVolume > 0);

  if (withSales.length === 0) {
    // Fallback: assume 50 sales/month as baseline
    return Math.max(10, Math.round(50 * (100 / price)));
  }

  const avgSales = withSales.reduce((sum, c) => sum + c.salesVolume!, 0) / withSales.length;
  const avgPrice = withSales.reduce((sum, c) => sum + c.price, 0) / withSales.length;

  // Scale based on price difference
  return Math.max(5, Math.round(avgSales * (avgPrice / price)));
}

/**
 * Fit demand curve using weighted linear regression
 * Prioritizes high-confidence data (e.g., eBay actual sales)
 */
export function fitDemandCurve(competitors: CompetitorListing[]): DemandCurve {
  // Filter out competitors without valid data
  const validCompetitors = competitors.filter(c => c.price > 0);

  if (validCompetitors.length < 2) {
    throw new Error('Insufficient competitor data');
  }

  // Remove outliers
  const filtered = removeOutliers(validCompetitors);

  if (filtered.length < 2) {
    throw new Error('Insufficient data after outlier removal');
  }

  // Ensure all have sales volume estimates
  const withSales = filtered.map(c => ({
    ...c,
    salesVolume: c.salesVolume || estimateSalesFromPrice(c.price, filtered)
  }));

  // Assign weights based on confidence
  const weightedData = withSales.map(c => ({
    price: c.price,
    sales: c.salesVolume!,
    weight: c.confidence === 'high' ? 3.0 : c.confidence === 'medium' ? 1.5 : 1.0
  }));

  // Perform weighted regression
  const { slope, intercept, rSquared } = weightedLinearRegression(
    weightedData.map(d => d.price),
    weightedData.map(d => d.sales),
    weightedData.map(d => d.weight)
  );

  // Determine model confidence
  const highConfidenceCount = filtered.filter(c => c.confidence === 'high').length;
  let confidence: 'high' | 'medium' | 'low';

  if (rSquared > 0.7 && highConfidenceCount >= 5) {
    confidence = 'high';
  } else if (rSquared > 0.3 && filtered.length >= 5) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return { slope, intercept, rSquared, confidence };
}

/**
 * Calculate profit for a given price
 */
function calculateProfit(
  price: number,
  totalCost: number,
  expectedSales: number
): number {
  return Math.round((price - totalCost) * expectedSales * 100) / 100;
}

/**
 * Generate price scenarios
 */
function generateScenarios(
  minPrice: number,
  maxPrice: number,
  totalCost: number,
  slope: number,
  intercept: number,
  numScenarios: number = 12
): PriceScenario[] {
  const scenarios: PriceScenario[] = [];
  const step = (maxPrice - minPrice) / (numScenarios - 1);

  for (let i = 0; i < numScenarios; i++) {
    const price = Math.round((minPrice + i * step) * 100) / 100;
    const expectedSales = Math.max(0, Math.round(slope * price + intercept));
    const expectedProfit = calculateProfit(price, totalCost, expectedSales);

    scenarios.push({ price, expectedSales, expectedProfit });
  }

  return scenarios;
}

/**
 * Cost-plus pricing fallback
 */
function costPlusPricing(product: ProductInput): PricingAnalysis {
  const totalCost = product.unitCost + product.variableCosts;
  const recommendedPrice = Math.round(totalCost * 2.5 * 100) / 100; // 250% markup
  const estimatedSales = 30; // Conservative estimate
  const predictedProfit = calculateProfit(recommendedPrice, totalCost, estimatedSales);

  const scenarios: PriceScenario[] = [
    { price: totalCost * 2.0, expectedSales: 40, expectedProfit: (totalCost * 2.0 - totalCost) * 40 },
    { price: totalCost * 2.25, expectedSales: 35, expectedProfit: (totalCost * 2.25 - totalCost) * 35 },
    { price: totalCost * 2.5, expectedSales: 30, expectedProfit: (totalCost * 2.5 - totalCost) * 30 },
    { price: totalCost * 2.75, expectedSales: 25, expectedProfit: (totalCost * 2.75 - totalCost) * 25 },
    { price: totalCost * 3.0, expectedSales: 20, expectedProfit: (totalCost * 3.0 - totalCost) * 20 },
  ];

  return {
    recommendedPrice,
    predictedSales: estimatedSales,
    predictedProfit,
    confidence: 'low',
    rSquared: 0,
    competitorCount: 0,
    scenarios,
    competitors: [],
    explanation: 'Using cost-plus pricing model with a 150% markup due to limited competitor data.',
    warning: 'Limited competitor data found. This recommendation is based on standard markup principles rather than market analysis. Try different keywords for better results.'
  };
}

/**
 * Main pricing analysis function
 */
export function analyzePricing(
  product: ProductInput,
  competitors: CompetitorListing[]
): PricingAnalysis {
  const totalCost = product.unitCost + product.variableCosts;

  // Check if we have enough data
  if (competitors.length < 3) {
    return costPlusPricing(product);
  }

  try {
    // Fit demand curve
    const { slope, intercept, rSquared, confidence } = fitDemandCurve(competitors);

    // If regression quality is too poor, fall back to cost-plus
    if (rSquared < 0.1) {
      return costPlusPricing(product);
    }

    // Calculate price range to explore
    const prices = competitors.map(c => c.price);
    const minCompPrice = Math.min(...prices);
    const maxCompPrice = Math.max(...prices);

    // Extend range slightly beyond competitor prices
    const minPrice = Math.max(totalCost * 1.2, minCompPrice * 0.8);
    const maxPrice = maxCompPrice * 1.2;

    // Generate scenarios
    const scenarios = generateScenarios(minPrice, maxPrice, totalCost, slope, intercept);

    // Find optimal price (max profit)
    const optimalScenario = scenarios.reduce((best, current) =>
      current.expectedProfit > best.expectedProfit ? current : best
    );

    // Generate explanation
    let explanation = `Based on analysis of ${competitors.length} competitors, `;

    if (confidence === 'high') {
      explanation += 'we have high confidence in this recommendation. The market data shows a clear price-demand relationship.';
    } else if (confidence === 'medium') {
      explanation += 'we have moderate confidence in this recommendation. There is sufficient market data to identify pricing trends.';
    } else {
      explanation += 'we have limited confidence in this recommendation. Market data is sparse, so treat this as a starting point.';
    }

    explanation += ` At $${optimalScenario.price.toFixed(2)}, you can expect to maximize your profit.`;

    return {
      recommendedPrice: optimalScenario.price,
      predictedSales: optimalScenario.expectedSales,
      predictedProfit: optimalScenario.expectedProfit,
      confidence,
      rSquared,
      competitorCount: competitors.length,
      scenarios,
      competitors,
      explanation,
      warning: confidence === 'low' ? 'Due to limited data, this recommendation should be validated with your own market research.' : undefined
    };

  } catch (error) {
    console.error('Pricing analysis error:', error);
    return costPlusPricing(product);
  }
}
