import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import CaseStudy from '../../components/CaseStudy';
import siteContent from '../../../content/site/site.json';

interface CaseStudyData {
  slug: string;
  published: boolean;
  title: string;
  subtitle?: string;
  heroImage?: string;
  context?: {
    client?: string;
    clientFull?: string;
    year?: string;
    role?: string;
    industry?: string;
  };
  sections?: Array<{
    heading?: string;
    content?: unknown;
    quote?: {
      text?: string;
    };
    images?: {
      layout?: 'full' | 'three';
      image1?: string;
      image2?: string;
      image3?: string;
      logo?: string;
    };
  }>;
  preview?: {
    image?: string;
    title?: string;
  };
}

function getCaseStudies(): CaseStudyData[] {
  const caseStudiesDir = path.join(process.cwd(), 'content/case-studies');

  if (!fs.existsSync(caseStudiesDir)) {
    return [];
  }

  const files = fs.readdirSync(caseStudiesDir).filter(f => f.endsWith('.json'));

  return files.map(file => {
    const content = fs.readFileSync(path.join(caseStudiesDir, file), 'utf8');
    return JSON.parse(content) as CaseStudyData;
  });
}

function getCaseStudyBySlug(slug: string): CaseStudyData | null {
  const caseStudies = getCaseStudies();
  return caseStudies.find(cs => cs.slug === slug && cs.published) || null;
}

export async function generateStaticParams() {
  const caseStudies = getCaseStudies();
  return caseStudies
    .filter(cs => cs.published)
    .map(cs => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: `${caseStudy.title} | Lili Sayce`,
    description: caseStudy.subtitle || `Case study: ${caseStudy.title}`,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      <Header {...siteContent.header} />
      <main>
        <CaseStudy
          title={caseStudy.title}
          subtitle={caseStudy.subtitle}
          heroImage={caseStudy.heroImage}
          context={caseStudy.context}
          sections={caseStudy.sections as CaseStudy['sections']}
        />
      </main>
    </>
  );
}

// Type helper for CaseStudy props
type CaseStudy = React.ComponentProps<typeof CaseStudy>;
