import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import styles from './Header.module.css';

interface HeaderProps {
  settings?: {
    name?: string | null;
    nav?: Array<{ label?: string | null; href?: string | null }> | null;
    cta?: { label?: string | null; href?: string | null } | null;
  } | null;
}

/** Anchor links stay plain <a>; real routes go through next/link. */
function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Header({ settings }: HeaderProps) {
  const name = settings?.name || 'Lili Sayce';
  const nav = (settings?.nav || []).filter((item) => item?.label && item?.href);
  const cta = settings?.cta;

  return (
    <>
      <div className={styles.topBar}>
        <Link href="/" className={styles.logo}>
          {name}
        </Link>
        {cta?.label && cta?.href && (
          <NavLink href={stegaClean(cta.href)} className={styles.cta}>
            {cta.label}
          </NavLink>
        )}
      </div>
      <nav className={styles.sidebar}>
        {nav.map((item, i) => (
          <NavLink
            key={`${item.href}-${i}`}
            href={stegaClean(item.href!)}
            className={styles.navLink}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
