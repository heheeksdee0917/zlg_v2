import React, { useState, useEffect } from 'react';

export default function UnderConstruction() {
  const [fadeIn, setFadeIn] = useState(false);
  const [dotsCount, setDotsCount] = useState(0);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-20 w-64 h-64 bg-gray-100 rounded-full opacity-50 animate-pulse"
          style={{ animationDuration: '3s' }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gray-50 rounded-full opacity-30 animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        ></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center px-8 max-w-2xl transition-all duration-1000 ${
          fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Icon/Logo animation */}
        <div className="mb-8 inline-block">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-gray-300 rounded-full animate-spin"
              style={{ animationDuration: '3s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full animate-spin"
                style={{ animationDuration: '2s', animationDirection: 'reverse' }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4 text-gray-800 lowercase">
          under construction
        </h1>

        {/* Animated dots */}
        <p className="text-xl md:text-2xl font-light text-gray-600 mb-8 lowercase">
          we're building something great{'.'.repeat(dotsCount)}
          <span className="invisible">{'.'.repeat(3 - dotsCount)}</span>
        </p>

        {/* Description */}
        <p className="text-base md:text-lg font-light text-gray-500 mb-12 lowercase max-w-md mx-auto">
          this page is currently being crafted with care. <br></br>check back soon to see what we've created.
        </p>

      </div>

      {/* Custom animation keyframes */}
      <style>{`
        @keyframes progress {
          0%, 100% {
            transform: translateX(-10%);
          }
          50% {
            transform: translateX(50%);
          }
        }
      `}</style>
    </div>
  );
}