import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-accent-600 bg-clip-text text-transparent">
            PriceSmart
          </div>
          <div className="space-x-4 flex items-center">
            <Link
              href="/auth/signin"
              className="text-orange-800 hover:text-orange-600 font-medium transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full text-orange-700 font-semibold text-sm">
          ✨ AI-Powered Pricing Intelligence
        </div>
        <h1 className="text-6xl md:text-7xl font-bold text-orange-900 mb-6 leading-tight">
          Price Your Products<br />
          <span className="bg-gradient-to-r from-orange-500 to-accent-500 bg-clip-text text-transparent">
            Like a Pro
          </span>
        </h1>
        <p className="text-xl text-orange-800 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop guessing. Use real competitor data and advanced algorithms to find
          the profit-maximizing price for your products.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth/signup"
            className="btn-primary text-lg px-10 py-4"
          >
            Start Free Analysis →
          </Link>
          <Link
            href="#features"
            className="btn-secondary text-lg px-10 py-4"
          >
            Learn More
          </Link>
        </div>
        <p className="text-sm text-orange-600 mt-6">
          No credit card required • 10 free analyses per month
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-orange-900 mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-elevated p-8 group hover:scale-105 transition-transform duration-300">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-2xl font-bold mb-4 text-orange-900">Real Competitor Data</h3>
            <p className="text-orange-700 leading-relaxed">
              We analyze pricing from Etsy, eBay, and Amazon to understand
              your market landscape.
            </p>
          </div>
          <div className="card-elevated p-8 group hover:scale-105 transition-transform duration-300">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-2xl font-bold mb-4 text-orange-900">Smart Algorithm</h3>
            <p className="text-orange-700 leading-relaxed">
              Advanced regression analysis models the demand curve to find
              your optimal price point.
            </p>
          </div>
          <div className="card-elevated p-8 group hover:scale-105 transition-transform duration-300">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">💰</div>
            <h3 className="text-2xl font-bold mb-4 text-orange-900">Maximize Profit</h3>
            <p className="text-orange-700 leading-relaxed">
              Get clear recommendations with projected sales and profit to
              make confident pricing decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-orange-900 mb-4">
          Simple Pricing
        </h2>
        <p className="text-center text-orange-700 mb-16 text-lg">
          Start free, upgrade when you're ready
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="card-elevated p-10 hover:scale-105 transition-transform">
            <h3 className="text-3xl font-bold mb-2 text-orange-900">Free</h3>
            <div className="text-5xl font-bold mb-8 text-orange-700">
              $0<span className="text-xl text-orange-600">/month</span>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-800">10 price analyses per month</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-800">Basic competitor data</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-800">Pricing recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-800">Profit projections</span>
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="btn-secondary block text-center w-full"
            >
              Get Started Free
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="relative card-elevated p-10 hover:scale-105 transition-transform bg-gradient-to-br from-orange-50 to-cream-100 border-2 border-orange-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              ⭐ POPULAR
            </div>
            <h3 className="text-3xl font-bold mb-2 text-orange-900">Premium</h3>
            <div className="text-5xl font-bold mb-8 text-orange-600">
              $1.00<span className="text-xl opacity-80">/month</span>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <span className="text-accent-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-900 font-medium">Unlimited price analyses</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-900 font-medium">Advanced competitor insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-900 font-medium">Historical analysis tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-900 font-medium">Export reports</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-3 text-2xl">✓</span>
                <span className="text-orange-900 font-medium">Priority support</span>
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="btn-primary block text-center w-full"
            >
              Start Premium →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 py-10 mt-20 bg-white/50">
        <div className="container mx-auto px-4 text-center text-orange-700">
          <p className="font-medium">&copy; 2025 PriceSmart. Built for sellers who want to maximize profits.</p>
        </div>
      </footer>
    </div>
  );
}
