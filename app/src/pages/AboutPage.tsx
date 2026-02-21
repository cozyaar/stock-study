import { Users, Shield, TrendingUp, Award, BookOpen } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-[#22c55e]">Study Stock</span>
            </h1>
            <p className="text-xl text-[#94a3b8]">
              We're on a mission to make day trading education accessible, interactive, and risk-free for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-[#94a3b8] text-lg mb-6">
                We believe that financial education should be accessible to everyone. Our platform provides
                a comprehensive learning experience for day trading, combining theoretical knowledge with
                practical, hands-on training using virtual money.
              </p>
              <p className="text-[#94a3b8] text-lg">
                Whether you're a complete beginner or looking to refine your trading strategies,
                our structured curriculum and interactive tools will help you master the art of
                technical analysis and candlestick pattern recognition.
              </p>
            </div>
            <div className="relative">
              <img
                src="/about-illustration.jpg"
                alt="Trading Education"
                className="rounded-2xl border border-[#2d3748] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Education First',
                description: 'We prioritize comprehensive learning over quick profits. Knowledge is the foundation of successful trading.',
              },
              {
                icon: Shield,
                title: 'Risk-Free Learning',
                description: 'Practice with virtual money in a realistic trading environment. Learn from mistakes without losing real capital.',
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Join a community of learners and traders. Share insights, ask questions, and grow together.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-[#1a2234] border border-[#2d3748] rounded-xl p-8 text-center transition-all duration-300 hover:border-[#4a5568] hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-[#22c55e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-[#94a3b8]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Active Learners', icon: Users },
              { value: '50+', label: 'Interactive Lessons', icon: BookOpen },
              { value: '95%', label: 'Success Rate', icon: TrendingUp },
              { value: '24/7', label: 'Demo Trading', icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-[#22c55e]" />
                </div>
                <p className="text-4xl font-bold text-[#22c55e] mb-2">{stat.value}</p>
                <p className="text-[#94a3b8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
              Comprehensive tools and resources to help you become a confident trader
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Interactive Learning Modules',
                description: 'Step-by-step lessons covering everything from basic concepts to advanced trading strategies.',
              },
              {
                title: 'Virtual Trading Simulator',
                description: 'Practice trading with real-time market data using virtual money. No risk, all learning.',
              },
              {
                title: 'Candlestick Pattern Recognition',
                description: 'Learn to identify and trade key candlestick patterns with interactive quizzes and examples.',
              },
              {
                title: 'Technical Analysis Tools',
                description: 'Master indicators like MACD, RSI, Moving Averages, and Bollinger Bands.',
              },
              {
                title: 'Risk Management Training',
                description: 'Learn essential risk management techniques to protect your capital.',
              },
              {
                title: 'Progress Tracking',
                description: 'Track your learning progress and trading performance over time.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 bg-[#1a2234] border border-[#2d3748] rounded-xl"
              >
                <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#94a3b8] text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e1a] border-t border-[#2d3748] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Study Stock</span>
          </div>
          <p className="text-[#94a3b8] max-w-md mx-auto mb-8">
            Master the art of day trading with our comprehensive learning platform.
          </p>
          <div className="border-t border-[#2d3748] pt-8 text-sm text-[#64748b]">
            <p>© 2024 Study Stock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
