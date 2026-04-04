# Stitch Design Prompts für pattaya.love

## Globale Design-Anweisungen (bei jedem Prompt voranstellen)

```
Role: You are a senior web designer and SEO expert specializing in high-converting affiliate and content platforms.

Brand: pattaya.love
Tagline: "Your Ultimate Pattaya Guide"

Design System:
- Style: "Modern Tropical High-End" — premium lifestyle portal, NOT cheap tourist site
- Primary Background: Clean white (#FFFFFF) with light gray sections (#F8FAFC)
- Accent Color "Love-Pink": Vibrant coral/pink (#F43F5E) for all CTAs, highlights, and brand accents
- Text Primary: Deep anthracite (#1E293B) for headings and body
- Text Secondary: Slate gray (#64748B) for subtitles and meta info
- Dark Sections: Deep marine/navy (#0F172A) for hero sections, footer, and contrast blocks
- Typography: "Inter" for body text, "Montserrat" for headings — clean Sans-Serif only
- Layout: Mobile-First responsive design (80% of traffic is mobile/smartphone)
- Border Radius: Rounded corners (8px cards, 12px buttons)
- Spacing: Generous whitespace, breathable layout
- Images: Support for large hero images, drone photography, video backgrounds
- Icons: Lucide or Heroicons style — minimal, clean line icons

Navigation (sticky top bar):
- Logo "pattaya.love" (left) with .love in coral/pink
- Main nav items: Stay | Explore | Nightlife | Lifestyle & Expat | Community
- CTA button top-right: "Newsletter" in coral/pink
- Mobile: Hamburger menu with full-screen overlay

Footer:
- Dark navy background (#0F172A)
- 4 columns: About, Categories, Legal, Follow Us
- Newsletter signup form
- Social media icons
- "Made with ❤️ in Pattaya" tagline
- Copyright + legal links (Privacy, Imprint, Affiliate Disclosure)
```

---

## Prompt 1: Homepage

```
Design a homepage for pattaya.love — a modern, high-end affiliate travel and lifestyle portal for Pattaya, Thailand.

[PASTE GLOBAL DESIGN ANWEISUNGEN HERE]

Homepage sections (in order):

1. HERO SECTION (full-width, dark overlay on background image)
   - Large headline: "Discover Pattaya Like Never Before"
   - Subtitle: "Hotels, Nightlife, Hidden Gems & Expat Life — Your Complete Guide"
   - Search bar with tabs: "Hotels" | "Nightlife" | "Things to Do" | "Guides"
   - Background: Drone shot of Pattaya Bay (placeholder image)

2. FEATURED CATEGORIES (4 cards in a grid)
   - Stay (hotel icon) — "Find your perfect hotel"
   - Explore (compass icon) — "Tours, beaches & hidden gems"
   - Nightlife (music icon) — "Clubs, rooftops & party zones"
   - Lifestyle (briefcase icon) — "Visa, legal & expat guides"
   - Each card: icon, title, short description, subtle hover animation

3. TRENDING GUIDES (horizontal scroll on mobile, 3-column grid on desktop)
   - Card design: Large image, category badge, title, reading time, arrow link
   - Section title: "Trending Guides" with "View All" link

4. HOTEL COMPARISON WIDGET
   - Section title: "Top Hotels This Month"
   - Comparison table with 3 hotels side by side
   - Each: Image, name, star rating, price range, area badge, "Check Price" CTA button in coral/pink
   - Responsive: stacks vertically on mobile

5. AREA SPOTLIGHT (alternating image-left/text-right layout)
   - Walking Street, Soi 6, Jomtien Beach — each with:
   - Large image, area name, short description, "Explore Area" button
   - Badge showing number of venues/hotels in that area

6. LATEST ARTICLES (3-column blog grid)
   - Card: Image, category badge, title, excerpt (2 lines), author avatar + name, date
   - "View All Articles" button below

7. NEWSLETTER SECTION (full-width coral/pink gradient background)
   - Headline: "Get Pattaya Insider Tips"
   - Subtitle: "Weekly updates on deals, events & hidden gems"
   - Email input + Subscribe button (white on pink)
   - Small trust text: "Join 5,000+ readers. No spam."

8. FOOTER (as described in global design system)

Important: Make the design feel premium and trustworthy, not like a typical SEO niche site. Think Airbnb meets travel magazine.
```

---

## Prompt 2: Hotel/Stay Listing Page

