import { defineField, defineType } from 'sanity';
import { imageField } from '../objects/shared';

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  description: 'The big opening statement at the top of a page.',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subline',
      title: 'Subline',
      type: 'text',
      rows: 4,
    }),
    imageField('image', 'Image'),
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Hero', subtitle: 'Hero', media };
    },
  },
});
