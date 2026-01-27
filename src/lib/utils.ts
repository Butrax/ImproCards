import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates contrasting text color (black or white) for a given background color.
 * Supports HSL and HEX color strings.
 * @param color The background color, e.g., 'hsl(30, 56%, 95%)' or '#2e4249'
 * @returns '#000000' for black or '#FFFFFF' for white.
 */
export function getContrastingTextColor(color: string): '#000000' | '#FFFFFF' {
  if (!color) {
    return '#000000'; // Default to black for invalid input
  }

  if (color.startsWith('hsl')) {
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
      console.error('Error parsing HSL color:', error);
      return '#000000'; // Fallback to black
    }
  }

  if (color.startsWith('#')) {
    try {
      let hex = color.slice(1);
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map(char => char + char)
          .join('');
      }

      if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
      }

      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      return luminance > 128 ? '#000000' : '#FFFFFF';
    } catch (error) {
      console.error('Error parsing HEX color:', error);
      return '#000000';
    }
  }

  return '#000000'; // Default to black for unknown formats
}
