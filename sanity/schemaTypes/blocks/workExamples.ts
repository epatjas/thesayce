import { defineArrayMember, defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

export const workExamples = defineType({
  name: 'workExamples',
  title: 'Work examples',
  type: 'object',
  description:
    'Examples of real engagements: a photo, how long it took, the client and a short description.',
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
      title: 'Examples',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workExample',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'Photo',
              options: { hotspot: true },
              description:
                'Shown as a square. Use the crop tool to set what must stay in frame.',
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt text',
                  description: 'Describes the photo for screen readers.',
                },
              ],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'duration',
              type: 'string',
              title: 'Duration',
              description:
                'The small label on the photo, e.g. "8 weeks", "1 day", "4 hours". Leave empty to hide it.',
            },
            {
              name: 'client',
              type: 'string',
              title: 'Client',
              description: 'Printed above the title, e.g. "Invacare International".',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
              description: 'What the work was, e.g. "Innovation Sprint coaching".',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              rows: 3,
              title: 'Description',
            },
          ],
          preview: {
            select: {
              title: 'title',
              client: 'client',
              duration: 'duration',
              media: 'image',
            },
            prepare({ title, client, duration, media }) {
              const meta = [client, duration].filter(Boolean).join(' · ');
              return { title: title || 'Work example', subtitle: meta, media };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).max(6).error('Add between one and six examples.'),
    }),
    anchorField,
  ],
  preview: {
    select: { heading: 'heading', items: 'items', media: 'items.0.image' },
    prepare({ heading, items, media }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: heading || 'Work examples',
        subtitle: `Work examples · ${count} example${count === 1 ? '' : 's'}`,
        media,
      };
    },
  },
});
