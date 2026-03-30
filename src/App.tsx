import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const Philosophy = lazy(() => import('./pages/Philosophy'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const People = lazy(() => import('./pages/People'));
const Partner = lazy(() => import('./pages/Partner'));
const ContactUs = lazy(() => import('./pages/ContactUs'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-pulse text-gray-600">Loading...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/people" element={<People />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;