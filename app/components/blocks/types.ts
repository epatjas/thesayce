import type { PortableTextBlock } from 'sanity';
import type { SanityImage } from '@/sanity/image';

/**
 * The same block types appear on pages and inside case studies, which use
 * different layouts. The variant picks which CSS module a block renders with.
 */
export type BlockVariant = 'page' | 'caseStudy';

export interface HeroCta {
  label?: string | null;
  href?: string | null;
}

export interface HeroBlockData {
  _type: 'hero';
  _key: string;
  headline?: string;
  subline?: string;
  primaryCta?: HeroCta | null;
  secondaryCta?: HeroCta | null;
  image?: SanityImage;
}

export interface TextSectionBlockData {
  _type: 'textSection';
  _key: string;
  tag?: string;
  heading?: string;
  body?: PortableTextBlock[];
  pullquote?: string;
  images?: SanityImage[];
  anchor?: string;
}

export interface PullquoteBlockData {
  _type: 'pullquote';
  _key: string;
  text?: string;
  attribution?: string;
  anchor?: string;
}

export interface ImageGroupBlockData {
  _type: 'imageGroup';
  _key: string;
  images?: SanityImage[];
  caption?: string;
  anchor?: string;
}

export interface CardsBlockData {
  _type: 'cards';
  _key: string;
  heading?: string;
  intro?: PortableTextBlock[];
  items?: Array<{ _key?: string; title?: string; body?: string }>;
  anchor?: string;
}

export interface WorkExamplesBlockData {
  _type: 'workExamples';
  _key: string;
  heading?: string;
  intro?: PortableTextBlock[];
  items?: Array<{
    _key?: string;
    image?: SanityImage;
    duration?: string;
    client?: string;
    title?: string;
    description?: string;
  }>;
  anchor?: string;
}

export interface CaseStudyCard {
  _id: string;
  slug?: string;
  client?: string;
  cardTitle?: string;
  image?: SanityImage;
}

export interface CaseStudyGridBlockData {
  _type: 'caseStudyGrid';
  _key: string;
  heading?: string;
  cards?: CaseStudyCard[];
  anchor?: string;
}

export interface LogoStripBlockData {
  _type: 'logoStrip';
  _key: string;
  heading?: string;
  logos?: Array<{ _key: string; image?: SanityImage; name?: string; url?: string }>;
  anchor?: string;
}

export interface ContactBlockData {
  _type: 'contactBlock';
  _key: string;
  headline?: string;
  body?: PortableTextBlock[];
  email?: string;
  linkedin?: string;
  image?: SanityImage;
  anchor?: string;
}

export type Block =
  | HeroBlockData
  | TextSectionBlockData
  | PullquoteBlockData
  | CardsBlockData
  | WorkExamplesBlockData
  | ImageGroupBlockData
  | CaseStudyGridBlockData
  | LogoStripBlockData
  | ContactBlockData;
