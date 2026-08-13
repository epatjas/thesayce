import ImageGrid from './ImageGrid';
import styles from './blocks.module.css';
import cs from '../CaseStudy.module.css';
import type { BlockVariant, ImageGroupBlockData } from './types';

type Props = ImageGroupBlockData & { variant?: BlockVariant };

export default function ImageGroupBlock({
  images,
  caption,
  anchor,
  variant = 'page',
}: Props) {
  if (!images?.length) return null;

  if (variant === 'caseStudy') {
    return (
      <div id={anchor || undefined} className={cs.sectionWrapper}>
        <ImageGrid images={images} variant="caseStudy" />
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    );
  }

  return (
    <section id={anchor || undefined} className={styles.imageSection}>
      <div className={styles.imageContainer}>
        <ImageGrid images={images} variant="page" />
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    </section>
  );
}
