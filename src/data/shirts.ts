/**
 * "Las Vaginas" shirt pre-launch interest test (/shirts/).
 *
 * Nothing is sold here. Each "I want this one" click leads to a static
 * /shirts/interest/<motif>/<size>/ page, so every motif + size combination
 * shows up as its own path in Vercel Web Analytics (page views work on the
 * Hobby plan; custom events would need Pro). The click also fires a custom
 * event, which only shows up if the team ever moves to Pro.
 */
import type { ImageMetadata } from 'astro';
import classicVegas from '../assets/images/shirts/motif-classic-vegas.png';
import neonClub from '../assets/images/shirts/motif-neon-club.png';
import desertGold from '../assets/images/shirts/motif-desert-gold.png';

export interface ShirtMotif {
  slug: string;
  name: string;
  tagline: string;
  shirtColors: string;
  /** Background the transparent motif is previewed on, roughly the shirt colour. */
  previewBg: 'light' | 'dark';
  image: ImageMetadata;
}

export const motifs: ShirtMotif[] = [
  {
    slug: 'classic-vegas',
    name: 'Classic Vegas',
    tagline: 'The full retro sign — star, bulbs and all. Looks like it was stolen from a casino car park.',
    shirtColors: 'White or grey shirt',
    previewBg: 'light',
    image: classicVegas,
  },
  {
    slug: 'neon-club',
    name: 'Neon Club',
    tagline: 'Pink and teal glow for people who only leave the hotel after dark.',
    shirtColors: 'Black shirt',
    previewBg: 'dark',
    image: neonClub,
  },
  {
    slug: 'desert-gold',
    name: 'Desert Gold',
    tagline: 'Gold on black. The "I am a respectable adult" edition. Nobody will believe you.',
    shirtColors: 'Black shirt',
    previewBg: 'dark',
    image: desertGold,
  },
];

export interface ShirtSize {
  slug: string;
  label: string;
}

export const sizes: ShirtSize[] = [
  { slug: 's', label: 'S' },
  { slug: 'm', label: 'M' },
  { slug: 'l', label: 'L' },
  { slug: 'xl', label: 'XL' },
  { slug: 'xxl', label: 'XXL' },
  { slug: 'any', label: 'Not sure yet' },
];

/** Shown as a planned price only — not an offer, nothing can be paid. */
export const plannedPrice = '~690 THB / ~19 €';

export const interestPath = (motif: string, size: string) => `/shirts/interest/${motif}/${size}/`;

export const NOTIFY_EMAIL = 'info@pattaya.love';
