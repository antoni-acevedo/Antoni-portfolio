import React from "react";
import { motion } from "framer-motion";
// import img2 from "../assets/arrow.png";

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
    src={`${import.meta.env.BASE_URL}/images/arrow.png`}
    alt="Curvy Arrow"
    className="w-[90%] h-[90%] object-contain"
  />
);

export interface ProfileData {
  id: number;
  title: string;
  description: string;
  highlight_text: string;
  years_experience: number;
  experience_text: string;
  profile_image: string;
  secondary_image: string;
  bullet_1: string;
  bullet_2: string;
  // English translations
  title_en?: string;
  description_en?: string;
  highlight_text_en?: string;
  experience_text_en?: string;
  bullet_1_en?: string;
  bullet_2_en?: string;
}

interface AboutProps {
  profileData: ProfileData;
}

export default function About({ profileData }: AboutProps) {
  // Fallback if no data provided
  if (!profileData) return null;

  return (
    <section
      id="about"
      className="w-full bg-[#f3f3f3] py-20 px-6 md:px-12 relative z-10 text-[#1A1A1A]"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Text */}
        <div className="lg:col-span-4 flex flex-col gap-8 pr-0 lg:pr-4 items-center text-center lg:items-start lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
          >
            {profileData.title}
          </motion.h2>

          <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {profileData.description}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-medium text-[#1A1A1A]"
            >
              {profileData.highlight_text}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:block mt-8 ml-12"
          >
            <CurvyArrow />
          </motion.div>
        </div>

        {/* Middle Column: Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm h-full flex flex-col items-start gap-8 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between w-full gap-4">
              <h3 className="text-6xl font-normal tracking-tighter">
                +{profileData.years_experience}
              </h3>
              <div className="bg-[#f3f3f3] p-3 rounded-full">
                <GlobeIcon />
              </div>
            </div>
            <div>
              <p className="text-gray-500 mt-4 leading-snug">
                {profileData.experience_text}
              </p>
            </div>

            <div className="w-full mt-auto pt-8 aspect-[4/5] relative rounded-2xl overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}/images/${profileData.profile_image}`}
                alt="Portrait"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 aspect-square"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Column: Experience */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Top Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="self-center w-full sm:w-3/4 lg:w-3/4 aspect-square bg-white p-2 rounded-3xl shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow lg:self-end"
          >
            <div className="w-full h-full relative rounded-2xl overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}/images/${profileData.secondary_image}`}
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
          </motion.div>

          {/* Bullet Points */}
          <div className="space-y-8 mt-4 pl-4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex gap-4 items-start"
            >
              <SparkleIcon />
              <p className="text-gray-500 leading-relaxed text-sm md:text-base pt-1">
                {profileData.bullet_1}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex gap-4 items-start"
            >
              <SparkleIcon />
              <p className="text-gray-500 leading-relaxed text-sm md:text-base pt-1">
                {profileData.bullet_2}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
