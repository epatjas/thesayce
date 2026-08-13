import Link from 'next/link';
import SanityImg from '../sanity/SanityImg';
import { hasImage } from '@/sanity/image';
import styles from '../Proof.module.css';
import type { CaseStudyGridBlockData } from './types';

export default function CaseStudyGridBlock({
  heading,
  cards,
  anchor,
}: CaseStudyGridBlockData) {
  if (!cards?.length) return null;

  return (
    <section id={anchor || undefined} className={styles.section}>
      <div className={styles.container}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        <div className={styles.grid}>
          {cards.map((card) => {
            const content = (
              <>
                {hasImage(card.image) && (
                  <div className={styles.imageWrapper}>
                    <SanityImg
                      image={card.image}
                      width={600}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={styles.image}
                    />
                  </div>
                )}
                {card.client && <span className={styles.client}>{card.client}</span>}
                {card.cardTitle && <p className={styles.title}>{card.cardTitle}</p>}
              </>
            );

            if (!card.slug) {
              return (
                <article key={card._id} className={styles.card}>
                  {content}
                </article>
              );
            }

            return (
              <Link
                key={card._id}
                href={`/case-studies/${card.slug}`}
                className={styles.cardLink}
              >
                <article className={styles.card}>{content}</article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
