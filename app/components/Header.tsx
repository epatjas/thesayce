import styles from './Header.module.css';

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  name: string;
  nav: NavItem[];
  cta: {
    label: string;
    href: string;
  };
}

export default function Header({ name, nav, cta }: HeaderProps) {
  return (
    <>
      <div className={styles.topBar}>
        <a href="#" className={styles.logo}>
          {name}
        </a>
        <a href={cta.href} className={styles.cta}>
          {cta.label}
        </a>
      </div>
      <nav className={styles.sidebar}>
        {nav.map((item) => (
          <a key={item.href} href={item.href} className={styles.navLink}>
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}
