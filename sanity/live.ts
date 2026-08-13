import { defineLive } from 'next-sanity/live';
import { client } from './client';

const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error(
    'Missing SANITY_API_READ_TOKEN — see SANITY-SETUP.md in the repo root.',
  );
}

/**
 * `sanityFetch` returns published content on the live site and draft content
 * inside Presentation mode. `SanityLive` (mounted in the root layout) pushes
 * updates down without a redeploy, so hitting Publish updates the site.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
