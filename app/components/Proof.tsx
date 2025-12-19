import Image from 'next/image';
import Link from 'next/link';
import styles from './Proof.module.css';

interface ProofItem {
  client: string;
  title: string;
  image: string;
  slug?: string;
}

interface ProofProps {
  show: boolean;
  items: ProofItem[];
}

export default function Proof({ show, items }: ProofProps) {
  if (!show) return null;

  return (
    <section id="experience" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Experience</h2>
        <div className={styles.grid}>
          {items.map((item, index) => {
            const CardContent = (
              <>
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.image}
                    alt=""
                    width={600}
                    height={800}
                    className={styles.image}
                  />
                </div>
                {item.client && <span className={styles.client}>{item.client}</span>}
                <p className={styles.title}>{item.title}</p>
              </>
            );

            if (item.slug) {
              return (
                <Link
                  key={index}
                  href={`/case-studies/${item.slug}`}
                  className={styles.cardLink}
                >
                  <article className={styles.card}>
                    {CardContent}
                  </article>
                </Link>
              );
            }

            return (
              <article key={index} className={styles.card}>
                {CardContent}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
