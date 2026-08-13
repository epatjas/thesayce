import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { client } from '@/sanity/client';
import { sanityFetch } from '@/sanity/live';
import {
  CASE_STUDY_QUERY,
  CASE_STUDY_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries';
import { buildMetadata } from '@/app/lib/metadata';
import Header from '../../components/Header';
import CaseStudy from '../../components/CaseStudy';
import type { Block } from '../../components/blocks/types';
import type { SanityImage } from '@/sanity/image';

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(CASE_STUDY_SLUGS_QUERY);
    return (slugs || [])
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({ slug }));
  } catch {
    // Pages render on demand anyway; don't fail the build if Sanity is
    // briefly unreachable.
    return [];
  }
}

async function getCaseStudy(slug: string) {
  const [caseStudy, settings] = await Promise.all([
    sanityFetch({ query: CASE_STUDY_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);
  return { caseStudy: caseStudy.data, settings: settings.data };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { caseStudy, settings } = await getCaseStudy(slug);

  if (!caseStudy) return { title: 'Case study not found' };

  return buildMetadata({
    page: {
      title: caseStudy.title,
      seoDescription: stegaClean(caseStudy.subtitle),
      shareImage: caseStudy.heroImage as SanityImage,
    },
    settings,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { caseStudy, settings } = await getCaseStudy(slug);

  if (!caseStudy) notFound();

  return (
    <>
      <Header settings={settings} />
      <main>
        <CaseStudy
          _id={caseStudy._id}
          title={caseStudy.title ?? undefined}
          subtitle={caseStudy.subtitle ?? undefined}
          heroImage={caseStudy.heroImage as SanityImage}
          heroLogo={caseStudy.heroLogo as SanityImage}
          context={caseStudy.context ?? undefined}
          blocks={caseStudy.blocks as Block[] | null}
        />
      </main>
    </>
  );
}
