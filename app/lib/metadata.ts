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
 * Page metadata, falling back to the site defaults.
 *
 * The site name is appended by the `title.template` in the root layout, so it
 * must NOT be added here as well. Pass `absolute` for the homepage, where the
 * title should stand alone rather than read "Homepage | Lili Sayce".
 *
 * Every value is run through stegaClean — in draft mode the raw strings carry
 * invisible editing metadata that must never reach a <title> or og: tag.
 */
export function buildMetadata({
  page,
  settings,
  absolute,
}: {
  page?: MetadataSource | null;
  settings?: SettingsSource | null;
  absolute?: boolean;
}): Metadata {
  const siteName = stegaClean(settings?.name) || 'Lili Sayce';
  const pageTitle = stegaClean(page?.seoTitle) || stegaClean(page?.title) || siteName;

  // Open Graph has no template mechanism, so it always needs the full string.
  const fullTitle =
    absolute || pageTitle === siteName ? pageTitle : `${pageTitle} | ${siteName}`;

  const description =
    stegaClean(page?.seoDescription) || stegaClean(settings?.seoDescription) || undefined;

  const shareSource = hasImage(page?.shareImage)
    ? page.shareImage
    : hasImage(settings?.shareImage)
      ? settings.shareImage
      : null;

  const imageUrl = shareSource ? urlForCrop(shareSource, 1200, 630).url() : undefined;

  const images = imageUrl
    ? [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }]
    : undefined;

  return {
    title: absolute ? { absolute: pageTitle } : pageTitle,
    description,
    openGraph: { title: fullTitle, description, type: 'website', images, siteName },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
