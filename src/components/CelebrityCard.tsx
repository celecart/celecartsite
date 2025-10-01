"use client"
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { GoChevronRight } from "react-icons/go";


interface Badge {
  text: string;
  className?: string;
}

interface CelebrityCardProps {
  image: StaticImageData | string;
  imageAlt: string;
  name: string;
  description: string;
  badges: Badge[];
  buttonText: string;
  href?: string;
  className?: string;
}

const CelebrityCard: React.FC<CelebrityCardProps> = ({
  image,
  imageAlt,
  name,
  description,
  badges,
  buttonText,
  href = "#",
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <Image
        src={image}
        alt={imageAlt}
        width={0}
        height={0}
        className="w-full h-[30rem] object-cover rounded-lg border border-[#7B5A28]"
      />
      <div className="bg-[#0E121B] border border-[#7B5A28] flex flex-col gap-2 p-3 rounded-lg">
        <h3 className="font-playfair text-xl font-bold">
          {name}
        </h3>
        <p className="text-[#F9A21F] text-xs">
          {description}
        </p>
        <div className="flex gap-2 mb-3">
          {badges.map((badge, index) => (
            <StatusBadge 
              key={index}
              text={badge.text} 
              className={badge.className}
            />
          ))}
        </div>
        <Link href={href}>
          <button className="w-full bg-[#F9A21F] text-[#0B0E16] font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-1">
            {buttonText}
            <GoChevronRight />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CelebrityCard;