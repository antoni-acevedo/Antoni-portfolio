import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useStore } from "@nanostores/react";
import { languageStore } from "../store/languageStore";

interface FeaturedProject {
  id: number;
  title: string;
  client: string;
  image: string;
  category: string;
  category_en?: string;
  link?: string;
}

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

export default function ProyectCarrousel() {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const lang = useStore(languageStore);

  useEffect(() => {
    fetch("/api/featured-projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching featured projects:", err));
  }, []);

  const getCategory = (project: FeaturedProject) => {
    if (lang === "es") return project.category;
    return project.category_en || project.category;
  };

  return (
    <div className="w-full bg-[#f3f3f3]">
      <section className="w-full bg-[#f3f3f3] py-10 px-6 md:px-0 relative z-10 text-[#1A1A1A] overflow-hidden max-w-[1700px] mx-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="pl-6 md:pl-12 cursor-grab active:cursor-grabbing">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              loop={projects.length > 2} // Only loop if enough slides
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              spaceBetween={30}
              slidesPerView={1.2}
              breakpoints={{
                640: {
                  slidesPerView: 2.2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 2.8,
                  spaceBetween: 40,
                },
              }}
              className="w-full !overflow-visible"
            >
              {projects.map((project) => (
                <SwiperSlide key={project.id} className="group">
                  <div className="flex flex-col gap-6">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl bg-gray-200">
                      <img
                        src={`${import.meta.env.BASE_URL}/images/${project.image}`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 backdrop-blur-[2px]">
                        <div className="bg-[#1A1A1A] text-white w-20 h-20 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                          <ArrowUpRight />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-medium tracking-tight group-hover:underline decoration-1 underline-offset-4">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm md:text-base font-medium">
                          <span>{getCategory(project)}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>
                            For{" "}
                            <span className="text-[#1A1A1A]">
                              {project.client}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
}
