import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LearnerPage } from './pages/LearnerPage';
import DemoTrading from './pages/DemoTrading';
import DemoCommoditiesTrading from './pages/DemoCommoditiesTrading';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NewsPage } from './pages/NewsPage';

export type Page = 'home' | 'learner' | 'demo' | 'demo-commodities' | 'about' | 'contact' | 'news';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

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
      </main>
    </div>
  );
}

export default App;