```
Design a hotel listing page for pattaya.love/stay — the accommodation section of a premium Pattaya travel portal.

[PASTE GLOBAL DESIGN ANWEISUNGEN HERE]

Page layout:

1. PAGE HEADER
   - Breadcrumb: Home > Stay
   - Title: "Best Hotels in Pattaya 2026"
   - Subtitle: "Handpicked hotels from budget to luxury — all guest-friendly"
   - Filter bar below: Area (Walking Street, Soi 6, Jomtien, Naklua) | Price Range (Budget, Mid-Range, Luxury) | Sort By (Rating, Price)

2. RESULTS GRID (2 columns desktop, 1 column mobile)
   - Hotel card design:
     - Large image (16:9 ratio) with area badge overlay (top-left)
     - Hotel name (h3)
     - Star rating (visual stars + number)
     - Price range badge (color-coded: green=budget, blue=mid, gold=luxury)
     - Key amenities as small icon chips (Pool, Spa, WiFi, etc.)
     - 2-line description excerpt
     - Two buttons side by side: "Read Review" (outline) + "Check Price" (coral/pink filled)

3. SIDEBAR (desktop only, sticky)
   - "Quick Pick" box: Top 3 hotels with mini cards
   - "Compare Hotels" CTA
   - Affiliate banner slot (300x250)
   - "Need Help?" contact card

4. PAGINATION (bottom)
   - Simple numbered pagination with prev/next

Make the cards scannable and optimized for quick decision-making. Affiliate CTAs should be prominent but not aggressive.
```

---

## Prompt 3: Single Hotel Review Page

```
Design a single hotel review page for pattaya.love — a detailed, SEO-optimized hotel review with affiliate conversion elements.

[PASTE GLOBAL DESIGN ANWEISUNGEN HERE]

Page layout:

1. HERO SECTION
   - Full-width hotel image with dark gradient overlay
   - Hotel name (h1), star rating, area badge
   - Price range indicator
   - "Check Latest Price" CTA button (coral/pink, prominent)
   - Breadcrumb above: Home > Stay > [Hotel Name]

2. QUICK-CHECK INFO BOX (right below hero, card with light background)
   - Grid layout showing: Price Range | Area | Rating | Guest-Friendly (Yes/No) | WiFi | Pool
   - Each as icon + label + value — scannable at a glance

3. TABLE OF CONTENTS (sticky left sidebar on desktop, collapsible on mobile)
   - Auto-generated from h2 headings
   - Highlights current section while scrolling

4. ARTICLE BODY
   - Clean typography, generous line-height
   - H2 sections: Overview, Location, Rooms, Amenities, Nightlife Access, Pros & Cons, Our Verdict
   - Embedded Google Map (iframe placeholder)
   - Image gallery (lightbox-style)
   - Pro/Con box: Two-column with green checkmarks and red X marks

5. RATING BOX (styled card)
   - Overall rating (large number + circular progress)
   - Sub-ratings as horizontal bars: Location, Value, Rooms, Service, Nightlife Access
   - Each bar color-coded (green/yellow/red)

6. STICKY BOTTOM BAR (mobile only)
   - Hotel name (truncated), rating, "Check Price" button
   - Fixed to bottom of screen, appears after scrolling past hero

7. COMPARISON TABLE (below article)
   - "Compare with similar hotels"
   - Table: Hotel | Rating | Price | Area | Guest-Friendly | CTA
   - 3-4 rows with alternating background colors

8. AUTHOR BOX (EEAT signal)
   - Avatar, name, "Written by a Local Expat since [year]"
   - Short bio (2 lines)
   - Link to author's other reviews

9. RELATED ARTICLES
   - "More Hotels in [Area]" — 3 card grid
   - Same card design as listing page

Make the affiliate CTAs naturally integrated, not pushy. The page should feel like reading a trusted friend's recommendation.
```

---

## Prompt 4: Nightlife Venue Page

```
Design a nightlife venue detail page for pattaya.love — a stylish, informative page for bars and clubs in Pattaya.

[PASTE GLOBAL DESIGN ANWEISUNGEN HERE]

Override for this page: Use the dark navy (#0F172A) as primary background with white text for a nightlife atmosphere. Coral/pink accents remain for CTAs.

Page layout:

1. HERO SECTION (dark, moody)
   - Full-width venue photo with subtle gradient
   - Venue name (h1), venue type badge ("GoGo Bar" / "Rooftop" / "Club")
   - Area badge: "Walking Street"
   - Rating: X.X/10 with star visualization
   - Opening hours pill

2. QUICK-CHECK BOX (dark card, slightly lighter than background)
   - Grid: Price Level (₿/₿₿/₿₿₿) | Beer Price | Area | Opening Hours | Dresscode | Vibe
   - All with subtle icons

3. TABLE OF CONTENTS (same as hotel, but adapted to dark theme)

4. ARTICLE BODY (dark theme)
   - Sections: The Vibe, What to Expect, Drinks & Prices, Our Rating, Tips for First-Timers
   - Image gallery with moody, atmospheric photos
   - Pull-quote style highlight boxes for key tips

5. RATING BREAKDOWN (dark card)
   - Overall rating (large)
   - Sub-ratings: Dancers/Entertainment, Staff & Service, Atmosphere, Value for Money
   - Horizontal progress bars in coral/pink on dark background

6. GOOGLE MAP EMBED
   - Dark-themed map (if possible) or standard with rounded corners

7. "NEARBY VENUES" SECTION
   - Horizontal scroll of venue cards (dark cards with venue image, name, type, rating)
   - "Explore all [Area] venues" link

8. AUTHOR BOX + RELATED ARTICLES (adapted to dark theme)

The design should feel exclusive and sophisticated — like a nightlife magazine, not a tourist directory.
```

