import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../data/projects';
import { SEO } from '../components/seo';
import Footer from '../components/Footer';

import { useLightbox } from '../hooks/useLightbox';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { useScrollActiveImage } from '../hooks/useScrollActiveImage';

const PEEK_Y = 85;
const OPEN_Y = 12;
const DRAG_THRESHOLD = 60;

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  const [zoom, setZoom] = useState<number>(1);
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  const [sheetSnap, setSheetSnap] = useState<'peek' | 'open'>('peek');
  const [dragY, setDragY] = useState<number | null>(null);
  const dragStartY = useRef<number>(0);
  const dragStartSnap = useRef<'peek' | 'open'>('peek');
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetInnerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopScrollContainerRef = useRef<HTMLDivElement>(null);
  const lightboxImageRef = useRef<HTMLDivElement>(null);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const others = projects.filter((p) => p.id !== project.id);
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }
    return others.slice(0, 3);
  }, [project]);

  const lightboxHook = useLightbox(project?.images || [], { enabled: true });
  const { isOpen: lightboxOpen, currentIndex: currentImageIndex, openLightbox, closeLightbox, goToNext, goToPrevious } = lightboxHook;

  const mobileScrollHook = useScrollActiveImage(mobileScrollContainerRef, project?.images.length || 0);
  const { activeIndex: activeImageIndex, setImageRef: setMobileImageRef } = mobileScrollHook;

  const desktopScrollHook = useScrollActiveImage(desktopScrollContainerRef, project?.images.length || 0);
  const { activeIndex: activeDesktopImageIndex, setImageRef: setDesktopImageRef } = desktopScrollHook;

  const lightboxGestures = useTouchGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    onSwipeDown: closeLightbox,
    threshold: 50,
    enabled: lightboxOpen,
  });

  // Scroll-to-bottom triggers sheet open on mobile
  useEffect(() => {
    const container = mobileScrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom < 50 && sheetSnap === 'peek') {
        setSheetSnap('open');
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sheetSnap]);

  // Reset all state on slug change — scroll reset deferred so refs are mounted
  useEffect(() => {
    setSheetSnap('peek');
    setDragY(null);
    setZoom(1);
    setFadeIn(false);
    setVisibleSections({});

    const timer = setTimeout(() => {
      mobileScrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      desktopScrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      setFadeIn(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    if (sheetSnap === 'open') {
      sheetInnerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [sheetSnap]);

  // Intersection observer for section reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) setVisibleSections((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    Object.values(sectionRefs.current).forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, [slug]);

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  const getSheetTranslateY = useCallback(() => {
    const baseVh = sheetSnap === 'peek' ? PEEK_Y : OPEN_Y;
    const basePx = (baseVh / 100) * window.innerHeight;
    if (dragY !== null) {
      return Math.max(OPEN_Y / 100 * window.innerHeight, Math.min(basePx + dragY, PEEK_Y / 100 * window.innerHeight));
    }
    return basePx;
  }, [sheetSnap, dragY]);

  const handleDragStart = useCallback((clientY: number) => {
    dragStartY.current = clientY;
    dragStartSnap.current = sheetSnap;
    setDragY(0);
  }, [sheetSnap]);

  const handleDragMove = useCallback((clientY: number) => {
    if (dragY === null) return;
    const delta = clientY - dragStartY.current;
    if (dragStartSnap.current === 'open' && sheetInnerRef.current) {
      if (sheetInnerRef.current.scrollTop > 0 && delta > 0) return;
    }
    setDragY(delta);
  }, [dragY]);

  const handleDragEnd = useCallback(() => {
    if (dragY === null) return;
    if (dragY > DRAG_THRESHOLD) setSheetSnap('peek');
    else if (dragY < -DRAG_THRESHOLD) setSheetSnap('open');
    else setSheetSnap(dragStartSnap.current);
    setDragY(null);
  }, [dragY]);

  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientY);
  const onTouchEnd = () => handleDragEnd();

  const translateY = getSheetTranslateY();
  const isTransitioning = dragY === null;

  // — Not found guard (after all hooks) —
  if (!project) {
    return (
      <div className="min-h-screen pt-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-base font-bold tracking-wider mb-4">project not found</h1>
          <Link to="/projects" className="text-base border-b border-black hover:border-gray-400 font-light">
            return to projects
          </Link>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1));

  const detailContent = project.detailContent || [];
  const hasContent = detailContent.length > 0;

  const peekStripHeight = (100 - PEEK_Y) / 100 * window.innerHeight;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.seo.description,
    "image": project.seo.image,
    "url": project.seo.canonical,
    "creator": {
      "@type": "Organization",
      "name": "zlgdesign"
    }
  };

  return (
    <>
      <SEO
        title={project.seo.title}
        description={project.seo.description}
        canonical={project.seo.canonical}
        image={project.seo.image}
        schema={schema}
      />
      <main>
        <h1 className="sr-only">{project.title}</h1>
        <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>

          {/* ════════ MOBILE ════════ */}
          <div className="md:hidden relative" style={{ height: '100dvh', overflow: 'hidden' }}>

            {/* Full-screen image gallery */}
            <div className="absolute inset-0 bg-[#F5FAF7]">
              <div className="w-full h-full overflow-y-auto" ref={mobileScrollContainerRef}>
                <div style={{ paddingTop: '47px' }}>
                  {project.images.map((image, index) => (
                    <div
                      key={index}
                      ref={setMobileImageRef(index)}
                      data-image-index={index}
                      className="w-full cursor-pointer"
                      onClick={() => { if (sheetSnap === 'peek') openLightbox(index); }}
                    >
                      <img
                        src={image}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-auto object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                  {/* Spacer so last image isn't hidden behind sheet */}
                  <div style={{ height: `${peekStripHeight}px` }} />
                </div>
              </div>

              {/* Dot indicators */}
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2 pointer-events-none">
                {project.images.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ${index === activeImageIndex ? 'w-1.5 h-1.5 bg-black' : 'w-1.5 h-1.5 bg-black/20'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* ── Bottom Sheet ── */}
            <div
              ref={sheetRef}
              className="absolute left-0 right-0 bottom-0 z-30"
              style={{
                top: `${translateY}px`,
                transition: isTransitioning ? 'top 0.4s cubic-bezier(0.32, 0.72, 0, 1)' : 'none',
                willChange: 'top',
              }}
            >
              <div className="bg-[#F5FAF7] rounded-t-2xl h-full flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)]">

                {/* Drag handle pill only — no content here */}
                <div
                  className="flex-shrink-0 px-6 pt-3 pb-2 cursor-grab active:cursor-grabbing"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onClick={() => setSheetSnap(sheetSnap === 'peek' ? 'open' : 'peek')}
                >
                  <div className="w-10 h-[3px] rounded-full bg-black/20 mx-auto" />
                </div>

                {/* Single scrollable container — title + content + footer all together */}
                <div
                  ref={sheetInnerRef}
                  className="flex-1 overflow-y-auto overscroll-contain"
                  onTouchStart={(e) => { if (sheetSnap === 'open') e.stopPropagation(); }}
                >
                  <div className="px-6 pt-2 pb-4">
                    {/* Title / year / location — now inside scroll */}
                    <div className="flex items-baseline justify-between mb-1">
                      <h2 className="text-base font-semibold text-[#185B30] lowercase leading-tight">{project.title}</h2>
                      <span className="text-xs text-[#185B30]/70 lowercase tracking-wide">{project.year}</span>
                    </div>
                    <p className="text-xs text-[#185B30]/70 lowercase mt-0.5 mb-4">{project.location}</p>

                    <div className="border-t border-black/10 mb-4" />

                    {hasContent && (
                      <div className="mb-4">
                        {detailContent.map((block, index) => (
                          <div key={index} className="mb-8">
                            {block.heading && (
                              <h4 className="text-xs font-semibold tracking-widest uppercase text-[#185B30]/40 mb-3">
                                {block.heading}
                              </h4>
                            )}
                            <p className="text-sm text-[#185B30] leading-relaxed font-light lowercase">
                              {block.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Related Projects */}
                    <section ref={setRef('related')} data-section="related" className="py-4 -mx-6 px-6">
                      <h2 className={`text-base font-medium tracking-wider mb-8 text-[#185B30] transition-all duration-1000 ease-out ${visibleSections.related ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}>
                        related projects
                      </h2>
                      <div className="grid grid-cols-1 gap-8">
                        {relatedProjects.map((relatedProject, index) => (
                          <Link
                            key={relatedProject.id}
                            to={`/projects/${relatedProject.slug}`}
                            className={`group block transition-all duration-1000 ease-out ${visibleSections.related ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                              }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                          >
                            <div className="w-full aspect-[2/3] overflow-hidden mb-4">
                              <img src={relatedProject.heroImage} alt={relatedProject.title} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <h3 className="text-base text-[#185B30] font-light mb-1 lowercase">{relatedProject.title}</h3>
                            <p className="text-base text-[#185B30] font-light lowercase">{relatedProject.location} • {relatedProject.year}</p>
                          </Link>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Footer */}
                  <Footer />
                </div>
              </div>
            </div>
          </div>

          {/* ════════ DESKTOP ════════ */}
          <section className="hidden md:flex gap-0 min-h-screen">
            <div className="w-[60%] h-screen relative">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-none">
                {project.images.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ${index === activeDesktopImageIndex ? 'w-2 h-2 bg-white' : 'w-2 h-2 bg-transparent border border-white/50'
                      }`}
                  />
                ))}
              </div>
              <div className="w-full h-full overflow-y-auto" ref={desktopScrollContainerRef}>
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    ref={setDesktopImageRef(index)}
                    data-image-index={index}
                    className="w-full cursor-pointer mb-[5px]"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-auto object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[40%] bg-[#F5FAF7] sticky top-20 h-screen overflow-y-auto custom-scrollbar pt-20">
              <div className="p-8 md:p-16">
                <div className="mb-12">
                  <h2 className="text-base text-[#185B30] font-bold mb-2 lowercase leading-tight">{project.title}</h2>
                  <p className="text-base text-[#185B30] font-light lowercase">{project.location}, {project.year}</p>
                </div>
                <div className="border-t border-gray-200 pt-8">
                  {hasContent && detailContent.map((block, index) => (
                    <div key={index} className="mb-8">
                      {block.heading && (
                        <h4 className="text-base font-semibold tracking-wide mb-4 lowercase">{block.heading}</h4>
                      )}
                      <p className="text-[#185B30] leading-relaxed font-light lowercase text-base">{block.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Desktop related projects */}
          <section ref={setRef('related-desktop')} data-section="related-desktop" className="hidden md:block bg-[#F5FAF7] py-16">
            <div className="max-w-screen-2xl mx-auto px-8">
              <h2 className={`text-base font-medium tracking-wider mb-8 text-[#185B30] transition-all duration-1000 ease-out ${visibleSections['related-desktop'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                related projects
              </h2>
              <div className="grid grid-cols-3 gap-8">
                {relatedProjects.map((rel, index) => (
                  <Link
                    key={rel.id}
                    to={`/projects/${rel.slug}`}
                    className={`group block transition-all duration-1000 ease-out ${visibleSections['related-desktop'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="w-full aspect-[2/3] overflow-hidden mb-4">
                      <img src={rel.heroImage} alt={rel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <h3 className="text-base text-[#185B30] font-light mb-1 lowercase">{rel.title}</h3>
                    <p className="text-base text-[#185B30] font-light lowercase">{rel.location} • {rel.year}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Lightbox */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
              ref={lightboxImageRef}
              {...lightboxGestures}
            >
              <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-[#185B30] transition-colors z-10">
                <X size={32} />
              </button>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-4 z-10">
                <button onClick={handleZoomOut} disabled={zoom <= 1} className="text-white hover:text-[#185B30] transition-colors disabled:opacity-30">
                  <ZoomOut size={24} />
                </button>
                <span className="text-white font-light text-base">{Math.round(zoom * 100)}%</span>
                <button onClick={handleZoomIn} disabled={zoom >= 3} className="text-white hover:text-[#185B30] transition-colors disabled:opacity-30">
                  <ZoomIn size={24} />
                </button>
              </div>
              {currentImageIndex > 0 && (
                <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#185B30] z-10 bg-black/50 rounded-full p-2">
                  <ChevronLeft size={32} />
                </button>
              )}
              {currentImageIndex < project.images.length - 1 && (
                <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#185B30] z-10 bg-black/50 rounded-full p-2">
                  <ChevronRight size={32} />
                </button>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-light text-base z-10">
                {currentImageIndex + 1} / {project.images.length}
              </div>
              <div className="overflow-auto w-full h-full flex items-center justify-center p-4 md:p-8">
                <img
                  src={project.images[currentImageIndex]}
                  alt="Full size view"
                  className="select-none transition-transform duration-200"
                  style={{ transform: `scale(${zoom})`, maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
        </div>
      </main>
    </>
  );
}