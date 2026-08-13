import SanityImg from '../sanity/SanityImg';
import { hasImage } from '@/sanity/image';
import styles from './blocks.module.css';
import type { LogoStripBlockData } from './types';

export default function LogoStripBlock({ heading, logos, anchor }: LogoStripBlockData) {
  const valid = (logos || []).filter((l) => hasImage(l.image));
  if (!valid.length) return null;

  return (
    <section id={anchor || undefined} className={styles.logoSection}>
      <div className={styles.logoContainer}>
        {heading && <h2 className={styles.logoHeading}>{heading}</h2>}
        <div className={styles.logoGrid}>
          {valid.map((logo) => {
            const img = (
              <SanityImg
                image={logo.image!}
                alt={logo.name}
                width={240}
                height={80}
                className={styles.logo}
              />
            );

            return logo.url ? (
              <a
                key={logo._key}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {img}
              </a>
            ) : (
              <span key={logo._key}>{img}</span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
