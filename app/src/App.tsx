import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LearnerPage } from './pages/LearnerPage';
import DemoTrading from './pages/DemoTrading';
import DemoCommoditiesTrading from './pages/DemoCommoditiesTrading';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NewsPage } from './pages/NewsPage';

import { EconomicCalendarPage } from './pages/EconomicCalendarPage';
import { GeneralNewsPage } from './pages/GeneralNewsPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from './context/AuthProvider';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

export type Page = 'home' | 'learner' | 'demo' | 'demo-commodities' | 'about' | 'contact' | 'news' | 'calendar' | 'stock-news' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { session, loading } = useAuth();

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
      } else if (!session && currentPage === 'dashboard') {
        setCurrentPage('login');
      }
    }
  }, [session, currentPage, loading]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="pt-[72px]">
        {currentPage === 'home' && <HomePage onPageChange={setCurrentPage} />}
        {currentPage === 'learner' && <LearnerPage />}
        {currentPage === 'demo' && <DemoTrading />}
        {currentPage === 'demo-commodities' && <DemoCommoditiesTrading />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'news' && <NewsPage onPageChange={setCurrentPage} />}
        {currentPage === 'calendar' && <EconomicCalendarPage />}
        {currentPage === 'stock-news' && <GeneralNewsPage />}
        {currentPage === 'login' && <LoginPage onPageChange={setCurrentPage} />}
        {currentPage === 'signup' && <LoginPage isSignup={true} onPageChange={setCurrentPage} />}
        {currentPage === 'dashboard' && <DashboardPage onPageChange={setCurrentPage} />}
      </main>
      <Analytics />
    </div>
  );
}

export default App;
