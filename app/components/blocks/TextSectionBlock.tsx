import PortableTextBody from '../sanity/PortableTextBody';
import ImageGrid from './ImageGrid';
import styles from '../Problem.module.css';
import cs from '../CaseStudy.module.css';
import blockStyles from './blocks.module.css';
import type { BlockVariant, TextSectionBlockData } from './types';

type Props = TextSectionBlockData & { variant?: BlockVariant };

export default function TextSectionBlock({
  tag,
  heading,
  body,
  pullquote,
  images,
  anchor,
  variant = 'page',
}: Props) {
  if (variant === 'caseStudy') {
    // Inside a case study: heading in a narrow left column, body on the right,
    // tag as a pill and the pullquote as a beige callout.
    return (
      <div id={anchor || undefined} className={cs.sectionWrapper}>
        {tag && <span className={cs.sectionTag}>{tag}</span>}
        <section className={cs.section}>
          <div className={cs.sectionHeader}>
            {heading && <h2 className={cs.sectionHeading}>{heading}</h2>}
          </div>
          <div className={cs.sectionBody}>
            <PortableTextBody value={body} className={cs.sectionContent} />
            {pullquote && (
              <blockquote className={cs.quote}>
                <p className={cs.quoteText}>{pullquote}</p>
              </blockquote>
            )}
          </div>
        </section>
        <ImageGrid images={images} variant="caseStudy" />
      </div>
    );
  }

  return (
    <section id={anchor || undefined} className={styles.section}>
      <div className={styles.container}>
        {tag && <span className={blockStyles.tag}>{tag}</span>}
        {heading && <h2 className={blockStyles.heading}>{heading}</h2>}

        <div className={styles.textColumns}>
          <PortableTextBody value={body} className={styles.text} />
          {pullquote && <p className={styles.pullquote}>{pullquote}</p>}
        </div>

        {/* No flex wrapper here — it would shrink the grid to its content
            width instead of letting it fill the container. */}
        <ImageGrid images={images} variant="page" />
      </div>
    </section>
  );
}
