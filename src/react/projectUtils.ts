import type { Language } from "../store/languageStore";
import type { ProjectData } from "./MyProjects";

const MONTHS: Record<Language, string[]> = {
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export const getImageUrl = (name: string) => {
  if (!name) return "";
  if (name.startsWith("http") || name.startsWith("data:")) return name;
  const cleanName = name
    .replace("src/assets/projectImages/", "projectImages/")
    .replace("src/assets/", "")
    .replace(/^\//, "");
  return `${import.meta.env.BASE_URL}images/${cleanName}`;
};

// Dates are free text in the DB: normalise ISO and dd/mm/yyyy ("Oct 2025"),
// leave anything else untouched.
export const formatDate = (raw: string, lang: Language) => {
  const one = (v: string) => {
    const iso = v.match(/^(\d{4})-(\d{2})-\d{2}$/);
    const dmy = v.match(/^\d{2}\/(\d{2})\/(\d{4})$/);
    const [y, m] = iso ? [iso[1], +iso[2]] : dmy ? [dmy[2], +dmy[1]] : [null, 0];
    return y && m >= 1 && m <= 12 ? `${MONTHS[lang][m - 1]} ${y}` : v;
  };
  return (raw || "").split(/\s*—\s*/).map(one).join(" — ");
};

// Roles are stored as a single string joined with " - ".
export const formatRole = (v: string) => (v || "").split(" - ").join(" · ");

export const localized = (
  item: ProjectData,
  field: "role" | "desc" | "long_desc",
  lang: Language,
) => (lang === "es" ? item[field] : item[`${field}_en`] || item[field]);
