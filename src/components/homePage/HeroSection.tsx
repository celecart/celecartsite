"use client";
import React, { useState, useEffect } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import HeadingParagraphBlock from "../HeadingParagraphBlock";
import { IoCameraOutline } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { FiUsers } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { MdOutlineShield } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../StatusBadge";

export default function HeroSection() {
  const contentData = [
    {
      icon: <BsGraphUpArrow />,
      heading: "Premium Fashion Insights",
      highlight: "Elite Collections",
      paragraph:
        "Discover premium collections and limited edition pieces worn by global icons",
    },
    {
      icon: <BsGraphUpArrow />,
      heading: "Discover Celebrity Style",
      highlight: "Celebrity Style",
      paragraph:
        "Explore the signature style and exclusive luxury brands preferred by world-class celebrities",
    },
    {
      icon: <BsGraphUpArrow />,
      heading: "Discover Fashion Trends",
      highlight: "Fashion Trends",
      paragraph:
        "Stay ahead with real-time insights on the latest celebrity fashion movements",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === contentData.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-10 py-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center gap-5"
            >
              <StatusBadge
                icon={contentData[currentIndex].icon}
                text={contentData[currentIndex].heading}
              />

              <h1 className="text-5xl font-bold relative inline-block">
                Discover{" "}
                <span className="relative inline-block text-[#F9A21F]">
                  {contentData[currentIndex].highlight}
                  {/* Underline Animation */}
                  <motion.span
                    className="absolute left-0 -bottom-3 h-[2px] bg-[#7B5A28]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </span>
              </h1>

              <p className="text-white/80">{contentData[currentIndex].paragraph}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex flex-col items-center justify-center p-10 gap-3 border border-[#7B5A28] rounded-xl">
            <StatusBadge
              icon={<BsGraphUpArrow />}
              text="Premium Fashion Insights"
            />
            <h1 className="text-3xl font-bold">
              Discover{" "}
              <span className="text-[#F9A21F] underline underline-offset-5 decoration-2 decoration-[#7B5A28]">
                Elite Collections
              </span>
            </h1>
            <p className="text-white/80 text-sm mb-5">
              Discover premium collections and limited edition pieces worn by
              global icons
            </p>
            <div className="grid grid-cols-2 gap-5">
              <button className="rounded-lg bg-[#E3941E] px-6 py-3 uppercase font-bold text-xs text-black flex gap-2 items-center justify-center">
                <IoCameraOutline className="text-xl" />
                Celebrity Spotlight
              </button>
              <button className="rounded-lg border border-[#7B5A28] px-6 py-3 uppercase font-bold text-xs flex gap-2 items-center justify-center">
                <BsGraphUpArrow className="text-sm" />
                Trending Products
              </button>
              <button className="rounded-lg border border-[#7B5A28] px-6 py-3 uppercase font-bold text-xs flex gap-2 items-center justify-center">
                <VscGraph className="text-sm" />
                Style Analytics
              </button>
              <button className="rounded-lg border border-[#7B5A28] px-6 py-3 uppercase font-bold text-xs flex gap-2 items-center justify-center">
                <FiUsers className="text-sm" />
                Browse Celebrities
              </button>
            </div>
            <div className="flex items-center gap-5 mt-5">
              <div className="flex items-center gap-1">
                <GoDotFill className="text-green-400 size-3" />
                <p className="font-bold text-[0.6rem] uppercase text-white/70">
                  Live Data
                </p>
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="text-[#F9A21F] size-3" />
                <p className="font-bold text-[0.6rem] uppercase text-white/70">
                  Premium Access
                </p>
              </div>
              <div className="flex items-center gap-1">
                <MdOutlineShield className="text-[#D68C1E] size-3" />
                <p className="font-bold text-[0.6rem] uppercase text-white/70">
                  Verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
