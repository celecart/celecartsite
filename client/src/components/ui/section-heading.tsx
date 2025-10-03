import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  className
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <div className={cn("max-w-3xl mb-12", alignmentClasses[align], className)}>
      <h2 className="font-playfair text-4xl md:text-5xl font-bold text-light tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lightgray text-lg">
          {subtitle}
        </p>
      )}
      <div className="mt-5 w-24 h-1 bg-gold" style={{ 
        marginLeft: align === "center" ? "auto" : align === "right" ? "auto" : "0",
        marginRight: align === "center" ? "auto" : "0"
      }} />
    </div>
  );
}