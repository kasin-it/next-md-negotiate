import { createMdVersion } from 'next-md-negotiate';
import { getProduct, getBlogPost } from './lib/data';

export const mdConfig = [
  createMdVersion('/products/[productId]', async ({ productId }) => {
    const product = await getProduct(productId);
    if (!product) return `# Not Found\n\nProduct "${productId}" does not exist.`;
    return [
      `# ${product.name}`,
      '',
      `**Price:** $${product.price}`,
      '',
      product.description,
    ].join('\n');
  }),
  createMdVersion('/blog/[slug]', async ({ slug }) => {
    const post = await getBlogPost(slug);
    if (!post) return `# Not Found\n\nBlog post "${slug}" does not exist.`;
    return [
      `# ${post.title}`,
      '',
      `*${post.date}*`,
      '',
      post.content,
    ].join('\n');
  }),
];
