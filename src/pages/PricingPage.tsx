
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  return (
    <div className="min-h-screen dark-tech-bg px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Pricing Plans</h1>
          <p className="text-xl text-white/70">Choose the plan that fits your trading journey</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Let him cook */}
          <div className="plan-card plan-card-free p-8 text-center rounded-2xl">
            <h4 className="text-2xl font-bold text-white/90 mb-4">Let him cook</h4>
            <div className="text-5xl font-black text-white mb-6">FREE</div>
            <ul className="space-y-4 mb-8">
              <li className="text-white/80 flex items-center justify-center gap-2 text-lg">
                <span className="text-green-400 text-xl">✓</span>
                ALL FEATURES (Cooked/Goated) for FREE!
              </li>
            </ul>
            <Button asChild className="w-full button-3d bg-transparent border-white/40 text-white hover:bg-white/10 font-semibold">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>

          {/* Cooked */}
          <div className="plan-card plan-card-cooked p-8 text-center rounded-2xl">
            <h4 className="text-2xl font-bold text-white mb-4">Cooked</h4>
            <div className="text-2xl font-bold text-white mb-2">Indian users <span className="text-purple-300">₹499/mo</span></div>
            <div className="text-2xl font-bold text-white mb-6">International users <span className="text-purple-300">$8/mo</span></div>
            <ul className="space-y-3 mb-8 text-left">
              {["Access to Overview", "Access to All Trades", "Access to Add Trades", "Access to Analytics", "Access to Limited cloud storage"].map((feature, i) => (
                <li key={i} className="text-white/80 flex items-center gap-2">
                  <span className="text-purple-400 text-lg">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 font-semibold border-none">
              <Link to="/auth">Upgrade</Link>
            </Button>
          </div>

          {/* Goated */}
          <div className="plan-card plan-card-goated p-8 text-center rounded-2xl">
            <h4 className="text-2xl font-bold text-white mb-4">Goated</h4>
            <div className="text-2xl font-bold text-white mb-2">Indian users <span className="text-yellow-400">₹799/mo</span></div>
            <div className="text-2xl font-bold text-white mb-6">International users <span className="text-yellow-400">$12/mo</span></div>
            <ul className="space-y-3 mb-8 text-left">
              {["All Basic features", "Import/export trades as zip/pdf", "Unlimited cloud storage", "Advanced AI Integrated Feedbacks"].map((feature, i) => (
                <li key={i} className="text-white/80 flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold border-none">
              <Link to="/auth">Go Goated</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
