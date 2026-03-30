import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../data/projects';

// Import hooks - comment out if files don't exist yet
import { useLightbox } from '../hooks/useLightbox';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { useScrollActiveImage } from '../hooks/useScrollActiveImage';

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  const [zoom, setZoom] = useState<number>(1);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [showScrollHint, setShowScrollHint] = useState(true);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopScrollContainerRef = useRef<HTMLDivElement>(null);
  const lightboxImageRef = useRef<HTMLDivElement>(null);

  // Memoize related projects to avoid recalculation
  const relatedProjects = useMemo(
    () => project ? projects.filter((p) => p.id !== project.id).slice(0, 3) : [],
    [project]
  );

  // Initialize lightbox with project images
  const lightboxHook = useLightbox(project?.images || [], { enabled: true });
  const {
    isOpen: lightboxOpen,
    currentIndex: currentImageIndex,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrevious,
  } = lightboxHook;

  // Mobile scroll active image detection with Intersection Observer
  const mobileScrollHook = useScrollActiveImage(
    mobileScrollContainerRef,
    project?.images.length || 0
  );
  const { activeIndex: activeImageIndex, setImageRef: setMobileImageRef } = mobileScrollHook;

  // Desktop scroll active image detection with Intersection Observer
  const desktopScrollHook = useScrollActiveImage(
    desktopScrollContainerRef,
    project?.images.length || 0
  );
  const { activeIndex: activeDesktopImageIndex, setImageRef: setDesktopImageRef } = desktopScrollHook;

  // Touch gestures for lightbox
  const lightboxGestures = useTouchGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    onSwipeDown: closeLightbox,
    threshold: 50,
    enabled: lightboxOpen,
  });

  // Hide scroll hint after timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 2000);
    return () => clearTimeout(timer);
  }, [slug]);

  // Reset state when project changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mobileScrollContainerRef.current) {
      mobileScrollContainerRef.current.scrollTop = 0;
    }
    if (desktopScrollContainerRef.current) {
      desktopScrollContainerRef.current.scrollTop = 0;
    }
    setShowFullDescription(false);
    setZoom(1);
    setFadeIn(false);
    setVisibleSections({});
    setShowScrollHint(true);

    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [slug]);

  // Intersection observer for related projects section
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
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
  }, [slug]);

  // Hide scroll hint when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const container = mobileScrollContainerRef.current;
      if (container && container.scrollTop > 50) {
        setShowScrollHint(false);
      }
    };

    const container = mobileScrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

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
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const detailContent = project.detailContent || [];
  const hasContent = detailContent.length > 0;
  const shouldShowToggle = detailContent.length > 3;

  return (
    <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Mobile Layout */}
      <div className="md:hidden h-screen flex flex-col">
        {/* Image Gallery - 90% with inner scroll */}
        <div className="h-[90vh] relative overflow-hidden">
          <div className="h-full overflow-y-auto" ref={mobileScrollContainerRef}>
            {project.images.map((image, index) => (
              <div
                key={index}
                ref={setMobileImageRef(index)}
                data-image-index={index}
                className="w-full cursor-pointer mb-[5px]"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-auto object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator - Fixed Position, Outside Scroll Container */}
          <div className="absolute bottom-24 left-8 z-20 flex flex-col items-center gap-3 pointer-events-none">
            {project.images.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${index === activeImageIndex
                    ? 'w-2 h-2 bg-white'
                    : 'w-2 h-2 bg-transparent border border-white'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Project Info - 10% */}
        <div className="h-[10vh] bg-[#F5FAF7] overflow-y-auto">
          <div className="px-8 py-4">
            <h1 className="text-base font-bold mb-1 text-[#185B30] lowercase leading-tight">
              {project.title}
            </h1>
            <p className="text-base text-[#185B30] font-light lowercase">
              {project.location}, {project.year}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - 60/40 */}
      <section className="hidden md:flex gap-0 min-h-screen">
        {/* Image Gallery - 60% on desktop */}
        <div className="w-[60%] h-screen relative">
          {/* Desktop Vertical Dots Indicator - Fixed Position */}
          <div className="absolute bottom-24 left-8 z-20 flex flex-col items-center gap-3 pointer-events-none">
            {project.images.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${index === activeDesktopImageIndex
                  ? 'w-2 h-2 bg-white'
                  : 'w-2 h-2 bg-transparent border border-white'
                  }`}
              />
            ))}
          </div>

          {/* Scrollable Image Container */}
          <div className="w-full h-full overflow-y-auto" ref={desktopScrollContainerRef}>
          <div style={{ paddingTop: '72px' }}>
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
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Project Info - 40% on desktop */}
        <div className="w-[40%] bg-[#F5FAF7] sticky top-20 h-screen overflow-y-auto custom-scrollbar pt-28">
          <div className="p-8 md:p-16">
            <div className="mb-12">
              <h1 className="text-base text-[#185B30] font-bold mb-2 lowercase leading-tight">
                {project.title}
              </h1>
              <p className="text-base text-[#185B30] font-light lowercase">
                {project.location}, {project.year}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              {hasContent && (
                <>
                  {showFullDescription ? (
                    detailContent.map((block, index) => (
                      <div key={index} className="mb-8">
                        {block.heading && (
                          <h4 className="text-base font-semibold tracking-wide mb-4 lowercase">
                            {block.heading}
                          </h4>
                        )}
                        <p className="text-[#185B30] leading-relaxed font-light lowercase text-base">
                          {block.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <>
                      {detailContent.slice(0, 3).map((block, index) => (
                        <div key={index} className="mb-8">
                          {block.heading && (
                            <h4 className="text-base font-semibold tracking-wide mb-4 lowercase">
                              {block.heading}
                            </h4>
                          )}
                          <p className="text-[#185B30] leading-relaxed font-light lowercase text-base">
                            {block.content}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                  {shouldShowToggle && (
                    <button
                      onClick={toggleDescription}
                      className="mt-2 text-base text-black border-b border-black hover:border-gray-400 transition-colors font-light"
                    >
                      {showFullDescription ? 'show less' : 'show more'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Full Details Section */}
      <div className="md:hidden bg-[#F5FAF7]">
        <div className="px-8 py-8 border-t border-gray-200">
          {hasContent && (
            <>
              {detailContent.map((block, index) => (
                <div key={index} className="mb-8">
                  {block.heading && (
                    <h4 className="text-base font-semibold tracking-wide mb-3 lowercase">
                      {block.heading}
                    </h4>
                  )}
                  <p className="text-[#185B30] leading-relaxed font-light lowercase text-base">
                    {block.content}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

{/* Related Projects Section */}
<section
  ref={setRef('related')}
  data-section="related"
  className="bg-[#F5FAF7] py-16"
>
  <div className="max-w-screen-2xl mx-auto px-8">
    <h2 className={`text-base font-medium tracking-wider mb-8 text-[#185B30] transition-all duration-1000 ease-out ${
      visibleSections.related ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
    }`}>
      related projects
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {relatedProjects.map((relatedProject, index) => (
        <Link
          key={relatedProject.id}
          to={`/projects/${relatedProject.slug}`}
          className={`group block transition-all duration-1000 ease-out ${
            visibleSections.related ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className="w-full aspect-[2/3] overflow-hidden mb-4">
            <img
              src={relatedProject.heroImage}
              alt={relatedProject.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-base text-[#185B30] font-light mb-1 lowercase">
            {relatedProject.title}
          </h3>
          <p className="text-base text-[#185B30] font-light lowercase">
            {relatedProject.location} • {relatedProject.year}
          </p>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Lightbox with Touch Gestures */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          ref={lightboxImageRef}
          {...lightboxGestures}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-[#185B30] transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="text-white hover:text-[#185B30] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut size={24} />
            </button>
            <span className="text-white font-light text-base">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="text-white hover:text-[#185B30] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn size={24} />
            </button>
          </div>

          {currentImageIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#185B30] transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {currentImageIndex < project.images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#185B30] transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-light text-base z-10">
            {currentImageIndex + 1} / {project.images.length}
          </div>

          <div className="overflow-auto w-full h-full flex items-center justify-center p-4 md:p-8">
            <img
              src={project.images[currentImageIndex]}
              alt="Full size view"
              className="select-none transition-transform duration-200"
              style={{
                transform: `scale(${zoom})`,
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}