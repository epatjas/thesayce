import SanityImg from '../sanity/SanityImg';
import { hasImage } from '@/sanity/image';
import styles from '../Hero.module.css';
import type { HeroBlockData } from './types';

export default function HeroBlock({ headline, subline, image }: HeroBlockData) {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        {headline && <h1 className={styles.headline}>{headline}</h1>}
        {subline && <p className={styles.subline}>{subline}</p>}
      </div>
      {hasImage(image) && (
        <div className={styles.imageWrapper}>
          <SanityImg
            image={image}
            width={1600}
            height={900}
            priority
            sizes="100vw"
            className={styles.image}
          />
        </div>
      )}
    </section>
  );
}
