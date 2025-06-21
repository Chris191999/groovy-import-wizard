
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Zap, TrendingUp, Shield, BarChart3, Brain, Target, Lightbulb, Eye, X } from 'lucide-react';
import AuroraBackground from './AuroraBackground';
import RubiksCube3D from './RubiksCube3D';
import DeviceMockup from './DeviceMockup';
import KeyFeaturesLightbox from './KeyFeaturesLightbox';
import ResponsiveHeader from './ResponsiveHeader';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const lightboxImages = [
    { src: '/overview.jpg', alt: 'Dashboard Overview - Complete trading performance at a glance' },
    { src: '/all trades.jpg', alt: 'Trade Management - Organize and track all your trades' },
    { src: '/add trades.jpg', alt: 'Quick Trade Entry - Easy and intuitive trade logging' },
    { src: '/importexport.jpg', alt: 'Data Management - Import/export your trading data' }
  ];

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Deep dive into your trading performance with comprehensive metrics and insights.",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Psychology Tracking",
      description: "Monitor your emotional state and psychological patterns to improve decision-making.",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Risk Management",
      description: "Advanced risk metrics and position sizing tools to protect your capital.",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Performance Insights",
      description: "Identify your strengths and weaknesses with detailed performance breakdowns.",
      gradient: "from-orange-400 to-red-400"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Cloud Storage",
      description: "Your data is safely stored and accessible from anywhere, anytime.",
      gradient: "from-indigo-400 to-purple-400"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations to improve your trading strategy.",
      gradient: "from-yellow-400 to-orange-400"
    }
  ];

  const openLightbox = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setShowLightbox(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-section');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          element.classList.add('fade-in-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <AuroraBackground />
      
      {/* Responsive Header */}
      <ResponsiveHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto pt-16 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold golden-text mb-4 sm:mb-6">
              TRADEMIND
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-2">
              The last missing piece in your trading puzzle.
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Professional. Precise. Powerful.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16"
          >
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-purple-500/25"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
            >
              Discover More
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="animate-bounce cursor-pointer"
            onClick={() => scrollToSection('features')}
          >
            <ChevronDown className="h-8 w-8 mx-auto text-white/60" />
          </motion.div>
        </div>

        {/* 3D Cube positioned for better mobile display */}
        <div className="absolute right-4 sm:right-8 lg:right-16 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <RubiksCube3D />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 gradient-text">
              Why Choose TRADEMIND?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Built by traders, for traders. Experience the difference with our cutting-edge features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 sm:p-8 hover:transform hover:scale-105 transition-all duration-300 group"
              >
                <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 gradient-text">
              Choose Your Plan
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="plan-card plan-card-free p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Let him cook</h3>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">FREE</div>
                <p className="text-gray-400">Perfect for beginners</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Basic trade logging
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Simple analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Mobile access
                </li>
              </ul>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Get Started
              </button>
            </motion.div>

            {/* Cooked Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="plan-card plan-card-cooked p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Cooked</h3>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">₹999<span className="text-lg">/mo</span></div>
                <p className="text-purple-200">For serious traders</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Psychology tracking
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Risk management tools
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Priority support
                </li>
              </ul>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg"
              >
                Choose Cooked
              </button>
            </motion.div>

            {/* Goated Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="plan-card plan-card-goated p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Goated</h3>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">₹1999<span className="text-lg">/mo</span></div>
                <p className="text-yellow-200">For trading legends</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Everything in Cooked
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  AI-powered insights
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Custom strategies
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  1-on-1 coaching
                </li>
              </ul>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg"
              >
                Go Goated
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section id="showcase" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 gradient-text">
              See TRADEMIND in Action
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our intuitive interface and powerful features designed to elevate your trading game.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* App Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="glass-card p-4 sm:p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openLightbox(0)}
                >
                  <img src="/overview.jpg" alt="Overview Dashboard" className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4" />
                  <h3 className="font-bold text-white mb-2">Dashboard Overview</h3>
                  <p className="text-gray-300 text-sm">Complete trading performance at a glance</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="glass-card p-4 sm:p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openLightbox(1)}
                >
                  <img src="/all trades.jpg" alt="All Trades View" className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4" />
                  <h3 className="font-bold text-white mb-2">Trade Management</h3>
                  <p className="text-gray-300 text-sm">Organize and track all your trades</p>
                </motion.div>
              </div>

              <div className="space-y-4 sm:space-y-6 mt-0 sm:mt-8">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-4 sm:p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openLightbox(2)}
                >
                  <img src="/add trades.jpg" alt="Add New Trade" className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4" />
                  <h3 className="font-bold text-white mb-2">Quick Trade Entry</h3>
                  <p className="text-gray-300 text-sm">Easy and intuitive trade logging</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="glass-card p-4 sm:p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openLightbox(3)}
                >
                  <img src="/importexport.jpg" alt="Import Export" className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4" />
                  <h3 className="font-bold text-white mb-2">Data Management</h3>
                  <p className="text-gray-300 text-sm">Import/export your trading data</p>
                </motion.div>
              </div>
            </div>

            {/* Device Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <DeviceMockup image="/overview.jpg" alt="TRADEMIND Dashboard Preview" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 gradient-text">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Join thousands of traders who have already elevated their performance with TRADEMIND.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-purple-500/25"
            >
              Start Your Journey
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
            >
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* Lightbox */}
      <KeyFeaturesLightbox 
        images={lightboxImages}
        photoIndex={selectedImageIndex}
        isOpen={showLightbox} 
        onClose={() => setShowLightbox(false)} 
      />
    </div>
  );
};

export default LandingPage;
