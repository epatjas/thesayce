import Image from 'next/image';
import styles from './Problem.module.css';

interface ProblemProps {
  text: string;
  pullquote: string;
  image: string;
}

export default function Problem({ text, pullquote, image }: ProblemProps) {
  return (
    <section id="problem" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumns}>
          <p className={styles.text}>{text}</p>
          <p className={styles.pullquote}>{pullquote}</p>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt=""
            width={800}
            height={1100}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
