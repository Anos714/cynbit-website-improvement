import rawDiaries from "./data/diaries.json";

export type DiaryEntry = {
  slug: string;
  title: string;
  date: string;
  author: string;
  role: string;
  paragraphs: string[];
  image: string;
  quote: string;
};

export const diaryEntries: DiaryEntry[] = (rawDiaries as DiaryEntry[]).toSorted(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function getDiaryEntry(slug: string) {
  return diaryEntries.find((entry) => entry.slug === slug);
}

export function getRelatedDiaryEntries(entry: DiaryEntry, limit = 2) {
  return diaryEntries.filter((candidate) => candidate.slug !== entry.slug).slice(0, limit);
}
