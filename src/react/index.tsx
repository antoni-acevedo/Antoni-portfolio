import profileImage from "../assets/img9.png";

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
  return (
    <div className="w-full h-screen bg-[#f3f3f3] text-[#1A1A1A] font-sans selection:bg-blue-100 flex flex-col relative overflow-hidden max-h-[720px] mx-auto">
      {/* Navigation */}
      <nav className="w-full flex justify-between items-center px-6 md:px-22 py-8 max-w-[1320px] mx-auto z-50">
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

        <div className="flex items-center gap-6">
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
      <div className="flex-1 w-full max-w-[1320px] mx-auto px-6 md:px-12 flex flex-col md:flex-row relative">
        {/* Left Side: Text & Content */}
        <div className="w-full md:w-[55%] flex flex-col justify-center relative pt-10 md:pt-0 md:pb-32 z-20">
          {/* Vertical Label - Absolute on Left */}
          <div className="hidden lg:block absolute -left-4 top-[40%]">
            <span className="-rotate-90 inline-block text-gray-300 text-xs font-semibold tracking-widest uppercase transform origin-center whitespace-nowrap">
              Product designer
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-16 mb-8 md:pl-10">
            <div>
              <h3 className="text-4xl md:text-5xl font-light tracking-tight">
                +200
              </h3>
              <p className="text-sm text-gray-500 mt-1">Project completed</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-light tracking-tight">
                +50
              </h3>
              <p className="text-sm text-gray-500 mt-1">Startup raised</p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative md:pl-8">
            <h1 className="text-[20vw] md:text-[12rem] leading-[0.8] font-normal tracking-tighter text-[#1A1A1A]">
              Antoni
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

        {/* Right Side: Image Box */}
        <div className="absolute bottom-0 right-0 md:right-[5%] w-full md:w-[55%] h-[50vh] md:h-[110%] z-10 flex items-end justify-center pointer-events-none">
          <div className="w-full h-full relative flex items-end justify-center overflow-hidden">
            <img
              style={{
                filter: "brightness(109.3%) grayscale(100%)",
              }}
              src={profileImage.src}
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
