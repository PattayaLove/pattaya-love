/**
 * Shared copy generator for hotel pages.
 *
 * Every generated page used to carry the same four paragraphs with only the
 * hotel name swapped, which made them duplicates of each other. This module
 * builds the body and meta description from the data we actually hold, plus
 * factual notes about each area, so no two pages read alike.
 *
 * Rules:
 *  - Never invent hotel-specific facts. Rooms, pools and service levels are
 *    not in the source data, so nothing here claims anything about them.
 *  - Never claim a guest policy we have not verified.
 *  - Selection is deterministic (hash of the slug), so re-running produces
 *    byte-identical output and the script stays idempotent.
 *
 * Used by import-hotels.mjs (new imports) and rewrite-hotel-copy.mjs
 * (existing files). Keep them pointed here rather than forking the text.
 */

import { createHash } from 'node:crypto';

/** Deterministic choice — same slug always yields the same variant. */
function pick(slug, salt, options) {
  const h = createHash('md5').update(`${slug}|${salt}`).digest('hex');
  return options[parseInt(h.slice(0, 8), 16) % options.length];
}

/** Street part of an address, without locality, postcode or country. */
export function streetOnly(addr = '') {
  return addr
    .replace(/,?\s*(Thailand|TH)\s*$/i, '')
    .replace(/,?\s*\d{5}\s*$/, '')
    .replace(/,?\s*(Chon\s?Buri|Chonburi)\s*$/i, '')
    .replace(/,?\s*Pattaya\s*$/i, '')
    .replace(/[\s,]+$/, '')
    .trim();
}

/** Always format review counts in English — toLocaleString() follows the host locale. */
const num = (n) => Number(n || 0).toLocaleString('en-US');

// ── Area notes: factual, no hotel-specific claims ──
const AREA = {
  'Central Pattaya': [
    'Central Pattaya puts Central Festival, the Beach Road promenade and the bar strips along Soi Buakhao within a short baht bus ride. Songthaews run the Beach Road–Second Road loop for 15 baht, which makes getting around without a scooter straightforward.',
    'The central district sits between Beach Road and Third Road, with Central Festival mall as the main landmark. Walking Street is roughly ten minutes south by baht bus, and the Soi Buakhao area with its night market is a short walk inland.',
    'Central Pattaya is the most connected part of the city: shopping at Central Festival, the beach a few blocks west, and the Soi Buakhao bar area inland. Baht buses circulate constantly along the one-way Beach Road–Second Road loop.',
  ],
  Jomtien: [
    'Jomtien lies south of Pattaya Bay and is noticeably calmer than the city centre. The beach here is longer and cleaner, the promenade is lined with seafood restaurants, and Jomtien Night Market runs in the evenings.',
    'Jomtien trades nightlife density for a quieter, wider stretch of sand. It is popular with families and long-stay visitors, and a baht bus into central Pattaya takes about fifteen minutes along Thappraya Road.',
    'The Jomtien area offers a more relaxed base than central Pattaya, with a long beachfront road, plenty of local restaurants and easy access over Pratumnak Hill into the city centre.',
  ],
  'Beach Road': [
    'Beach Road runs the full length of Pattaya Bay, with the sand and the palm-lined promenade directly opposite. Baht buses head south along this road towards Walking Street and the Bali Hai pier.',
    'The Beach Road strip places the bay directly in front of you and the shopping and dining of Second Road one block inland. It is the most walkable part of the city for anyone who wants the sea close by.',
    'Sitting on Beach Road means direct access to the promenade and the three-kilometre stretch of Pattaya Bay, with the Second Road shops and restaurants immediately behind.',
  ],
  'Soi Buakhao': [
    'Soi Buakhao runs inland parallel to Second Road and is one of the busiest budget areas in the city, lined with open-air bars, guesthouses and street food. Buakhao Market and the Soi Diana junction are both within walking distance.',
  ],
  'South Pattaya': [
    'South Pattaya covers the stretch towards Walking Street and the Bali Hai pier, where the ferries to Koh Larn depart. It is the densest part of the city for nightlife while still being walkable to the southern end of the beach.',
  ],
  'Soi 6': [
    'Soi 6 is a short street running between Beach Road and Second Road in north Pattaya, known almost entirely for its bar scene. The beach is at the western end, and Central Pattaya is a few minutes south by baht bus.',
  ],
  'Walking Street': [
    'Walking Street is the pedestrianised nightlife strip at the southern end of Pattaya Bay, closed to traffic from early evening. The Bali Hai pier sits at its far end, and the area is at its loudest between 9pm and 2am.',
  ],
  'Pratumnak Hill': [
    'Pratumnak Hill sits between Pattaya and Jomtien, quieter than both and home to Cosy Beach and the Wat Phra Yai viewpoint. Getting to either centre means a short baht bus ride rather than a walk.',
  ],
  'Na Jomtien': [
    'Na Jomtien is the stretch south of Jomtien proper, where the coast opens out and development thins. It is the quietest coastal option in the area, though you will want transport for trips into the city.',
  ],
  'North Pattaya': [
    'North Pattaya covers the area around Dolphin Roundabout and the Terminal 21 mall, with the bus terminal to Bangkok close by. It is calmer than the centre while still on the main baht bus routes.',
  ],
};
const AREA_FALLBACK = [
  "The property sits within Pattaya's main urban area, with the beach, shopping and the city's nightlife districts all reachable by baht bus.",
];

