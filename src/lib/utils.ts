import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates contrasting text color (black or white) for a given background color.
 * Currently supports HSL color strings.
 * @param color The background color, e.g., 'hsl(30, 56%, 95%)'
 * @returns '#000000' for black or '#FFFFFF' for white.
 */
export function getContrastingTextColor(color: string): '#000000' | '#FFFFFF' {
  if (!color || !color.startsWith('hsl')) {
    return '#000000'; // Default to black for invalid input
  }

  try {
    const lightnessString = color.split(',')[2];
    if (!lightnessString) {
      return '#000000';
    }
    // Extracts the percentage value for lightness
    const lightness = parseFloat(lightnessString);
    
    // If lightness is > 60%, the color is light, so we use black text.
    // Otherwise, it's dark, so we use white text.
    return lightness > 60 ? '#000000' : '#FFFFFF';
  } catch (error) {
    console.error("Error parsing HSL color:", error);
    return '#000000'; // Fallback to black
  }
}
