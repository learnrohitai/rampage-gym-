export type FieldType = "text" | "number" | "select";

export interface ExtraField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
}

export interface Category {
  id: string;
  name: string;
  short: string;
  icon: string;
  color: string;
  desc: string;
  fields: ExtraField[];
}

const WEIGHT_RANGES = [
  "Below 60 kg",
  "60 - 65 kg",
  "65 - 70 kg",
  "70 - 75 kg",
  "75 - 80 kg",
  "80 - 85 kg",
  "Above 85 kg",
];

const HEIGHT_RANGES = ["Below 5'9\"", "Above 5'9\""];

export const CATEGORIES: Category[] = [
  {
    id: "bodybuilding",
    name: "Bodybuilding",
    short: "7 Weight Classes",
    icon: "dumbbell",
    color: "from-amber-500 to-red-600",
    desc: "Classic mass monster showdown across 7 weight classes. Mandatory poses, symmetry and conditioning.",
    fields: [
      {
        name: "weightClass",
        label: "Weight Class",
        type: "select",
        options: WEIGHT_RANGES,
      },
      {
        name: "competitiveExperience",
        label: "Competitive Experience",
        type: "select",
        options: ["Beginner (first show)", "Intermediate (1-3 shows)", "Advanced (4+ shows)"],
      },
    ],
  },
  {
    id: "masters",
    name: "Masters Bodybuilding",
    short: "Age 35+",
    icon: "shield",
    color: "from-slate-400 to-slate-700",
    desc: "For athletes aged 35 and above. Age verified at check-in via government ID. Single division.",
    fields: [
      { name: "age", label: "Age (must be 35+)", type: "number", placeholder: "e.g. 42" },
      {
        name: "yearsTraining",
        label: "Years of Training",
        type: "number",
        placeholder: "e.g. 15",
      },
    ],
  },
  {
    id: "physique",
    name: "Men's Physique",
    short: "2 Height Classes",
    icon: "sparkles",
    color: "from-cyan-500 to-blue-700",
    desc: "Aesthetic, conditioned, board-shorts physique. Two height classes — below and above 5'9\".",
    fields: [
      {
        name: "heightClass",
        label: "Height Class",
        type: "select",
        options: HEIGHT_RANGES,
      },
      { name: "height", label: "Exact Height (feet, e.g. 5.10)", type: "number", placeholder: "5.10" },
    ],
  },
];

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function categoryLabel(reg: { category: string; categoryMeta?: Record<string, unknown> }) {
  const cat = getCategory(reg.category);
  if (!cat) return reg.category;
  const meta = reg.categoryMeta || {};
  switch (cat.id) {
    case "bodybuilding":
      return `${cat.name} — ${meta.weightClass ?? "-"}`;
    case "masters":
      return `${cat.name} (${meta.age ?? "-"} yrs)`;
    case "physique":
      return `${cat.name} — ${meta.heightClass ?? "-"}`;
    default:
      return cat.name;
  }
}
