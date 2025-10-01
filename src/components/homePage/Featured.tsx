"use client"

import React from "react";
import { LuCrown } from "react-icons/lu";
import StatusBadge from "../StatusBadge";
import CelebrityCard from "../CelebrityCard";
import featured1 from "../../../public/priyanka.png";
import katrinaImage from "../../../public/katrina-kaif.jpg";
import ayezaImage from "../../../public/ayeza-khan.jpg";

export default function Featured() {
  const celebritiesData = [
    {
      image: featured1,
      imageAlt: "Priyanka Chopra",
      name: "Priyanka Chopra",
      description: "Actress, Singer, Producer, Philanthropist",
      badges: [
        { text: "High Fashion" },
        { text: "4 Looks", className: "bg-[#181B23] text-[#9FA1A4] border-[#9FA1A4]" }
      ],
      buttonText: "View Profile",
      href: "/celebrity/priyanka-chopra"
    },
    {
      image: katrinaImage,
      imageAlt: "Katrina Kaif",
      name: "Katrina Kaif",
      description: "Bollywood Actress, Kay Beauty Co-founder, Global Brand Ambassador",
      badges: [
        { text: "Entertainment" },
        { text: "5 Looks", className: "bg-[#181B23] text-[#9FA1A4] border-[#9FA1A4]" }
      ],
      buttonText: "View Profile",
      href: "/celebrity/katrina-kaif"
    },
    {
      image: ayezaImage,
      imageAlt: "Mehwish Hayat",
      name: "Mehwish Hayat",
      description: "Actress, Singer, Model",
      badges: [
        { text: "Fashion" },
        { text: "3 Looks", className: "bg-[#181B23] text-[#9FA1A4] border-[#9FA1A4]" }
      ],
      buttonText: "View Profile",
      href: "/celebrity/mehwish-hayat"
    }
  ];

  return (
    <div className="bg-[#0F141D] w-full px-10 py-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-5">
          <StatusBadge icon={<LuCrown />} text="Featured" />

          <h2 className="text-3xl font-bold mb-5">
            Style{" "}
            <span className="text-3xl font-bold text-[#F9A21F]">Spotlight</span>
          </h2>

          <div className="grid grid-cols-3 gap-5">
            {celebritiesData.map((celebrity, index) => (
              <CelebrityCard
                key={index}
                image={celebrity.image}
                imageAlt={celebrity.imageAlt}
                name={celebrity.name}
                description={celebrity.description}
                badges={celebrity.badges}
                buttonText={celebrity.buttonText}
                href={celebrity.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
