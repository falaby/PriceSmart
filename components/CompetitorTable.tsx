'use client';

import { CompetitorListing } from '@/types';
import { formatCurrency, truncate } from '@/lib/utils';

interface CompetitorTableProps {
  competitors: CompetitorListing[];
}

export default function CompetitorTable({ competitors }: CompetitorTableProps) {
  const sourceBadges = {
    etsy: 'bg-orange-100 text-orange-800',
    ebay: 'bg-blue-100 text-blue-800',
    amazon: 'bg-yellow-100 text-yellow-800',
    shopify: 'bg-green-100 text-green-800',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Product</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Source</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Price</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Est. Sales/mo</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((comp, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3">
                {comp.url ? (
                  <a
                    href={comp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {truncate(comp.title, 50)}
                  </a>
                ) : (
                  truncate(comp.title, 50)
                )}
              </td>
              <td className="py-2 px-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${sourceBadges[comp.source]}`}>
                  {comp.source.toUpperCase()}
                </span>
              </td>
              <td className="py-2 px-3 font-semibold">{formatCurrency(comp.price)}</td>
              <td className="py-2 px-3">
                {comp.salesVolume ? comp.salesVolume : <span className="text-gray-400">N/A</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
