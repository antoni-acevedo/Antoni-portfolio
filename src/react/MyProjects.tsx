import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@nanostores/react";
import { languageStore } from "../store/languageStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getImageUrl, formatDate, formatRole } from "./projectUtils";

const ArrowUpRight = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

export interface ProjectData {
  // ... (keep interface mostly same, but make sure usage reflects it)
  id: number;
  company: string;
  role: string;
  date: string;
  desc: string;
  long_desc: string;
  tags: string[];
  images: string[];
  role_en?: string;
  desc_en?: string;
  long_desc_en?: string;
}

interface MyProjectsProps {
  projects: ProjectData[];
}

export default function MyProjects({ projects }: MyProjectsProps) {
  const [activeId, setActiveId] = useState<number | null>(0);
  const lang = useStore(languageStore);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentLightboxImages, setCurrentLightboxImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil((projects?.length || 0) / ITEMS_PER_PAGE);
  const currentProjects = useMemo(
    () => projects?.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE) || [],
    [projects, currentPage],
  );

  if (!projects) return null;

  const t = (item: ProjectData, field: keyof ProjectData) => {
    if (lang === "es") return item[field] as string;
    return (
      (item[`${field}_en` as keyof ProjectData] as string) ||
      (item[field] as string)
    );
  };

  const MAX_TAGS = 3;

  // The entrance animation is only for the first load; re-running it on every
  // page change made the whole list flash (remount at opacity 0, staggered).
  const hasPagedRef = useRef(false);

  const goToPage = (page: number) => {
    hasPagedRef.current = true;
    setActiveId(null);
    setCurrentPage(page);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      if (start > 1) pages.push("ellipsis");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push("ellipsis");

      pages.push(totalPages - 1);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="w-full py-10 px-4 md:px-6 relative z-10 text-[#1A1A1A]"
    >
      <div className="max-w-[1400px] mx-auto rounded-[2.5rem] bg-[#f3f3f3] border border-white/70 py-20 px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {lang === "es" ? "Experiencia Laboral" : "Work Experience"}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight max-w-xl">
              {lang === "es" ? "Mi Trayectoria" : "My Journey"} <br />
              <br />
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md text-gray-500 text-sm md:text-base leading-relaxed"
          >
            <p className="mb-4">
              {lang === "es"
                ? "Durante más de 4 años, he trabajado en una amplia gama de proyectos de desarrollo, colaborando con diversos equipos y clientes para dar vida a soluciones digitales escalables y eficientes."
                : "For over 4 years, I have worked on a wide range of development projects, collaborating with various teams and clients to bring scalable and efficient digital solutions to life."}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="https://wa.me/573016236319"
                target="_blank"
                className="inline-flex items-center gap-1 font-semibold text-[#1A1A1A] border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
              >
                {lang === "es" ? "Contáctame" : "Contact Me"} <ArrowUpRight />
              </a>
              <a
                href={`${import.meta.env.BASE_URL}projects/`}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] text-white text-sm font-medium hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {lang === "es" ? "Ver todos los proyectos" : "View all projects"}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight />
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {currentProjects.map((project, index) => {
            const isActive = activeId === project.id;
            const number = String(currentPage * ITEMS_PER_PAGE + index + 1).padStart(2, "0");
            const extraTags = project.tags.length - MAX_TAGS;
            return (
              <motion.div
                key={project.id}
                initial={hasPagedRef.current ? false : { opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveId(isActive ? null : project.id)}
                className={`group border-t border-gray-300 py-7 px-6 -mx-6 rounded-3xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-sm"
                    : `hover:bg-white/70 hover:shadow-sm ${index % 2 === 1 ? "bg-black/[0.04]" : ""}`
                }`}
              >
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-6 gap-y-4 lg:gap-x-8">
                  <span className="hidden lg:block w-8 shrink-0 text-sm font-medium text-gray-400 tabular-nums transition-colors group-hover:text-[#1A1A1A]">
                    {number}
                  </span>

                  {/* Title, role and date */}
                  <div className="flex-1 min-w-[10rem] lg:flex-none lg:w-[230px]">
                    <h3 className="text-2xl font-medium tracking-tight leading-tight mb-1.5">
                      {project.company}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatRole(t(project, "role"))}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(project.date, lang)}
                    </p>
                  </div>

                  {/* Cover */}
                  <div className="relative w-28 lg:w-44 aspect-[16/10] shrink-0 rounded-xl overflow-hidden bg-gray-200 ring-1 ring-black/5 shadow-sm">
                    <img
                      src={getImageUrl(project.images[0])}
                      alt={project.company}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.images.length > 1 && (
                      <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        +{project.images.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Expand button (last on desktop) */}
                  <span
                    aria-hidden="true"
                    className={`ml-auto lg:order-last w-11 h-11 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                        : "border-gray-300 text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:border-[#1A1A1A] group-hover:text-white"
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`transition-transform duration-300 ${isActive ? "rotate-45" : ""}`}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>

                  {/* Short description */}
                  <p className="hidden lg:block flex-1 min-w-0 text-sm leading-relaxed text-gray-500 line-clamp-3">
                    {t(project, "desc")}
                  </p>

                  {/* Tags (first few, full list when expanded) */}
                  <div className="w-full lg:w-[240px] lg:shrink-0 flex flex-wrap gap-2 lg:justify-end">
                    {project.tags.slice(0, MAX_TAGS).map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                          isActive
                            ? "bg-[#1A1A1A] text-white"
                            : "bg-gray-200 text-gray-600 group-hover:bg-gray-300/70"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {extraTags > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-500">
                        +{extraTags}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 32 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-8 items-start">
                        {/* Images - Carousel with Swiper */}
                        <div className="relative w-full group/carousel">
                          <Swiper
                            modules={[Autoplay, Navigation]}
                            navigation={{
                              nextEl: `.swiper-next-${project.id}`,
                              prevEl: `.swiper-prev-${project.id}`,
                            }}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                            slidesPerView={1.2}
                            spaceBetween={16}
                            breakpoints={{
                              768: { slidesPerView: 2, spaceBetween: 24 },
                              1280: { slidesPerView: 2.5, spaceBetween: 32 },
                            }}
                            className="w-full"
                          >
                            {project.images.map((img, idx) => (
                              <SwiperSlide key={idx}>
                                <div
                                  className="w-full h-52 md:h-[280px] rounded-2xl overflow-hidden bg-gray-200 shadow-md border border-white cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentLightboxImages(
                                      project.images.map(getImageUrl),
                                    );
                                    setLightboxIndex(idx);
                                    setLightboxOpen(true);
                                  }}
                                >
                                  <img
                                    src={getImageUrl(img)}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>

                          <button
                            className={`swiper-prev-${project.id} absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100`}
                            aria-label="Previous image"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                          </button>
                          <button
                            className={`swiper-next-${project.id} absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100`}
                            aria-label="Next image"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                          </button>
                        </div>

                        {/* Description & full tag list */}
                        <div className="grid w-full gap-8 pt-6 border-t border-gray-200 lg:grid-cols-[minmax(0,1fr)_280px]">
                          <div className="max-w-3xl">
                            <p className="text-gray-500 leading-relaxed text-base md:text-xl italic mb-4">
                              {t(project, "desc")}
                            </p>
                            <p className="text-[#1A1A1A] leading-relaxed text-sm md:text-lg">
                              {t(project, "long_desc")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                              {lang === "es" ? "Tecnologías" : "Tech stack"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#1A1A1A] text-white"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <div className="border-t border-gray-300"></div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              ← {lang === "es" ? "Anterior" : "Previous"}
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <span key={`e-${i}`} className="text-gray-400 text-sm px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                      p === currentPage
                        ? "bg-[#1A1A1A] text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {p + 1}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              {lang === "es" ? "Siguiente" : "Next"} →
            </button>
          </div>
        )}
      </div>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentLightboxImages.map((src) => ({ src }))}
      />
    </section>
  );
}
