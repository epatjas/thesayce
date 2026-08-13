import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { sanityFetch } from '@/sanity/live';
import {
  PAGE_QUERY,
  PAGE_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries';
import { buildMetadata } from '@/app/lib/metadata';
import Header from '../components/Header';
import Blocks from '../components/blocks/Blocks';
import type { Block } from '../components/blocks/types';
import styles from '../page.module.css';

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(PAGE_SLUGS_QUERY);
    return (slugs || [])
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({ slug }));
  } catch {
    // Pages render on demand anyway; don't fail the build if Sanity is
    // briefly unreachable.
    return [];
  }
}

async function getPage(slug: string) {
  const [page, settings] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);
  return { page: page.data, settings: settings.data };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { page, settings } = await getPage(slug);
  if (!page) return { title: 'Page not found' };
  return buildMetadata({ page, settings, titleSuffix: true });
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { page, settings } = await getPage(slug);

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
