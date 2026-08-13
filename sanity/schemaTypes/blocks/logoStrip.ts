import { defineArrayMember, defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

export const logoStrip = defineType({
  name: 'logoStrip',
  title: 'Logo strip',
  type: 'object',
  description: 'A row of client logos.',
  fieldsets: [advancedFieldset],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional, e.g. "Worked with".',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'logo',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'Logo',
              description: 'An SVG or PNG with a transparent background works best.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'name',
              type: 'string',
              title: 'Company name',
              description: 'Used as the alt text.',
              validation: (Rule) => Rule.required(),
            },
            { name: 'url', type: 'url', title: 'Link (optional)' },
          ],
          preview: {
            select: { title: 'name', media: 'image' },
          },
        }),
      ],
      options: { layout: 'grid' },
      validation: (Rule) => Rule.required().min(1),
    }),
    anchorField,
  ],
  preview: {
    select: { heading: 'heading', logos: 'logos', media: 'logos.0.image' },
    prepare({ heading, logos, media }) {
      const count = Array.isArray(logos) ? logos.length : 0;
      return {
        title: heading || 'Logo strip',
        subtitle: `Logo strip · ${count} logo${count === 1 ? '' : 's'}`,
        media,
      };
    },
  },
});
