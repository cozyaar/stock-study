import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, Shield, Check, ArrowRight } from 'lucide-react';
import type { Page } from '@/App';

interface HomePageProps {
  onPageChange: (page: Page) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0a0e1a]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-in slide-in-from-left-8 duration-700 delay-200">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Learn Intraday Trading{' '}
                <span className="text-[#22c55e]">Without Risk</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#94a3b8] max-w-xl">
                Practice with real charts. Trade with virtual money. Master technical analysis
                and candlestick patterns with our comprehensive learning platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => onPageChange('learner')}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Start Learning
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => onPageChange('demo')}
                  variant="outline"
                  className="border-[#2d3748] text-white hover:bg-white/5 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200"
                >
                  Try Demo Account
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#64748b]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22c55e]" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22c55e]" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22c55e]" />
                  <span>Interactive lessons</span>
                </div>
              </div>
            </div>

            {/* Right Content - Chart Image */}
            <div className="relative animate-in slide-in-from-right-8 duration-700 delay-400">
              <div className="relative rounded-2xl overflow-hidden border border-[#2d3748] shadow-2xl">
                <img
                  src="/hero-chart.jpg"
                  alt="Trading Chart"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/50 to-transparent" />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-[#1a2234] border border-[#2d3748] rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#22c55e]/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748b]">Success Rate</p>
                    <p className="text-lg font-bold text-[#22c55e]">+78.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Master the Art of <span className="text-[#22c55e]">Intraday</span> Trading
            </h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
              Mission: Learn to identify key candlestick patterns for better trading decisions here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Learn Smart',
                description: 'Explore easy-to-follow lessons on day trading strategies and technical analysis.',
              },
              {
                icon: BarChart3,
                title: 'Analyze Charts',
                description: 'Understand candlestick patterns and technical indicators like a pro.',
              },
              {
                icon: Shield,
                title: 'Practice Risk-Free',
                description: 'Trade in a risk-free market environment with virtual money.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-[#1a2234] border border-[#2d3748] rounded-xl p-8 transition-all duration-300 hover:border-[#4a5568] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#22c55e]/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-[#22c55e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#94a3b8]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
              Follow our structured learning path to become a confident day trader.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Learn Basics',
                description: 'Understand the fundamentals of day trading and market mechanics.',
              },
              {
                step: '02',
                title: 'Practice Patterns',
                description: 'Learn and practice candlestick patterns with interactive quizzes.',
              },
              {
                step: '03',
                title: 'Trade Demo',
                description: 'Trade stocks using a demo account with virtual money.',
              },
              {
                step: '04',
                title: 'Track Performance',
                description: 'Analyze your trades, learn from mistakes, and improve.',
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-5xl font-bold text-[#22c55e]/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[#94a3b8]">{item.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#22c55e]/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-[#22c55e]/10 via-[#0a0e1a] to-[#111827]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-[#94a3b8] text-lg mb-10 max-w-2xl mx-auto">
            Whether you\'re a beginner or experienced trader, we have the tools you need to succeed.
            Start learning today and master the art of day trading.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => onPageChange('learner')}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              Start Learning Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => onPageChange('demo')}
              variant="outline"
              className="border-[#2d3748] text-white hover:bg-white/5 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              Create Demo Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e1a] border-t border-[#2d3748] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Study Stock</span>
              </div>
              <p className="text-[#94a3b8] text-sm">
                Master the art of day trading with our comprehensive learning platform.
                Practice risk-free with virtual money.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Contact', 'Learner', 'Demo'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => onPageChange(item.toLowerCase() as Page)}
                      className="text-[#94a3b8] hover:text-[#22c55e] transition-colors duration-200 text-sm"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Blog', 'Tutorials', 'FAQ', 'Support'].map((item) => (
                  <li key={item}>
                    <span className="text-[#94a3b8] text-sm cursor-pointer hover:text-[#22c55e] transition-colors duration-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-[#94a3b8]">
                <li>support@studystock.com</li>
                <li>+91 8904435530</li>
                <li>VIT CHENNAI<br />Chennai, Tamil Nadu 600013</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#2d3748] mt-12 pt-8 text-center text-sm text-[#64748b]">
            <p>© 2024 Study Stock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
