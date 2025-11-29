import Image from 'next/image';
import styles from './Question.module.css';

interface QuestionProps {
  text: string;
  pullquote: string;
  image: string;
}

export default function Question({ text, pullquote, image }: QuestionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.text}>{text}</p>
          <p className={styles.pullquote}>{pullquote}</p>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt=""
            width={800}
            height={1000}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
