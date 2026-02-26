export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    description: "Noise-cancelling over-ear headphones with 30h battery life.",
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    price: 129.99,
    description: "Hot-swappable switches, RGB backlight, aluminum frame.",
  },
  {
    id: "3",
    name: "USB-C Hub",
    price: 49.99,
    description: "7-in-1 hub with HDMI, USB-A, SD card reader, and PD charging.",
  },
];

const posts: BlogPost[] = [
  {
    slug: "getting-started",
    title: "Getting Started with next-md-negotiate",
    date: "2025-06-01",
    content:
      "This library lets you serve Markdown to LLMs and HTML to browsers from the same URL. Just define your routes once in md.config.ts and you're good to go.",
  },
  {
    slug: "why-markdown",
    title: "Why Serve Markdown to LLMs?",
    date: "2025-07-15",
    content:
      "LLMs work best with structured text. By serving Markdown instead of HTML, you reduce token usage and improve comprehension for AI agents crawling your site.",
  },
];

/** Simulate an async API call */
async function delay(ms = 10) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay();
  return products.find((p) => p.id === id) ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  await delay();
  return products;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  await delay();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  await delay();
  return posts;
}
