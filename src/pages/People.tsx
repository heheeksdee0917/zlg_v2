import React, { useState, useEffect, useRef } from 'react';
import { keyPartners, team } from '../data/partner';
import type { Team } from '../data/partner';
import LazyLoading from '../components/LazyLoading';

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 200);
  const imageBlur = Math.min(10, (scrollY - 100) / 30);
  const overlayOpacity = Math.min(1, (scrollY - 100) / 300);
  const overlayTranslateY = Math.max(0, 40 - (scrollY - 100) / 10);

  return (
    <section className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url('/People/team_hero.avif')`,
            backgroundPosition: 'center 70%',
            marginTop: '32px',
            filter: `blur(${Math.max(0, imageBlur)}px)`,
            transform: 'scale(1.05)',
          }}
        />

        <div className="absolute inset-0 bg-black/30" />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          style={{ opacity: heroOpacity, transition: 'none' }}
        >
          <p className="text-xs tracking-[0.3em] lowercase font-light text-white/60 mb-4">
            zlg design
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight lowercase text-white">
            people
          </h1>
        </div>

        <div
          className="absolute inset-0 flex items-center px-8 max-w-screen-2xl mx-auto"
          style={{
            opacity: overlayOpacity,
            transform: `translateY(${overlayTranslateY}px)`,
            transition: 'none',
          }}
        >
          <div className="max-w-xl">
            <h2 className="text-base font-normal mb-4 lowercase underline text-white">Our Team</h2>
            <p className="text-base text-white/90 leading-relaxed lowercase text-left">
              ZLG Design is a collective of architects, designers, and thinkers united by a shared passion for creating meaningful spaces. Our diverse backgrounds and expertise enable us to approach each project with fresh perspectives and rigorous craft.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default function People() {
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    intro: true
  });
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>

      <HeroSection />

      <div className="bg-[#F5FAF7] w-full">
        <section
          ref={setRef('intro')}
          data-section="intro"
          className="max-w-screen-2xl mx-auto px-8 pb-16"
        >

          {/* Key Partners Section */}
          {keyPartners.map((partner, index) => (
            <React.Fragment key={partner.name}>
              <section
                ref={setRef(`partner-${index}`)}
                data-section={`partner-${index}`}
                className="flex items-center py-4 md:py-8"
              >
                <div className={`grid ${
                  index % 2 === 0
                    ? 'md:grid-cols-[30%_70%]'
                    : 'md:grid-cols-[70%_30%]'
                } gap-6 lg:gap-10 items-center w-full transition-all duration-1000 ease-out ${
                  visibleSections[`partner-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                  {index % 2 === 0 ? (
                    <>
                      <div className="w-full overflow-hidden">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-full aspect-[2/3] object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-base font-normal text-[#185B30] lowercase">{partner.name}</h3>
                        <p className="text-base text-[#185B30] mb-8 font-light lowercase">{partner.role}</p>
                        <div className="space-y-6 text-[#185B30] leading-relaxed font-light lowercase text-left">
                          {partner.bio.map((paragraph, i) => (
                            <p key={i} className="text-base">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col justify-center order-2 md:order-1">
                        <h3 className="text-base font-normal text-[#185B30] lowercase">{partner.name}</h3>
                        <p className="text-base text-[#185B30] mb-8 font-light lowercase">{partner.role}</p>
                        <div className="space-y-6 text-[#185B30] leading-relaxed font-light lowercase text-left">
                          {partner.bio.map((paragraph, i) => (
                            <p key={i} className="text-base">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                      <div className="w-full overflow-hidden order-1 md:order-2">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-full aspect-[2/3] object-cover object-center"
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>
            </React.Fragment>
          ))}

          {/* Team Grid */}
          <LazyLoading
            items={team}
            initialCount={4}
            loadMoreCount={4}
            visibleSections={visibleSections}
          >
            {(displayedTeam) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {displayedTeam.map((member: Team, index: number) => (
                  <div
                    key={member.id}
                    ref={index === 0 ? setRef('team') : undefined}
                    data-section={index === 0 ? 'team' : undefined}
                    className={`group transition-all duration-1000 ease-out ${
                      visibleSections.team ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="overflow-hidden mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full aspect-[2/3] object-cover"
                        loading={index < 4 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                    <h3 className="text-base font-normal text-[#185B30] mb-1 lowercase">{member.name}</h3>
                    <p className="text-base text-[#185B30] mb-4">{member.role}</p>
                  </div>
                ))}
              </div>
            )}
          </LazyLoading>

        </section>

        {/* CTA */}
        <section
          ref={setRef('cta')}
          data-section="cta"
          className="bg-[#F5FAF7] py-16"
        >
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className={`text-left transition-all duration-1000 ease-out ${
              visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              <h2 className="text-base font-normal text-[#185B30] mb-4 lowercase underline">Join Our Team</h2>
              <p className="text-base text-[#185B30] leading-relaxed mb-8 lowercase text-left">
                We are always seeking talented architects and designers who share our commitment to excellence, sustainability, and thoughtful design. If you are passionate about creating spaces that matter, we would love to hear from you.
              </p>
              <a
                href="mailto:info@zlgdesign.com"
                className="inline-block text-base tracking-[0.08em] font-light lowercase text-[#185B30] px-8 py-3 border border-[#185B30]/60 transition-all duration-300"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'rgba(24, 91, 48, 0.05)',
                }}
              >
                join the team
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}