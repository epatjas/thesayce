import SanityImg from '../sanity/SanityImg';
import PortableTextBody from '../sanity/PortableTextBody';
import { hasImage } from '@/sanity/image';
import { stegaClean } from 'next-sanity';
import styles from '../Contact.module.css';
import type { ContactBlockData } from './types';

export default function ContactSectionBlock({
  headline,
  body,
  email,
  linkedin,
  image,
  anchor,
}: ContactBlockData) {
  // Stega characters must not end up inside href attributes.
  const cleanEmail = stegaClean(email);
  const cleanLinkedin = stegaClean(linkedin);

  return (
    <section id={anchor || undefined} className={styles.section}>
      <div className={styles.container}>
        {hasImage(image) && (
          <div className={styles.imageWrapper}>
            <SanityImg
              image={image}
              width={600}
              height={800}
              sizes="(max-width: 768px) 100vw, 600px"
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.content}>
          {headline && <h2 className={styles.headline}>{headline}</h2>}
          <PortableTextBody value={body} className={styles.text} />
          <div className={styles.links}>
            {cleanEmail && (
              <a href={`mailto:${cleanEmail}`} className={styles.link}>
                {cleanEmail}
              </a>
            )}
            {cleanLinkedin && (
              <a
                href={cleanLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
