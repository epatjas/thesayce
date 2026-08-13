import { createImageUrlBuilder } from '@sanity/image-url';
import { dataset, projectId } from './env';

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * The shape our GROQ projections return: the asset is dereferenced so we get
 * the LQIP placeholder alongside it, rather than a bare reference.
 */
export interface SanityImage {
  _type?: 'image';
  _key?: string;
  alt?: string | null;
  hotspot?: { x?: number; y?: number; width?: number; height?: number } | null;
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } | null;
  asset?: {
    _id?: string;
    _ref?: string;
    metadata?: {
      lqip?: string | null;
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      } | null;
    } | null;
  } | null;
}

export function urlFor(source: SanityImage) {
  return builder.image(source as Parameters<typeof builder.image>[0]).auto('format');
}

/**
 * Crops to the exact box using the focal point the editor set in the studio.
 * Without `fit: crop` the hotspot is ignored and the browser centre-crops.
 */
export function urlForCrop(source: SanityImage, width: number, height: number) {
  return urlFor(source).width(width).height(height).fit('crop');
}

export function hasImage(
  source: SanityImage | null | undefined,
): source is SanityImage {
  return Boolean(source?.asset?._id || source?.asset?._ref);
}
