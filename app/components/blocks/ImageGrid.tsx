import SanityImg from '../sanity/SanityImg';
import { hasImage, type SanityImage } from '@/sanity/image';
import styles from './blocks.module.css';
import cs from '../CaseStudy.module.css';
import type { BlockVariant } from './types';

const PAGE_GRID = ['', styles.imageGridOne, styles.imageGridTwo, styles.imageGridThree];

/**
 * One to three images. The layout follows the count, so the editor never picks
 * a layout that contradicts what they uploaded.
 */
export default function ImageGrid({
  images,
  variant = 'page',
}: {
  images?: SanityImage[] | null;
  variant?: BlockVariant;
}) {
  const valid = (images || []).filter(hasImage).slice(0, 3);
  if (!valid.length) return null;

  const count = valid.length;
  const isFull = count === 1;

  const pictures = valid.map((image, i) => (
    <div key={image.asset?._ref || i} className={styles.imageWrapper}>
      <SanityImg
        image={image}
        width={isFull ? 1600 : 800}
        height={isFull ? 900 : 800}
        sizes={
          isFull ? '(max-width: 768px) 100vw, 1200px' : '(max-width: 768px) 100vw, 400px'
        }
        className={variant === 'caseStudy' ? undefined : styles.image}
      />
    </div>
  ));

  if (variant === 'caseStudy') {
    // Matches the original case study layout: images sit tight under the text.
    return <div className={isFull ? cs.imagesFull : cs.imagesThree}>{pictures}</div>;
  }

  return (
    <div className={`${styles.imageGrid} ${PAGE_GRID[count]}`}>{pictures}</div>
  );
}
