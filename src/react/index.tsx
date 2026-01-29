import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

const ArrowUpRight = () => (
  <svg
    width="14"
    height="14"
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

const ArrowDown = () => (
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
    <path d="M12 5v14" />
    <path d="M19 12l-7 7-7-7" />
  </svg>
);

const Hero = () => {
  const container = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if image is already loaded on mount (cache check)
  useLayoutEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Enforce initial states IMMEDIATELY
      gsap.set(".hero-text-reveal", { y: 100, autoAlpha: 0 });
      gsap.set(".hero-fade-in", { y: 20, autoAlpha: 0 });
      gsap.set(".hero-nav-item", { y: -20, autoAlpha: 0 });
      gsap.set(".sidebar-line", { scaleY: 0, transformOrigin: "top" });
      gsap.set(".sidebar-text", { x: -20, autoAlpha: 0 });

      // Only play text/sidebar animations when image is ready
      if (isLoaded) {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.2,
        }); // slight delay to sync with CSS start

        tl.to(".sidebar-line", {
          scaleY: 1,
          duration: 1,
        })
          .to(
            ".hero-text-reveal",
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              stagger: 0.1,
            },
            "-=0.5",
          )
          .to(
            [".hero-fade-in", ".sidebar-text"],
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              duration: 0.8,
              stagger: 0.1,
            },
            "-=0.6",
          )
          .to(
            ".hero-nav-item",
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.6,
            },
            "-=0.8",
          );
      }
    }, container);

    return () => ctx.revert();
  }, [isLoaded]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll handler
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close mobile menu if open

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Optionally update URL
      history.pushState(null, "", href);
    }
  };

  const navLinks = [
    { label: "Sobre Mí", href: "#about" },
    { label: "Portafolio", href: "#portfolio" },
    { label: "Servicios", href: "#services" },
    { label: "Trayectoria", href: "#experience" },
  ];

  return (
    <div
      ref={container}
      className="w-full h-screen bg-[#f3f3f3] text-[#1A1A1A] font-sans selection:bg-blue-100 flex flex-col relative overflow-hidden max-h-[820px] mx-auto"
    >
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#f3f3f3] z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleScroll(e, item.href)}
            className="text-3xl font-medium hover:text-gray-500 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Navigation */}
      <nav className="w-full flex justify-between items-center px-6 md:px-22 py-8 max-w-[1320px] mx-auto z-50">
        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#1A1A1A] p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors relative z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex gap-10 text-sm font-medium text-gray-500">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="hero-nav-item opacity-0 hover:text-black transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hero-nav-item opacity-0 flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <button className="text-black font-semibold">EN</button>
            <span className="text-gray-300">/</span>
            <button className="text-gray-500 hover:text-black transition-colors">
              ES
            </button>
          </div>

          <a
            href="#"
            className="flex items-center gap-1 text-sm font-semibold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
          >
            Book A Call <ArrowUpRight />
          </a>
        </div>
      </nav>

      {/* Main Content Grid */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row relative">
        {/* Left Vertical Sidebar */}
        <div className="hidden xl:flex absolute -left-12 top-0 h-full flex-col items-center py-12 z-30 pointer-events-none">
          <div className="flex-none pb-4 sidebar-text opacity-0">
            <span className="[writing-mode:vertical-rl] rotate-180 text-gray-400 text-sm font-semibold tracking-widest uppercase whitespace-nowrap">
              Full-Stack Dev
            </span>
          </div>

          {/* Continuous Vertical Line */}
          <div className="sidebar-line w-[1px] flex-1 bg-gray-300 scale-y-0 origin-top"></div>

          <div className="flex-none pt-4 sidebar-text opacity-0">
            <span className="[writing-mode:vertical-rl] rotate-180 text-gray-400 text-sm font-bold tracking-widest block">
              2024
            </span>
          </div>
        </div>

        {/* Left Side: Text & Content */}
        <div className="w-full md:w-[55%] flex flex-col justify-center items-center md:items-start text-center md:text-left relative pt-10 md:pt-0 md:pb-32 z-20">
          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 md:gap-16 mb-8 md:pl-10 w-full md:w-auto">
            <div className="hero-fade-in opacity-0">
              <h3 className="text-3xl md:text-5xl font-light tracking-tight">
                +4
              </h3>
              <p className="text-sm text-gray-500 mt-1">Years exp.</p>
            </div>
            <div className="hero-fade-in opacity-0">
              <h3 className="text-3xl md:text-5xl font-light tracking-tight">
                +50
              </h3>
              <p className="text-sm text-gray-500 mt-1">Project completed</p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative md:pl-8 flex flex-col items-center md:items-start">
            <div className="overflow-hidden">
              <h1 className="hero-text-reveal opacity-0 text-[16vw] sm:text-[18vw] md:text-[12rem] leading-[0.8] font-normal tracking-tighter text-[#1A1A1A]">
                Antoni
              </h1>
            </div>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-3 md:pl-2 hero-text-reveal opacity-0">
              <span className="h-[1px] w-8 bg-gray-400"></span>
              <p className="text-base md:text-lg text-gray-600 font-medium max-w-[200px] md:max-w-none text-left md:text-left">
                Full Stack Developer & UI/UX Specialist
              </p>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="mt-12 md:mt-auto md:absolute md:bottom-12 md:left-12 flex items-end justify-center md:justify-between w-full pr-0 md:pr-12">
            <div className="hidden md:flex flex-col gap-12">
              <div className="hero-fade-in opacity-0 flex items-center gap-2 text-sm font-medium animate-bounce cursor-pointer">
                Scroll down <ArrowDown />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image Box */}
        <div className="absolute bottom-0 right-0 md:right-[5%] w-full md:w-[55%] h-[50vh] md:h-[110%] z-10 flex items-end justify-center pointer-events-none">
          <div
            className={`hero-image-container w-full h-full relative flex items-end justify-center overflow-hidden ${
              isLoaded ? "animate-slide-up" : "image-initial"
            }`}
          >
            <img
              ref={imgRef}
              onLoad={() => setIsLoaded(true)}
              style={{
                filter: "brightness(109.3%) grayscale(100%)",
              }}
              src={`${import.meta.env.BASE_URL}/images/img10.png`}
              alt="Portrait"
              className="w-full h-full object-cover grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
