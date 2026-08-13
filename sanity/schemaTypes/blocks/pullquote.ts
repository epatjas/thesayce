import { defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

export const pullquote = defineType({
  name: 'pullquote',
  title: 'Pullquote',
  type: 'object',
  description: 'One short statement, set large, standing on its own.',
  fieldsets: [advancedFieldset],
  fields: [
    defineField({
      name: 'text',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Optional. Who said it, e.g. "Head of Innovation, Gerresheimer".',
    }),
    anchorField,
  ],
  preview: {
    select: { title: 'text', subtitle: 'attribution' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Pullquote',
        subtitle: subtitle ? `Pullquote · ${subtitle}` : 'Pullquote',
      };
    },
  },
});
