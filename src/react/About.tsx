import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img10 from "../assets/profile2.jpeg";
import img11 from "../assets/profile2.jpg";
import img2 from "../assets/arrow.png";

// Register ScrollTrigger safely for SSG/SSR
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GlobeIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ArrowUpRight = () => (
  <svg
    width="20"
    height="20"
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

const SparkleIcon = () => (
  <div className="bg-[#1A1A1A] text-white p-1.5 rounded-full flex items-center justify-center w-8 h-8 shrink-0">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </div>
);

const CurvyArrow = () => (
  <img
    src={img2.src}
    alt="Curvy Arrow"
    className="w-[90%] h-[90%] object-contain"
  />
);

export default function About() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".about-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: container.current,
            start: "top 70%",
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      className="w-full bg-[#f3f3f3] py-20 px-6 md:px-12 relative z-10 text-[#1A1A1A]"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Text */}
        <div className="lg:col-span-4 flex flex-col gap-8 pr-4">
          <h2 className="about-text text-5xl md:text-6xl font-normal tracking-tight">
            Sobre Mí
          </h2>

          <div className="about-text space-y-6 text-gray-500 text-lg leading-relaxed">
            <p>
              Desarrollador Full-Stack con más de 4 años de experiencia creando
              aplicaciones web y móviles escalables con JavaScript/TypeScript.
              Especializado en React, Vue, Node.js, y desarrollo híbrido con
              Ionic, React Native y Flutter.
            </p>
            <p className="font-medium text-[#1A1A1A]">
              ¿Listo para iniciar tu próximo proyecto?
            </p>
          </div>

          <div className="about-text hidden md:block mt-8 ml-12">
            <CurvyArrow />
          </div>
        </div>

        {/* Middle Column: Stats Card */}
        <div className="lg:col-span-4 about-card">
          <div className="bg-white p-8 rounded-3xl shadow-sm h-full flex flex-col items-start gap-8 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between w-full gap-4">
              <h3 className="text-6xl font-normal tracking-tighter">+4</h3>
              <div className="bg-[#f3f3f3] p-3 rounded-full">
                <GlobeIcon />
              </div>
            </div>
            <div>
              <p className="text-gray-500 mt-4 leading-snug">
                Años de experiencia liderando el desarrollo de soluciones
                digitales completas.
              </p>
            </div>

            <div className="w-full mt-auto pt-8 aspect-[4/5] relative rounded-2xl overflow-hidden">
              <img
                src={img10.src}
                alt="Portrait"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 aspect-square"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Experience */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Top Image Card */}
          <div className="about-card self-end w-3/4 aspect-square bg-white p-2 rounded-3xl shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-full h-full relative rounded-2xl overflow-hidden">
              <img
                src={img11.src}
                alt="Detail"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <a
                href="https://www.linkedin.com/in/leideracevedo"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-full text-black shadow-lg transform transition-transform duration-300 group-hover:scale-110 z-20"
              >
                <ArrowUpRight />
              </a>
            </div>
          </div>

          {/* Bullet Points */}
          <div className="space-y-8 mt-4 pl-4">
            <div className="about-card flex gap-4 items-start">
              <SparkleIcon />
              <p className="text-gray-500 leading-relaxed text-sm md:text-base pt-1">
                Enfoque en arquitecturas eficientes y escalables, optimizando
                tanto el rendimiento del frontend como la robustez del backend
                para clientes globales.
              </p>
            </div>

            <div className="about-card flex gap-4 items-start">
              <SparkleIcon />
              <p className="text-gray-500 leading-relaxed text-sm md:text-base pt-1">
                Experiencia integral abarcando desde la concepción del diseño
                UI/UX hasta el despliegue en producción, integrando pasarelas de
                pago y servicios cloud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
