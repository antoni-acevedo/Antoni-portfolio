import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useStore } from "@nanostores/react";
import { languageStore, setLanguage } from "../store/languageStore";
import type { ProjectData } from "./MyProjects";
import { getImageUrl, formatDate, formatRole, localized, tagKey } from "./projectUtils";

const BASE = import.meta.env.BASE_URL;
const MAX_TAGS = 3;
const MAX_FILTERS = 10;

const copy = {
  es: {
    back: "Volver",
    nav: [
      { label: "Sobre Mí", href: "#about" },
      { label: "Portafolio", href: "#portfolio" },
      { label: "Servicios", href: "#services" },
      { label: "Trayectoria", href: "#experience" },
    ],
    talk: "Charlemos",
    menu: "Menú",
    eyebrow: "Portafolio",
    title: "Todos los proyectos",
    subtitle:
      "Una selección completa de lo que he construido: plataformas, landings y herramientas para clientes de distintos sectores.",
    all: "Todos",
    count: (n: number) => `${n} ${n === 1 ? "proyecto" : "proyectos"}`,
    empty: "No hay proyectos con esa tecnología.",
    stack: "Tecnologías",
    close: "Cerrar",
    images: "Imágenes",
    prev: "Imagen anterior",
    next: "Imagen siguiente",
  },
  en: {
    back: "Back",
    nav: [
      { label: "About Me", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Services", href: "#services" },
      { label: "Experience", href: "#experience" },
    ],
    talk: "Let's Talk",
    menu: "Menu",
    eyebrow: "Portfolio",
    title: "All projects",
    subtitle:
      "A complete selection of what I have built: platforms, landing pages and tools for clients across different industries.",
    all: "All",
    count: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
    empty: "No projects with that technology.",
    stack: "Tech stack",
    close: "Close",
    images: "Images",
    prev: "Previous image",
    next: "Next image",
  },
};

// Fades in once loaded, so cards don't pop in as images arrive.
function CardImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`ap-card__img ${loaded ? "is-loaded" : ""}`}
    />
  );
}

// Crossfade: the new image fades in over the previous one, so there is never a blank frame.
function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src);
  const [previous, setPrevious] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (src === current) return;
    setPrevious(current);
    setCurrent(src);
    setLoaded(false);
  }, [src]);

  const reveal = () => {
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaded(true)));
  };

  useEffect(() => {
    if (loaded) return;
    if (ref.current?.complete) reveal();
  }, [current, loaded]);

  useEffect(() => {
    if (!loaded || !previous) return;
    const t = setTimeout(() => setPrevious(null), 300);
    return () => clearTimeout(t);
  }, [loaded, previous]);

  return (
    <>
      {previous && <img src={previous} alt="" aria-hidden className="ap-gallery__prev" />}
      <img
        key={current}
        ref={ref}
        src={current}
        alt={alt}
        onLoad={reveal}
        className={`ap-gallery__img ${loaded ? "is-loaded" : ""}`}
      />
    </>
  );
}

