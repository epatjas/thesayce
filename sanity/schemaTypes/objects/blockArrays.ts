import { defineArrayMember, defineType } from 'sanity';

const SHARED_BLOCKS = ['textSection', 'pullquote', 'imageGroup', 'logoStrip'];

/**
 * Blocks available on a Page. This is the "+ Add section" menu the editor sees.
 * Kept deliberately short — a long menu is harder to choose from, not easier.
 */
export const pageBlocks = defineType({
  name: 'pageBlocks',
  title: 'Sections',
  type: 'array',
  of: [...['hero', ...SHARED_BLOCKS, 'caseStudyGrid', 'contactBlock']].map((type) =>
    defineArrayMember({ type }),
  ),
  options: { insertMenu: { showIcons: true, views: [{ name: 'list' }] } },
});

/**
 * Blocks available inside a case study. No hero (the case study builds its own
 * from the title and hero image) and no case study grid (it would list itself).
 */
export const caseStudyBlocks = defineType({
  name: 'caseStudyBlocks',
  title: 'Sections',
  type: 'array',
  of: SHARED_BLOCKS.map((type) => defineArrayMember({ type })),
  options: { insertMenu: { showIcons: true, views: [{ name: 'list' }] } },
});
