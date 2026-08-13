import PortableTextBody from '../sanity/PortableTextBody';
import styles from './blocks.module.css';
import type { CardsBlockData } from './types';

export default function CardsBlock({ heading, intro, items, anchor }: CardsBlockData) {
  const cards = (items || []).filter((item) => item?.title);
  if (!cards.length) return null;

  return (
    <section id={anchor || undefined} className={styles.cardsSection}>
      <div className={styles.cardsContainer}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        <PortableTextBody value={intro} className={styles.sectionIntro} />

        <div className={styles.cardsGrid}>
          {cards.map((card, i) => (
            <article key={card._key || i} className={styles.card}>
              <p className={styles.cardTitle}>{card.title}</p>
              {card.body && <p className={styles.cardBody}>{card.body}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
