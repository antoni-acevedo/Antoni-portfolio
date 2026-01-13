import React from "react";

// Icons
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

const Logo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
  >
    <path d="M12 2L2 19h20L12 2zm0 3l6 14H6l6-14z" />
  </svg>
);

const Hero = () => {
  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans selection:bg-blue-100 flex flex-col relative overflow-hidden">
      {/* Navigation */}
      <nav className="w-full flex justify-between items-center px-6 md:px-12 py-8 max-w-[1920px] mx-auto z-50">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="hidden md:flex gap-10 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-black transition-colors">
            About Me
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Portfolio
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Services
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Blog
          </a>
        </div>

        <a
          href="#"
          className="flex items-center gap-1 text-sm font-semibold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
        >
          Book A Call <ArrowUpRight />
        </a>
      </nav>

      {/* Main Content Grid */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-6 md:px-12 flex flex-col md:flex-row relative">
        {/* Left Side: Text & Content */}
        <div className="flex-[1.2] flex flex-col justify-center relative pt-10 md:pt-0">
          {/* Vertical Label - Absolute on Left */}
          <div className="hidden lg:block absolute -left-4 top-[40%]">
            <span className="-rotate-90 inline-block text-gray-300 text-xs font-semibold tracking-widest uppercase transform origin-center whitespace-nowrap">
              Product designer
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-16 mb-8 md:pl-10">
            <div>
              <h3 className="text-3xl font-light tracking-tight">+200</h3>
              <p className="text-xs text-gray-500 mt-1">Project completed</p>
            </div>
            <div>
              <h3 className="text-3xl font-light tracking-tight">+50</h3>
              <p className="text-xs text-gray-500 mt-1">Startup raised</p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative md:pl-8">
            <h1 className="text-[20vw] md:text-[13rem] leading-[0.8] font-normal tracking-tighter text-[#1A1A1A]">
              Hello
            </h1>
            <div className="mt-8 flex items-center gap-3 md:pl-2">
              <span className="h-[1px] w-8 bg-gray-400"></span>
              <p className="text-lg text-gray-600 font-medium">
                It's D.Nova a design wizard
              </p>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="mt-20 md:mt-auto md:absolute md:bottom-12 md:left-12 flex items-end justify-between w-full pr-12">
            <div className="hidden md:flex flex-col gap-12">
              <span className="-rotate-90 text-gray-300 text-xs font-bold tracking-widest origin-bottom-left transform translate-y-full">
                2024
              </span>
              <div className="flex items-center gap-2 text-sm font-medium animate-bounce cursor-pointer">
                Scroll down <ArrowDown />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Blue Placeholder Box */}
        <div className="flex-1 flex items-end justify-center md:justify-end relative mt-12 md:mt-0 h-[50vh] md:h-auto">
          {/* The Blue Box */}
          <div className="w-full md:w-[85%] h-full md:h-[90%] bg-blue-600 relative z-10 flex items-center justify-center text-white/50 overflow-hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
