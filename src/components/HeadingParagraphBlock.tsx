import React from "react";

interface HeadingParagraphBlockProps {
  icon: React.ReactNode;
  heading: string;
  highlight: string;
  paragraph: string;
}

const HeadingParagraphBlock: React.FC<HeadingParagraphBlockProps> = ({
  icon,
  heading,
  highlight,
  paragraph,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex flex-row items-center gap-2 bg-[#3C2E1A] rounded-full border border-[#F9A21F] text-[#F9A21F] text-xs px-5 py-1">
          {icon}
          <p className="uppercase font-medium tracking-wider">{heading}</p>
        </div>

        <h1 className="text-5xl font-bold">
          Discover{" "}
          <span className="text-[#F9A21F] underline underline-offset-5 decoration-2 decoration-[#7B5A28]">
            {highlight}
          </span>
        </h1>

        <p className="text-white/80">{paragraph}</p>
      </div>
    </>
  );
};

export default HeadingParagraphBlock;
