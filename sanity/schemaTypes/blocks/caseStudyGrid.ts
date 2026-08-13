import { defineArrayMember, defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

export const caseStudyGrid = defineType({
  name: 'caseStudyGrid',
  title: 'Case study grid',
  type: 'object',
  description:
    'The cards linking to case studies. By default it shows every published case study, newest order first.',
  fieldsets: [advancedFieldset],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Experience',
    }),
    defineField({
      name: 'source',
      title: 'Which case studies?',
      type: 'string',
      options: {
        list: [
          { title: 'All published case studies', value: 'all' },
          { title: 'Only the ones I pick', value: 'picked' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'items',
      title: 'Case studies',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }] })],
      hidden: ({ parent }) => parent?.source !== 'picked',
      validation: (Rule) =>
        Rule.custom((items, context) => {
          const source = (context.parent as { source?: string })?.source;
          if (source === 'picked' && (!items || items.length === 0)) {
            return 'Pick at least one case study, or switch back to "All published case studies".';
          }
          return true;
        }),
    }),
    anchorField,
  ],
  preview: {
    select: { heading: 'heading', source: 'source' },
    prepare({ heading, source }) {
      return {
        title: heading || 'Case study grid',
        subtitle:
          source === 'picked'
            ? 'Case study grid · hand-picked'
            : 'Case study grid · all published',
      };
    },
  },
});
