import rawCareers from "./data/careers.json";

// The source data has no per-role dates. These constants describe when the
// current set of openings was published and when it should be reviewed again;
// JobPosting requires both fields. Sitemap entries still omit lastmod.
export const CAREERS_POSTED_AT = "2026-10-25";
export const CAREERS_VALID_THROUGH = "2027-01-23";

export type Career = {
  slug: string;
  title: string;
  description: string;
  department: string;
  location: string;
  type: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

export const careers: Career[] = (rawCareers as Career[]).toSorted((a, b) => {
  if (a.type !== b.type) return a.type === "Full-time" ? -1 : 1;
  return a.title.localeCompare(b.title);
});

export const internships = careers.filter((role) => role.type === "Internship");
export const fullTimeRoles = careers.filter((role) => role.type === "Full-time");

export function getCareer(slug: string) {
  return careers.find((role) => role.slug === slug);
}

export function careerSummary(role: Career) {
  return role.description.replace(/^Experience:\s*[^.]+\.\s*/, "");
}

export function careerExperience(role: Career) {
  const match = role.description.match(/^Experience:\s*([^.]+)\./);
  return match?.[1] ?? null;
}

export const careerDisciplines = Array.from(new Set(careers.map((role) => role.department)));