---

## Prompt 5: Guide/Blog Article Page

```
Design a long-form guide/blog article page for pattaya.love — optimized for readability, SEO, and affiliate conversions.

[PASTE GLOBAL DESIGN ANWEISUNGEN HERE]

Page layout:

1. ARTICLE HEADER
   - Breadcrumb: Home > [Category] > [Title]
   - Category badge (colored pill)
   - Title (h1) — large, bold
   - Meta: Author avatar + name, publish date, updated date, reading time
   - Hero image (full-width, 21:9 aspect ratio)

2. STICKY TABLE OF CONTENTS (left sidebar desktop, top collapsible mobile)
   - Auto-generated from h2/h3 headings
   - Active section highlighting
   - Progress indicator (thin bar showing scroll progress)

3. ARTICLE BODY (centered, max-width 720px)
   - Clean typography, 1.7 line-height, 18px font size
   - Support for these content blocks:
     a. "Quick-Check" info box (light gray card with key facts)
     b. "Pro Tip" callout box (coral/pink left border)
     c. Comparison table (striped rows, CTA buttons)
     d. Image with caption
     e. Embedded Google Map
     f. FAQ accordion section
     g. "Book Now" affiliate CTA card (prominent, with hotel/tour image + price + button)

4. AUTHOR BOX (after article)
   - Large format: photo, name, title "Local Expat & Pattaya Expert"
   - Short bio + link to all articles by this author
   - EEAT trust signal

5. FAQ SECTION (if applicable)
   - Accordion-style, Schema.org FAQ markup ready
   - Clean expand/collapse animation

6. RELATED ARTICLES
   - "Continue Reading" — 3 cards from same silo/category
   - Same card design as homepage blog grid

7. NEWSLETTER CTA (full-width section, same as homepage)

8. COMMENTS or CTA SECTION
   - "Have questions? Join our community" with link to community/social

Mobile: The sticky TOC becomes a floating "Contents" button that opens an overlay. The sticky bottom CTA bar shows on relevant affiliate articles.
```

---

## Prompt 6: Area/Category Overview Page

```
Design an area overview page for pattaya.love (e.g., /walking-street/) — a hub page that links to all venues, hotels, and guides in a specific area.

[PASTE GLOBAL DESIGN ANWEISUNGEN HERE]

Page layout:

1. HERO SECTION
   - Full-width area photo (e.g., Walking Street at night)
   - Area name (h1): "Walking Street"
   - Short description (2 lines)
   - Stats bar: "12 Venues | 8 Hotels | 5 Guides"

2. EMBEDDED MAP
   - Google Map showing the area with pins for all venues/hotels
   - Clickable pins that show mini-cards

3. VENUE LISTINGS
   - Section title: "Nightlife on Walking Street"
   - Grid of venue cards (2 columns desktop, 1 mobile)
   - Sort/filter options: Type (GoGo, Club, Bar), Rating, Price Level

4. HOTEL LISTINGS
   - Section title: "Where to Stay Near Walking Street"
   - Horizontal scroll of hotel cards with "View All" link

5. GUIDES & ARTICLES
   - Section title: "Walking Street Guides"
   - List-style article cards: Image left, title + excerpt right, arrow link

6. INSIDER TIPS BOX
   - Styled card with coral/pink accent
   - "Walking Street Tips" — bullet list of quick tips
   - Icon-enhanced tips (clock icon for "Best time to visit: 11 PM - 1 AM")

7. NEWSLETTER + FOOTER

This page is a pillar/hub page — design it to feel comprehensive and authoritative. Every section should link deeper into the silo.
```

---

## Nutzungshinweis

Kopiere den "Globale Design-Anweisungen" Block und setze ihn am Anfang jedes einzelnen Prompts ein, wo [PASTE GLOBAL DESIGN ANWEISUNGEN HERE] steht. So bleibt das Design über alle Seiten konsistent.

Reihenfolge zum Designen:
1. Homepage (Prompt 1)
2. Guide/Blog Article (Prompt 5) — wird am häufigsten gesehen
3. Hotel Review (Prompt 3) — wichtigste Conversion-Seite
4. Nightlife Venue (Prompt 4)
5. Area Overview (Prompt 6)
6. Hotel Listing (Prompt 2)
