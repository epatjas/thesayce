import Image from 'next/image';
import styles from './Contact.module.css';

interface ContactProps {
  headline: string;
  text: string;
  email: string;
  linkedin: string;
  image: string;
}

export default function Contact({ headline, text, email, linkedin, image }: ContactProps) {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt="Lili Sayce"
            width={300}
            height={400}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.headline}>{headline}</h2>
          <p className={styles.text}>{text}</p>
          <div className={styles.links}>
            <a href={`mailto:${email}`} className={styles.link}>
              {email}
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
