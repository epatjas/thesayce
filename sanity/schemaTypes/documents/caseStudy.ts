import { defineField, defineType } from 'sanity';
import { orderRankField } from '@sanity/orderable-document-list';
import { imageField } from '../objects/shared';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case studies',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'card', title: 'Card on the homepage' },
  ],
  fields: [
    // Drag-to-reorder in the case study list. Replaces the old numeric
    // "Display Order" field, which required knowing every other number.
    orderRankField({ type: 'caseStudy' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'content',
      description: 'Becomes /case-studies/… — avoid changing it once the page is live.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    imageField('heroImage', 'Hero image', { group: 'content' }),
    defineField({
      name: 'heroLogo',
      title: 'Client logo on the hero image',
      type: 'image',
      group: 'content',
      description: 'Optional. An SVG with a transparent background works best.',
    }),
    defineField({
      name: 'context',
      title: 'Context box',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'client',
          type: 'string',
          title: 'Client name (short)',
          description: 'Used on the homepage card, e.g. "Gerresheimer".',
        },
        {
          name: 'clientFull',
          type: 'string',
          title: 'Client name (full)',
          description:
            'Shown in the context box, e.g. "Gerresheimer AG (€2B+ revenue, 10,000+ employees)".',
        },
        { name: 'year', type: 'string', title: 'Year / timeline' },
        { name: 'role', type: 'string', title: 'Role' },
        { name: 'industry', type: 'string', title: 'Industry' },
      ],
    }),
    defineField({
      name: 'blocks',
      title: 'Sections',
      type: 'caseStudyBlocks',
      group: 'content',
      description:
        'The body of the case study. Use "Add item" to add a section, and drag to reorder.',
    }),
    defineField({
      name: 'preview',
      title: 'Card',
      type: 'object',
      group: 'card',
      description: 'How this case study appears in the grid on the homepage.',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Card title',
          description:
            'Short, usually the result — e.g. "Got a stuck product to market 8 months faster". Falls back to the case study title.',
        },
        {
          name: 'image',
          type: 'image',
          title: 'Card image',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'context.client',
      media: 'preview.image',
      heroImage: 'heroImage',
    },
    prepare({ title, client, media, heroImage }) {
      return {
        title: title || 'Untitled case study',
        subtitle: client || undefined,
        media: media || heroImage,
      };
    },
  },
});
