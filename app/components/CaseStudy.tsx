import Link from 'next/link';
import SanityImg from './sanity/SanityImg';
import Blocks from './blocks/Blocks';
import { hasImage, urlFor, type SanityImage } from '@/sanity/image';
import type { Block } from './blocks/types';
import styles from './CaseStudy.module.css';

interface CaseStudyProps {
  _id: string;
  title?: string;
  subtitle?: string;
  heroImage?: SanityImage;
  heroLogo?: SanityImage;
  context?: {
    client?: string;
    clientFull?: string;
    year?: string;
    role?: string;
    industry?: string;
  };
  blocks?: Block[] | null;
}

export default function CaseStudy({
  _id,
  title,
  subtitle,
  heroImage,
  heroLogo,
  context,
  blocks,
}: CaseStudyProps) {
  const contextItems = [
    { label: 'Client', value: context?.clientFull || context?.client },
    { label: 'Year', value: context?.year },
    { label: 'Role', value: context?.role },
    { label: 'Industry', value: context?.industry },
  ].filter((item) => item.value);

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          &larr; Back
        </Link>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      {hasImage(heroImage) && (
        <div className={styles.heroImageWrapper}>
          <SanityImg
            image={heroImage}
            width={1600}
            height={900}
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          {hasImage(heroLogo) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(heroLogo).width(400).url()}
              alt=""
              className={styles.heroLogo}
            />
          )}
        </div>
      )}

      <div className={styles.content}>
        {contextItems.length > 0 && (
          <div className={styles.context}>
            {contextItems.map((item) => (
              <div key={item.label} className={styles.contextItem}>
                <span className={styles.contextLabel}>{item.label}</span>
                <span className={styles.contextValue}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <Blocks
          blocks={blocks}
          variant="caseStudy"
          documentId={_id}
          documentType="caseStudy"
        />
      </div>
    </article>
  );
}
