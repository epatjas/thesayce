import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';
import { urlForCrop, hasImage, type SanityImage } from '@/sanity/image';

interface MetadataSource {
  title?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  shareImage?: SanityImage | null;
}

interface SettingsSource {
  name?: string | null;
  seoDescription?: string | null;
  shareImage?: SanityImage | null;
}

/**
 * Page metadata, falling back to the site defaults. Every value is run through
 * stegaClean — in draft mode the raw strings carry invisible editing metadata
 * that must never reach a <title> or og: tag.
 */
export function buildMetadata({
  page,
  settings,
  titleSuffix,
}: {
  page?: MetadataSource | null;
  settings?: SettingsSource | null;
  titleSuffix?: boolean;
}): Metadata {
  const siteName = stegaClean(settings?.name) || 'Lili Sayce';
  const rawTitle = stegaClean(page?.seoTitle) || stegaClean(page?.title) || siteName;
  const title =
    titleSuffix && rawTitle !== siteName ? `${rawTitle} | ${siteName}` : rawTitle;

  const description =
    stegaClean(page?.seoDescription) || stegaClean(settings?.seoDescription) || undefined;

  const shareSource = hasImage(page?.shareImage)
    ? page.shareImage
    : hasImage(settings?.shareImage)
      ? settings.shareImage
      : null;

  const imageUrl = shareSource ? urlForCrop(shareSource, 1200, 630).url() : undefined;

  const images = imageUrl
    ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', images, siteName },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
