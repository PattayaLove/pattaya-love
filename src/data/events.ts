/**
 * Pattaya events calendar — the single source for /events/ and the "What's on"
 * strip on the homepage.
 *
 * Rules for adding an entry:
 * - Only dates that a named source actually states. Link that source.
 * - `status: 'expected'` when the organiser has not confirmed the dates yet,
 *   `'programme-tba'` when the dates are firm but the programme is not out.
 * - Dates are local Pattaya dates (YYYY-MM-DD). Past events drop off
 *   automatically: at build time, and again in the browser for visitors who
 *   land on an older build.
 */

export type EventStatus = 'confirmed' | 'programme-tba' | 'expected';

export interface PattayaEvent {
  id: string;
  name: string;
  /** YYYY-MM-DD, local date */
  startDate: string;
  /** YYYY-MM-DD, local date (same as startDate for one-day events) */
  endDate: string;
  venue: string;
  /** Postal-style address for schema.org; keep it to what the source supports. */
  address: string;
  description: string;
  status: EventStatus;
  free?: boolean;
  /** Internal guide, if we have one */
  guide?: { href: string; label: string };
  source: { label: string; url: string };
}

export const events: PattayaEvent[] = [
  {
    id: 'diwali-2026',
    name: 'Diwali Pattaya Festival of Lights 2026',
    startDate: '2026-11-13',
    endDate: '2026-11-15',
    venue: 'Central Pattaya Beach',
    address: 'Pattaya Beach Road, Pattaya, Chon Buri, Thailand',
    description:
      'Three days of Diwali celebrations on the beachfront, organised by Pattaya City with the Thai-Indian Business Association of Pattaya: lights, cultural performances and festive activities.',
    status: 'confirmed',
    source: {
      label: 'Pattaya Mail, 4 Nov 2026',
      url: 'https://www.pattayamail.com/latestnews/news/pattaya-prepares-for-diwali-festival-at-central-beach-from-november-13-15-570070',
    },
  },
  {
    id: 'coffee-on-the-beach-2026',
    name: 'Chonburi Coffee on the Beach 2026',
    startDate: '2026-11-13',
    endDate: '2026-11-15',
    venue: 'Central Pattaya Beach, opposite Hard Rock Hotel Pattaya',
    address: 'Pattaya Beach Road, Pattaya, Chon Buri, Thailand',
    description:
      'Free coffee festival, daily 07:00–21:00: specialty coffee from across Thailand, workshops, talks, arts and crafts, and free concerts on the beach.',
    status: 'confirmed',
    free: true,
    source: {
      label: 'Pattaya Mail, 7 Nov 2026',
      url: 'https://www.pattayamail.com/latestnews/news/chonburi-coffee-on-the-beach-returns-to-pattaya-november-13-15-571136',
    },
  },
  {
    id: 'loy-krathong-2026',
    name: 'Loy Krathong 2026',
    startDate: '2026-11-24',
    endDate: '2026-11-24',
    venue: 'Lan Pho Public Park, Naklua (Koh Larn: 23–24 Nov, in front of Wat Mai Samran)',
    address: 'Lan Pho Public Park, Naklua, Bang Lamung District, Chon Buri, Thailand',
    description:
      "Pattaya City's main Loy Krathong celebration on the full-moon night, with a krathong competition using natural materials and the Little Noppamas contest. Koh Larn holds an eco-themed two-day programme.",
    status: 'confirmed',
    guide: { href: '/guides/loy-krathong-pattaya-2026/', label: 'Loy Krathong guide' },
    source: {
      label: 'The Pattaya News, 12 Oct 2026',
      url: 'https://thepattayanews.com/pattaya-prepares-for-loy-krathong-2026-celebrations-at-lan-pho-park-and-koh-larn/',
    },
  },
  {
    id: 'fireworks-2026',
    name: 'Pattaya International Fireworks Festival 2026',
    startDate: '2026-11-27',
    endDate: '2026-11-28',
    venue: 'Pattaya Beach (main stage: Central Pattaya Beach)',
    address: 'Pattaya Beach Road, Pattaya, Chon Buri, Thailand',
    description:
      'Two free nights of fireworks from Japan, Italy, the Philippines, Malaysia and Finland, with concerts between the displays. First display 19:45; Beach Road closed as far as Walking Street.',
    status: 'confirmed',
    free: true,
    guide: { href: '/guides/pattaya-fireworks-festival-2026/', label: 'Fireworks guide' },
    source: {
      label: 'TAT Newsroom, 29 Oct 2026',
      url: 'https://www.tatnews.org/2026/10/november-event-and-calendar/',
    },
  },
  {
    id: 'wonderfruit-2026',
    name: 'Wonderfruit 2026',
    startDate: '2026-12-03',
    endDate: '2026-12-07',
    venue: 'The Fields at Siam Country Club',
    address: 'Siam Country Club, Chon Buri, Thailand',
    description:
      'Five days of music, art, food, talks and camping inland from Pattaya. Main passes are sold out online; at-door prices are listed, subject to availability.',
    status: 'confirmed',
    guide: { href: '/guides/wonderfruit-2026/', label: 'Wonderfruit guide' },
    source: { label: 'Wonderfruit (official)', url: 'https://wonderfruit.co/tickets' },
  },
  {
    id: 'tomorrowland-2026',
    name: 'Tomorrowland Thailand 2026',
    startDate: '2026-12-11',
    endDate: '2026-12-13',
    venue: 'Wisdom Valley, Khao Mai Kaeo',
    address: '188/5 Moo 1, Khao Mai Kaeo, Bang Lamung District, Chonburi 20150, Thailand',
    description:
      "Tomorrowland's first edition in Thailand. Sold out; only the official waiting list and Ticket Exchange remain.",
    status: 'confirmed',
    guide: { href: '/guides/tomorrowland-pattaya-2026/', label: 'Tomorrowland guide' },
    source: { label: 'Tomorrowland (official)', url: 'https://www.tomorrowland.com' },
  },
  {
    id: 'countdown-2027',
    name: 'Pattaya Countdown 2027',
    startDate: '2026-12-29',
    endDate: '2026-12-31',
    venue: 'Pattaya Beach',
    address: 'Pattaya Beach Road, Pattaya, Chon Buri, Thailand',
    description:
      "The city's New Year countdown on the beachfront, with Christmas events at hotels, malls and restaurants throughout December. Line-up and programme not announced yet.",
    status: 'programme-tba',
    guide: { href: '/guides/christmas-new-year-pattaya/', label: 'Christmas & New Year guide' },
    source: {
      label: 'Pattaya Mail, 11 Nov 2026',
      url: 'https://www.pattayamail.com/latestnews/news/pattaya-may-get-cooler-but-its-warm-welcome-never-goes-cold-571493',
    },
  },
  {
    id: 'unkonscious-2027',
    name: 'UnKonscious Festival 2027',
    startDate: '2027-01-28',
    endDate: '2027-01-31',
    venue: 'Alexa Beach Club, Na Jomtien (main festival 29–30 Jan)',
    address: 'Alexa Beach Club, Soi Na Jomtien 8, Na Chom Thian, Sattahip District, Chon Buri 20250, Thailand',
    description:
      "Tenth-anniversary edition of the trance festival: boat party on 28 Jan, beach festival at Alexa Beach Club on 29–30 Jan with after-parties, and a closing party on 31 Jan.",
    status: 'confirmed',
    source: { label: 'Ticketmelon (official ticketing)', url: 'https://www.ticketmelon.com/unkonscious/unk27' },
  },
  {
    id: 'burapa-bike-week-2027',
    name: 'Burapa Pattaya Bike Week 2027',
    startDate: '2027-02-04',
    endDate: '2027-02-06',
    venue: 'Pattaya — venue to be confirmed',
    address: 'Pattaya, Chon Buri, Thailand',
    description:
      "The 30th anniversary of Thailand's biggest motorcycle festival. Dates expected, not yet confirmed by the organiser, the Burapa Motorcycle Club.",
    status: 'expected',
    source: { label: 'pattayabikeweek.com', url: 'https://www.pattayabikeweek.com/' },
  },
];

