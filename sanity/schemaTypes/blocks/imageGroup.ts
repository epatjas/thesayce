import { defineArrayMember, defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

export const imageGroup = defineType({
  name: 'imageGroup',
  title: 'Images',
  type: 'object',
  description:
    'One to three images. The layout follows the number of images: one fills the width, two sit side by side, three run across.',
  fieldsets: [advancedFieldset],
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
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
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(3)
          .error('Add between one and three images.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional line of text printed under the images.',
    }),
    anchorField,
  ],
  preview: {
    select: { images: 'images', caption: 'caption', media: 'images.0' },
    prepare({ images, caption, media }) {
      const count = Array.isArray(images) ? images.length : 0;
      const layout =
        count === 1 ? 'full width' : count === 2 ? 'side by side' : 'three across';
      return {
        title: caption || `${count} image${count === 1 ? '' : 's'}`,
        subtitle: count ? `Images · ${layout}` : 'Images',
        media,
      };
    },
  },
});
