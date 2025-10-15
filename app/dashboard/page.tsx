'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { ProductInput, PricingAnalysis } from '@/types';
import PriceInputForm from '@/components/PriceInputForm';
import PriceRecommendation from '@/components/PriceRecommendation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PricingAnalysis | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setUser(user);

    // Get subscription info
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setSubscription(sub);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpgrade = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No session');
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      alert('Failed to start upgrade process');
    }
  };

  const handleAnalysis = async (productData: ProductInput) => {
    setAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No session');
      }

      const response = await fetch('/api/analyze-price', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.upgradeRequired) {
          setError(data.message);
        } else {
          throw new Error(data.error || 'Analysis failed');
        }
      } else {
        setAnalysis(data.analysis);

        // Refresh subscription info
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setSubscription(sub);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze pricing. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const analysesRemaining = subscription?.plan === 'free'
    ? Math.max(0, 10 - (subscription?.analyses_used_this_month || 0))
    : 'unlimited';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary-600">PriceSmart</h1>
              <span className="text-sm text-gray-600">
                {subscription?.plan === 'premium' ? (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                    Premium
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    Free Plan
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Analyses remaining: <span className="font-semibold">{analysesRemaining}</span>
              </div>
              {subscription?.plan === 'free' && (
                <button
                  onClick={handleUpgrade}
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                >
                  Upgrade to Premium
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-cream-50 rounded-lg shadow-sm p-8 mb-8 border border-orange-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-orange-900 mb-2">
                  Welcome back, {user?.email?.split('@')[0]}! 👋
                </h2>
                <p className="text-orange-700 text-lg">
                  Ready to optimize your pricing? Enter your product details below.
                </p>
              </div>
              {!analysis && !analyzing && (
                <div className="hidden md:block">
                  <div className="bg-white px-6 py-4 rounded-lg shadow-md border-2 border-orange-300">
                    <div className="text-sm text-orange-600 font-semibold mb-1">ANALYSES LEFT</div>
                    <div className="text-4xl font-bold text-orange-900">{analysesRemaining}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <span className="text-red-500 text-xl mr-3">❌</span>
                <div className="flex-1">
                  <p className="text-red-800">{error}</p>
                  {error.includes('limit') && (
                    <button
                      onClick={handleUpgrade}
                      className="mt-2 bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition text-sm"
                    >
                      Upgrade Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Input Form */}
          {!analysis && !analyzing && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">📊 Product Information</h3>
                <div className="text-sm text-gray-500">
                  Step 1: Fill in your product details
                </div>
              </div>
              <PriceInputForm onSubmit={handleAnalysis} loading={analyzing} />
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Your Pricing Analysis</h3>
                <button
                  onClick={() => setAnalysis(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  New Analysis
                </button>
              </div>
              <PriceRecommendation analysis={analysis} />
            </div>
          )}

          {/* Loading State */}
          {analyzing && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Product</h3>
              <p className="text-gray-600">
                Fetching competitor data from Etsy, eBay, and Amazon...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
