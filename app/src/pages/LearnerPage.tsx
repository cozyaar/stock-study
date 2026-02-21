import { useState } from 'react';
import { 
  BookOpen, ChevronRight, CheckCircle2, Circle, 
  TrendingUp, TrendingDown, Minus, Award, RotateCcw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizData: Record<string, QuizQuestion[]> = {
  'candlestick-basics': [
    {
      id: 'q1',
      question: 'What does a green (bullish) candlestick indicate?',
      options: [
        'The closing price was lower than the opening price',
        'The closing price was higher than the opening price',
        'The price remained unchanged',
        'The market was closed'
      ],
      correctAnswer: 1,
      explanation: 'A green (bullish) candlestick indicates that the closing price was higher than the opening price, showing buying pressure.'
    },
    {
      id: 'q2',
      question: 'What are the four main components of a candlestick?',
      options: [
        'Open, High, Low, Close',
        'Buy, Sell, Hold, Wait',
        'Support, Resistance, Trend, Volume',
        'MACD, RSI, SMA, EMA'
      ],
      correctAnswer: 0,
      explanation: 'The four main components are Open (opening price), High (highest price), Low (lowest price), and Close (closing price).'
    }
  ],
  'hammer': [
    {
      id: 'q1',
      question: 'Where does the Hammer pattern typically appear?',
      options: [
        'At the top of an uptrend',
        'At the bottom of a downtrend',
        'In the middle of a trend',
        'Only in sideways markets'
      ],
      correctAnswer: 1,
      explanation: 'The Hammer pattern typically appears at the bottom of a downtrend and signals a potential bullish reversal.'
    },
    {
      id: 'q2',
      question: 'What is the key characteristic of a Hammer candlestick?',
      options: [
        'Long upper wick and small body',
        'Long lower wick and small body at the top',
        'No wicks and large body',
        'Equal upper and lower wicks'
      ],
      correctAnswer: 1,
      explanation: 'A Hammer has a long lower wick (about 2-3 times the body) and a small body at the top of the range.'
    }
  ],
  'shooting-star': [
    {
      id: 'q1',
      question: 'What does a Shooting Star pattern indicate?',
      options: [
        'Bullish continuation',
        'Bearish reversal',
        'Market consolidation',
        'High volatility'
      ],
      correctAnswer: 1,
      explanation: 'A Shooting Star is a bearish reversal pattern that appears at the top of an uptrend.'
    }
  ],
  'doji': [
    {
      id: 'q1',
      question: 'What does a Doji candlestick represent?',
      options: [
        'Strong buying pressure',
        'Strong selling pressure',
        'Market indecision',
        'Trend continuation'
      ],
      correctAnswer: 2,
      explanation: 'A Doji represents market indecision, where buying and selling pressures are in equilibrium.'
    }
  ]
};

export function LearnerPage() {
  const [activeLesson, setActiveLesson] = useState('intro-daytrading');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>((['basics', 'candlestick-patterns']));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleQuizAnswer = (lessonId: string, questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [`${lessonId}-${questionId}`]: answerIndex }));
  };

  const checkQuizAnswer = (lessonId: string, questionId: string, correctAnswer: number) => {
    const userAnswer = quizAnswers[`${lessonId}-${questionId}`];
    return userAnswer === correctAnswer;
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const calculateProgress = () => {
    const totalLessons = 15; // Approximate total
    return Math.round((completedLessons.length / totalLessons) * 100);
  };

  const lessonCategories = [
    {
      id: 'basics',
      title: 'Basics',
      icon: BookOpen,
      lessons: [
        { id: 'intro-daytrading', title: 'Introduction to Day Trading' },
        { id: 'technical-analysis', title: 'What is Technical Analysis?' },
        { id: 'risk-basics', title: 'Risk Management Basics' },
      ]
    },
    {
      id: 'candlestick-patterns',
      title: 'Candlestick Patterns',
      icon: TrendingUp,
      lessons: [
        { id: 'candlestick-basics', title: 'What Are Candlesticks?' },
        { id: 'hammer', title: 'Bullish: Hammer' },
        { id: 'morning-star', title: 'Bullish: Morning Star' },
        { id: 'bullish-engulfing', title: 'Bullish: Engulfing' },
        { id: 'shooting-star', title: 'Bearish: Shooting Star' },
        { id: 'evening-star', title: 'Bearish: Evening Star' },
        { id: 'bearish-engulfing', title: 'Bearish: Engulfing' },
        { id: 'doji', title: 'Bilateral: Doji' },
        { id: 'spinning-top', title: 'Bilateral: Spinning Top' },
      ]
    },
    {
      id: 'chart-patterns',
      title: 'Chart Patterns',
      icon: TrendingDown,
      lessons: [
        { id: 'support-resistance', title: 'Support and Resistance' },
        { id: 'double-patterns', title: 'Double Top/Bottom' },
        { id: 'head-shoulders', title: 'Head and Shoulders' },
        { id: 'triangles', title: 'Triangles' },
      ]
    },
    {
      id: 'indicators',
      title: 'Technical Indicators',
      icon: Minus,
      lessons: [
        { id: 'moving-averages', title: 'Moving Averages' },
        { id: 'macd', title: 'MACD' },
        { id: 'rsi', title: 'RSI' },
      ]
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      icon: Award,
      lessons: [
        { id: 'position-sizing', title: 'Position Sizing' },
        { id: 'stop-loss', title: 'Stop Loss Strategies' },
      ]
    },
  ];

  const renderLessonContent = () => {
    switch (activeLesson) {
      case 'intro-daytrading':
        return (
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-[#22c55e]/20 text-[#22c55e]">Basics</Badge>
              <h2 className="text-3xl font-bold mb-4">Introduction to Day Trading</h2>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-[#94a3b8] text-lg">
                Day trading is the practice of buying and selling financial instruments within the same trading day. 
                Unlike long-term investing, day traders aim to profit from short-term price movements.
              </p>
              
              <h3 className="text-xl font-semibold mt-8 mb-4">What You Will Learn</h3>
              <ul className="space-y-3 text-[#94a3b8]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <span>How to read and analyze candlestick charts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <span>Identify key reversal and continuation patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <span>Use technical indicators to confirm trades</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <span>Manage risk and protect your capital</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4">Why Day Trading?</h3>
              <p className="text-[#94a3b8]">
                Day trading offers the potential for quick profits and doesn't require holding positions overnight, 
                avoiding overnight risk. However, it requires discipline, knowledge, and proper risk management.
              </p>
            </div>

            <Button 
              onClick={() => markLessonComplete('intro-daytrading')}
              className="bg-[#22c55e] hover:bg-[#16a34a] mt-6"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </div>
        );

      case 'candlestick-basics':
        return (
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-[#22c55e]/20 text-[#22c55e]">Candlestick Patterns</Badge>
              <h2 className="text-3xl font-bold mb-4">What Are Candlesticks?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[#94a3b8]">
                  A candlestick is a single bar on a candlestick price chart, showing traders market movements at a glance. 
                  Each candlestick shows the open price, low price, high price, and close price for a particular period.
                </p>
                
                <h3 className="text-lg font-semibold mt-6">Components:</h3>
                <ul className="space-y-2 text-[#94a3b8]">
                  <li><span className="text-white font-medium">Body:</span> Represents the open-to-close range</li>
                  <li><span className="text-white font-medium">Wick/Shadow:</span> Indicates the intra-day high and low</li>
                  <li><span className="text-white font-medium">Color:</span> Green = price increase, Red = price decrease</li>
                </ul>
              </div>

              <div className="bg-[#111827] rounded-xl p-6 border border-[#2d3748]">
                <h4 className="font-semibold mb-4 text-center">Bullish vs Bearish Candle</h4>
                <div className="flex justify-around items-end h-48">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-32 bg-[#22c55e] rounded-sm relative">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#22c55e]" />
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#22c55e]" />
                    </div>
                    <span className="mt-6 text-sm text-[#22c55e]">Bullish</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-24 bg-[#ef4444] rounded-sm relative">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-6 bg-[#ef4444]" />
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#ef4444]" />
                    </div>
                    <span className="mt-6 text-sm text-[#ef4444]">Bearish</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Section */}
            {quizData['candlestick-basics'] && (
              <div className="mt-8 bg-[#111827] rounded-xl p-6 border border-[#2d3748]">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#22c55e]" />
                  Test Your Knowledge!
                </h3>
                
                {quizData['candlestick-basics'].map((q, idx) => (
                  <div key={q.id} className="mb-6 last:mb-0">
                    <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const answerKey = `candlestick-basics-${q.id}`;
                        const isSelected = quizAnswers[answerKey] === optIdx;
                        const isCorrect = optIdx === q.correctAnswer;
                        const showResult = showQuizResults[`candlestick-basics-${q.id}`];
                        
                        return (
                          <button
                            key={optIdx}
                            onClick={() => !showResult && handleQuizAnswer('candlestick-basics', q.id, optIdx)}
                            disabled={showResult}
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                              showResult
                                ? isCorrect
                                  ? 'bg-[#22c55e]/20 border-[#22c55e] text-white'
                                  : isSelected
                                    ? 'bg-[#ef4444]/20 border-[#ef4444] text-white'
                                    : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8]'
                                : isSelected
                                  ? 'bg-[#22c55e]/10 border-[#22c55e] text-white'
                                  : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8] hover:border-[#4a5568]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {!showQuizResults[`candlestick-basics-${q.id}`] ? (
                      <Button
                        onClick={() => setShowQuizResults(prev => ({ ...prev, [`candlestick-basics-${q.id}`]: true }))}
                        disabled={quizAnswers[`candlestick-basics-${q.id}`] === undefined}
                        className="mt-3 bg-[#22c55e] hover:bg-[#16a34a]"
                        size="sm"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <div className={`mt-3 p-3 rounded-lg ${checkQuizAnswer('candlestick-basics', q.id, q.correctAnswer) ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'}`}>
                        <p className={checkQuizAnswer('candlestick-basics', q.id, q.correctAnswer) ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                          {checkQuizAnswer('candlestick-basics', q.id, q.correctAnswer) ? 'Correct!' : 'Incorrect.'}
                        </p>
                        <p className="text-[#94a3b8] text-sm mt-1">{q.explanation}</p>
                        {!checkQuizAnswer('candlestick-basics', q.id, q.correctAnswer) && (
                          <Button
                            onClick={() => {
                              setShowQuizResults(prev => ({ ...prev, [`candlestick-basics-${q.id}`]: false }));
                              setQuizAnswers(prev => ({ ...prev, [`candlestick-basics-${q.id}`]: null }));
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2 border-[#2d3748]"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Again
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={() => markLessonComplete('candlestick-basics')}
              className="bg-[#22c55e] hover:bg-[#16a34a]"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </div>
        );

      case 'hammer':
        return (
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-[#22c55e]/20 text-[#22c55e]">Bullish Pattern</Badge>
              <h2 className="text-3xl font-bold mb-4">Hammer Pattern</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[#94a3b8]">
                  The Hammer is a bullish reversal pattern that forms after a decline in price. 
                  It indicates that sellers pushed the price down, but buyers stepped in strongly 
                  to close the price near the opening level.
                </p>
                
                <h3 className="text-lg font-semibold mt-6">Characteristics:</h3>
                <ul className="space-y-2 text-[#94a3b8]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#22c55e]">•</span>
                    Little to no upper shadow
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22c55e]">•</span>
                    Long lower wick (2-3x the body length)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22c55e]">•</span>
                    Small body at the top of the range
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22c55e]">•</span>
                    Appears at the bottom of a downtrend
                  </li>
                </ul>

                <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#22c55e]">
                    <strong>Trading Tip:</strong> Wait for confirmation on the next candle. 
                    The price should move up following the hammer for the pattern to be valid.
                  </p>
                </div>
              </div>

              <div className="bg-[#111827] rounded-xl p-6 border border-[#2d3748]">
                <img 
                  src="/candlestick-hammer.jpg" 
                  alt="Hammer Pattern" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Quiz */}
            {quizData['hammer'] && (
              <div className="mt-8 bg-[#111827] rounded-xl p-6 border border-[#2d3748]">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#22c55e]" />
                  Test Your Knowledge!
                </h3>
                {quizData['hammer'].map((q, idx) => (
                  <div key={q.id} className="mb-6 last:mb-0">
                    <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const answerKey = `hammer-${q.id}`;
                        const isSelected = quizAnswers[answerKey] === optIdx;
                        const isCorrect = optIdx === q.correctAnswer;
                        const showResult = showQuizResults[`hammer-${q.id}`];
                        
                        return (
                          <button
                            key={optIdx}
                            onClick={() => !showResult && handleQuizAnswer('hammer', q.id, optIdx)}
                            disabled={showResult}
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                              showResult
                                ? isCorrect
                                  ? 'bg-[#22c55e]/20 border-[#22c55e] text-white'
                                  : isSelected
                                    ? 'bg-[#ef4444]/20 border-[#ef4444] text-white'
                                    : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8]'
                                : isSelected
                                  ? 'bg-[#22c55e]/10 border-[#22c55e] text-white'
                                  : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8] hover:border-[#4a5568]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {!showQuizResults[`hammer-${q.id}`] ? (
                      <Button
                        onClick={() => setShowQuizResults(prev => ({ ...prev, [`hammer-${q.id}`]: true }))}
                        disabled={quizAnswers[`hammer-${q.id}`] === undefined}
                        className="mt-3 bg-[#22c55e] hover:bg-[#16a34a]"
                        size="sm"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <div className={`mt-3 p-3 rounded-lg ${checkQuizAnswer('hammer', q.id, q.correctAnswer) ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'}`}>
                        <p className={checkQuizAnswer('hammer', q.id, q.correctAnswer) ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                          {checkQuizAnswer('hammer', q.id, q.correctAnswer) ? 'Correct!' : 'Incorrect.'}
                        </p>
                        <p className="text-[#94a3b8] text-sm mt-1">{q.explanation}</p>
                        {!checkQuizAnswer('hammer', q.id, q.correctAnswer) && (
                          <Button
                            onClick={() => {
                              setShowQuizResults(prev => ({ ...prev, [`hammer-${q.id}`]: false }));
                              setQuizAnswers(prev => ({ ...prev, [`hammer-${q.id}`]: null }));
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2 border-[#2d3748]"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Again
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={() => markLessonComplete('hammer')}
              className="bg-[#22c55e] hover:bg-[#16a34a]"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </div>
        );

      case 'shooting-star':
        return (
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-[#ef4444]/20 text-[#ef4444]">Bearish Pattern</Badge>
              <h2 className="text-3xl font-bold mb-4">Shooting Star Pattern</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[#94a3b8]">
                  The Shooting Star is a bearish reversal pattern that forms after an advance in price. 
                  It indicates that buyers pushed the price up, but sellers stepped in strongly to push 
                  the price back down near the opening level.
                </p>
                
                <h3 className="text-lg font-semibold mt-6">Characteristics:</h3>
                <ul className="space-y-2 text-[#94a3b8]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    Little to no lower shadow
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    Long upper wick (2-3x the body length)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    Small body at the bottom of the range
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    Appears at the top of an uptrend
                  </li>
                </ul>

                <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#ef4444]">
                    <strong>Warning:</strong> If the price rises after a shooting star, 
                    the formation may have been a false signal. Always wait for confirmation.
                  </p>
                </div>
              </div>

              <div className="bg-[#111827] rounded-xl p-6 border border-[#2d3748]">
                <img 
                  src="/candlestick-shootingstar.jpg" 
                  alt="Shooting Star Pattern" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Quiz */}
            {quizData['shooting-star'] && (
              <div className="mt-8 bg-[#111827] rounded-xl p-6 border border-[#2d3748]">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#22c55e]" />
                  Test Your Knowledge!
                </h3>
                {quizData['shooting-star'].map((q, idx) => (
                  <div key={q.id} className="mb-6 last:mb-0">
                    <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const answerKey = `shooting-star-${q.id}`;
                        const isSelected = quizAnswers[answerKey] === optIdx;
                        const isCorrect = optIdx === q.correctAnswer;
                        const showResult = showQuizResults[`shooting-star-${q.id}`];
                        
                        return (
                          <button
                            key={optIdx}
                            onClick={() => !showResult && handleQuizAnswer('shooting-star', q.id, optIdx)}
                            disabled={showResult}
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                              showResult
                                ? isCorrect
                                  ? 'bg-[#22c55e]/20 border-[#22c55e] text-white'
                                  : isSelected
                                    ? 'bg-[#ef4444]/20 border-[#ef4444] text-white'
                                    : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8]'
                                : isSelected
                                  ? 'bg-[#22c55e]/10 border-[#22c55e] text-white'
                                  : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8] hover:border-[#4a5568]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {!showQuizResults[`shooting-star-${q.id}`] ? (
                      <Button
                        onClick={() => setShowQuizResults(prev => ({ ...prev, [`shooting-star-${q.id}`]: true }))}
                        disabled={quizAnswers[`shooting-star-${q.id}`] === undefined}
                        className="mt-3 bg-[#22c55e] hover:bg-[#16a34a]"
                        size="sm"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <div className={`mt-3 p-3 rounded-lg ${checkQuizAnswer('shooting-star', q.id, q.correctAnswer) ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'}`}>
                        <p className={checkQuizAnswer('shooting-star', q.id, q.correctAnswer) ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                          {checkQuizAnswer('shooting-star', q.id, q.correctAnswer) ? 'Correct!' : 'Incorrect.'}
                        </p>
                        <p className="text-[#94a3b8] text-sm mt-1">{q.explanation}</p>
                        {!checkQuizAnswer('shooting-star', q.id, q.correctAnswer) && (
                          <Button
                            onClick={() => {
                              setShowQuizResults(prev => ({ ...prev, [`shooting-star-${q.id}`]: false }));
                              setQuizAnswers(prev => ({ ...prev, [`shooting-star-${q.id}`]: null }));
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2 border-[#2d3748]"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Again
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={() => markLessonComplete('shooting-star')}
              className="bg-[#22c55e] hover:bg-[#16a34a]"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </div>
        );

      case 'doji':
        return (
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-[#f59e0b]/20 text-[#f59e0b]">Bilateral Pattern</Badge>
              <h2 className="text-3xl font-bold mb-4">Doji Pattern</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[#94a3b8]">
                  A Doji candlestick has an open and close that are virtually equal. 
                  It represents market indecision, where neither buyers nor sellers could gain control.
                </p>
                
                <h3 className="text-lg font-semibold mt-6">Key Points:</h3>
                <ul className="space-y-2 text-[#94a3b8]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b]">•</span>
                    Open and close prices are nearly identical
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b]">•</span>
                    Represents market indecision
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b]">•</span>
                    Can appear in any trend
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b]">•</span>
                    Does NOT automatically mean reversal
                  </li>
                </ul>

                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#f59e0b]">
                    <strong>Important:</strong> The Doji pattern indicates indecision, not necessarily a reversal. 
                    Wait for confirmation from the next candlestick.
                  </p>
                </div>
              </div>

              <div className="bg-[#111827] rounded-xl p-6 border border-[#2d3748] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-1 h-8 bg-[#94a3b8]" />
                  <div className="w-4 h-1 bg-[#94a3b8] rounded-full" />
                  <div className="w-1 h-8 bg-[#94a3b8]" />
                  <span className="mt-4 text-sm text-[#94a3b8]">Doji</span>
                </div>
              </div>
            </div>

            {/* Quiz */}
            {quizData['doji'] && (
              <div className="mt-8 bg-[#111827] rounded-xl p-6 border border-[#2d3748]">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#22c55e]" />
                  Test Your Knowledge!
                </h3>
                {quizData['doji'].map((q, idx) => (
                  <div key={q.id} className="mb-6 last:mb-0">
                    <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const answerKey = `doji-${q.id}`;
                        const isSelected = quizAnswers[answerKey] === optIdx;
                        const isCorrect = optIdx === q.correctAnswer;
                        const showResult = showQuizResults[`doji-${q.id}`];
                        
                        return (
                          <button
                            key={optIdx}
                            onClick={() => !showResult && handleQuizAnswer('doji', q.id, optIdx)}
                            disabled={showResult}
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                              showResult
                                ? isCorrect
                                  ? 'bg-[#22c55e]/20 border-[#22c55e] text-white'
                                  : isSelected
                                    ? 'bg-[#ef4444]/20 border-[#ef4444] text-white'
                                    : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8]'
                                : isSelected
                                  ? 'bg-[#22c55e]/10 border-[#22c55e] text-white'
                                  : 'bg-[#1a2234] border-[#2d3748] text-[#94a3b8] hover:border-[#4a5568]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {!showQuizResults[`doji-${q.id}`] ? (
                      <Button
                        onClick={() => setShowQuizResults(prev => ({ ...prev, [`doji-${q.id}`]: true }))}
                        disabled={quizAnswers[`doji-${q.id}`] === undefined}
                        className="mt-3 bg-[#22c55e] hover:bg-[#16a34a]"
                        size="sm"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <div className={`mt-3 p-3 rounded-lg ${checkQuizAnswer('doji', q.id, q.correctAnswer) ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'}`}>
                        <p className={checkQuizAnswer('doji', q.id, q.correctAnswer) ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                          {checkQuizAnswer('doji', q.id, q.correctAnswer) ? 'Correct!' : 'Incorrect.'}
                        </p>
                        <p className="text-[#94a3b8] text-sm mt-1">{q.explanation}</p>
                        {!checkQuizAnswer('doji', q.id, q.correctAnswer) && (
                          <Button
                            onClick={() => {
                              setShowQuizResults(prev => ({ ...prev, [`doji-${q.id}`]: false }));
                              setQuizAnswers(prev => ({ ...prev, [`doji-${q.id}`]: null }));
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2 border-[#2d3748]"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Again
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={() => markLessonComplete('doji')}
              className="bg-[#22c55e] hover:bg-[#16a34a]"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-[#22c55e]/20 text-[#22c55e]">Coming Soon</Badge>
              <h2 className="text-3xl font-bold mb-4">
                {lessonCategories.flatMap(c => c.lessons).find(l => l.id === activeLesson)?.title || 'Lesson'}
              </h2>
            </div>
            <p className="text-[#94a3b8]">
              This lesson is currently being developed. Check back soon for comprehensive content about this topic!
            </p>
            <div className="bg-[#111827] rounded-xl p-8 border border-[#2d3748] text-center">
              <BookOpen className="w-16 h-16 text-[#22c55e]/30 mx-auto mb-4" />
              <p className="text-[#64748b]">Content coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex animate-in fade-in duration-500">
      {/* Sidebar */}
      <aside className="w-72 bg-[#111827] border-r border-[#2d3748] flex-shrink-0 overflow-y-auto hidden lg:block">
        <div className="p-6">
          <div className="mb-6">
            <p className="text-xs text-[#64748b] uppercase tracking-wider mb-2">Module Progress</p>
            <div className="flex items-center gap-3">
              <Progress value={calculateProgress()} className="flex-1 h-2" />
              <span className="text-sm font-medium text-[#22c55e]">{calculateProgress()}%</span>
            </div>
          </div>

          <nav className="space-y-2">
            {lessonCategories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-[#94a3b8]" />
                    <span className="font-medium text-sm">{category.title}</span>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 text-[#64748b] transition-transform duration-200 ${
                      expandedCategories.includes(category.id) ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                
                {expandedCategories.includes(category.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {category.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={`w-full flex items-center gap-3 p-2 pl-8 rounded-lg text-left text-sm transition-all duration-200 ${
                          activeLesson === lesson.id
                            ? 'bg-[#22c55e]/10 text-[#22c55e]'
                            : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {completedLessons.includes(lesson.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-10">
          {renderLessonContent()}
        </div>
      </main>
    </div>
  );
}
