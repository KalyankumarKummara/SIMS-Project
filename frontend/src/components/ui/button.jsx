import React from "react";

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 font-semibold rounded-md shadow-sm focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
