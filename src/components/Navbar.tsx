import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [carouselSlide, setCarouselSlide] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { title: 'home', link: '/' },
    { title: 'philosophy', link: '/philosophy' },
    { title: 'projects', link: '/projects' },
    { title: 'people', link: '/people' },
    { title: 'partners', link: '/partner' },
    { title: 'contact us', link: '/contact' },
  ];

  const carouselImages = [
    '/images/Image6.avif',
    '/images/Image1.avif',
    '/images/Image2.avif',
    '/images/Image3.avif',
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const timer = setInterval(() => {
      setCarouselSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) { setLastScrollY(currentScrollY); return; }
      if (currentScrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };

    const handleInnerScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollHeight > target.clientHeight) {
        setIsVisible(target.scrollTop <= 10);
      }
    };

    let timeoutId: NodeJS.Timeout | null = null;
    const throttled = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => { handleScroll(); timeoutId = null; }, 30);
    };

    window.addEventListener('scroll', throttled, { passive: true });
    document.addEventListener('scroll', handleInnerScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', throttled);
      document.removeEventListener('scroll', handleInnerScroll, { capture: true });
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* ── Navbar Bar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] transition-transform duration-300 ${
          isVisible && !menuOpen ? 'translate-y-0' : menuOpen ? '-translate-y-full' : '-translate-y-full'
        }`}
        style={{ background: 'linear-gradient(to right, #336138 0%, #5a9d63 100%)' }}
      >
        <div className="max-w-screen-2xl mx-auto px-8 py-3 md:py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img
                src="/general/logo(white).png"
                alt="zlgdesign"
                className="h-6 md:h-7"
              />
              <span className="text-sm md:text-base text-white lowercase leading-none ml-3">
                zlgdesign
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMenu}
              className="text-black hover:text-gray-500 transition-colors flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-2 flex flex-col justify-between">
                <span className="block w-full h-[1.5px] bg-white transform transition-all duration-300 origin-center" />
                <span className="block w-full h-[1.5px] bg-white transform transition-all duration-300 origin-center" />
              </div>
              <span className="hidden md:block text-sm text-white lowercase leading-none ml-2">
                menu
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── DESKTOP OVERLAY ── */}
      <div
        className="hidden md:flex fixed inset-0 z-[499] transition-opacity duration-500 ease-in-out"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* 30% — blurred zone, close button top-right */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: '30%',
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0,0,0,0.15)'
          }}
          onClick={closeMenu}
        >
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 w-9 h-9 rounded-full border border-white/60 bg-[white] flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="">
              <path d="M1 1L13 13M13 1L1 13" stroke="#185B30" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 35% — full bleed image carousel */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ width: '35%' }}>
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
              style={{
                backgroundImage: `url(${img})`,
                opacity: carouselSlide === index ? 1 : 0,
              }}
            />
          ))}

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselSlide(i)}
                className="h-px transition-all duration-500"
                style={{
                  width: i === carouselSlide ? '2rem' : '1rem',
                  backgroundColor: i === carouselSlide ? '#ffffff' : '#ffffff66',
                }}
              />
            ))}
          </div>
        </div>

        {/* 35% — nav links panel */}
        <div
          className="flex flex-col justify-center px-20 relative flex-shrink-0"
          style={{
            width: '35%',
            background: 'linear-gradient(to right, #336138 0%, #5a9d63 100%)',
          }}
        >
          <div className="flex flex-col space-y-0">
            {navItems.map((item, index) => {
              const active = isActive(item.link);
              return (
                <Link
                  key={item.title}
                  to={item.link}
                  onClick={closeMenu}
                  className="group flex items-center gap-4 py-2 border-b border-white/10 last:border-none"
                  onMouseEnter={() => setHoveredColumn(index)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <span className="text-white/70 text-[10px] font-light w-5">
                    0{index + 1}
                  </span>
                  <span
                    className="text-xl lowercase transition-all duration-300"
                    style={{
                      fontWeight: active ? 700 : 300,
                      color: active
                        ? '#FFFFFF'
                        : hoveredColumn === null || hoveredColumn === index
                          ? '#D3D3D3'
                          : '#FFFFFF',
                    }}
                  >
                    {item.title}
                  </span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFFFFF] opacity-70" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Logo + wordmark — bottom of panel */}
          <div className="absolute bottom-8 left-20 flex items-center space-x-3">
            <img src="/general/logo(white).png" alt="zlgdesign" className="h-6" />
            <span className="text-sm text-white lowercase leading-none">zlgdesign</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE OVERLAY ── */}
      <div
        className="md:hidden fixed inset-0 z-[499] transition-opacity duration-500 ease-in-out flex flex-col"
        style={{
          background: 'linear-gradient(to right, #336138 0%, #5a9d63 100%)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* Close button */}
        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-black/5 transition-colors"
          aria-label="Close menu"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Nav links — vertically centered, flex-1 pushes logo to bottom */}
        <div className="flex flex-col items-start justify-center flex-1 space-y-6 px-10">
          {navItems.map((item, index) => {
            const active = isActive(item.link);
            return (
              <Link
                key={item.title}
                to={item.link}
                onClick={closeMenu}
                className="group flex items-center gap-4"
              >
                <span className="text-white/70 text-xs font-light">
                  0{index + 1}
                </span>
                <span
                  className="text-3xl lowercase transition-all duration-300"
                  style={{
                    fontWeight: active ? 700 : 300,
                    color: '#FFFFFF',
                  }}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logo + wordmark — bottom */}
        <div className="px-10 pb-10 flex items-center space-x-3">
          <img src="/general/logo(white).png" alt="zlgdesign" className="h-6" />
          <span className="text-sm text-white lowercase leading-none">zlgdesign</span>
        </div>
      </div>
    </>
  );
}