export default function AllProjects({ projects }: { projects: ProjectData[] }) {
  const lang = useStore(languageStore);
  const c = copy[lang];
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<ProjectData | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // Cards stagger in on first paint only; later filter changes enter without delay.
  const firstPaint = useRef(true);
  useEffect(() => {
    firstPaint.current = false;
  }, []);

  const filters = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const p of projects) {
      for (const tag of new Set(p.tags.map(tagKey))) {
        const label = p.tags.find((t) => tagKey(t) === tag)!;
        const prev = map.get(tag);
        map.set(tag, { label: prev?.label ?? label, count: (prev?.count ?? 0) + 1 });
      }
    }
    return [...map.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, MAX_FILTERS);
  }, [projects]);

  const visible = useMemo(
    () =>
      activeKey
        ? projects.filter((p) => p.tags.some((t) => tagKey(t) === activeKey))
        : projects,
    [projects, activeKey],
  );

  const open = (p: ProjectData) => {
    setImgIndex(0);
    setSelected(p);
  };

  // Warm the cache so browsing images swaps instantly instead of flashing.
  useEffect(() => {
    selected?.images.forEach((img) => {
      new Image().src = getImageUrl(img);
    });
  }, [selected]);

  const step = (dir: 1 | -1) => {
    const n = selected?.images.length ?? 0;
    if (n > 1) setImgIndex((i) => (i + dir + n) % n);
  };

  // Esc closes, arrows browse images; the page behind doesn't scroll while open.
  // Focus moves into the drawer and returns to the card on close.
  useEffect(() => {
    if (!selected) return;
    const trigger = document.activeElement as HTMLElement | null;
    const n = selected.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      else if (n > 1 && e.key === "ArrowLeft") setImgIndex((i) => (i - 1 + n) % n);
      else if (n > 1 && e.key === "ArrowRight") setImgIndex((i) => (i + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [selected]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="ap">
      {/* Top bar */}
      <header className="ap-header">
        <div className="ap-header__left">
          <a href={`${BASE}#portfolio`} className="ap-back">
            <span className="ap-back__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </span>
            {c.back}
          </a>

          <nav className="ap-nav" aria-label="Principal">
            {c.nav.map((item) => (
              <a key={item.href} href={`${BASE}${item.href}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="ap-header__right">
          <div className="ap-lang">
            {(["en", "es"] as const).map((l, i) => (
              <React.Fragment key={l}>
                {i > 0 && <span className="ap-lang__sep">/</span>}
                <button
                  onClick={() => setLanguage(l)}
                  className={lang === l ? "is-active" : ""}
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
            className="ap-talk"
          >
            {c.talk}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>

          <button
            className="ap-menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={c.menu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="ap-mobile-nav" aria-label="Principal">
            {c.nav.map((item) => (
              <a key={item.href} href={`${BASE}${item.href}`}>
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Title */}
      <div className="ap-hero">
        <div>
          <div className="ap-eyebrow">
            <span className="ap-eyebrow__dot" />
            <span className="ap-eyebrow__text">{c.eyebrow}</span>
          </div>
          <h1 className="ap-title">{c.title}</h1>
        </div>
        <p className="ap-subtitle">{c.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="ap-filters">
        <button
          onClick={() => setActiveKey(null)}
          className={`ap-chip ${activeKey === null ? "is-active" : ""}`}
        >
          {c.all} <span>{projects.length}</span>
        </button>
        {filters.map(([key, f]) => (
          <button
            key={key}
            onClick={() => setActiveKey(activeKey === key ? null : key)}
            className={`ap-chip ${activeKey === key ? "is-active" : ""}`}
          >
            {f.label} <span>{f.count}</span>
          </button>
        ))}
        <span className="ap-count">{c.count(visible.length)}</span>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <motion.p className="ap-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{c.empty}</motion.p>
      ) : (
        <div className="ap-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const extra = p.tags.length - MAX_TAGS;
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: firstPaint.current ? Math.min(i, 8) * 0.05 : 0,
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => open(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      open(p);
                    }
                  }}
                  className="ap-card"
                >
                  <div className="ap-card__media">
                    <CardImage src={getImageUrl(p.images[0])} alt={p.company} />
                    {p.images.length > 1 && (
                      <span className="ap-card__more">+{p.images.length - 1}</span>
                    )}
                  </div>

                  <div className="ap-card__body">
                    <div className="ap-card__top">
                      <h2 className="ap-card__title">{p.company}</h2>
                      <span className="ap-card__date">{formatDate(p.date, lang)}</span>
                    </div>
                    <p className="ap-card__role">{formatRole(localized(p, "role", lang))}</p>
                    <p className="ap-card__desc">{localized(p, "desc", lang)}</p>
                    <div className="ap-tags">
                      {p.tags.slice(0, MAX_TAGS).map((tag) => (
                        <span key={tag} className="ap-tag">
                          {tag}
                        </span>
                      ))}
                      {extra > 0 && <span className="ap-tag ap-tag--more">+{extra}</span>}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelected(null)}
            className="ap-overlay"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={selected.company}
              className="ap-modal"
            >
              <div className="ap-modal__head">
                <div>
                  <h2 className="ap-modal__title">{selected.company}</h2>
                  <p className="ap-modal__meta">
                    {formatRole(localized(selected, "role", lang))} ·{" "}
                    {formatDate(selected.date, lang)}
                  </p>
                </div>
                <button ref={closeRef} onClick={() => setSelected(null)} aria-label={c.close} className="ap-close">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <motion.div
                className="ap-modal__scroll"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.3, ease: "easeOut" }}
              >
                <div className="ap-media">
                  <div className="ap-gallery">
                    <GalleryImage
                      src={getImageUrl(selected.images[imgIndex])}
                      alt={`${selected.company} ${imgIndex + 1}`}
                    />
                    {selected.images.length > 1 && (
                      <>
                        <button onClick={() => step(-1)} aria-label={c.prev} className="ap-gallery__nav ap-gallery__nav--prev">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <button onClick={() => step(1)} aria-label={c.next} className="ap-gallery__nav ap-gallery__nav--next">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                        <span className="ap-gallery__count">
                          {imgIndex + 1} / {selected.images.length}
                        </span>
                      </>
                    )}
                  </div>
                  {selected.images.length > 1 && (
                    <div className="ap-thumbs" aria-label={c.images}>
                      {selected.images.map((img, i) => (
                        <button
                          key={img + i}
                          onClick={() => setImgIndex(i)}
                          aria-label={`${c.images} ${i + 1}`}
                          className={`ap-thumb ${i === imgIndex ? "is-active" : ""}`}
                        >
                          <img src={getImageUrl(img)} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ap-info">
                  <div>
                    <p className="ap-info__short">{localized(selected, "desc", lang)}</p>
                    <p className="ap-info__long">{localized(selected, "long_desc", lang)}</p>
                  </div>
                  <div>
                    <p className="ap-stack__label">{c.stack}</p>
                    <div className="ap-tags">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="ap-tag ap-tag--dark">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}
