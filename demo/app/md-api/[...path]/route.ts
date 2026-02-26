import { createMdHandler } from 'next-md-negotiate';
import { mdConfig } from '@/md.config';

export const GET = createMdHandler(mdConfig);
