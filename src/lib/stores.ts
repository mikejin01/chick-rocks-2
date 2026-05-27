export type DayHours = { open: number; close: number };

export type Store = {
  id: "flushing" | "astoria";
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  mapsUrl: string;
  orderUrl: string;
  hours: DayHours[];
};

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// hours: index 0 = Sunday ... 6 = Saturday. close > 24 means closes that many hours past
// midnight (next day) — e.g. 26 = 2 AM next day, 29 = 5 AM next day.
export const STORES: Store[] = [
  {
    id: "flushing",
    name: "Flushing",
    phone: "(347) 368-6181",
    addressLine1: "136-20 Roosevelt Ave #25",
    addressLine2: "Flushing, NY 11354",
    mapsUrl: "https://maps.google.com/?q=136-20+Roosevelt+Ave+%2325+Flushing+NY+11354",
    orderUrl: "https://pos.chowbus.com/online-ordering/store/chick-rocks/11843",
    hours: Array.from({ length: 7 }, () => ({ open: 10, close: 21.5 })),
  },
  {
    id: "astoria",
    name: "Astoria",
    phone: "(347) 242-3449",
    addressLine1: "30-02 Steinway St",
    addressLine2: "Astoria, NY 11103",
    mapsUrl: "https://maps.google.com/?q=30-02+Steinway+St+Astoria+NY+11103",
    orderUrl: "https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957",
    hours: [
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 26 },
      { open: 10, close: 29 },
      { open: 10, close: 29 },
    ],
  },
];

export const formatHour = (h: number): string => {
  const wrapped = h >= 24 ? h - 24 : h;
  const hour = Math.floor(wrapped);
  const min = Math.round((wrapped - hour) * 60);
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return min === 0
    ? `${display} ${period}`
    : `${display}:${min.toString().padStart(2, "0")} ${period}`;
};

export const formatRange = (h: DayHours) => `${formatHour(h.open)}–${formatHour(h.close)}`;

// Google Maps embed (no API key required) for a store's address — used for the
// checkout pickup map.
export const mapEmbedUrl = (store: Store) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(
    `${store.addressLine1}, ${store.addressLine2}`
  )}&z=15&output=embed`;

export type OpenStatus =
  | { open: true; activeHours: DayHours }
  | { open: false; nextWhen: "today" | "tomorrow"; nextHours: DayHours };

// Pickup time slots for a given calendar date, derived from that weekday's open
// hours. `value` is a decimal hour (may exceed 24 for past-midnight closes, e.g.
// 25.5 = 1:30 AM); `label` is the human display. Same-day slots are limited to at
// least `leadHours` from `now` so customers can't book a pickup in the past.
export type PickupSlot = { value: number; label: string };

export const getPickupSlots = (
  store: Store,
  dateStr: string,
  now: Date,
  leadHours = 1
): PickupSlot[] => {
  if (!dateStr) return [];
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return [];
  const date = new Date(y, m - 1, d);
  const { open, close } = store.hours[date.getDay()];

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const earliest = isToday ? now.getHours() + now.getMinutes() / 60 + leadHours : -Infinity;

  const slots: PickupSlot[] = [];
  for (let t = open; t <= close - 0.5; t += 0.5) {
    if (t < earliest) continue;
    slots.push({ value: t, label: formatHour(t) });
  }
  return slots;
};

export const getOpenStatus = (hours: DayHours[], now: Date): OpenStatus => {
  const day = now.getDay();
  const decHour = now.getHours() + now.getMinutes() / 60;
  const yIdx = (day + 6) % 7;

  if (hours[yIdx].close > 24 && decHour < hours[yIdx].close - 24) {
    return { open: true, activeHours: hours[yIdx] };
  }
  if (decHour >= hours[day].open && decHour < hours[day].close) {
    return { open: true, activeHours: hours[day] };
  }
  const todayNotYetOpen = decHour < hours[day].open;
  const nextIdx = todayNotYetOpen ? day : (day + 1) % 7;
  return {
    open: false,
    nextWhen: todayNotYetOpen ? "today" : "tomorrow",
    nextHours: hours[nextIdx],
  };
};