/** Today's date in Pattaya as YYYY-MM-DD. */
export const pattayaToday = (now: Date = new Date()): string =>
  now.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

/** Events that have not ended yet, soonest first. */
export const upcomingEvents = (today: string = pattayaToday()): PattayaEvent[] =>
  events
    .filter((e) => e.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "24 November 2026", "13–15 November 2026", "28 November – 1 December 2026", "29 Dec 2026 – 2 Jan 2027" */
export const formatEventDates = (e: Pick<PattayaEvent, 'startDate' | 'endDate'>): string => {
  const [sy, sm, sd] = e.startDate.split('-').map(Number);
  const [ey, em, ed] = e.endDate.split('-').map(Number);
  const S = MONTHS[sm - 1];
  const E = MONTHS[em - 1];
  if (e.startDate === e.endDate) return `${sd} ${S} ${sy}`;
  if (sy === ey && sm === em) return `${sd}–${ed} ${S} ${sy}`;
  if (sy === ey) return `${sd} ${S} – ${ed} ${E} ${sy}`;
  return `${sd} ${S} ${sy} – ${ed} ${E} ${ey}`;
};

export const statusLabel: Record<EventStatus, string | null> = {
  confirmed: null,
  'programme-tba': 'Programme to follow',
  expected: 'Expected, not yet confirmed',
};
