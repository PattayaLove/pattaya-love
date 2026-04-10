import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const hotels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hotels' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    rating: z.number().min(0).max(5),
    reviewsCount: z.number().default(0),
    priceRange: z.enum(['budget', 'mid-range', 'luxury']),
    category: z.string().default('Hotel'),
    area: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    image: z.string().optional(),
    bookingUrl: z.string().url().optional(),
    agodaUrl: z.string().url().optional(),
    googleMapsUrl: z.string().optional(),
    amenities: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const venues = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/venues' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    type: z.enum(['gogo', 'beer-bar', 'club', 'restaurant', 'rooftop', 'other']),
    area: z.string(),
    image: z.string().optional(),
    priceLevel: z.number().min(1).max(3),
    openingHours: z.string().optional(),
    googleMapsUrl: z.string().url().optional(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const areas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/areas' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    image: z.string().optional(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    category: z.enum(['nightlife', 'hotels', 'transport', 'food', 'tips', 'general']),
    image: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { hotels, venues, areas, guides };
