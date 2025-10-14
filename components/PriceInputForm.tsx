'use client';

import { useState } from 'react';
import { ProductInput } from '@/types';

interface PriceInputFormProps {
  onSubmit: (data: ProductInput) => void;
  loading: boolean;
}

export default function PriceInputForm({ onSubmit, loading }: PriceInputFormProps) {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    description: '',
    keyword: '',
    category: '',
    unitCost: 0,
    variableCosts: 0,
    photoUrl: '',
    monthlySales: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Art & Collectibles',
    'Jewelry & Accessories',
    'Clothing & Shoes',
    'Home & Living',
    'Toys & Games',
    'Craft Supplies & Tools',
    'Electronics',
    'Books & Media',
    'Pet Supplies',
    'Other',
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.keyword.trim()) newErrors.keyword = 'Keyword is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.unitCost <= 0) newErrors.unitCost = 'Unit cost must be greater than 0';
    if (formData.variableCosts < 0) newErrors.variableCosts = 'Variable costs cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Handmade Wooden Cutting Board"
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          placeholder="Describe your product..."
          disabled={loading}
        />
      </div>

      {/* Keyword */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Keyword/Tag <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.keyword}
          onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="wooden cutting board"
          disabled={loading}
        />
        <p className="text-sm text-gray-500 mt-1">
          This keyword will be used to find similar products on Etsy, eBay, and Amazon
        </p>
        {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword}</p>}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Unit Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Cost <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.unitCost || ''}
              onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="10.00"
              disabled={loading}
            />
          </div>
          {errors.unitCost && <p className="text-red-500 text-sm mt-1">{errors.unitCost}</p>}
        </div>

        {/* Variable Costs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variable Costs <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.variableCosts || ''}
              onChange={(e) => setFormData({ ...formData, variableCosts: parseFloat(e.target.value) || 0 })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="5.00"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Shipping, fees, etc.</p>
          {errors.variableCosts && <p className="text-red-500 text-sm mt-1">{errors.variableCosts}</p>}
        </div>

        {/* Monthly Sales (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Sales <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            min="0"
            value={formData.monthlySales || ''}
            onChange={(e) => setFormData({ ...formData, monthlySales: parseInt(e.target.value) || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="30"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Your current sales</p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing...' : 'Analyze Pricing'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Total cost: ${(formData.unitCost + formData.variableCosts).toFixed(2)}
      </p>
    </form>
  );
}
