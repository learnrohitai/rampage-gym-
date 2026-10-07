export type Lang = "en" | "hi" | "pa";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "pa", label: "ਪੰ" },
];

export const STORE_KEY = "ricela-lang";

export function getStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORE_KEY);
    if (v === "hi" || v === "pa") return v;
  } catch {
    /* ignore */
  }
  return "en";
}

export function setStoredLang(lang: Lang) {
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch {
    /* ignore */
  }
}

export const I18N: Record<string, Record<Lang, string | string[]>> = {
  "nav.home": { en: "Home", hi: "होम", pa: "ਹੋਮ" },
  "nav.categories": { en: "Categories", hi: "श्रेणियां", pa: "ਸ਼੍ਰੇਣੀਆਂ" },
  "nav.admin": { en: "Admin", hi: "व्यवस्थापक", pa: "ਐਡਮਿਨ" },
  "nav.register": { en: "Register Now", hi: "अभी पंजीकरण करें", pa: "ਅੱਜ ਹੀ ਰਜਿਸਟਰ ਕਰੋ" },
  "nav.logout": { en: "Logout", hi: "लॉग आउट", pa: "ਲਾਜ਼ ਆਉਟ" },
  "lang.title": { en: "Language", hi: "भाषा", pa: "ਭਾ਷ਾ" },

  "hero.tag": { en: "THE IRON CROWN AWAITS", hi: "लोहे का ताज़ इंतज़ार कर रहा है", pa: "ਲੋਹੇ ਦਾ ਤਾਜ਼ਾ ਇਤਨਾਈ ਉਪਸਥਿਤ ਹੈ" },
  "hero.headline1": { en: "RICELA", hi: "रिसेला", pa: "ਰਿਸੇਲਾ" },
  "hero.headline2": { en: "MR. INDIA", hi: "मिस्टर इंडिया", pa: "ਮਿਸਟਰ ਇੰਡੀਆ" },
  "hero.headlineYear": { en: "2026", hi: "2026", pa: "2026" },
  "hero.sub": { en: "Step Under The Lights", hi: "रोशनी के नीचे कदम रखें", pa: "ਰੋਸ਼ਨੀ ਦੇ ਨੀਚੇ ਕਦਮ ਰੱਖੋ" },
  "hero.meta": { en: "{date} • {city}", hi: "{date} • {city}", pa: "{date} • {city}" },
  "hero.opening": { en: "Registration Opens {opens} — Closes {closes}", hi: "पंजीकरण शुरू {opens} — बंद {closes}", pa: "ਰਜਿਸਟਰੇਸ਼ਨ ਸ਼ੁਰੂ {opens} — ਬੰਦ {closes}" },
  "hero.slogan": { en: "Forge Your Legacy", hi: "अपनी विरासत गढ़ें", pa: "ਆਪਣੀ ਵਿਰਾਸਤ ਗੜੋ" },
  "hero.cta1": { en: "Claim Your Spot", hi: "अपनी जगह लें", pa: "ਆਪਣਾ ਸਥਾਨ ਲਓ" },
  "hero.cta2": { en: "View Categories", hi: "श्रेणियां देखें", pa: "ਸ਼੍ਰੇਣੀਆਂ ਵੇਖੋ" },
  "hero.eventDate": { en: "{date}", hi: "{date}", pa: "{date}" },
  "hero.venue": { en: "{venue}, {city}", hi: "{venue}, {city}", pa: "{venue}, {city}" },
  "hero.limited": { en: "Limited entries per class", hi: "प्रति वर्ग सीमित प्रवेश", pa: "ਹਰ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਸੀਮਤ ਪ੍ਰਵੇਸ਼" },
  "hero.venue2": { en: "MGM Public School, Dugri Phase", hi: "एमजीएम पब्लिक स्कूल, दुग्गी फेज़", pa: "ਐਮਜੇਐਮ ਪਬਲਿਕ ਸਕੂਲ, ਡੁੱਗਰੀ ਫੇਜ਼" },

  "countdown.ends": { en: "REGISTRATION ENDS IN", hi: "पंजीकरण की अंतिम तारीख", pa: "ਰਜਿਸਟਰੇਸ਼ਨ ਦੀ ਆਖਰੀ ਮਿਤੀ" },
  "countdown.closed": { en: "REGISTRATION CLOSED", hi: "पंजीकरण बंद", pa: "ਰਜਿਸਟਰੇਸ਼ਨ ਬੰਦ" },
  "countdown.closes": { en: "Closes {date} • {event}", hi: "बंद {date} • {event}", pa: "ਬੰਦ {date} • {event}" },
  "countdown.registerNow": { en: "Register Now", hi: "अभी पंजीकरण करें", pa: "ਅੱਜ ਹੀ ਰਜਿਸਟਰ ਕਰੋ" },

  "categories.choose": { en: "CHOOSE YOUR BATTLE", hi: "अपना संघर्ष चुनें", pa: "ਆਪਣਾ ਸੰਗ੍ਰਾਮ ਚੁਣੋ" },
  "categories.title": { en: "COMPETITION CATEGORIES", hi: "प्रतियोगिता श्रेणियां", pa: "ਮੁਕਾਬਲੇ ਦੀਆਂ ਸ਼੍ਰੇਣੀਆਂ" },
  "categories.desc": {
    en: "Three divisions. Every level of athlete. Pick the one that fits your physique — the form adapts to your choice.",
    hi: "तीन विभाग। हर स्तर का एथलीट। वह चुनें जो आपके शरीर के अनुसार हो — फ़ॉर्म आपकी चुनाव के अनुसार बदलेगा।",
    pa: "ਤਿੰਨ ਵੰਡ। ਹਰ ਪੱਧਰ ਦਾ ਏਥਲੀਟ। ਉਹ ਚੁਣੋ ਜੋ ਤੁਹਾਡੇ ਸਰੀਰ ਨਾਲ ਮੇਲ ਖਾਏ — ਫਾਰਮ ਤੁਹਾਡੇ ਚੁਣਾਵ ਅਨੁਸਾਰ ਬਦਲ ਜਾਵੇਗਾ।",
  },
  "categories.register": { en: "Register {name}", hi: "{name} के लिए पंजीकरण करें", pa: "{name} ਲਈ ਰਜਿਸਟਰ ਕਰੋ" },
  "categories.feeTier": { en: "₹{one} / ₹{two} / ₹{three}", hi: "₹{one} / ₹{two} / ₹{three}", pa: "₹{one} / ₹{two} / ₹{three}" },
  "categories.feeLabel": { en: "1 / 2 / 3 categories", hi: "1 / 2 / 3 श्रेणियां", pa: "1 / 2 / 3 ਸ਼੍ਰੇਣੀਆਂ" },

  "cta.title": { en: "THE STAGE IS WAITING", hi: "मंच इंतज़ार कर रहा है", pa: "ਮੰਚ ਦੀ ਉਡੀਕ ਰਹੀ ਹੈ" },
  "cta.desc": {
    en: "Entry fee ₹{fee} per category. Limited slots per weight class — once full, registration closes.",
    hi: "प्रति श्रेणी प्रवेश शुल्क ₹{fee}। वजन वर्ग प्रति सीमित स्थान — एक बार भरने पर पंजीकरण बंद।",
    pa: "ਹਰ ਸ਼੍ਰੇਣੀ ਲਈ ਪ੍ਰਵੇਸ਼ ਫੀਸ ₹{fee}। ਵਜ਼ਨ ਸ਼੍ਰੇਣੀ ਪ੍ਰਤੀ ਸੀਮਤ ਸਲਾਟ — ਇੱਕ ਵਾਰ ਭਰਨ ਉੱਤੇ ਰਜਿਸਟਰੇਸ਼ਨ ਬੰਦ।",
  },
  "cta.register": { en: "Register Now", hi: "अभी पंजीकरण करें", pa: "ਅੱਜ ਹੀ ਰਜਿਸਟਰ ਕਰੋ" },
  "cta.rules": { en: "Read The Rules", hi: "नियम पढ़ें", pa: "ਨਿਯਮ ਪੜ੍ਹੋ" },

  "sticky.event": { en: "{event}", hi: "{event}", pa: "{event}" },
  "sticky.closes": { en: "₹{fee} • Closes {date}", hi: "₹{fee} • बंद {date}", pa: "₹{fee} • ਬੰਦ {date}" },
  "sticky.register": { en: "Register", hi: "पंजीकरण करें", pa: "ਰਜਿਸਟਰ ਕਰੋ" },

  "footer.rights": { en: "All rights reserved", hi: "सर्वाधिकार सुरक्षित", pa: "ਸਾਰੇ ਅਧੀਕਾਰ ਸੁਰੱਖਿਅਤ" },

  "steps.category.title": { en: "STEP 1 — CHOOSE CATEGORY", hi: "चरण 1 — श्रेणी चुनें", pa: "ਕਦਮ 1 — ਸ਼੍ਰੇਣੀ ਚੁਣੋ" },
  "steps.category.desc": {
    en: "Pick one, two, or three categories. The fee changes with the number you pick.",
    hi: "एक, दो, या तीन श्रेणियां चुनें। शुल्क आपके द्वारा चुनी गई संख्या के अनुसार बदलता है।",
    pa: "ਇੱਕ, ਦੋ, ਜਾਂ ਤਿੰਨ ਸ਼੍ਰੇਣੀਆਂ ਚੁਣੋ। ਫੀਸ ਤੁਹਾਡੇ ਦੁਆਰਾ ਚੁਣੀ ਗਈ ਗਿਣਤੀ ਅਨੁਸਾਰ ਬਦਲਦੀ ਹੈ।",
  },
  "steps.category.hint": {
    en: "Select up to 3 categories. Fee: ₹3,500 (1) · ₹6,000 (2) · ₹8,000 (3)",
    hi: "अधिकतम 3 श्रेणियां चुनें। शुल्क: ₹3,500 (1) · ₹6,000 (2) · ₹8,000 (3)",
    pa: "ਅੱਧਿਕ ਤੋਂ ਅੱਧਿਕ 3 ਸ਼੍ਰੇਣੀਆਂ ਚੁਣੋ। ਫੀਸ: ₹3,500 (1) · ₹6,000 (2) · ₹8,000 (3)",
  },
  "steps.category.selected": { en: "{count} category selected", hi: "{count} श्रेणी चुनी गई", pa: "{count} ਸ਼੍ਰੇਣੀ ਚੁਣੀ ਗਈ" },
  "steps.category.selectedPlural": { en: "{count} categories selected", hi: "{count} श्रेणियां चुनी गईं", pa: "{count} ਸ਼੍ਰੇਣੀਆਂ ਚੁਣੀਆਂ ਗਈਆਂ" },
  "steps.category.continue": { en: "Continue to Payment", hi: "भुगतान के लिए जारी रखें", pa: "ਭੁਗਤਾਨ ਲਈ ਜਾਰੀ ਰੱਖੋ" },

  "steps.payment.title": { en: "STEP 2 — PAY ENTRY FEE", hi: "चरण 2 — प्रवेश शुल्क भुगतान करें", pa: "ਕਦਮ 2 — ਪ੍ਰਵੇਸ਼ ਫੀਸ ਭੁਗਤਾਨ ਕਰੋ" },
  "steps.payment.descSingle": {
    en: "Tap Pay Now to open your UPI app directly, or scan the QR with GPay / PhonePe / Paytm — then continue to the form and submit your payment reference number.",
    hi: "पेई नाउ टैप करें तो आपका UPI ऐप सीधे खुलेगा, या QR को GPay / PhonePe / Paytm से स्कैन करें — फिर फ़ॉर्म पर जारी रखें और अपना भुगतान संदर्भ नंबर जमा करें।",
    pa: "ਪੇਅ ਨੌਂ ਟੈਪ ਕਰਨ ਉੱਤੇ ਤੁਹਾਡਾ UPI ਐਪ ਸਿੱਧੇ ਖੁੱਲੇਗਾ, ਜਾਂ QR ਨੂੰ GPay / PhonePe / Paytm ਨਾਲ ਸਕੇਨ ਕਰੋ — ਫਿਰ ਫਾਰਮ ਵੱਲ ਜਾਰੀ ਰੱਖੋ ਅਤੇ ਆਪਣਾ ਭੁਗਤਾਨ ਸੰਦਰਭ ਨੰਬਰ ਜਮਾ ਕਰੋ।",
  },
  "steps.payment.descMulti": {
    en: "You picked {count} categories. Total entry fee is ₹{fee}. Tap Pay Now and the amount will be pre-filled in your UPI app — then continue to the form and submit your payment reference number.",
    hi: "{count} श्रेणियां चुनी गईं। कुल प्रवेश शुल्क ₹{fee} है। पेई नाउ टैप करें और राशि आपके UPI ऐप में पहले से भरी जाएगी — फिर फ़ॉर्म पर जारी रखें और अपना भुगतान संदर्भ नंबर जमा करें।",
    pa: "{count} ਸ਼੍ਰੇਣੀਆਂ ਚੁਣੀਆਂ। ਕੁਲ ਪ੍ਰਵੇਸ਼ ਫੀਸ ₹{fee} ਹੈ। ਪੇਅ ਨੌਂ ਟੈਪ ਕਰੋ ਅਤੇ ਰਕਮ ਤੁਹਾਡੇ UPI ਐਪ ਵਿੱਚ ਪਹਿਲਾਂ ਹੀ ਭਰੀ ਜਾਵੇਗੀ — ਫਿਰ ਫਾਰਮ ਵੱਲ ਜਾਰੀ ਰੱਖੋ ਅਤੇ ਆਪਣਾ ਭੁਗਤਾਨ ਸੰਦਰਭ ਨੰਬਰ ਜਮਾ ਕਰੋ।",
  },
  "steps.payment.feeHeading": { en: "ENTRY FEE", hi: "प्रवेश शुल्क", pa: "ਪ੍ਰਵੇਸ਼ ਫੀਸ" },
  "steps.payment.feeSingle": { en: "₹{fee} per category entry • non-refundable", hi: "प्रति श्रेणी प्रवेश ₹{fee} • गैर-वापसी योग्य", pa: "ਹਰ ਸ਼੍ਰੇਣੀ ਪ੍ਰਵੇਸ਼ ₹{fee} • ਵਾਪਸ ਨਹੀਂ" },
  "steps.payment.feeSinglePer": { en: "₹{fee} per category entry • non-refundable", hi: "प्रति श्रेणी प्रवेश ₹{fee} • गैर-वापसी योग्य", pa: "ਹਰ ਸ਼੍ਰੇਣੀ ਪ੍ਰਵੇਸ਼ ₹{fee} • ਵਾਪਸ ਨਹੀਂ" },
  "steps.payment.feeTier": {
    en: "₹{one} (1 cat) / ₹{two} (2 cats) / ₹{three} (3 cats)",
    hi: "₹{one} (1 श्रेणी) / ₹{two} (2 श्रेणियां) / ₹{three} (3 श्रेणियां)",
    pa: "₹{one} (1 ਸ਼੍ਰੇਣੀ) / ₹{two} (2 ਸ਼੍ਰੇਣੀਆਂ) / ₹{three} (3 ਸ਼੍ਰੇਣੀਆਂ)",
  },
  "steps.payment.feeTierNote": {
    en: "1 cat: ₹{one} · 2 cats: ₹{two} · 3 cats: ₹{three}",
    hi: "1 श्रेणी: ₹{one} · 2 श्रेणियां: ₹{two} · 3 श्रेणियां: ₹{three}",
    pa: "1 ਸ਼੍ਰੇਣੀ: ₹{one} · 2 ਸ਼੍ਰੇਣੀਆਂ: ₹{two} · 3 ਸ਼੍ਰੇਣੀਆਂ: ₹{three}",
  },
  "steps.payment.qrScan": { en: "Scan with any UPI app", hi: "किसी भी UPI ऐप से स्कैन करें", pa: "ਕਿਸੇ ਵੀ UPI ਐਪ ਨਾਲ ਸਕੇਨ ਕਰੋ" },
  "steps.payment.payNow": { en: "Pay ₹{fee} Now", hi: "अभी ₹{fee} भुगतान करें", pa: "ਅੱਜ ਹੀ ₹{fee} ਭੁਗਤਾਨ ਕਰੋ" },
  "steps.payment.openApp": {
    en: "Opens GPay / PhonePe / Paytm directly with amount pre-filled — no scanning needed on mobile.",
    hi: "GPay / PhonePe / Paytm सीधे खुलता है with राशि पहले से भरी — मोबाइल पर स्कैन करने की आवश्यकता नहीं।",
    pa: "GPay / PhonePe / Paytm ਸਿੱਧੇ ਖੁੱਲਦਾ ਹੈ ਰਕਮ ਪਹਿਲਾਂ ਹੀ ਭਰੀ — ਮੋਬਾਈਲ 'ਤੇ ਸਕੇਨ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ।",
  },
  "steps.payment.upiHeading": { en: "UPI DETAILS", hi: "UPI विवरण", pa: "UPI ਵਿਸਤਾਰ" },
  "steps.payment.payee": { en: "Payee", hi: "प्राप्तकर्ता", pa: "ਪ੍ਰਾਪਤਕਰਤਾ" },
  "steps.payment.upiId": { en: "UPI ID", hi: "UPI ID", pa: "UPI ID" },
  "steps.payment.copied": { en: "Copied", hi: "कॉपी हो गया", pa: "ਕਾਪੀ ਹੋ ਗਿਆ" },
  "steps.payment.copy": { en: "Copy", hi: "कॉपी करें", pa: "ਕਾਪੀ ਕਰੋ" },
  "steps.payment.continue": { en: "I Have Paid — Continue", hi: "मैं भुगतान कर चुका हूं — जारी रखें", pa: "ਮੈਂ ਭੁਗਤਾਨ ਕਰ ਲਿਆ ਹੈ — ਜਾਰੀ ਰੱਖੋ" },
  "steps.payment.instructions": {
    en: [
      "Tap Pay Now (opens your UPI app) or scan the QR",
      "Pay exactly ₹{fee} for this category",
      "Take a screenshot of the payment success screen",
      "Continue to the form — upload screenshot (add UTR if you have it)",
    ],
    hi: [
      "पेई नाउ टैप करें (UPI ऐप खुलेगा) या QR स्कैन करें",
      "इस श्रेणी के लिए ठीक ₹{fee} भुगतान करें",
      "भुगतान सफलता स्क्रीन की स्क्रीनशॉट लें",
      "फ़ॉर्म पर जारी रखें — स्क्रीनशॉट अपलोड करें (UTR हो तो जोड़ें)",
    ],
    pa: [
      "ਪੇਅ ਨੌਂ ਟੈਪ ਕਰੋ (UPI ਐਪ ਖੁੱਲੇਗਾ) ਜਾਂ QR ਸਕੇਨ ਕਰੋ",
      "ਇਸ ਸ਼੍ਰੇਣੀ ਲਈ ਠੀਕ ₹{fee} ਭੁਗਤਾਨ ਕਰੋ",
      "ਭੁਗਤਾਨ ਸਫਲਤਾ ਸਕ੍ਰੀਨ ਦੀ ਸਕ੍ਰੀਨਸ਼ਟ ਲਓ",
      "ਫਾਰਮ ਵੱਲ ਜਾਰੀ ਰੱਖੋ — ਸਕ੍ਰੀਨਸ਼ਟ ਅੱਪਲੋਡ ਕਰੋ (UTR ਹੋਵੇ ਤਾਂ ਜੋੜੋ)",
    ],
  },

  "form.title": { en: "STEP 3 — ATHLETE DETAILS", hi: "चरण 3 — एथलीट विवरण", pa: "ਕਦਮ 3 — ਏਥਲੀਟ ਵਿਸਤਾਰ" },
  "form.descSingle": { en: "Fill in your details for the {name} category. Submit only after payment.", hi: "{name} श्रेणी के लिए अपने विवरण भरें। केवल भुगतान के बाद जमा करें।", pa: "{name} ਸ਼੍ਰੇਣੀ ਲਈ ਆਪਣੇ ਵਿਸਤਾਰ ਭਰੋ। ਸਿਰਫ਼ ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਜਮਾ ਕਰੋ।" },
  "form.descMulti": { en: "Fill in the details for each selected category below. Submit only after payment.", hi: "नीचे प्रत्येक चुनी गई श्रेणी के विवरण भरें। केवल भुगतान के बाद जमा करें।", pa: "ਹੇਠਾਂ ਹਰ ਚੁਣੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੇ ਵਿਸਤਾਰ ਭਰੋ। ਸਿਰਫ਼ ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਜਮਾ ਕਰੋ।" },
  "form.personalLegend": { en: "PERSONAL DETAILS", hi: "व्यक्तिगत विवरण", pa: "ਵਿਅਕਤੀਗਤ ਵਿਸਤਾਰ" },
  "form.name": { en: "Full Name *", hi: "पूरा नाम *", pa: "ਪੂਰਾ ਨਾਮ *" },
  "form.namePlaceholder": { en: "e.g. Rahul Sharma", hi: "जैसे राहुल शर्मा", pa: "ਜਿਵੇਂ ਰਾਹੁਲ ਸ਼ਰਮਾ" },
  "form.phone": { en: "Mobile Number *", hi: "मोबाइल नंबर *", pa: "ਮੋਬਾਈਲ ਨੰਬਰ *" },
  "form.phonePlaceholder": { en: "10-digit mobile", hi: "10 अंकों का मोबाइल", pa: "10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ" },
  "form.email": { en: "Email", hi: "ईमेल", pa: "ਈਮੇਲ" },
  "form.emailPlaceholder": { en: "you@email.com (optional)", hi: "आप@ईयैल.कॉम (वैकल्पिक)", pa: "ਤੁਹਾਡਾ@ਈਮੇਲ.ਕੌਮ (ਵਿਕਲਪਿਕ)" },
  "form.dob": { en: "Date of Birth *", hi: "जन्म तिथि *", pa: "ਜਨਮ ਤਰੀਕਾ *" },
  "form.gender": { en: "Gender *", hi: "लिंग *", pa: "ਲਿੰਗ *" },
  "form.genderPlaceholder": { en: "Select gender", hi: "लिंग चुनें", pa: "ਲਿੰਗ ਚੁਣੋ" },
  "form.genderMale": { en: "Male", hi: "पुरुष", pa: "ਪੁਰुष" },
  "form.genderFemale": { en: "Female", hi: "महिला", pa: "ਔਰਤ" },
  "form.genderOther": { en: "Other", hi: "अन्य", pa: "ਹੋਰ" },
  "form.city": { en: "City *", hi: "शहर *", pa: "ਸ਼ਹਿਰ *" },
  "form.cityPlaceholder": { en: "e.g. Mumbai", hi: "जैसे मुंबई", pa: "ਜਿਵੇਂ ਮੁੰਬਈ" },
  "form.gym": { en: "Gym / Academy *", hi: "जिम / एकेडमी *", pa: "ਜਿਮ / ਐਕੈਡਮੀ *" },
  "form.gymPlaceholder": { en: "Your gym name", hi: "अपना जिम का नाम", pa: "ਆਪਣੇ ਜਿਮ ਦਾ ਨਾਮ" },
  "form.photo": { en: "Athlete Photo * (auto-compressed to max 1 MB)", hi: "एथलीट फ़ोटो * (स्वतः 1 MB तक संकुचित)", pa: "ਏਥਲੀਟ ਫੋਟੋ * (ਸਵੈ-ਸੰਚਿਤ 1 MB ਤੱਕ)" },
  "form.categorySection": { en: "{name} — CATEGORY DETAILS", hi: "{name} — श्रेणी विवरण", pa: "{name} — ਸ਼੍ਰੇਣੀ ਵਿਸਤਾਰ" },
  "form.categorySectionMulti": { en: "CATEGORY {index} — {name}", hi: "श्रेणी {index} — {name}", pa: "ਸ਼੍ਰੇਣੀ {index} — {name}" },
  "form.categorySectionSub": { en: "Category: {name}", hi: "श्रेणी: {name}", pa: "ਸ਼੍ਰੇਣੀ: {name}" },
  "form.categoryWarning": {
    en: "⚠️ Weight / height / age will be verified at check-in. False details lead to disqualification.",
    hi: "⚠️ वजन / ऊंचाई / आयु चेक-इन पर सत्यापित की जाएगी। गलत विवरण से अयोग्य घोषित किया जा सकता है।",
    pa: "⚠️ ਵਜ਼ਨ / ਉਚਾਈ / ਉਮਰ ਚੈੱਕ-ਇਨ 'ਤੇ ਪ੍ਰਮਾਣਿਤ ਕੀਤੀ ਜਾਵੇਗੀ। ਗਲਤ ਵਿਸਤਾਰ ਨਾਲ ਅਯੋਗ ਘੋਸ਼ਿਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
  },
  "form.paymentLegend": { en: "PAYMENT PROOF", hi: "भुगतान प्रमाण", pa: "ਭੁਗਤਾਨ ਸਬੂਤ" },
  "form.utr": { en: "UTR / Payment Reference No.", hi: "UTR / भुगतान संदर्भ संख्या", pa: "UTR / ਭੁਗਤਾਨ ਹਵਾਲੇ ਨੰਬਰ" },
  "form.utrPlaceholder": { en: "e.g. 4235XXXXXX21 (optional)", hi: "जैसे 4235XXXXXX21 (वैकल्पिक)", pa: "ਜਿਵੇਂ 4235XXXXXX21 (ਵਿਕਲਪਿਕ)" },
  "form.receipt": { en: "Payment Screenshot * (auto-compressed to max 1 MB)", hi: "भुगतान स्क्रीनशॉट * (स्वतः 1 MB तक संकुचित)", pa: "ਭੁਗਤਾਨ ਸਕ੍ਰੀਨਸ਼ਟ * (ਸਵੈ-ਸੰਚਿਤ 1 MB ਤੱਕ)" },
  "form.notes": { en: "Notes (optional)", hi: "नोट (वैकल्पिक)", pa: "ਨੋਟ (ਵਿਕਲਪਿਕ)" },
  "form.notesPlaceholder": { en: "Anything the organizers should know (e.g. paid for 2 categories)", hi: "जो कुछ आयोजकों को पता होना चाहिए (जैसे 2 श्रेणियों के लिए भुगतान)", pa: "ਜੋ ਕੁਝ ਆਯੋਜਕਾਂ ਨੂੰ ਜਾਣਨਾ ਚਾਹੀਦਾ ਹੈ (ਜਿਵੇਂ 2 ਸ਼੍ਰੇਣੀਆਂ ਲਈ ਭੁਗਤਾਨ)" },
  "form.submissionNote": {
    en: "By submitting, you agree to the competition rules. Your entry gets confirmed after the organizers verify your payment (usually within 24h).",
    hi: "जमा करके, आप प्रतियोगिता नियमों से सहमत होते हैं। आपका प्रवेश आयोजकों द्वारा भुगतान सत्यापित करने के बाद पुष्टि होता है (आमतौर पर 24 घंटे के भीतर)।",
    pa: "ਜਮਾ ਕਰਕੇ, ਤੁਸੀਂ ਮੁਕਾਬਲੇ ਦੇ ਨਿਯਮਾਂ ਨਾਲ ਸਹਿਮਤ ਹੋ ਜਾਂਦੇ ਹੋ। ਤੁਹਾਡਾ ਪ੍ਰਵੇਸ਼ ਆਯੋਜਕਾਂ ਦੁਆਰਾ ਭੁਗਤਾਨ ਪ੍ਰਮਾਣਿਤ ਕਰਨ ਤੋਂ ਬਾਅਦ ਪੁਸ਼ਟੀ ਹੁੰਦਾ ਹੈ (ਆਮ ਤੌਰ 'ਤੇ 24 ਘੰਟਿਆਂ ਦੇ ਭੀਤਰ।)",
  },
  "form.totalFeeLabel": {
    en: "TOTAL FEE — {count} category selected",
    hi: "कुल शुल्क — {count} श्रेणी चुनी गई",
    pa: "ਕੁਲ ਫੀਸ — {count} ਸ਼੍ਰੇਣੀ ਚੁਣੀ ਗਈ",
  },
  "form.totalFeeSingle": { en: "One category entry: ₹{fee} (pay once)", hi: "एक श्रेणी प्रवेश: ₹{fee} (एक बार भुगतान)", pa: "ਇੱਕ ਸ਼੍ਰੇਣੀ ਪ੍ਰਵੇਸ਼: ₹{fee} (ਇੱਕ ਵਾਰ ਭੁਗਤਾਨ)" },
  "form.totalFeeMulti": {
    en: "{count} categories selected — flat fee ₹{fee} (₹3,500 / ₹6,000 / ₹8,000 for 1/2/3)",
    hi: "{count} श्रेणियां चुनी गईं — Flat शुल्क ₹{fee} (₹3,500 / ₹6,000 / ₹8,000 for 1/2/3)",
    pa: "{count} ਸ਼੍ਰੇਣੀਆਂ ਚੁਣੀਆਂ — Flat ਫੀਸ ₹{fee} (₹3,500 / ₹6,000 / ₹8,000 for 1/2/3)",
  },
  "form.submit": { en: "Submit Registration", hi: "पंजीकरण जमा करें", pa: "ਰਜਿਸਟਰੇਸ਼ਨ ਜਮਾ ਕਰੋ" },
  "form.submitting": { en: "Submitting…", hi: "जमा हो रहा है…", pa: "ਜਮਾ ਹੋ ਰਿਹਾ ਹੈ…" },
  "form.photoRequired": { en: "Please upload your photo", hi: "अपनी फ़ोटो अपलोड करें", pa: "ਆਪਣੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ" },
  "form.receiptRequired": { en: "Please select a payment screenshot", hi: "कृपया भुगतान स्क्रीनशॉट चुनें", pa: "ਕਿਰਪਾ ਕਰਕੇ ਭੁਗਤਾਨ ਸਕ੍ਰੀਨਸ਼ਟ ਚੁਣੋ" },
  "form.compressErrorReceipt": { en: "Could not compress screenshot below 1 MB — please use a smaller image", hi: "स्क्रीनशॉट को 1 MB से नीचे संकुचित नहीं किया जा सकता — कृपया छोटी छवि का उपयोग करें", pa: "ਸਕ੍ਰੀਨਸ਼ਟ ਨੂੰ 1 MB ਤੋਂ ਹੇਠਾਂ ਸੰਚਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ — ਕਿਰਪਾ ਕਰਕੇ ਛੋਟੀ ਇਮੇਜ ਵਰਤੋਂ" },
  "form.compressErrorPhoto": { en: "Could not compress your photo below 1 MB — please use a smaller image", hi: "अपनी फ़ोटो को 1 MB से नीचे संकुचित नहीं किया जा सकता — कृपया छोटी छवि का उपयोग करें", pa: "ਆਪਣੀ ਫੋਟੋ ਨੂੰ 1 MB ਤੋਂ ਹੇਠਾਂ ਸੰਚਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ — ਕਿਰਪਾ ਕਰਕੇ ਛੋਟੀ ਇਮੇਜ ਵਰਤੋਂ" },
  "form.pdfReceiptError": { en: "Payment PDF must be under 1 MB", hi: "भुगतान PDF 1 MB से कम होना चाहिए", pa: "ਭੁਗਤਾਨ PDF 1 MB ਤੋਂ ਘੱਟ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ" },
  "form.success": { en: "Registered! Your ID: {id}", hi: "पंजीकृत! आपकी ID: {id}", pa: "ਰਜਿਸਟਰ ਹੋ ਗਈ! ਤੁਹਾਡੀ ID: {id}" },

  "register.title": { en: "ATHLETE REGISTRATION", hi: "एथलीट पंजीकरण", pa: "ਏਥਲੀਟ ਰਜਿਸਟਰੇਸ਼ਨ" },
  "register.stepCategory": { en: "Category", hi: "श्रेणी", pa: "ਸ਼੍ਰੇਣੀ" },
  "register.stepPayment": { en: "Payment", hi: "भुगतान", pa: "ਭੁਗਤਾਨ" },
  "register.stepDetails": { en: "Details", hi: "विवरण", pa: "ਵਿਸਤਾਰ" },
  "register.success.title": { en: "YOU'RE IN!", hi: "आप जुड़ गए!", pa: "ਤੁਸੀਂ ਜੁੜ ਗਏ!" },
  "register.success.desc": {
    en: "Your registration is submitted. The Rampage Gym team will verify your payment and confirm your slot — usually within 24 hours.",
    hi: "आपका पंजीकरण जमा हो गया है। Rampage Gym टीम आपके भुगतान की सत्यापना करेगी और आपकी स्थिति की पुष्टि करेगी — आमतौर पर 24 घंटे के भीतर।",
    pa: "ਤੁਹਾਡਾ ਰਜਿਸਟਰੇਸ਼ਨ ਜਮਾ ਹੋ ਗਿਆ ਹੈ। Rampage Gym ਟੀਮ ਤੁਹਾਡੇ ਭੁਗਤਾਨ ਦੀ ਪ੍ਰਮਾਣਿਤੀ ਕਰੇਗੀ ਅਤੇ ਤੁਹਾਡੀ ਸਲਾਟ ਦੀ ਪੁਸ਼ਟੀ ਕਰੇਗੀ — ਆਮ ਤੌਰ 'ਤੇ 24 ਘੰਟਿਆਂ ਦੇ ਭੀਤਰ।",
  },
  "register.idLabel": { en: "Your Registration ID", hi: "आपकी पंजीकरण ID", pa: "ਤੁਹਾਡੀ ਰਜਿਸਟਰੇਸ਼ਨ ID" },
  "register.copyId": { en: "Copy", hi: "कॉपी करें", pa: "ਕਾਪੀ ਕਰੋ" },
  "register.copied": { en: "Copied", hi: "कॉपी हो गया", pa: "ਕਾਪੀ ਹੋ ਗਿਆ" },
  "register.backHome": { en: "Back Home", hi: "वापस होम", pa: "ਵਾਪਸ ਹੋਮ" },
  "register.another": { en: "Register Another Category", hi: "दूसरी श्रेणी पंजीकरण करें", pa: "ਦੂਸਰੀ ਸ਼੍ਰੇਣੀ ਰਜਿਸਟਰ ਕਰੋ" },
  "register.checkStatus": { en: "Check Status", hi: "स्थिति जांचें", pa: "ਸਥਿਤੀ ਜਾਂਚੋ" },
  "register.downloadForm": { en: "DOWNLOAD YOUR FILLED FORM", hi: "अपना भरा हुआ फ़ॉर्म डाउनलोड करें", pa: "ਆਪਣਾ ਭਰਿਆ ਹੋਇਆ ਫਾਰਮ ਡਾਉਨਲੋਡ ਕਰੋ" },
  "register.downloadDesc": {
    en: "Enter your Registration ID and mobile number to download a structured copy of your registration.",
    hi: "अपना पंजीकरण ID और मोबाइल नंबर डालें ताकि आपके पंजीकरण की संरचित प्रतिलिपि डाउनलोड हो।",
    pa: "ਆਪਣੀ ਰਜਿਸਟਰੇਸ਼ਨ ID ਅਤੇ ਮੋਬਾਈਲ ਨੰਬਰ ਦਾਲੋ ਤਾਂ ਕਿ ਤੁਹਾਡੇ ਰਜਿਸਟਰੇਸ਼ਨ ਦੀ ਰੂਪਰੇਖਾ ਪ੍ਰਤਿਲਿਪੀ ਡਾਉਨਲੋਡ ਹੋਵੇ।",
  },
  "register.idFieldLabel": { en: "Registration ID", hi: "पंजीकरण ID", pa: "ਰਜਿਸਟਰੇਸ਼ਨ ID" },
  "register.mobileFieldLabel": { en: "Mobile Number", hi: "मोबाइल नंबर", pa: "ਮੋਬਾਈਲ ਨੰਬਰ" },
  "register.downloadBtn": { en: "⬇ Download My Filled Form", hi: "⬇ अपना भरा हुआ फ़ॉर्म डाउनलोड करें", pa: "⬇ ਆਪਣਾ ਭਰਿਆ ਹੋਇਆ ਫਾਰਮ ਡਾਉਨਲੋਡ ਕਰੋ" },
  "register.saveIdNote": {
    en: "Save your Registration ID — you'll need it at check-in.",
    hi: "अपनी पंजीकरण ID सही रखें — चेक-इन पर इसकी आवश्यकता होगी।",
    pa: "ਆਪਣੀ ਰਜਿਸਟਰੇਸ਼ਨ ID ਸੁਰੱਖਿਅਤ ਰੱਖੋ — ਚੈੱਕ-ਇਨ 'ਤੇ ਇਸਦੀ ਲੋੜ ਹੋਵੇਗੀ।",
  },

  "admin.title": { en: "ADMIN DASHBOARD", hi: "व्यवस्थापक डैशबोर्ड", pa: "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ" },
  "admin.login": { en: "Admin Login", hi: "व्यवस्थापक लॉगिन", pa: "ਐਡਮਿਨ ਲਾਗਿਨ" },
  "admin.username": { en: "Username", hi: "उपयोगकर्ता नाम", pa: "ਉਪਯੋਗਕਰਤਾ ਨਾਮ" },
  "admin.password": { en: "Password", hi: "पासवर्ड", pa: "ਪਾਸਵਰਡ" },
  "admin.signIn": { en: "Sign In", hi: "साइन इन करें", pa: "ਸਾਈਨ ਇਨ ਕਰੋ" },
  "admin.registrations": { en: "Registrations", hi: "पंजीकरण", pa: "ਰਜਿਸਟਰੇਸ਼ਨ" },
  "admin.count": { en: "{count} registration(s)", hi: "{count} पंजीकरण", pa: "{count} ਰਜਿਸਟਰੇਸ਼ਨ" },
  "admin.exportCsv": { en: "Export CSV", hi: "CSV निर्यात", pa: "CSV ਰਨਣ ਕਰੋ" },
  "admin.exportJson": { en: "Export JSON", hi: "JSON निर्यात", pa: "JSON ਰਨਣ ਕਰੋ" },
  "admin.refresh": { en: "Refresh", hi: "रिफ्रेश", pa: "ਰੀਫ੍ਰੇਸ਼" },
  "admin.verified": { en: "Verified", hi: "सत्यापित", pa: "ਪ੍ਰਮਾਣਿਤ" },
  "admin.unverified": { en: "Unverified", hi: "असत्यापित", pa: "ਅਪ੍ਰਮਾਣਿਤ" },
  "admin.rejected": { en: "Rejected", hi: "अस्वीकृत", pa: "ਨਕਾਰਾਤਮਕ" },
  "admin.pending": { en: "Pending", hi: "लंबित", pa: "ਲੰਮਿਤ" },
  "admin.confirmed": { en: "Confirmed", hi: "पुष्टि", pa: "ਪੁਸ਼ਟੀ" },
  "admin.category": { en: "Category", hi: "श्रेणी", pa: "ਸ਼੍ਰੇਣੀ" },
  "admin.categoryMeta": { en: "{meta}", hi: "{meta}", pa: "{meta}" },
  "admin.details": { en: "Details", hi: "विवरण", pa: "ਵਿਸਤਾਰ" },
  "admin.downloadReceipt": { en: "Download Receipt", hi: "रसीद डाउनलोड", pa: "ਰਸੀਦ ਡਾਉਨਲੋਡ" },
  "admin.downloadForm": { en: "Download Form", hi: "फ़ॉर्म डाउनलोड", pa: "ਫਾਰਮ ਡਾਉਨਲੋਡ" },
  "admin.generateQr": { en: "Generate QR", hi: "QR बनाएं", pa: "QR ਬਣਾਓ" },
  "admin.receipt": { en: "Receipt", hi: "रसीद", pa: "ਰਸੀਦ" },
  "admin.status": { en: "Status", hi: "स्थिति", pa: "ਸਥਿਤੀ" },
  "admin.paymentStatus": { en: "Payment", hi: "भुगतान", pa: "ਭੁਗਤਾਨ" },
  "admin.updateStatus": { en: "Update Status", hi: "स्थिति अद्यतन", pa: "ਸਥਿਤੀ ਅੱਪਡੇਟ" },
  "admin.save": { en: "Save", hi: "सहेजें", pa: "ਸੁਰੱਖਿਅਤ ਕਰੋ" },
  "admin.remarks": { en: "Remarks", hi: "टिप्पणी", pa: "ਟਿਪਪਣੀ" },
  "admin.remarksPlaceholder": { en: "Add admin note", hi: "व्यवस्थापक नोट जोड़ें", pa: "ਐਡਮਿਨ ਨੋਟ ਸ਼ਾਮਲ ਕਰੋ" },

  "checkin.title": { en: "CHECK-IN", hi: "चेक-इन", pa: "ਚੈੱਕ-ਇਨ" },
  "checkin.find": { en: "Find your registration", hi: "अपना पंजीकरण खोजें", pa: "ਆਪਣਾ ਰਜਿਸਟਰੇਸ਼ਨ ਲੱਭੋ" },
  "checkin.regId": { en: "Registration ID", hi: "पंजीकरण ID", pa: "ਰਜਿਸਟਰੇਸ਼ਨ ID" },
  "checkin.regIdPlaceholder": { en: "e.g. MI26-1234", hi: "जैसे MI26-1234", pa: "ਜਿਵੇਂ MI26-1234" },
  "checkin.search": { en: "Search", hi: "खोजें", pa: "ਲੱਝੋ" },
  "checkin.notFound": { en: "Registration not found", hi: "पंजीकरण नहीं मिला", pa: "ਰਜਿਸਟਰੇਸ਼ਨ ਨਹੀਂ ਮਿਲਿਆ" },
  "checkin.athlete": { en: "ATHLETE", hi: "एथलीट", pa: "ਏਥਲੀਟ" },
  "checkin.details": { en: "Details", hi: "विवरण", pa: "ਵਿਸਤਾਰ" },
  "checkin.category": { en: "Category", hi: "श्रेणी", pa: "ਸ਼੍ਰੇਣੀ" },
  "checkin.weightClass": { en: "Weight Class", hi: "वजन वर्ग", pa: "ਵਜ਼ਨ ਸ਼੍ਰੇਣੀ" },
  "checkin.heightClass": { en: "Height Class", hi: "ऊंचाई वर्ग", pa: "ਉਚਾਈ ਸ਼੍ਰੇਣੀ" },
  "checkin.age": { en: "Age", hi: "आयु", pa: "ਉਮਰ" },
  "checkin.status": { en: "Status", hi: "स्थिति", pa: "ਸਥਿਤੀ" },
  "checkin.qrPass": { en: "QR Pass", hi: "QR पास", pa: "QR ਪਾਸ" },
  "checkin.printPass": { en: "Print Pass", hi: "पास प्रिंट करें", pa: "ਪਾਸ ਪ੍ਰਿੰਟ ਕਰੋ" },

  "misc.loading": { en: "Loading…", hi: "लोड हो रहा है…", pa: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…" },
  "misc.or": { en: "or", hi: "या", pa: "ਜਾਂ" },
  "misc.perCategory": { en: "per category entry", hi: "प्रति श्रेणी प्रवेश", pa: "ਹਰ ਸ਼੍ਰੇਣੀ ਪ੍ਰਵੇਸ਼" },
  "misc.nonRefundable": { en: "non-refundable", hi: "गैर-वापसी योग्य", pa: "ਨਾ ਵਾਪਸ ਕੀਤਾ ਜਾ ਸਕਣ ਵਾਲਾ" },
};
