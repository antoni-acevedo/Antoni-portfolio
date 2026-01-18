import React, { useState } from "react";
import img3 from "../assets/mockImg.png";
import img4 from "../assets/mockImg.png";
import img5 from "../assets/mockImg.png";

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

const projects = [
  {
    id: 1,
    company: "Soluciones Star",
    role: "Desarrollador Full-Stack",
    date: "Agosto 2024 – Presente",
    desc: "Desarrollo de soluciones digitales completas (Web & Mobile)",
    longDesc:
      "Contribución activa en plataformas como Validocus y Wasapi. Enfoque en arquitecturas eficientes y escalables, optimizando tanto el rendimiento del frontend como la robustez del backend utilizando React, Node.js y tecnologías móviles híbridas.",
    tags: ["FullStack", "Mobile"],
    images: [img3, img4, img5],
  },
  {
    id: 2,
    company: "Vinix Code",
    role: "Desarrollador de Software",
    date: "Junio 2022 – Junio 2024",
    desc: "Desarrollo de aplicaciones web y móviles con React y Vue.js",
    longDesc:
      "Implementación de pasarelas de pago (Stripe, PayU), gestión de bases de datos (MySQL, Firebase) y contenerización con Docker. Colaboración estrecha en diseño UI/UX y despliegues consistentes en AWS.",
    tags: ["Frontend", "Backend"],
    images: [img4, img5, img3],
  },
  {
    id: 3,
    company: "Konecta",
    role: "Desarrollador Web",
    date: "Octubre 2019 – Marzo 2020",
    desc: "Construcción de aplicaciones web con Angular y Node.js",
    longDesc:
      "Desarrollo de interfaces de usuario modernas y experiencias digitales. Creación de aplicaciones robustas utilizando Angular (CLI, Material) e integración de servicios backend con Express.js.",
    tags: ["Web", "UI/UX"],
    images: [img5, img3, img4],
  },
];

export default function MyProjects() {
  const [activeId, setActiveId] = useState<number | null>(1); // Default expanded

  return (
    <section className="w-full bg-[#f3f3f3] py-24 px-6 md:px-12 relative z-10 text-[#1A1A1A]">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Experiencia Laboral
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-normal tracking-tight max-w-xl">
              Mi Trayectoria Profesional
            </h2>
          </div>

          <div className="max-w-md text-gray-500 text-sm md:text-base leading-relaxed">
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
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {projects.map((project) => (
            <div
              key={project.id}
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
                <div className="md:col-span-3 flex gap-2 md:justify-end">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${activeId === project.id ? "bg-[#1A1A1A] text-white" : "bg-gray-200 text-gray-600"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded Content */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${activeId === project.id ? "max-h-[500px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Images */}
                  <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {project.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-32 h-24 md:w-48 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-200"
                      >
                        <img
                          src={img.src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Description & Action */}
                  <div className="flex-1 flex items-center justify-between gap-8 w-full">
                    <p className="text-gray-500 leading-relaxed text-sm md:text-lg max-w-xl">
                      {project.longDesc}
                    </p>

                    <button className="hidden md:flex bg-[#1A1A1A] text-white w-16 h-16 rounded-full items-center justify-center shrink-0 hover:scale-110 transition-transform duration-300">
                      <ArrowUpRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-300"></div>
        </div>
      </div>
    </section>
  );
}
