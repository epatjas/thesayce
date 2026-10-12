import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import SanityImg from '../sanity/SanityImg';
import PortableTextBody from '../sanity/PortableTextBody';
import { hasImage } from '@/sanity/image';
import styles from './blocks.module.css';
import type { WorkExamplesBlockData } from './types';

export default function WorkExamplesBlock({
  heading,
  intro,
  items,
  anchor,
}: WorkExamplesBlockData) {
  const examples = (items || []).filter((item) => item?.title && hasImage(item.image));
  if (!examples.length) return null;

  return (
    <section id={anchor || undefined} className={styles.workSection}>
      <div className={styles.workContainer}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        <PortableTextBody value={intro} className={styles.sectionIntro} />

        <div className={styles.workGrid}>
          {examples.map((item, i) => {
            // An example only links somewhere once it has a story to show.
            const slug = item.hasStory ? stegaClean(item.slug) : null;

            const content = (
              <>
                <div className={styles.workMedia}>
                  <SanityImg
                    image={item.image!}
                    width={800}
                    height={800}
                    sizes="(max-width: 1000px) 100vw, 380px"
                    className={styles.workImage}
                  />
                  {item.duration && <span className={styles.workBadge}>{item.duration}</span>}
                </div>

                {item.client && (
                  <p className={styles.workClient}>
                    Client
                    {/* Drawn as a rule, not a "|" glyph — see blocks.module.css */}
                    <span className={styles.workSeparator} aria-hidden="true" />
                    {item.client}
                  </p>
                )}
                <h3 className={styles.workTitle}>{item.title}</h3>
                {item.description && (
                  <p className={styles.workDescription}>{item.description}</p>
                )}
                {slug && (
                  <span className={styles.workMore}>
                    Read the story
                    <span className={styles.workArrow} aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                )}
              </>
            );

            if (!slug) {
              return (
                <article key={item._key || i} className={styles.workItem}>
                  {content}
                </article>
              );
            }

            return (
              <Link key={item._key || i} href={`/work/${slug}`} className={styles.workLink}>
                <article className={styles.workItem}>{content}</article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
