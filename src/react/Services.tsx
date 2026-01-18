import React from "react";
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

const services = [
  {
    id: 1,
    title: "Desarrollo Web Full-Stack",
    description: "Aplicaciones web modernas y escalables con React y Node.js.",
    image: img3,
    tag: "Web & PWA",
  },
  {
    id: 2,
    title: "Desarrollo Móvil",
    description:
      "Apps nativas e híbridas para iOS y Android con React Native y Flutter.",
    image: img4,
    tag: "Mobile",
  },
  {
    id: 3,
    title: "Arquitectura & Cloud",
    description:
      "Sistemas robustos, bases de datos y despliegue en la nube (AWS).",
    image: img5,
    tag: "Backend",
  },
];

export default function Services() {
  return (
    <section className="w-full bg-[#f3f3f3] py-24 px-6 md:px-12 relative z-10 text-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="flex items-center gap-2 mb-4 bg-white px-4 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Lo que hago
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-normal tracking-tight">
            Mis Servicios
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group cursor-pointer flex flex-col gap-4"
            >
              {/* Image Card */}
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-gray-200">
                <img
                  src={service.image.src}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay with Arrow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 backdrop-blur-[2px]">
                  <div className="bg-[#1A1A1A] text-white w-20 h-20 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <ArrowUpRight />
                  </div>
                </div>

                {/* Internal Tags (Optional, matching style of some modern cards) */}
                <div className="absolute bottom-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {/* Can put content here if needed */}
                </div>
              </div>

              {/* Content Below */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-medium tracking-tight group-hover:underline underline-offset-4 decoration-1">
                    {service.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                  <span className="font-medium bg-gray-200/50 px-3 py-1 rounded-full">
                    {service.tag}
                  </span>
                  <span>
                    For{" "}
                    <span className="text-[#1A1A1A] font-medium">
                      Clientes Globales
                    </span>
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Link (Optional based on design image "Check out More ->") */}
        <div className="flex justify-center mt-16 text-center">
          <a
            href="https://wa.me/573016236319"
            target="_blank"
            className="group inline-flex items-center gap-2 text-lg font-medium text-gray-500 hover:text-black transition-colors"
          >
            ¿Necesitas una solución personalizada?
            <span className="text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Contáctame <ArrowUpRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
