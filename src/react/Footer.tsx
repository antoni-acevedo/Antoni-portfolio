import React from "react";
import { motion } from "framer-motion";

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

export default function Footer() {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();

    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.pushState(null, "", " ");
      return;
    }

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      history.pushState(null, "", href);
    }
  };

  const footerLinks = [
    { label: "Inicio", href: "#" },
    { label: "Sobre Mí", href: "#about" },
    { label: "Portafolio", href: "#portfolio" },
    { label: "Servicios", href: "#services" },
    { label: "Trayectoria", href: "#experience" },
  ];

  return (
    <footer className="w-full bg-[#f3f3f3] relative z-10 text-[#1A1A1A]">
      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="pb-24 pt-12 px-6 md:px-12 flex flex-col items-center justify-center text-center"
      >
        <h2 className="text-3xl md:text-6xl font-medium tracking-tight mb-6 max-w-3xl leading-tight">
          ¿Tienes una visión? <br /> ¡Hagámosla realidad!
        </h2>
        <p className="text-gray-500 max-w-2xl text-base md:text-lg mb-8 leading-relaxed">
          Siempre estoy emocionado por colaborar en proyectos nuevos e
          innovadores. Ya sea que estés empezando desde cero o refinando una
          idea existente, estoy aquí para ayudarte.
        </p>
        <a
          href="https://wa.me/573016236319"
          target="_blank"
          className="inline-flex items-center gap-2 text-lg font-medium border-b border-black pb-1 hover:opacity-70 transition-opacity"
        >
          Agenda una llamada <ArrowUpRight />
        </a>
      </motion.div>

      {/* Dark Footer Section */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-[#111111] text-white py-16 px-6 md:px-12 rounded-t-[3rem]"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-12 md:gap-0 min-h-[120px]">
            {/* Navigation */}
            <div className="flex flex-wrap justify-center gap-2 bg-[#1A1A1A] p-2 rounded-full border border-white/10">
              {footerLinks.map((item, index) => (
                <a
                  href={item.href}
                  key={index}
                  onClick={(e) => handleScroll(e, item.href)}
                  className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-colors ${index === 0 ? "bg-white text-black" : "hover:text-white text-gray-400"}`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Email */}
            <a
              href="mailto:leideracevedo07@gmail.com"
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light tracking-tight hover:text-gray-300 transition-colors break-all md:break-normal text-center"
            >
              leideracevedo07@gmail.com
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm gap-4 text-center md:text-left">
            <p className="order-2 md:order-1">
              © 2026 Leider Acevedo. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 order-1 md:order-2">
              <a
                href="https://www.linkedin.com/in/leideracevedo"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
