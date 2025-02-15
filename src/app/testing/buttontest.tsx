import React from "react";

interface ButtonProps {
  children: React.ReactNode; // Correct type definition for children
  hexColor: String; // Optional boolean prop (note the ?)
  circleSize: Number;
  className?: String;
}

export function ButtonTest({
  children,
  hexColor,
  circleSize,
  className,
}: ButtonProps) {
  const validHexColor = (
    hexColor.startsWith("#") ? hexColor.slice(1) : hexColor
  ).padEnd(6, "0"); // Ensure 6 digits
  const backgroundColor = `bg-[#${validHexColor}]`;

  const sizeInPixels = circleSize !== undefined ? circleSize : 24; // Default size
  const pixelSizeClass = `w-[${sizeInPixels}px] h-[${sizeInPixels}px]`; // Create Tailwind class for size

  return (
    <div
      className={`${className} ${pixelSizeClass} w-60 h-60 rounded-full ${backgroundColor}`}
    >
      {children}
    </div>
  );
}
