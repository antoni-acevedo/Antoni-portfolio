import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useStore } from "@nanostores/react";
import { languageStore, setLanguage } from "../store/languageStore";

const copy = {
  es: {
    nav: [
      { label: "Sobre Mí", href: "#about" },
      { label: "Portafolio", href: "#portfolio" },
      { label: "Servicios", href: "#services" },
      { label: "Trayectoria", href: "#experience" },
    ],
    talk: "Charlemos",
    menu: "Menú",
  },
  en: {
    nav: [
      { label: "About Me", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Services", href: "#services" },
      { label: "Experience", href: "#experience" },
    ],
    talk: "Let's Talk",
    menu: "Menu",
  },
};

// Fixed copy of the hero navigation: slides in once the hero is scrolled past.
export default function StickyNav() {
  const lang = useStore(languageStore);
  const c = copy[lang];
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  };

  return (
    <header
      inert={!visible}
      className={`fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-[#f3f3f3] transition-[transform,box-shadow] duration-300 ease-out ${
        visible ? "translate-y-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)]" : "-translate-y-full"
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 md:px-12"
      >
        <button
          className="-ml-2 rounded-full p-2 text-[#1A1A1A] transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={c.menu}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden gap-10 text-sm font-medium text-gray-500 md:flex">
          {c.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className="transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            {(["en", "es"] as const).map((l, i) => (
              <React.Fragment key={l}>
                {i > 0 && <span className="text-gray-300">/</span>}
                <button
                  onClick={() => setLanguage(l)}
                  className={`transition-colors ${lang === l ? "font-semibold text-black" : "text-gray-500 hover:text-black"}`}
                >
                  {l.toUpperCase()}
                </button>
              </React.Fragment>
            ))}
          </div>

          <a
            href="https://wa.me/573016236319"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 border-b border-black pb-0.5 text-sm font-semibold transition-opacity hover:opacity-70 sm:flex"
          >
            {c.talk}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      </nav>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-black/10 px-6 pb-4 pt-2 text-base font-medium md:hidden">
          {c.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className="py-2 text-gray-500 transition-colors hover:text-black"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
