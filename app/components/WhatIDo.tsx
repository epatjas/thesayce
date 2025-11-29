import Image from 'next/image';
import styles from './WhatIDo.module.css';

interface WhatIDoProps {
  text: string;
  pullquote: string;
  image: string;
}

export default function WhatIDo({ text, pullquote, image }: WhatIDoProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt=""
            width={1200}
            height={800}
            className={styles.image}
          />
        </div>
        <div className={styles.textColumns}>
          <p className={styles.text}>{text}</p>
          <p className={styles.pullquote}>{pullquote}</p>
        </div>
      </div>
    </section>
  );
}
