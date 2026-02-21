import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LearnerPage } from './pages/LearnerPage';
import DemoTrading from './pages/DemoTrading';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export type Page = 'home' | 'learner' | 'demo' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="pt-[72px]">
        {currentPage === 'home' && <HomePage onPageChange={setCurrentPage} />}
        {currentPage === 'learner' && <LearnerPage />}
        {currentPage === 'demo' && <DemoTrading />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>
    </div>
  );
}

export default App;
