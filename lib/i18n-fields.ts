import { Lang } from "./i18n";

export const FIELD_LABELS: Record<string, Record<Lang, string>> = {
  weightClass: {
    en: "Weight Class",
    hi: "वजन वर्ग",
    pa: "ਵਜ਼ਨ ਸ਼੍ਰੇਣੀ",
  },
  competitiveExperience: {
    en: "Competitive Experience",
    hi: "प्रतिस्पर्धी अनुभव",
    pa: "ਮੁਕਾਬਲਿਆਤ ਤਜਰਬਾ",
  },
  age: {
    en: "Age (must be 35+)",
    hi: "आयु (35+ होना चाहिए)",
    pa: "ਉਮਰ (35+ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ)",
  },
  yearsTraining: {
    en: "Years of Training",
    hi: "प्रशिक्षण के वर्ष",
    pa: "ਪ੍ਰਸ਼ਿਕ਼ਸ਼ਣ ਦੇ ਸਾਲ",
  },
  heightClass: {
    en: "Height Class",
    hi: "ऊंचाई वर्ग",
    pa: "ਉਚਾਈ ਸ਼੍ਰੇਣੀ",
  },
  height: {
    en: "Exact Height (feet, e.g. 5.10)",
    hi: "सटीक ऊंचाई (फीट, जैसे 5.10)",
    pa: "ਸਟੀਕ ਉਚਾਈ (ਫੁੱਟ, ਜਿਵੇਂ 5.10)",
  },
};

export function fieldLabel(fieldName: string, lang: Lang): string {
  return FIELD_LABELS[fieldName]?.[lang] ?? fieldName;
}

export const FIELD_PLACEHOLDERS: Record<string, Record<Lang, string>> = {
  age: {
    en: "e.g. 42",
    hi: "जैसे 42",
    pa: "ਜਿਵੇਂ 42",
  },
  yearsTraining: {
    en: "e.g. 15",
    hi: "जैसे 15",
    pa: "ਜਿਵੇਂ 15",
  },
  height: {
    en: "5.10",
    hi: "5.10",
    pa: "5.10",
  },
};

export function fieldPlaceholder(fieldName: string, lang: Lang): string {
  return FIELD_PLACEHOLDERS[fieldName]?.[lang] ?? "";
}

export const FIELD_SELECT_PLACEHOLDERS: Record<Lang, string> = {
  en: "Select {label}",
  hi: "{label} चुनें",
  pa: "{label} ਚੁਣੋ",
};

export function fieldSelectPlaceholder(label: string, lang: Lang): string {
  return FIELD_SELECT_PLACEHOLDERS[lang].replace("{label}", label);
}
