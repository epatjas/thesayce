import Image from 'next/image';
import styles from './Hero.module.css';

interface HeroProps {
  headline: string;
  subline: string;
  image: string;
}

export default function Hero({ headline, subline, image }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.subline}>{subline}</p>
      </div>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt=""
          width={1600}
          height={900}
          priority
          className={styles.image}
        />
      </div>
    </section>
  );
}
