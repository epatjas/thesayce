import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { client } from '@/sanity/client';
import { sanityFetch } from '@/sanity/live';
import {
  SITE_SETTINGS_QUERY,
  WORK_EXAMPLE_QUERY,
  WORK_EXAMPLE_SLUGS_QUERY,
} from '@/sanity/queries';
import { buildMetadata } from '@/app/lib/metadata';
import Header from '../../components/Header';
import WorkExample from '../../components/WorkExample';
import type { SanityImage } from '@/sanity/image';
import styles from '../../page.module.css';

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(WORK_EXAMPLE_SLUGS_QUERY);
    return (slugs || [])
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({ slug }));
  } catch {
    // Pages render on demand anyway; don't fail the build if Sanity is
    // briefly unreachable.
    return [];
  }
}

async function getWorkExample(slug: string) {
  const [parent, settings] = await Promise.all([
    sanityFetch({ query: WORK_EXAMPLE_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);
  return { parent: parent.data, settings: settings.data };
}

/** The section the example's card sits in, on whichever page lists it. */
function sectionHref(parent: {
  _type: string;
  parentSlug: string | null;
  block: { anchor?: string | null } | null;
}) {
  const slug = stegaClean(parent.parentSlug);
  const anchor = stegaClean(parent.block?.anchor);
  const base =
    parent._type === 'caseStudy'
      ? `/case-studies/${slug}`
      : !slug || slug === 'home'
        ? '/'
        : `/${slug}`;
  return anchor ? `${base}#${anchor}` : base;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { parent, settings } = await getWorkExample(slug);
  const example = parent?.block?.example;

  if (!example) return { title: 'Example not found' };

  return buildMetadata({
    page: {
      title: [stegaClean(example.client), stegaClean(example.title)]
        .filter(Boolean)
        .join(': '),
      seoDescription: example.description,
      shareImage: example.image as SanityImage,
    },
    settings,
  });
}

export default async function WorkExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { parent, settings } = await getWorkExample(slug);
  const example = parent?.block?.example;

  if (!parent || !example) notFound();

  return (
    <>
      <Header settings={settings} />
      <main className={styles.main}>
        <WorkExample
          title={example.title}
          client={example.client}
          duration={example.duration}
          description={example.description}
          image={example.image as SanityImage}
          story={example.story}
          others={parent.block?.others}
          backHref={sectionHref(parent)}
        />
      </main>
    </>
  );
}
