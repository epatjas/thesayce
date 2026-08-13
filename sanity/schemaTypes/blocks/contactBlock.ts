import { defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField, imageField } from '../objects/shared';

export const contactBlock = defineType({
  name: 'contactBlock',
  title: 'Contact',
  type: 'object',
  description: 'The closing section with your email and LinkedIn.',
  fieldsets: [advancedFieldset],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'richText',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    imageField('image', 'Portrait'),
    anchorField,
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Contact', subtitle: 'Contact', media };
    },
  },
});
