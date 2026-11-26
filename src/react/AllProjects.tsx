import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function AllProjects({ projects }: { projects: ProjectData[] }) {
  const lang = useStore(languageStore);
  const c = copy[lang];
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<ProjectData | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

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
    <div className="ap">
      {/* Top bar */}
      <header className="ap-header">
        <a href={`${BASE}#portfolio`} className="ap-back">
          <span className="ap-back__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </span>
          {c.back}
        </a>

        <div className="ap-lang">
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={lang === l ? "is-active" : ""}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
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
        <p className="ap-empty">{c.empty}</p>
      ) : (
        <div className="ap-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => {
              const extra = p.tags.length - MAX_TAGS;
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
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
                    <img
                      src={getImageUrl(p.images[0])}
                      alt={p.company}
                      loading="lazy"
                      className="ap-card__img"
                    />
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

              <div className="ap-modal__scroll">
                <div className="ap-media">
                  <div className="ap-gallery">
                    <img
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
