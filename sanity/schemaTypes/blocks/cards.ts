import { defineArrayMember, defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

export const cards = defineType({
  name: 'cards',
  title: 'Cards',
  type: 'object',
  description:
    'A heading, a short intro, and two to four cards side by side. Good for listing situations, services or offers.',
  fieldsets: [advancedFieldset],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'richText',
      description: 'Optional. A short paragraph under the heading.',
    }),
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          fields: [
            {
              name: 'title',
              type: 'text',
              rows: 3,
              title: 'Statement',
              description: 'The larger line at the top of the card.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'body',
              type: 'text',
              rows: 3,
              title: 'Answer',
              description: 'The smaller text at the bottom of the card.',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'body' },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .max(4)
          .error('Add between two and four cards — they sit in a single row.'),
    }),
    anchorField,
  ],
  preview: {
    select: { heading: 'heading', items: 'items' },
    prepare({ heading, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: heading || 'Cards',
        subtitle: `Cards · ${count} card${count === 1 ? '' : 's'}`,
      };
    },
  },
});
