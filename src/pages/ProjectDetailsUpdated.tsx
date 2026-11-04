import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, type ProjectLayoutBlock } from '../data/projects';
import { Helmet } from 'react-helmet-async';
import { SEO } from '../components/seo';
import Footer from '../components/Footer';

import { useLightbox } from '../hooks/useLightbox';
import { useTouchGestures } from '../hooks/useTouchGestures';

/** Where this preview lives. Links between previewed projects stay on this path. */
export const PREVIEW_BASE = '/test/updated';

// Preview of the reworked project page, served at /test/updated/:slug so the live
// /projects/:slug page keeps its original layout while this is shown to clients.
export default function ProjectDetailsUpdated() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  const [zoom, setZoom] = useState<number>(1);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
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

  const lightboxGestures = useTouchGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    onSwipeDown: closeLightbox,
    threshold: 50,
    enabled: lightboxOpen,
  });

  // Reset on slug change
  useEffect(() => {
    setZoom(1);
    setVisibleSections({});
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Intersection observer drives every entrance animation on the page.
  // Elements opt in with ref={setRef(id)} + data-section={id}; a low threshold
  // keeps tall images from waiting until they are well past the fold.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) setVisibleSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );
    Object.values(sectionRefs.current).forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, [slug]);

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  // Images settle from a slight over-scale; text rises into place.
  const imageReveal = (id: string) =>
    `transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visibleSections[id] ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.06]'
    }`;

  const textReveal = (id: string) =>
    `transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`;

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
  const captions = project.imageCaptions || [];

  // images[0] is the cover; everything below it follows project.layout.
  const coverImage = project.images[0];

  // Without a layout, keep the old running order: all text beside the title, then
  // every remaining image in wide/narrow rows.
  const defaultLayout = (): ProjectLayoutBlock[] => {
    const blocks: ProjectLayoutBlock[] = [];
    if (hasContent) {
      blocks.push({ type: 'text', paragraphs: detailContent.map((_, i) => i + 1) });
    }
    for (let n = 1; n < project.images.length; n += 2) {
      blocks.push({
        type: 'images',
        images: [n, n + 1].filter((i) => i < project.images.length),
      });
    }
    return blocks;
  };

  const layout = project.layout?.length ? project.layout : defaultLayout();

  // Resolve the 1-based numbers in the layout, dropping anything out of range so a
  // typo in the data file can't blank the page.
  const resolved = layout
    .map((block) =>
      block.type === 'images'
        ? {
          type: 'images' as const,
          images: block.images
            .filter((n) => n >= 1 && n < project.images.length)
            .map((n) => ({ src: project.images[n], index: n })),
        }
        : {
          type: 'text' as const,
          paragraphs: block.paragraphs
            .filter((n) => n >= 1 && n <= detailContent.length)
            .map((n) => ({ ...detailContent[n - 1], number: n })),
        }
    )
    .filter((block) => (block.type === 'images' ? block.images.length : block.paragraphs.length));

  // Text before the first image block belongs beside the title; the rest flows with the images.
  const firstImageBlock = resolved.findIndex((block) => block.type === 'images');
  const splitAt = firstImageBlock === -1 ? resolved.length : firstImageBlock;
  const introParagraphs = resolved
    .slice(0, splitAt)
    .flatMap((block) => (block.type === 'text' ? block.paragraphs : []));

  type Paragraph = { heading?: string; content: string; number: number };
  type FlowRow = { kind: 'row'; images: Array<{ src: string; index: number }>; text: Paragraph[] };
  type FlowBand = { kind: 'band'; text: Paragraph[] };

  // Text that follows a wide/narrow row joins that row, stacking under the narrow image so the
  // two share one rectangle. Only text with no such row to join falls back to its own band.
  const flowBlocks = resolved.slice(splitAt).reduce<Array<FlowRow | FlowBand>>((flow, block) => {
    if (block.type === 'images') {
      flow.push({ kind: 'row', images: block.images, text: [] });
      return flow;
    }
    const previous = flow[flow.length - 1];
    if (previous?.kind === 'row' && previous.images.length === 2) {
      previous.text.push(...block.paragraphs);
    } else {
      flow.push({ kind: 'band', text: block.paragraphs });
    }
    return flow;
  }, []);

  // No canonical, no schema: this URL is a preview, not a page we want indexed or linked to.
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SEO
        title={`${project.seo.title} (preview)`}
        description={project.seo.description}
        image={project.seo.image}
      />
      <main className="bg-white">
        <div>

          {/* ════════ COVER ════════ */}
          <div
            ref={setRef('cover')}
            data-section="cover"
            className="w-full cursor-pointer overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              src={coverImage}
              alt={`${project.title} — cover`}
              className={`w-full h-[55vh] md:h-[82vh] object-cover ${imageReveal('cover')}`}
              loading="eager"
            />
          </div>

          {/* ════════ TITLE + INTRO TEXT ════════ */}
          <section className="px-6 md:px-10 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
              <div ref={setRef('title')} data-section="title" className="md:col-span-5">
                <h1 className={`text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] text-[#185B30] lowercase ${textReveal('title')}`}>
                  {project.title}
                </h1>
                <p
                  className={`text-base md:text-lg text-[#185B30] font-light lowercase mt-1 ${textReveal('title')}`}
                  style={{ transitionDelay: '120ms' }}
                >
                  {project.location}, {project.year}
                </p>
              </div>

              {introParagraphs.length > 0 && (
                <div className="md:col-span-6 md:col-start-7 space-y-5">
                  {introParagraphs.map((block, index) => (
                    <div
                      key={block.number}
                      ref={setRef(`text-${block.number}`)}
                      data-section={`text-${block.number}`}
                      className={textReveal(`text-${block.number}`)}
                      style={{ transitionDelay: `${index * 110}ms` }}
                    >
                      {block.heading && (
                        <h2 className="text-xs font-semibold tracking-widest uppercase text-[#185B30]/40 mb-2">
                          {block.heading}
                        </h2>
                      )}
                      <p className="text-sm md:text-base text-[#185B30] leading-relaxed font-light">
                        {block.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ════════ IMAGE + TEXT FLOW ════════ */}
          {flowBlocks.length > 0 && (
            <section className="flex flex-col gap-[5px]">
              {flowBlocks.map((block, blockIndex) => {
                if (block.kind === 'band') {
                  return (
                    <div
                      key={`text-block-${blockIndex}`}
                      className="grid grid-cols-1 md:grid-cols-12 px-6 md:px-10 py-12 md:py-20"
                    >
                      <div className="md:col-span-6 md:col-start-7 space-y-5">
                        {block.text.map((para, index) => (
                          <div
                            key={para.number}
                            ref={setRef(`text-${para.number}`)}
                            data-section={`text-${para.number}`}
                            className={textReveal(`text-${para.number}`)}
                            style={{ transitionDelay: `${index * 110}ms` }}
                          >
                            {para.heading && (
                              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#185B30]/40 mb-2">
                                {para.heading}
                              </h2>
                            )}
                            <p className="text-sm md:text-base text-[#185B30] leading-relaxed font-light">
                              {para.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                const row = block.images;
                // Which side is wide alternates across image rows, text bands aside.
                const rowIndex = flowBlocks
                  .slice(0, blockIndex)
                  .filter((b) => b.kind === 'row').length;

                return (
                  <div
                    key={`images-block-${blockIndex}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-[5px]"
                  >
                    {row.map((image, posInRow) => {
                    // The wide image sets the row height; the narrow one is cropped to fill it,
                    // leaving room underneath for its caption. Rows alternate which side is wide.
                    const widePosition = rowIndex % 2 === 0 ? 0 : 1;
                    const isWide = row.length === 2 ? posInRow === widePosition : true;
                    const caption = captions[image.index];
                    return (
                      <div
                        key={image.index}
                        className={`flex flex-col md:h-full ${row.length === 2 ? (isWide ? 'md:col-span-8' : 'md:col-span-4') : 'md:col-span-12'
                          }`}
                      >
                        <div
                          ref={setRef(`image-${image.index}`)}
                          data-section={`image-${image.index}`}
                          className={`w-full cursor-pointer overflow-hidden ${isWide ? '' : 'md:flex-1 md:min-h-0'}`}
                          onClick={() => openLightbox(image.index)}
                        >
                          <img
                            src={image.src}
                            alt={`${project.title} - Image ${image.index + 1}`}
                            className={`w-full object-cover ${isWide ? 'h-auto' : 'h-auto md:h-full'} ${imageReveal(`image-${image.index}`)}`}
                            loading="lazy"
                          />
                        </div>
                        {/* Caption and any text the layout attached to this row share the
                            narrow column, directly under its image. */}
                        {(caption || (!isWide && block.text.length > 0)) && (
                          <div className="px-6 md:px-4 pt-4 space-y-4 md:flex-shrink-0">
                            {caption && (
                              <p
                                className={`text-sm text-[#185B30] leading-relaxed font-light ${textReveal(`image-${image.index}`)}`}
                                style={{ transitionDelay: '200ms' }}
                              >
                                {caption}
                              </p>
                            )}
                            {!isWide && block.text.map((para, index) => (
                              <div
                                key={para.number}
                                ref={setRef(`text-${para.number}`)}
                                data-section={`text-${para.number}`}
                                className={textReveal(`text-${para.number}`)}
                                style={{ transitionDelay: `${200 + index * 110}ms` }}
                              >
                                {para.heading && (
                                  <h2 className="text-xs font-semibold tracking-widest uppercase text-[#185B30]/40 mb-2">
                                    {para.heading}
                                  </h2>
                                )}
                                <p className="text-sm text-[#185B30] leading-relaxed font-light">
                                  {para.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                );
              })}
            </section>
          )}

          {/* ════════ RELATED PROJECTS ════════ */}
          <section
            ref={setRef('related')}
            data-section="related"
            className="bg-[#F5FAF7] py-16 md:py-24 mt-12 md:mt-20"
          >
            <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
              <h2 className={`text-base font-medium tracking-wider mb-8 text-[#185B30] transition-all duration-1000 ease-out ${visibleSections.related ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                related projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((rel, index) => (
                  <Link
                    key={rel.id}
                    to={`${PREVIEW_BASE}/${rel.slug}`}
                    className={`group block transition-all duration-1000 ease-out ${visibleSections.related ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
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

          <Footer />

          {/* Lightbox */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
              ref={lightboxImageRef}
              onTouchStart={lightboxGestures.handleTouchStart}
              onTouchMove={lightboxGestures.handleTouchMove}
              onTouchEnd={lightboxGestures.handleTouchEnd}
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
        </div>
      </main>
    </>
  );
}
