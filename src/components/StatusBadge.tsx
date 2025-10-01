import React, { ReactNode } from 'react';

interface StatusBadgeProps {
  icon?: ReactNode;
  text?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  icon,
  text,
  className = ""
}) => {
  // Default classes that can be overridden
  const defaultClasses = "flex flex-row items-center gap-2 bg-[#3C2E1A] rounded-full border border-[#F9A21F] text-[#F9A21F] text-xs px-5 py-1";
  
  // If custom className is provided, use it entirely, otherwise use defaults
  const finalClassName = className ? `flex flex-row items-center gap-2 rounded-full border text-xs px-5 py-1 ${className}` : defaultClasses;
  
  return (
    <div className={finalClassName}>
      {icon}
      {text && (
        <p className="uppercase font-medium tracking-widest text-[0.6rem]">
          {text}
        </p>
      )}
    </div>
  );
};

export default StatusBadge;