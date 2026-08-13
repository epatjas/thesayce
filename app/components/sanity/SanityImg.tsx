import Image from 'next/image';
import { stegaClean } from 'next-sanity';
import { urlForCrop, type SanityImage } from '@/sanity/image';

interface SanityImgProps {
  image: SanityImage;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Overrides the alt text stored on the image. */
  alt?: string | null;
}

/**
 * next/image fed from Sanity's image pipeline. Cropping happens server-side
 * around the hotspot the editor set, and the stored LQIP is used as the blur
 * placeholder.
 */
export default function SanityImg({
  image,
  width,
  height,
  className,
  sizes,
  priority,
  alt,
}: SanityImgProps) {
  if (!image?.asset) return null;

  const src = urlForCrop(image, width, height).url();
  const lqip = image.asset?.metadata?.lqip ?? undefined;
  // Stega metadata would otherwise leak invisible characters into the alt text.
  const altText = stegaClean(alt ?? image.alt ?? '') || '';

  return (
    <Image
      src={src}
      alt={altText}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? 'blur' : undefined}
      blurDataURL={lqip}
    />
  );
}
