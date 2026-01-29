import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import { languageStore } from "../store/languageStore";

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

export interface ServiceData {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
  title_en?: string;
  description_en?: string;
  tag_en?: string;
}

interface ServicesProps {
  services: ServiceData[];
}

export default function Services({ services }: ServicesProps) {
  const lang = useStore(languageStore);

  if (!services) return null;

  const t = (item: ServiceData, field: keyof ServiceData) => {
    if (lang === "es") return item[field] as string;
    return (
      (item[`${field}_en` as keyof ServiceData] as string) ||
      (item[field] as string)
    );
  };

  return (
    <section
      id="services"
      className="w-full bg-[#f3f3f3] pb-24 pt-12 px-6 md:px-12 relative z-10 text-[#1A1A1A]"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center mb-16"
        >
          <div className="flex items-center gap-2 mb-4 bg-white px-4 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {lang === "es" ? "Lo que hago" : "What I do"}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mt-4">
            {lang === "es" ? "Mis Servicios" : "My Services"}
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group cursor-pointer flex flex-col gap-4"
            >
              {/* Image Card */}
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-gray-200">
                <img
                  src={`${import.meta.env.BASE_URL}/images/${service.image}`}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />

                {/* Overlay with Arrow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 backdrop-blur-[2px]">
                  <div className="bg-[#1A1A1A] text-white w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transform scale-100 md:scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <ArrowUpRight />
                  </div>
                </div>
              </div>

              {/* Content Below */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-medium tracking-tight group-hover:underline underline-offset-4 decoration-1">
                    {t(service, "title")}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                  <span className="font-medium bg-gray-200/50 px-3 py-1 rounded-full">
                    {t(service, "tag")}
                  </span>
                  <span>
                    {lang === "es" ? "Para" : "For"}{" "}
                    <span className="text-[#1A1A1A] font-medium">
                      {lang === "es" ? "Clientes Globales" : "Global Clients"}
                    </span>
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed line-clamp-2">
                  {t(service, "description")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Link (Optional based on design image "Check out More ->") */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mt-16 text-center"
        >
          <a
            href="https://wa.me/573016236319"
            target="_blank"
            className="group inline-flex flex-col md:flex-row items-center gap-2 text-lg font-medium text-gray-500 hover:text-black transition-colors"
          >
            {lang === "es"
              ? "¿Necesitas una solución personalizada?"
              : "Need a custom solution?"}
            <span className="text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {lang === "es" ? "Contáctame" : "Contact Me"} <ArrowUpRight />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
