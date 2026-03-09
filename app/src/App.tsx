import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LearnerPage } from './pages/LearnerPage';
import DemoTrading from './pages/DemoTrading';
import DemoCommoditiesTrading from './pages/DemoCommoditiesTrading';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NewsPage } from './pages/NewsPage';
import { TradingSuggestionPage } from './pages/TradingSuggestionPage';

import { EconomicCalendarPage } from './pages/EconomicCalendarPage';
import { GeneralNewsPage } from './pages/GeneralNewsPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from './context/AuthProvider';
import { useEffect } from 'react';

export type Page = 'home' | 'learner' | 'demo' | 'demo-commodities' | 'about' | 'contact' | 'news' | 'calendar' | 'stock-news' | 'login' | 'signup' | 'dashboard' | 'suggestions';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const saved = localStorage.getItem('currentPage');
    return (saved as Page) || 'home';
  });
  const { session, loading } = useAuth();

  // Pages that require authentication
  const protectedPages: Page[] = ['demo', 'demo-commodities', 'news', 'calendar', 'stock-news', 'dashboard', 'suggestions'];

  useEffect(() => {
    // Basic Hash/URL-like routing reaction for magic link redirects back from email
    if (window.location.hash.includes('access_token')) {
      setCurrentPage('dashboard');
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (session && (currentPage === 'login' || currentPage === 'signup')) {
        setCurrentPage('dashboard');
      } else if (!session && protectedPages.includes(currentPage)) {
        // Redirect to login if trying to access a protected page without auth
        setCurrentPage('login');
      }
    }
  }, [session, currentPage, loading]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="pt-[72px]">
        {currentPage === 'home' && <HomePage onPageChange={setCurrentPage} />}
        {currentPage === 'learner' && <LearnerPage />}
        {currentPage === 'demo' && session && <DemoTrading />}
        {currentPage === 'demo-commodities' && session && <DemoCommoditiesTrading />}
        {currentPage === 'about' && <AboutPage onPageChange={setCurrentPage} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'news' && session && <NewsPage onPageChange={setCurrentPage} />}
        {currentPage === 'suggestions' && session && <TradingSuggestionPage onPageChange={setCurrentPage} />}
        {currentPage === 'calendar' && session && <EconomicCalendarPage />}
        {currentPage === 'stock-news' && session && <GeneralNewsPage />}
        {currentPage === 'login' && <LoginPage onPageChange={setCurrentPage} />}
        {currentPage === 'signup' && <LoginPage isSignup={true} onPageChange={setCurrentPage} />}
        {currentPage === 'dashboard' && session && <DashboardPage onPageChange={setCurrentPage} />}
      </main>
    </div>
  );
}

export default App;
