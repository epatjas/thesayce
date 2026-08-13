import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from './env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Embeds invisible metadata in strings so Presentation mode can map text on
  // the page back to the field that produced it — this is what makes
  // click-to-edit work. It is stripped automatically outside draft mode.
  stega: {
    studioUrl: '/studio',
  },
});
