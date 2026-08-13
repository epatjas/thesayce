import styles from './blocks.module.css';
import cs from '../CaseStudy.module.css';
import type { BlockVariant, PullquoteBlockData } from './types';

type Props = PullquoteBlockData & { variant?: BlockVariant };

export default function PullquoteBlock({
  text,
  attribution,
  anchor,
  variant = 'page',
}: Props) {
  if (!text) return null;

  if (variant === 'caseStudy') {
    return (
      <div id={anchor || undefined} className={cs.sectionWrapper}>
        <blockquote className={cs.quote}>
          <p className={cs.quoteText}>{text}</p>
          {attribution && <p className={styles.attribution}>{attribution}</p>}
        </blockquote>
      </div>
    );
  }

  return (
    <section id={anchor || undefined} className={styles.quoteSection}>
      <div className={styles.quoteContainer}>
        <blockquote className={styles.quote}>{text}</blockquote>
        {attribution && <p className={styles.attribution}>{attribution}</p>}
      </div>
    </section>
  );
}
