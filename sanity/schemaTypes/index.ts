import type { SchemaTypeDefinition } from 'sanity';

import { richText } from './objects/richText';
import { pageBlocks, caseStudyBlocks } from './objects/blockArrays';

import { hero } from './blocks/hero';
import { textSection } from './blocks/textSection';
import { pullquote } from './blocks/pullquote';
import { imageGroup } from './blocks/imageGroup';
import { cards } from './blocks/cards';
import { workExamples } from './blocks/workExamples';
import { caseStudyGrid } from './blocks/caseStudyGrid';
import { logoStrip } from './blocks/logoStrip';
import { contactBlock } from './blocks/contactBlock';

import { page } from './documents/page';
import { caseStudy } from './documents/caseStudy';
import { siteSettings } from './documents/siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  page,
  caseStudy,
  siteSettings,
  // Block types (the "Add section" menu)
  hero,
  textSection,
  pullquote,
  imageGroup,
  cards,
  workExamples,
  caseStudyGrid,
  logoStrip,
  contactBlock,
  // Shared objects
  richText,
  pageBlocks,
  caseStudyBlocks,
];
