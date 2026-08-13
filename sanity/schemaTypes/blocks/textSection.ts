import { defineArrayMember, defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

export const textSection = defineType({
  name: 'textSection',
  title: 'Text section',
  type: 'object',
  description:
    'A block of text, optionally with a heading, a pullquote and one image beside it.',
  fieldsets: [advancedFieldset],
  fields: [
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description:
        'Optional small label printed above the heading, e.g. "PHASE 1".',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'richText',
      description:
        'Press Enter for a new paragraph. Use the toolbar for bold, links and lists.',
    }),
    defineField({
      name: 'pullquote',
      title: 'Pullquote',
      type: 'text',
      rows: 3,
      description:
        'Optional. A short line set in large type next to the text.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description:
        'Optional. Images that belong with this text, shown underneath it. One fills the width, two sit side by side, three run across.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description:
                'Describes the image for screen readers. Leave empty if purely decorative.',
            },
          ],
        }),
      ],
      options: { layout: 'grid' },
      validation: (Rule) => Rule.max(3).error('Up to three images.'),
    }),
    anchorField,
  ],
  preview: {
    select: {
      heading: 'heading',
      tag: 'tag',
      body: 'body',
      media: 'images.0',
    },
    prepare({ heading, tag, body, media }) {
      const firstLine = Array.isArray(body)
        ? body
            .find((b: { _type?: string }) => b?._type === 'block')
            ?.children?.map((c: { text?: string }) => c.text)
            .join('')
        : undefined;
      return {
        title: heading || firstLine || 'Text section',
        subtitle: tag ? `Text section · ${tag}` : 'Text section',
        media,
      };
    },
  },
});
