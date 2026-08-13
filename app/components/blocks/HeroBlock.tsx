import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import HeroImage from './HeroImage';
import { hasImage } from '@/sanity/image';
import styles from '../Hero.module.css';
import type { HeroBlockData, HeroCta } from './types';

/** A button needs both halves; one without the other is a dead control. */
function isUsable(cta?: HeroCta | null): boolean {
  return Boolean(cta?.label && stegaClean(cta?.href));
}

/** Anchors and external protocols stay plain <a>; internal routes use next/link. */
function CtaButton({
  cta,
  variant,
}: {
  cta?: HeroCta | null;
  variant: 'primary' | 'secondary';
}) {
  if (!isUsable(cta)) return null;

  const label = cta!.label;
  const href = stegaClean(cta!.href) || '';

  const className = `${styles.button} ${
    variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary
  }`;

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  const isExternal = /^https?:/i.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {label}
    </a>
  );
}

export default function HeroBlock({
  headline,
  subline,
  primaryCta,
  secondaryCta,
  image,
}: HeroBlockData) {
  // Checked on the data, not on the rendered elements — a JSX element is
  // truthy even when the component returns null, which would leave an empty
  // actions row taking up margin.
  const hasActions = isUsable(primaryCta) || isUsable(secondaryCta);

  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        {headline && <h1 className={styles.headline}>{headline}</h1>}
        {subline && <p className={styles.subline}>{subline}</p>}

        {hasActions && (
          <div className={styles.actions}>
            <CtaButton cta={primaryCta} variant="primary" />
            <CtaButton cta={secondaryCta} variant="secondary" />
          </div>
        )}

        {hasImage(image) && (
          <HeroImage image={image} alt={stegaClean(image.alt ?? '') || ''} />
        )}
      </div>
    </section>
  );
}
