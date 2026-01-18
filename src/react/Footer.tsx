import React from "react";

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
  return (
    <footer className="w-full bg-[#f3f3f3] relative z-10 text-[#1A1A1A]">
      {/* Call to Action Section */}
      <div className="py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 max-w-3xl">
          ¿Tienes una visión? <br /> ¡Hagámosla realidad!
        </h2>
        <p className="text-gray-500 max-w-2xl text-lg mb-10 leading-relaxed">
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
      </div>

      {/* Dark Footer Section */}
      <div className="bg-[#111111] text-white py-16 px-6 md:px-12 rounded-t-[3rem]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-0 min-h-[120px]">
            {/* Navigation */}
            <div className="flex flex-wrap gap-2 bg-[#1A1A1A] p-2 rounded-full border border-white/10">
              {["Inicio", "Sobre Mí", "Portafolio", "Servicios", "Blog"].map(
                (item, index) => (
                  <a
                    href="#"
                    key={index}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${index === 0 ? "bg-white text-black" : "hover:text-white text-gray-400"}`}
                  >
                    {item}
                  </a>
                ),
              )}
            </div>

            {/* Email */}
            <a
              href="mailto:leideracevedo07@gmail.com"
              className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight hover:text-gray-300 transition-colors break-all md:break-normal"
            >
              leideracevedo07@gmail.com
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm gap-4">
            <p>© 2026 Leider Acevedo. Todos los derechos reservados.</p>
            <div className="flex gap-6">
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
      </div>
    </footer>
  );
}
