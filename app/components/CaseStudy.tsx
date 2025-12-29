import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import styles from './CaseStudy.module.css';

interface CaseStudySection {
  tag?: string;
  heading?: string;
  content?: TinaMarkdownContent | string;
  quote?: {
    text?: string;
  };
  images?: {
    layout?: 'full' | 'three';
    image1?: string;
    image2?: string;
    image3?: string;
  };
}

// Helper to check if content is TinaMarkdown AST or plain string
function isRichTextContent(content: unknown): content is TinaMarkdownContent {
  return (
    content !== null &&
    typeof content === 'object' &&
    'type' in (content as object) &&
    'children' in (content as object)
  );
}

// Simple markdown parser for plain text strings
function renderMarkdownString(text: string) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split('\n');
  let currentList: string[] = [];
  let blockIndex = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${blockIndex++}`}>
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  let paragraph = '';
  for (const line of lines) {
    const trimmed = line.trim();

    // Check for bullet points
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      // Flush any pending paragraph
      if (paragraph.trim()) {
        flushList();
        blocks.push(<p key={`p-${blockIndex++}`}>{paragraph.trim()}</p>);
        paragraph = '';
      }
      currentList.push(trimmed.slice(2));
    } else if (trimmed === '') {
      // Empty line - flush paragraph
      if (paragraph.trim()) {
        flushList();
        blocks.push(<p key={`p-${blockIndex++}`}>{paragraph.trim()}</p>);
        paragraph = '';
      }
      flushList();
    } else {
      // Regular text
      flushList();
      paragraph += (paragraph ? ' ' : '') + trimmed;
    }
  }

  // Flush remaining content
  if (paragraph.trim()) {
    flushList();
    blocks.push(<p key={`p-${blockIndex++}`}>{paragraph.trim()}</p>);
  }
  flushList();

  return blocks;
}

interface CaseStudyProps {
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroLogo?: string;
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
  heroLogo,
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
          {heroLogo && (
            <img
              src={heroLogo}
              alt=""
              className={styles.heroLogo}
            />
          )}
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
            {section.tag && (
              <span className={styles.sectionTag}>{section.tag}</span>
            )}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionHeading}>{section.heading}</h2>
              </div>

              <div className={styles.sectionBody}>
                {section.content && (
                  <div className={styles.sectionContent}>
                    {isRichTextContent(section.content) ? (
                      <TinaMarkdown content={section.content} />
                    ) : typeof section.content === 'string' && section.content.trim() && !section.content.includes('[object Object]') ? (
                      // Render plain text with markdown parsing
                      renderMarkdownString(section.content)
                    ) : null}
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
