import { urlForCrop, type SanityImage } from '@/sanity/image';
import styles from '../Hero.module.css';

/**
 * Art-directed hero image.
 *
 * Desktop gets a 16:9 crop, phones get a square one. Both are cropped by
 * Sanity around the hotspot the editor set, which a single source plus a CSS
 * `aspect-ratio` could not do — the browser would centre-crop the letterbox
 * and cut the subject. `<picture>` means only the matching source downloads.
 */
export default function HeroImage({ image, alt }: { image: SanityImage; alt: string }) {
  const wide = (w: number, dpr = 1) =>
    urlForCrop(image, w, Math.round((w / 16) * 9)).dpr(dpr).url();
  const square = (w: number, dpr = 1) => urlForCrop(image, w, w).dpr(dpr).url();

  const lqip = image.asset?.metadata?.lqip;

  return (
    <div
      className={styles.imageWrapper}
      style={
        lqip
          ? { backgroundImage: `url(${lqip})`, backgroundSize: 'cover' }
          : undefined
      }
    >
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={`${square(800)} 1x, ${square(800, 2)} 2x`}
        />
        <source srcSet={`${wide(1600)} 1x, ${wide(1600, 2)} 2x`} />
        <img
          src={wide(1600)}
          alt={alt}
          width={1600}
          height={900}
          className={styles.image}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
    </div>
  );
}
