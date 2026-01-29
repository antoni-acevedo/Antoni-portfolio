import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import { languageStore } from "../store/languageStore";

export interface JobData {
  id: number;
  company: string;
  role: string;
  date: string;
  description: string;
  image: string;
  tag: string;
  role_en?: string;
  description_en?: string;
  tag_en?: string;
}

interface LatestJobProps {
  jobs: JobData[];
}

export default function LatestJob({ jobs }: LatestJobProps) {
  const lang = useStore(languageStore);

  if (!jobs) return null;

  const t = (item: JobData, field: keyof JobData) => {
    if (lang === "es") return item[field] as string;
    return (
      (item[`${field}_en` as keyof JobData] as string) ||
      (item[field] as string)
    );
  };

  const getImageUrl = (name?: string) => {
    if (!name) return "";
    if (name.startsWith("http") || name.startsWith("data:")) return name;
    const cleanName = name.replace("src/assets/", "").replace(/^\//, "");
    return `${import.meta.env.BASE_URL}images/${cleanName}`;
  };

  return (
    <section
      id="experience"
      className="w-full bg-[#f3f3f3] pb-16 md:pb-24 pt-12 px-6 md:px-12 relative z-10 text-[#1A1A1A]"
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
              {lang === "es" ? "Trayectoria" : "Background"}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mt-4">
            {lang === "es" ? "Últimos Trabajos" : "Latest Work"}
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group bg-white rounded-[2rem] p-4 transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/3] mb-6 bg-gray-100">
                <img
                  src={getImageUrl(job.image)}
                  alt={job.company}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="px-2 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {t(job, "tag")}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    {job.date}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-3">
                  {job.company}
                </h3>

                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {t(job, "role")} - {t(job, "description")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
