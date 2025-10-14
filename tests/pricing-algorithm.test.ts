import { fitDemandCurve, analyzePricing } from '../lib/pricing-algorithm';
import { CompetitorListing, ProductInput } from '../types';

describe('Pricing Algorithm', () => {
  describe('fitDemandCurve', () => {
    it('should fit a demand curve with valid competitor data', () => {
      const competitors: CompetitorListing[] = [
        { source: 'etsy', title: 'Product 1', price: 10, salesVolume: 100, confidence: 'high' },
        { source: 'etsy', title: 'Product 2', price: 15, salesVolume: 80, confidence: 'high' },
        { source: 'ebay', title: 'Product 3', price: 20, salesVolume: 60, confidence: 'high' },
        { source: 'ebay', title: 'Product 4', price: 25, salesVolume: 40, confidence: 'high' },
        { source: 'amazon', title: 'Product 5', price: 30, salesVolume: 20, confidence: 'medium' },
      ];

      const result = fitDemandCurve(competitors);

      expect(result.slope).toBeLessThan(0); // Demand should decrease as price increases
      expect(result.intercept).toBeGreaterThan(0);
      expect(result.rSquared).toBeGreaterThanOrEqual(0);
      expect(result.rSquared).toBeLessThanOrEqual(1);
      expect(result.confidence).toBeDefined();
    });

    it('should throw error with insufficient data', () => {
      const competitors: CompetitorListing[] = [
        { source: 'etsy', title: 'Product 1', price: 10, salesVolume: 100, confidence: 'high' },
      ];

      expect(() => fitDemandCurve(competitors)).toThrow();
    });

    it('should assign higher confidence with more high-quality data', () => {
      const highQualityCompetitors: CompetitorListing[] = [
        { source: 'ebay', title: 'P1', price: 10, salesVolume: 100, confidence: 'high' },
        { source: 'ebay', title: 'P2', price: 15, salesVolume: 90, confidence: 'high' },
        { source: 'ebay', title: 'P3', price: 20, salesVolume: 80, confidence: 'high' },
        { source: 'ebay', title: 'P4', price: 25, salesVolume: 70, confidence: 'high' },
        { source: 'ebay', title: 'P5', price: 30, salesVolume: 60, confidence: 'high' },
        { source: 'ebay', title: 'P6', price: 35, salesVolume: 50, confidence: 'high' },
      ];

      const result = fitDemandCurve(highQualityCompetitors);
      expect(['high', 'medium']).toContain(result.confidence);
    });
  });

  describe('analyzePricing', () => {
    it('should return a pricing recommendation with competitor data', () => {
      const product: ProductInput = {
        name: 'Test Product',
        description: 'A test product',
        keyword: 'test',
        category: 'Other',
        unitCost: 10,
        variableCosts: 5,
      };

      const competitors: CompetitorListing[] = [
        { source: 'etsy', title: 'Comp 1', price: 30, salesVolume: 50, confidence: 'high' },
        { source: 'etsy', title: 'Comp 2', price: 35, salesVolume: 45, confidence: 'high' },
        { source: 'ebay', title: 'Comp 3', price: 40, salesVolume: 40, confidence: 'high' },
        { source: 'ebay', title: 'Comp 4', price: 45, salesVolume: 35, confidence: 'high' },
        { source: 'amazon', title: 'Comp 5', price: 50, salesVolume: 30, confidence: 'medium' },
      ];

      const analysis = analyzePricing(product, competitors);

      expect(analysis.recommendedPrice).toBeGreaterThan(product.unitCost + product.variableCosts);
      expect(analysis.predictedSales).toBeGreaterThan(0);
      expect(analysis.predictedProfit).toBeGreaterThan(0);
      expect(analysis.competitorCount).toBe(5);
      expect(analysis.scenarios.length).toBeGreaterThan(0);
      expect(analysis.explanation).toBeDefined();
    });

    it('should fall back to cost-plus pricing with no competitors', () => {
      const product: ProductInput = {
        name: 'Test Product',
        description: 'A test product',
        keyword: 'test',
        category: 'Other',
        unitCost: 10,
        variableCosts: 5,
      };

      const competitors: CompetitorListing[] = [];

      const analysis = analyzePricing(product, competitors);

      expect(analysis.recommendedPrice).toBeGreaterThan(product.unitCost + product.variableCosts);
      expect(analysis.confidence).toBe('low');
      expect(analysis.warning).toBeDefined();
      expect(analysis.competitorCount).toBe(0);
    });

    it('should recommend a price that maximizes profit', () => {
      const product: ProductInput = {
        name: 'Test Product',
        description: 'A test product',
        keyword: 'test',
        category: 'Other',
        unitCost: 10,
        variableCosts: 5,
      };

      const competitors: CompetitorListing[] = [
        { source: 'etsy', title: 'C1', price: 25, salesVolume: 100, confidence: 'high' },
        { source: 'etsy', title: 'C2', price: 30, salesVolume: 90, confidence: 'high' },
        { source: 'ebay', title: 'C3', price: 35, salesVolume: 80, confidence: 'high' },
        { source: 'ebay', title: 'C4', price: 40, salesVolume: 70, confidence: 'high' },
        { source: 'amazon', title: 'C5', price: 45, salesVolume: 60, confidence: 'high' },
      ];

      const analysis = analyzePricing(product, competitors);

      // Find the scenario with max profit
      const maxProfit = Math.max(...analysis.scenarios.map(s => s.expectedProfit));
      const optimalScenario = analysis.scenarios.find(s => s.expectedProfit === maxProfit);

      // Recommended price should match the optimal price
      expect(Math.abs(analysis.recommendedPrice - optimalScenario!.price)).toBeLessThan(0.01);
    });

    it('should generate multiple price scenarios', () => {
      const product: ProductInput = {
        name: 'Test Product',
        description: 'A test product',
        keyword: 'test',
        category: 'Other',
        unitCost: 10,
        variableCosts: 5,
      };

      const competitors: CompetitorListing[] = [
        { source: 'etsy', title: 'C1', price: 30, salesVolume: 50, confidence: 'high' },
        { source: 'etsy', title: 'C2', price: 35, salesVolume: 45, confidence: 'high' },
        { source: 'ebay', title: 'C3', price: 40, salesVolume: 40, confidence: 'high' },
        { source: 'amazon', title: 'C4', price: 45, salesVolume: 35, confidence: 'medium' },
      ];

      const analysis = analyzePricing(product, competitors);

      expect(analysis.scenarios.length).toBeGreaterThanOrEqual(5);

      // Scenarios should have increasing prices
      for (let i = 1; i < analysis.scenarios.length; i++) {
        expect(analysis.scenarios[i].price).toBeGreaterThan(analysis.scenarios[i - 1].price);
      }
    });
  });
});