const PRICE_LABEL = { budget: 'budget', 'mid-range': 'mid-range', luxury: 'upper-tier' };

function overview({ name, area, category, priceRange, rating, reviewsCount, slug }) {
  const r = Number(rating);
  const n = Number(reviewsCount || 0);
  const label = PRICE_LABEL[priceRange] || priceRange;
  const kind = (category || 'Hotel').toLowerCase();

  let band;
  if (r >= 4.5) band = pick(slug, 'b', ['rates consistently well with guests', 'holds one of the stronger guest scores in its bracket', 'reviews well across the board']);
  else if (r >= 4.0) band = pick(slug, 'b', ['reviews solidly', 'holds a dependable guest score', 'rates well overall']);
  else if (r >= 3.5) band = pick(slug, 'b', ['reviews reasonably', 'sits mid-table on guest scores', 'holds an average guest score']);
  else band = pick(slug, 'b', ['reviews unevenly', 'sits below average on guest scores', 'draws mixed feedback']);

  let vol;
  if (n >= 3000) vol = `a large sample of ${num(n)} Google reviews`;
  else if (n >= 500) vol = `${num(n)} Google reviews`;
  else if (n >= 50) vol = `a moderate ${num(n)} Google reviews`;
  else vol = `only ${num(n)} Google reviews so far, so treat the score as provisional`;

  const score = r.toFixed(1);
  return pick(slug, 'o', [
    `${name} is a ${label} ${kind} in the ${area} area. It ${band}, based on ${vol} (${score}/5).`,
    `Set in the ${area} area, ${name} is a ${label} ${kind}. It ${band} — ${score}/5 from ${vol}.`,
    `Rated ${score}/5 from ${vol}, ${name} ${band} among ${label} ${kind}s in the ${area} area.`,
  ]);
}

function location({ area, street, slug }) {
  const st = streetOnly(street);
  let opening;
  if (!st) {
    opening = pick(slug, 'l', [`The hotel is in the ${area} area.`, `It sits in the ${area} area.`, `The property is located in ${area}.`]);
  } else if (st.toLowerCase().includes(area.split(' ')[0].toLowerCase())) {
    opening = pick(slug, 'l', [`The hotel is at ${st}.`, `You will find it at ${st}.`, `The address is ${st}.`]);
  } else {
    opening = pick(slug, 'l', [`The hotel is at ${st}, in ${area}.`, `You will find it at ${st} in ${area}.`, `The address is ${st}, ${area}.`]);
  }
  return `${opening} ${pick(slug, 'a', AREA[area] || AREA_FALLBACK)}`;
}

