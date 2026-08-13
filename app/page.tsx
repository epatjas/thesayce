import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/live';
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { buildMetadata } from '@/app/lib/metadata';
import Header from './components/Header';
import Blocks from './components/blocks/Blocks';
import type { Block } from './components/blocks/types';
import styles from './page.module.css';

async function getHome() {
  const [page, settings] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY, params: { slug: 'home' } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);
  return { page: page.data, settings: settings.data };
}

export async function generateMetadata(): Promise<Metadata> {
  const { page, settings } = await getHome();
  // `page.title` is the studio's internal label ("Homepage") — not a page
  // title anyone should see, so it is deliberately not passed through.
  return buildMetadata({
    page: {
      seoTitle: page?.seoTitle,
      seoDescription: page?.seoDescription,
      shareImage: page?.shareImage,
    },
    settings,
    absolute: true,
  });
}

export default async function Home() {
  const { page, settings } = await getHome();

  if (!page) notFound();

  return (
    <>
      <Header settings={settings} />
      <main className={styles.main}>
        <Blocks
          blocks={page.blocks as Block[] | null}
          documentId={page._id}
          documentType="page"
        />
      </main>
    </>
  );
}
