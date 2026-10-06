import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export interface FeaturedProject {
  id: number;
  title: string;
  client: string;
  image: string;
  category: string;
  category_en?: string;
  link?: string;
}

interface ProyectCarrouselProps {
  initialProjects?: FeaturedProject[];
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

export default function ProyectCarrousel({
  initialProjects = [],
}: ProyectCarrouselProps) {
  const projects = initialProjects;
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const slides = projects.map((project) => ({
    src: `${import.meta.env.BASE_URL}images/${project.image}`,
    title: project.title,
    description: project.client,
  }));

  if (projects.length === 0) return null; // Or return a loading skeleton?

  // Two rows moving in opposite directions: even projects on the first row,
  // odd ones on the second. Each row's set is repeated until it is wider than
  // the screen, then rendered twice so the -50% loop is seamless.
  const indexed = projects.map((project, idx) => ({ project, idx }));
  const rows = [
    indexed.filter((_, i) => i % 2 === 0),
    indexed.filter((_, i) => i % 2 === 1),
  ].filter((r) => r.length > 0);

  const fill = <T,>(arr: T[]) => {
    let out = arr;
    while (out.length < 6) out = [...out, ...arr];
    return out;
  };

  const openAt = (idx: number) => {
    setIndex(idx);
    setOpen(true);
  };

  return (
    <div className="w-full bg-[#f3f3f3]">
      <section className="w-full py-10 relative z-10 text-[#1A1A1A] overflow-hidden">
        <div className="flex flex-col gap-5">
          {rows.map((row, rowIdx) => {
            const set = fill(row);
            return (
              <div key={rowIdx} className="marquee-row marquee-mask overflow-hidden py-3">
                <div
                  className={`marquee-track ${rowIdx % 2 === 1 ? "marquee-track--reverse" : ""}`}
                  style={{ ["--marquee-duration" as string]: `${set.length * 7}s` }}
                >
                  {[0, 1].flatMap((copy) =>
                    set.map(({ project, idx }, k) => (
                      <article
                        key={`${copy}-${k}`}
                        role="button"
                        tabIndex={copy === 0 ? 0 : -1}
                        aria-hidden={copy === 1}
                        aria-label={project.title}
                        onClick={() => openAt(idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openAt(idx);
                          }
                        }}
                        className="group relative mr-5 aspect-video w-[240px] shrink-0 overflow-hidden rounded-3xl bg-gray-200 text-[#1A1A1A] cursor-pointer outline-none ring-1 ring-black/10 transition-all duration-500 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-black sm:w-[290px] lg:w-[330px]"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}images/${project.image}`}
                          alt={copy === 0 ? project.title : ""}
                          loading="lazy"
                          draggable={false}
                          className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                        />

                        {/* Open button */}
                        <span className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1A1A1A] opacity-0 shadow-lg -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          <ArrowUpRight />
                        </span>
                      </article>
                    )),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Fullscreen, Zoom, Thumbnails]}
        carousel={{ padding: "60px" }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </div>
  );
}
