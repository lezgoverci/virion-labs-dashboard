import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInitials(name?: string | null): string {
  if (!name || name.trim() === '') {
    return 'U'
  }
  
  const words = name.trim().split(/\s+/)
  
  if (words.length === 1) {
    // For single word names, take first two characters or just the first if only one character
    return words[0].slice(0, 2).toUpperCase()
  }
  
  // For multiple words, take first character of first and last word
  const firstInitial = words[0].charAt(0)
  const lastInitial = words[words.length - 1].charAt(0)
  
  return (firstInitial + lastInitial).toUpperCase()
}
