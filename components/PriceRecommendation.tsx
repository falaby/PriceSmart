'use client';

import { PricingAnalysis } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import ProfitChart from './ProfitChart';
import CompetitorTable from './CompetitorTable';

interface PriceRecommendationProps {
  analysis: PricingAnalysis;
}

export default function PriceRecommendation({ analysis }: PriceRecommendationProps) {
  const confidenceBadgeColors = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {analysis.warning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Important Notice</h4>
              <p className="text-yellow-800 text-sm">{analysis.warning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Recommendation Card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Recommended Price</h3>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
              confidenceBadgeColors[analysis.confidence]
            }`}
          >
            {analysis.confidence.toUpperCase()} CONFIDENCE
          </span>
        </div>

        <div className="text-6xl font-bold mb-4">
          {formatCurrency(analysis.recommendedPrice)}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-sm opacity-90">Predicted Monthly Sales</div>
            <div className="text-3xl font-bold mt-1">
              {formatNumber(analysis.predictedSales)}
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-sm opacity-90">Predicted Monthly Profit</div>
            <div className="text-3xl font-bold mt-1">
              {formatCurrency(analysis.predictedProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          How we calculated this
        </h4>
        <p className="text-gray-700">{analysis.explanation}</p>

        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Competitors analyzed:</span>
            <span className="font-semibold ml-2">{analysis.competitorCount}</span>
          </div>
          <div>
            <span className="text-gray-600">Model R²:</span>
            <span className="font-semibold ml-2">
              {analysis.rSquared > 0 ? analysis.rSquared.toFixed(3) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Profit Chart */}
      {analysis.scenarios.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Price vs. Profit Analysis</h4>
          <ProfitChart scenarios={analysis.scenarios} recommendedPrice={analysis.recommendedPrice} />
        </div>
      )}

      {/* Scenario Table */}
      {analysis.scenarios.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Price Scenarios</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Expected Sales</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Expected Profit</th>
                </tr>
              </thead>
              <tbody>
                {analysis.scenarios.map((scenario, idx) => {
                  const isRecommended = Math.abs(scenario.price - analysis.recommendedPrice) < 0.01;
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-gray-100 ${
                        isRecommended ? 'bg-primary-50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2 px-3">
                        {formatCurrency(scenario.price)}
                        {isRecommended && (
                          <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded">
                            BEST
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">{formatNumber(scenario.expectedSales)}</td>
                      <td className="py-2 px-3">{formatCurrency(scenario.expectedProfit)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Competitor Data */}
      {analysis.competitors.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Competitor Insights ({analysis.competitors.length} products)
          </h4>
          <CompetitorTable competitors={analysis.competitors.slice(0, 10)} />
        </div>
      )}
    </div>
  );
}
