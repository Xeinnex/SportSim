import React from 'react'; // Import React if you haven't already

interface ButtonProps {
  children: React.ReactNode; // Correct type definition for children
  customProperty?: boolean;    // Optional boolean prop (note the ?)
}

export function Button({ children, customProperty }: ButtonProps) {
  return (
    <div
      className={`b-2 border-spacing-6 ${
        customProperty ? "bg-black" : "bg-white"
      } ${customProperty ? "text-white" : "text-black"}`}
    >
      {children}
    </div>
  );
}