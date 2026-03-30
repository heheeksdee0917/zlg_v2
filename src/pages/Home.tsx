import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: '/projects/boh-visitor/A1.avif',
    projectName: 'boh visitor centre',
    slug: 'boh-visitor-centre',
  },
  {
    image: '/general/HomeCP_Lantern.avif',
    projectName: 'lantern hotel',
    slug: 'lantern-hotel',
  },
  {
    image: '/general/HomeCP_point92.avif',
    projectName: 'point 92',
    slug: 'point-92',
  },
];

const SLIDE_DURATION = 4500;

export default function Home() {
  const [fadeIn, setFadeIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nameKey, setNameKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setNameKey((k) => k + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }

        .fade-up {
          opacity: 0;
          animation: fadeUp 1s ease forwards;
        }

        .progress-bar {
          animation: progressBar ${SLIDE_DURATION}ms linear forwards;
        }

        .slide-img {
          transition: opacity 1.2s ease, transform 1.2s ease;
        }
      `}</style>

      <div
        className="transition-opacity duration-700"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        <section className="relative w-full h-screen overflow-hidden">

          {/* Images */}
          {slides.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 slide-img"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: i === currentSlide ? 1 : 0,
                transform: i === currentSlide ? 'scale(1)' : 'scale(1.05)',
                zIndex: i === currentSlide ? 2 : 1,
              }}
            />
          ))}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/25 z-10" />

          {/* Text — bottom, center-aligned */}
          <div className="absolute z-20 bottom-16 left-0 right-0 flex flex-col items-center text-white text-center px-8">
            <h1
              className="fade-up text-4xl md:text-4xl font-bold lowercase mb-2"
              style={{ animationDelay: '0.35s' }}
            >
              zlgdesign
            </h1>
            <p
              className="fade-up text-xs tracking-[0.1em] lowercase font-light mb-6 opacity-60"
              style={{ animationDelay: '0.2s' }}
            >
              design | architecture | archives | theory
            </p>

            <Link
              to="/projects"
              className="fade-up inline-block text-base tracking-[0.08em] font-light lowercase text-white px-8 py-3 border border-white/60 transition-all duration-300 relative"
              style={{
                animationDelay: '0.55s',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.1)',
              }}
            >
              explore
            </Link>
          </div>

          {/* Slide indicators — bottom right */}
          <div className="absolute z-20 bottom-16 right-12 md:right-16 flex flex-col items-end gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentSlide(i); setNameKey((k) => k + 1); }}
                className="flex items-center gap-2 group"
              >
                <span className={`block h-px transition-all duration-700 ease-in-out ${i === currentSlide ? 'w-10 bg-white' : 'w-4 bg-white/30 group-hover:bg-white/60 group-hover:w-6'
                  }`} />
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15 z-20">
            <div
              key={`${currentSlide}-progress`}
              className="progress-bar h-full bg-white/50"
            />
          </div>

        </section>

        {/* Philosophy Section */}
        <section className="relative w-full h-screen overflow-hidden flex flex-col md:flex-row">

          {/* Video — full width on mobile, left half on desktop */}
          <video
            className="w-full h-1/2 md:w-1/2 md:h-full object-cover"
            style={{ opacity: 0.8, objectPosition: '10% center' }}
            src="/general/Philosophy_video.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/general/HomeCP_Philosophy.avif"
          />

          {/* Bottom half on mobile, right half on desktop — white background */}
          <div className="w-full h-1/2 md:w-1/2 md:h-full bg-white" />

          {/* Text — bottom center on mobile, overlaps on desktop */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 md:inset-0 md:h-auto z-10 flex items-center px-8 md:px-0">
            <div className="md:ml-[45%] max-w-none w-full text-center md:text-left">
              <p className="text-xs tracking-[0.1em] lowercase font-light mb-3 opacity-60">
                founder's quote
              </p>
              <p className="text-2xl md:text-4xl font-normal leading-relaxed lowercase tracking-wide mb-3">
                Thought is a form of necessary action,{' '}
                <br />a precursor to a possible work of art.<br />
              </p>
              <a
                href="/philosophy"
                className="inline-block text-base tracking-[0.08em] font-light lowercase text-gray-800 px-8 py-3 border border-gray-800/60 transition-all duration-300 mt-4"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'rgba(255,255,255,0.1)',
                }}
              >
                explore the mind
              </a>
            </div>
          </div>

        </section>

        {/* Partners Section */}
        <section className="relative w-full h-screen overflow-hidden">

          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/v2_thumbnail.avif"
          >
            <source src="/general/zlg_v4_upscaled.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8">
            <p className="text-xs tracking-[0.1em] lowercase font-light text-white/60 mb-4">
              our network
            </p>
            <h2 className="text-4xl md:text-5xl font-extralight lowercase text-white mb-6">
              partners
            </h2>
            <p className="text-base font-light text-white/80 lowercase leading-relaxed max-w-lg mb-10">
              decades of collaboration with exceptional architects, designers, and specialists who share our vision of design excellence.
            </p>
            <a
              href="/partner"
              className="inline-block text-base tracking-[0.08em] font-light lowercase text-white px-8 py-3 border border-white/60 transition-all duration-300"
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.1)',
              }}
            >
              explore our partners
            </a>
          </div>

        </section>

      </div>
    </>
  );
}