import rawCareers from "./data/careers.json";

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

export const careerDisciplines = Array.from(new Set(careers.map((role) => role.department)));
