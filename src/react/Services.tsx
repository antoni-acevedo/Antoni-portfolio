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
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white p-10 rounded-[40px] border border-gray-100 hover:bg-[#1A1A1A] transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-4xl md:text-5xl font-light text-gray-200 group-hover:text-white/20 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-[#f3f3f3] flex items-center justify-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
                      <ArrowUpRight />
                    </div>
                  </div>

                  <h3 className="text-3xl font-medium mb-4 group-hover:text-white transition-colors">
                    {t(service, "title")}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-400 text-lg leading-relaxed transition-colors">
                    {t(service, "description")}
                  </p>
                </div>

                <div className="mt-12 flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-[#f3f3f3] text-gray-600 text-sm font-medium group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
                    {t(service, "tag")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mt-20"
        >
          <a
            href="https://wa.me/573016236319"
            target="_blank"
            className="group flex items-center gap-4 bg-white hover:bg-[#1A1A1A] px-8 py-5 rounded-full transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100"
          >
            <span className="text-lg font-medium text-gray-600 group-hover:text-white transition-colors">
              {lang === "es"
                ? "¿Buscas algo específico?"
                : "Looking for something specific?"}
            </span>
            <span className="flex items-center gap-2 text-black group-hover:text-white transition-colors font-bold">
              {lang === "es" ? "Hablemos" : "Let's talk"}{" "}
              <div className="group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight />
              </div>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
