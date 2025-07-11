import { Space_Mono } from 'next/font/google';
import { Space_Grotesk } from 'next/font/google';

// Using Space Grotesk for sans serif with a bit of character
export const fontSans = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-sans',
});

// Using Space Mono for a modern monospace with a touch of character
export const fontMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});
