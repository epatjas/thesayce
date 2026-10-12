import Link from 'next/link';
import type { PortableTextBlock } from 'sanity';
import SanityImg from './sanity/SanityImg';
import PortableTextBody from './sanity/PortableTextBody';
import { hasImage, type SanityImage } from '@/sanity/image';
import styles from './WorkExample.module.css';

interface StorySection {
  _key: string;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
}

interface OtherExample {
  _key: string;
  slug?: string | null;
  duration?: string | null;
  client?: string | null;
  title?: string | null;
  image?: SanityImage | null;
}

interface WorkExampleProps {
  title?: string | null;
  client?: string | null;
  duration?: string | null;
  /** The card's short text, repeated here as the line under the title. */
  description?: string | null;
  image?: SanityImage | null;
  story?: StorySection[] | null;
  others?: OtherExample[] | null;
  /** Where the card that led here sits, e.g. "/#in-practise". */
  backHref: string;
}

export default function WorkExample({
  title,
  client,
  duration,
  description,
  image,
  story,
  others,
  backHref,
}: WorkExampleProps) {
  const parts = (story || []).filter((part) => part?.body?.length);
  const more = (others || []).filter((item) => item?.slug && item?.title);

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <Link href={backHref} className={styles.backLink}>
            &larr; All examples
          </Link>
          {client && (
            <p className={styles.client}>
              Client
              <span className={styles.separator} aria-hidden="true" />
              {client}
            </p>
          )}
          {title && <h1 className={styles.title}>{title}</h1>}
          {description && <p className={styles.lead}>{description}</p>}
          {duration && <p className={styles.badge}>{duration}</p>}
        </div>

        {hasImage(image) && (
          <div className={styles.media}>
            <SanityImg
              image={image}
              width={960}
              height={960}
              priority
              sizes="(max-width: 900px) 100vw, 460px"
              className={styles.image}
            />
          </div>
        )}
      </header>

      {parts.map((part) => (
        <section key={part._key} className={styles.part}>
          <h2 className={styles.partHeading}>{part.heading}</h2>
          <PortableTextBody value={part.body} className={styles.partBody} />
        </section>
      ))}

      {more.length > 0 && (
        <nav className={styles.more} aria-labelledby="more-examples">
          <h2 id="more-examples" className={styles.moreHeading}>
            More examples
          </h2>
          <ul className={styles.moreList}>
            {more.map((item) => (
              <li key={item._key}>
                <Link href={`/work/${item.slug}`} className={styles.moreLink}>
                  {hasImage(item.image) && (
                    <SanityImg
                      image={item.image}
                      width={240}
                      height={240}
                      sizes="96px"
                      className={styles.moreImage}
                      // The title right next to it already says what this is.
                      alt=""
                    />
                  )}
                  <span className={styles.moreText}>
                    <span className={styles.moreMeta}>
                      {[item.client, item.duration].filter(Boolean).join(' · ')}
                    </span>
                    <span className={styles.moreTitle}>{item.title}</span>
                  </span>
                  <span className={styles.moreArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
