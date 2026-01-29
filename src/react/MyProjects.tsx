import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeId, setActiveId] = useState<number | null>(1); // Default expanded

  if (!projects) return null;

  return (
    <section
      id="portfolio"
      className="w-full bg-[#f3f3f3] py-24 px-6 md:px-12 relative z-10 text-[#1A1A1A]"
    >
      <div className="max-w-[1320px] mx-auto">
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
                Experiencia Laboral
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight max-w-xl">
              Mi Trayectoria <br />
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
              Durante más de 4 años, he trabajado en una amplia gama de
              proyectos de desarrollo, colaborando con diversos equipos y
              clientes para dar vida a soluciones digitales escalables y
              eficientes.
            </p>
            <a
              href="https://wa.me/573016236319"
              target="_blank"
              className="inline-flex items-center gap-1 font-semibold text-[#1A1A1A] border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              Contáctame <ArrowUpRight />
            </a>
          </motion.div>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() =>
                setActiveId(activeId === project.id ? null : project.id)
              }
              className="group border-t border-gray-300 py-8 transition-all duration-300 cursor-pointer hover:bg-gray-200/40 px-6 -mx-6 rounded-3xl"
            >
              {/* Top Row: Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-5 transition-transform duration-300 group-hover:translate-x-2">
                  <h3 className="text-2xl font-medium tracking-tight mb-1">
                    {project.company}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    &#8226; {project.date}
                  </p>
                </div>

                {/* Middle Role - Hidden on Hover/Expand */}
                <div
                  className={`md:col-span-4 hidden md:block text-gray-500 text-sm max-w-xs transition-opacity duration-300 ${activeId === project.id ? "opacity-0" : "opacity-100"}`}
                >
                  {project.desc}
                </div>

                {/* Tags */}
                <div className="md:col-span-3 flex flex-wrap md:flex-nowrap gap-2 justify-start md:justify-end mt-2 md:mt-0">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors duration-300 ${activeId === project.id ? "bg-[#1A1A1A] text-white" : "bg-gray-200 text-gray-600"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {activeId === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 32 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                      {/* Images */}
                      <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide snap-x">
                        {project.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="w-40 h-28 md:w-48 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-200 snap-center"
                          >
                            <img
                              src={`${import.meta.env.BASE_URL}/images/${img}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Description & Action */}
                      <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 w-full">
                        <p className="text-gray-500 leading-relaxed text-sm md:text-lg max-w-xl">
                          {project.long_desc}
                        </p>

                        <button className="flex bg-[#1A1A1A] text-white w-12 h-12 md:w-16 md:h-16 rounded-full items-center justify-center shrink-0 hover:scale-110 transition-transform duration-300 self-end md:self-auto">
                          <ArrowUpRight />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="border-t border-gray-300"></div>
        </div>
      </div>
    </section>
  );
}
