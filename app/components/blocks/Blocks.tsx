import { createDataAttribute } from 'next-sanity';

import HeroBlock from './HeroBlock';
import TextSectionBlock from './TextSectionBlock';
import PullquoteBlock from './PullquoteBlock';
import ImageGroupBlock from './ImageGroupBlock';
import CardsBlock from './CardsBlock';
import WorkExamplesBlock from './WorkExamplesBlock';
import CaseStudyGridBlock from './CaseStudyGridBlock';
import LogoStripBlock from './LogoStripBlock';
import ContactSectionBlock from './ContactSectionBlock';
import type { Block, BlockVariant } from './types';

interface BlocksProps {
  blocks?: Block[] | null;
  variant?: BlockVariant;
  /** Needed so Presentation mode can highlight the right section in the studio. */
  documentId?: string;
  documentType?: string;
}

function renderBlock(block: Block, variant: BlockVariant) {
  switch (block._type) {
    case 'hero':
      return <HeroBlock {...block} />;
    case 'textSection':
      return <TextSectionBlock {...block} variant={variant} />;
    case 'pullquote':
      return <PullquoteBlock {...block} variant={variant} />;
    case 'imageGroup':
      return <ImageGroupBlock {...block} variant={variant} />;
    case 'cards':
      return <CardsBlock {...block} />;
    case 'workExamples':
      return <WorkExamplesBlock {...block} />;
    case 'caseStudyGrid':
      return <CaseStudyGridBlock {...block} />;
    case 'logoStrip':
      return <LogoStripBlock {...block} />;
    case 'contactBlock':
      return <ContactSectionBlock {...block} />;
    default:
      // A block type that exists in the studio but has no renderer yet.
      // Skipped rather than crashing the page.
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `No renderer for block type "${(block as { _type: string })._type}".`,
        );
      }
      return null;
  }
}

export default function Blocks({
  blocks,
  variant = 'page',
  documentId,
  documentType,
}: BlocksProps) {
  if (!blocks?.length) return null;

  const attr =
    documentId && documentType
      ? createDataAttribute({ id: documentId, type: documentType, path: 'blocks' })
      : null;

  return (
    <>
      {blocks.map((block) => (
        <div key={block._key} data-sanity={attr?.([{ _key: block._key }]).toString()}>
          {renderBlock(block, variant)}
        </div>
      ))}
    </>
  );
}
