export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
};

export type TestimonialRow = {
  id: string;
  author_name: string;
  content: string;
  rating: number;
};
