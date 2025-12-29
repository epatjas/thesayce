import Image from 'next/image';
import Link from 'next/link';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import styles from './CaseStudy.module.css';

interface CaseStudySection {
  heading?: string;
  content?: TinaMarkdownContent;
  quote?: {
    text?: string;
  };
  images?: {
    layout?: 'full' | 'three';
    image1?: string;
    image2?: string;
    image3?: string;
    logo?: string;
  };
}

interface CaseStudyProps {
  title: string;
  subtitle?: string;
  heroImage?: string;
  context?: {
    client?: string;
    clientFull?: string;
    year?: string;
    role?: string;
    industry?: string;
  };
  sections?: CaseStudySection[];
}

export default function CaseStudy({
  title,
  subtitle,
  heroImage,
  context,
  sections,
}: CaseStudyProps) {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          &larr; Back
        </Link>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      {heroImage && (
        <div className={styles.heroImageWrapper}>
          <Image
            src={heroImage}
            alt=""
            width={1600}
            height={900}
            className={styles.heroImage}
            priority
          />
        </div>
      )}

      <div className={styles.content}>
        {context && (
          <div className={styles.context}>
            {(context.clientFull || context.client) && (
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Client</span>
                <span className={styles.contextValue}>{context.clientFull || context.client}</span>
              </div>
            )}
            {context.year && (
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Year</span>
                <span className={styles.contextValue}>{context.year}</span>
              </div>
            )}
            {context.role && (
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Role</span>
                <span className={styles.contextValue}>{context.role}</span>
              </div>
            )}
            {context.industry && (
              <div className={styles.contextItem}>
                <span className={styles.contextLabel}>Industry</span>
                <span className={styles.contextValue}>{context.industry}</span>
              </div>
            )}
          </div>
        )}

        {sections?.map((section, index) => (
          <div key={index} className={styles.sectionWrapper}>
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>

              <div className={styles.sectionBody}>
                {section.content && (
                  <div className={styles.sectionContent}>
                    <TinaMarkdown content={section.content} />
                  </div>
                )}

                {section.quote?.text && (
                  <blockquote className={styles.quote}>
                    <p className={styles.quoteText}>{section.quote.text}</p>
                  </blockquote>
                )}
              </div>
            </section>

            {section.images?.image1 && (
              <>
                {section.images.layout === 'three' ? (
                  <div className={styles.imagesThree}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={section.images.image1}
                        alt=""
                        width={400}
                        height={400}
                      />
                      {section.images.logo && (
                        <img
                          src={section.images.logo}
                          alt=""
                          className={styles.imageLogo}
                        />
                      )}
                    </div>
                    {section.images.image2 && (
                      <div className={styles.imageWrapper}>
                        <Image
                          src={section.images.image2}
                          alt=""
                          width={400}
                          height={400}
                        />
                      </div>
                    )}
                    {section.images.image3 && (
                      <div className={styles.imageWrapper}>
                        <Image
                          src={section.images.image3}
                          alt=""
                          width={400}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.imagesFull}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={section.images.image1}
                        alt=""
                        width={1200}
                        height={675}
                      />
                      {section.images.logo && (
                        <img
                          src={section.images.logo}
                          alt=""
                          className={styles.imageLogo}
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
