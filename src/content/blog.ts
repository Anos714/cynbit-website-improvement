import rawPosts from "./data/blog.json";

export type BlogTextBlock = {
  type: "p" | "h2" | "h3" | "quote";
  text: string;
};

export type BlogListBlock = {
  type: "list" | "ordered-list";
  items: string[];
};

export type BlogFigureBlock = {
  type: "figure";
  src: string;
  alt: string;
  caption?: string;
};

export type BlogBlock = BlogTextBlock | BlogListBlock | BlogFigureBlock;

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  publishedAt: string;
  author: string;
  authorRole: string;
  image: string;
  blocks: BlogBlock[];
};

export const blogPosts: BlogPost[] = (rawPosts as BlogPost[]).toSorted((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

export const featuredBlogPost = blogPosts[0];

export const blogCategories = Array.from(new Set(blogPosts.map((post) => post.category))).sort();

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const sameCategory = blogPosts.filter(
    (candidate) => candidate.slug !== post.slug && candidate.category === post.category,
  );
  const others = blogPosts.filter(
    (candidate) => candidate.slug !== post.slug && candidate.category !== post.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function getBlogHeadings(post: BlogPost) {
  return post.blocks
    .filter((block): block is BlogTextBlock => block.type === "h2")
    .map((block) => ({
      text: block.text,
      id: textToId(block.text),
    }));
}

export function textToId(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
