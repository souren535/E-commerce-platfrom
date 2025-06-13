import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colorOptions = [
  { bg: "#f87171", text: "#000000" },
  { bg: "#60a5fa", text: "#ffffff" },
  { bg: "#34d399", text: "#000000" },
  { bg: "#fbbf24", text: "#000000" },
  { bg: "#a78bfa", text: "#ffffff" },
];

export const getColors = (index) => {
  return colorOptions[index] || colorOptions[0];
};