function gettingThere({ area, slug }) {
  const base = pick(slug, 't', [
    'Suvarnabhumi Airport is roughly 120 km north — about 90 minutes by taxi, or two hours on the scheduled airport coaches, which cost a fraction of a private car.',
    'Most visitors arrive via Suvarnabhumi Airport, around 90 minutes away by taxi. Airport coaches run through the day and are the cheaper option. U-Tapao, south of the city, is closer at roughly 45 minutes.',
    'From Bangkok, buses to Pattaya leave Ekkamai terminal throughout the day. From Suvarnabhumi Airport a taxi takes about 90 minutes, and U-Tapao is nearer still at around 45 minutes.',
  ]);
  const last = {
    Jomtien: ' Arriving from the north, ask to be dropped on Thappraya Road rather than at the main bus terminal — it saves an extra baht bus leg.',
    'Beach Road': ' Once in the city, the Beach Road baht bus loop runs one-way southbound, so the return leg goes via Second Road.',
    'Central Pattaya': ' The main bus terminal on North Pattaya Road is a short baht bus ride from here.',
    'Walking Street': ' The Bali Hai pier at the end of Walking Street is also where the Koh Larn ferries leave from.',
  }[area] || '';
  return base + last;
}

/** Deliberately does not assert a policy we have not checked. */
function guestPolicy({ name, slug }) {
  return pick(slug, 'g', [
    `Most Pattaya hotels are guest-friendly and admit visitors without a joiner fee, but we have not independently confirmed the policy for ${name}. Check directly with the property before booking if this matters to you.`,
    `We have no confirmed guest policy on file for ${name}. Guest-friendly arrangements are common in Pattaya, though some properties do charge a joiner fee — worth clarifying with reception or at the time of booking.`,
    `Policies vary by property and change over time. We have not verified whether ${name} charges a joiner fee, so confirm it directly if you need certainty.`,
  ]);
}

function rates({ priceRange, slug }) {
  const season = pick(slug, 's', [
    'High season runs November to February and carries the highest rates; June to September is the cheapest window, with rain most likely in the afternoons.',
    'Expect peak pricing between November and February. The low season from June to September brings the best rates alongside heavier afternoon rain.',
    'Rates peak over the November–February high season and drop noticeably from June to September, when the monsoon keeps demand down.',
  ]);
  const tier = {
    budget: 'At this end of the market, rates move less between seasons, but rooms in the cheapest brackets sell out first around Songkran and New Year.',
    'mid-range': 'Mid-range rates in Pattaya swing widely with the calendar, so booking dates either side of a public holiday can make a substantial difference.',
    luxury: 'Upper-tier properties discount most aggressively in the low season, which is when the gap to mid-range pricing narrows the most.',
  }[priceRange] || '';
  return `${season} ${tier}`.trim();
}

function tomorrowland({ name, area }) {
  const near = area.includes('Jomtien') || area.includes('South') || area.includes('Pratumnak');
  const where = near
    ? 'The Jomtien end of the bay is expected to be within easy reach of the festival grounds.'
    : 'The festival is expected to draw heavy demand across the whole of Pattaya, not just the areas closest to the site.';
  return `**Tomorrowland Thailand 2026** comes to Pattaya in November 2026. ${where} Accommodation across the city will book out well in advance for it, so if your trip overlaps with the festival dates, secure a room at ${name} early rather than close to the date.`;
}

const TOMORROWLAND_AREAS = ['Jomtien', 'Na Jomtien', 'Pratumnak Hill', 'South Pattaya'];

/** Full markdown body for a hotel page. */
export function buildBody(h) {
  const parts = [
    '## Overview', '', overview(h), '',
    '## Location', '', location(h), '',
  ];
  if (h.tomorrowland ?? TOMORROWLAND_AREAS.includes(h.area)) {
    parts.push('## Tomorrowland Thailand 2026', '', tomorrowland(h), '');
  }
  parts.push(
    '## Getting There', '', gettingThere(h), '',
    '## Guest-Friendly Policy', '', guestPolicy(h), '',
    '## Booking & Rates', '', rates(h), '',
  );
  return parts.join('\n').trimEnd() + '\n';
}

/** Meta description — unique per page, kept near the ~160 char display limit. */
export function buildDescription(h) {
  const { name, area, rating, reviewsCount, priceRange, slug } = h;
  const r = Number(rating).toFixed(1);
  const n = num(reviewsCount);
  const price = PRICE_LABEL[priceRange] || '';
  return pick(slug, 'd', [
    `${name} — ${r}/5 from ${n} Google reviews. Location in ${area}, guest policy and booking notes for 2026.`,
    `${name}, a ${price} stay in ${area}, Pattaya. Guest score ${r}/5 across ${n} reviews, plus season and booking notes.`,
    `${name} (${area}, Pattaya): ${r}/5 from ${n} reviews. Where it sits, how the area works and when rates are lowest.`,
  ]);
}
