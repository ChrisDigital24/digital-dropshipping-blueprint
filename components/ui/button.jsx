import React from "react";

export function Button({ children, variant = "default", className = "", ...props }) {
  const baseStyles = "px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring";
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-neutral-700 text-white hover:bg-neutral-800",
    outline: "border border-neutral-700 text-neutral-300 hover:border-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </button>
  );
}