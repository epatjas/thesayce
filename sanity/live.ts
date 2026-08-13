import { defineLive } from 'next-sanity/live';
import { client } from './client';

/**
 * Optional on purpose. Published content is readable without it because the
 * dataset is public, so a missing or expired token degrades to "published
 * content only" rather than taking the site down. It is required for draft
 * previews and Presentation mode's click-to-edit.
 */
const token = process.env.SANITY_API_READ_TOKEN;

if (!token && process.env.NODE_ENV === 'development') {
  console.warn(
    '[sanity] No SANITY_API_READ_TOKEN set — draft previews and Presentation ' +
      'mode will not work. See SANITY-SETUP.md.',
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
