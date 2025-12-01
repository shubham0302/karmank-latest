import React from "react";

/**
 * Reusable GradientText component for consistent title/heading styling across the project
 * Uses the KarmAnk™ brand gradient: cyan → blue → purple
 */
export const GradientText = ({
  children,
  as: Component = "span",
  size = "base",
  className = "",
  animated = false,
  ...props
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-4xl md:text-6xl",
  };

  const baseClasses = `text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 font-bold ${sizeClasses[size]}`;

  return React.createElement(
    Component,
    {
      className: `${baseClasses} ${className}`,
      ...props,
    },
    children
  );
};

/**
 * Gradient utilities for Tailwind CSS class names
 */
export const gradientUtils = {
  // Main KarmAnk gradient for titles
  text: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500",

  // Alternative gradient for section titles (warm tones)
  textWarm:
    "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-300 to-purple-500",

  // For background elements
  bgAccent:
    "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20",
};

/**
 * CSS class factory for dynamic gradient application
 */
export const getGradientClass = (variant = "default") => {
  const variants = {
    default:
      "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500",
    warm: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-300 to-purple-500",
    cool: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-600",
  };
  return variants[variant] || variants.default;
};

export default GradientText;
