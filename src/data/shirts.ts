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
import classicVegasThumb from '../assets/images/shirts/thumb-classic-vegas.png';
import neonClubThumb from '../assets/images/shirts/thumb-neon-club.png';
import desertGoldThumb from '../assets/images/shirts/thumb-desert-gold.png';

export interface ShirtMotif {
  slug: string;
  name: string;
  tagline: string;
  shirtColors: string;
  /** Background the transparent motif is previewed on, roughly the shirt colour. */
  previewBg: 'light' | 'dark';
  image: ImageMetadata;
  /**
   * 300 px version for the design picker tiles, used as a plain file.
   * Both images come from scripts/shirt-images.mjs.
   */
  thumb: ImageMetadata;
  /** Two ink colours of the motif, used for the glow behind the product preview. */
  glow: [string, string];
  /**
   * Product URL in the print partner's shop. While it is missing, the button
   * counts interest instead (/shirts/interest/<motif>/<size>/). Once every
   * motif has one, /shirts/ switches from "vote" to "buy".
   */
  shopUrl?: string;
}

export const motifs: ShirtMotif[] = [
  {
    slug: 'classic-vegas',
    name: 'Classic Vegas',
    tagline: 'The full retro sign — star, bulbs and all. Looks like it was stolen from a casino car park.',
    shirtColors: 'White or grey shirt',
    previewBg: 'light',
    image: classicVegas,
    thumb: classicVegasThumb,
    glow: ['#E8B52A', '#CB151B'],
  },
  {
    slug: 'neon-club',
    name: 'Neon Club',
    tagline: 'Pink and teal glow for people who only leave the hotel after dark.',
    shirtColors: 'Black shirt',
    previewBg: 'dark',
    image: neonClub,
    thumb: neonClubThumb,
    glow: ['#F32291', '#02C4D3'],
  },
  {
    slug: 'desert-gold',
    name: 'Desert Gold',
    tagline: 'Gold on black. The "I am a respectable adult" edition. Nobody will believe you.',
    shirtColors: 'Black shirt',
    previewBg: 'dark',
    image: desertGold,
    thumb: desertGoldThumb,
    glow: ['#DDAA37', '#F6EBD2'],
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

/**
 * Shown as a planned price only — not an offer, nothing can be paid.
 * US dollars only: the shirts ship worldwide from a print partner in the US.
 * Shipping comes on top.
 */
export const plannedPrice = '$29';

export const interestPath = (motif: string, size: string) => `/shirts/interest/${motif}/${size}/`;

/** True once every motif links to the print partner's shop. */
export const shopLive = motifs.every((m) => Boolean(m.shopUrl));

export const NOTIFY_EMAIL = 'info@pattaya.love';
