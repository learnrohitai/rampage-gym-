export const SITE = {
  eventName: "RICELA MR. INDIA",
  eventTagline: "The Ultimate Battle For The Iron Crown",
  gym: {
    name: "Rampage Gym",
    tagline: "Forge Your Legacy",
  },
  organizedBy: "Rampage Gym",
  eventDate: "18 October 2026",
  // ISO date used by the hero countdown (YYYY-MM-DD)
  eventDateISO: "2026-10-18T00:00:00+05:30",
  venue: "MGM Public School, Urban Estate Phase 1, Dugri",
  city: "Ludhiana, Punjab",
  contactPhone: "9814480965",
  instagram: "https://instagram.com/rampage_gym",
  registrationOpens: "5 October 2026",
  // ISO date the hero countdown counts down to (YYYY-MM-DD)
  registrationDeadlineISO: "2026-10-10T23:59:00+05:30",
  registrationDeadline: "10 October 2026",
  entryFee: 3500,
  upiId: "flex303-3@okhdfcbank",
  payeeName: "Rampage Gym",
  // Put your real QR code image at /public/rampage-qr.jpeg
  qrImage: "/rampage-qr.jpeg",
};

// One-tap UPI deep link: opens GPay / PhonePe / Paytm with all details pre-filled
export function upiPayUrl(amount: number = SITE.entryFee, note?: string): string {
  const params = [
    `pa=${encodeURIComponent(SITE.upiId)}`,
    `pn=${encodeURIComponent(SITE.payeeName)}`,
    `am=${amount}`,
    "cu=INR",
    `tn=${encodeURIComponent(note ?? `${SITE.eventName} Entry Fee`)}`,
  ];
  return `upi://pay?${params.join("&")}`;
}

export const PRIZES = [
  {
    place: "1st",
    title: "Champion",
    reward: "₹51,000 + Trophy + Supplement Hamper",
    accent: "from-amber-300 via-yellow-500 to-amber-700",
    icon: "trophy",
  },
  {
    place: "2nd",
    title: "Runner Up",
    reward: "₹21,000 + Trophy + Supplement Hamper",
    accent: "from-slate-200 via-slate-400 to-slate-600",
    icon: "medal",
  },
  {
    place: "3rd",
    title: "2nd Runner Up",
    reward: "₹11,000 + Trophy",
    accent: "from-orange-300 via-orange-500 to-amber-800",
    icon: "award",
  },
];

export const SCHEDULE = [
  {
    date: "5 Oct 2026",
    title: "Registration Opens",
    desc: "Entries open — lock your spot before your weight class fills up.",
  },
  {
    date: "10 Oct 2026",
    title: "Registration Closes",
    desc: "Last date to submit your entry online with payment.",
  },
  {
    date: "17 Oct 2026",
    title: "Check-in & Weigh-in",
    desc: "Report at venue with ID proof. Height & weight verification.",
  },
  {
    date: "18 Oct 2026 • 9 AM",
    title: "Prelims — All Categories",
    desc: "Physique rounds & mandatory poses for every division.",
  },
  {
    date: "18 Oct 2026 • 6 PM",
    title: "Grand Finals",
    desc: "Top athletes battle on the main stage under the lights.",
  },
];

export const FAQS = [
  {
    q: "Who can participate in Ricela Mr. India?",
    a: "Any Indian citizen aged 18 or above with a valid government ID. Athletes above 35 years may also enter the Masters Bodybuilding division.",
  },
  {
    q: "Can I participate in more than one category?",
    a: "Yes! You can register for multiple categories. Complete a separate registration for each — you get 50% off on the second entry.",
  },
  {
    q: "What documents do I need at check-in?",
    a: "Carry a government photo ID (Aadhaar / PAN / Driving License), your payment reference / screenshot, and your registration confirmation.",
  },
  {
    q: "How will I know my registration is confirmed?",
    a: "After paying via the QR code, upload the payment screenshot — and add the payment reference number (UTR) if you have it. The Rampage Gym team verifies it in the dashboard and your status changes to Confirmed.",
  },
  {
    q: "What are the judging criteria?",
    a: "Muscle mass, symmetry, conditioning, posing presentation and stage confidence — judged by certified IFBB-style judges.",
  },
  {
    q: "Is there a doping test?",
    a: "Yes, random doping tests may be conducted. Participants must sign a fair-play declaration at check-in.",
  },
  {
    q: "Can I get a refund if I can't attend?",
    a: "Entry fees are non-refundable, but you may transfer your entry to another athlete until 5 days before the event.",
  },
];

export const RULES = [
  "Valid government photo ID mandatory at weigh-in.",
  "Entry fee is non-refundable once paid.",
  "Posing trunks must be plain, solid color (no logos) for bodybuilding.",
  "Board shorts for Men's Physique; barefoot or as instructed.",
  "Report 90 minutes before your category is called.",
  "Judges' decision is final in all rounds.",
  "Any misconduct on stage leads to immediate disqualification.",
  "Tanning oil / paint allowed, must be applied backstage only.",
];
