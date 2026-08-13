import { defineField, defineType } from 'sanity';
import { imageField } from '../objects/shared';

/** Shared shape for the two hero buttons. */
function ctaField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: 'object',
    description,
    options: { collapsible: true, collapsed: false },
    fields: [
      { name: 'label', type: 'string', title: 'Button text' },
      {
        name: 'href',
        type: 'string',
        title: 'Link',
        description:
          'A full address (https://…), an email (mailto:you@example.com), or a section on this page (#contact).',
      },
    ],
    // A button with only half of it filled in would render as a dead control.
    validation: (Rule) =>
      Rule.custom((value?: { label?: string; href?: string }) => {
        if (!value) return true;
        const { label, href } = value;
        if (label && !href) return 'Add a link, or clear the button text.';
        if (href && !label) return 'Add button text, or clear the link.';
        return true;
      }),
  });
}

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
      title: 'Intro text',
      type: 'text',
      rows: 6,
      description: 'Sits to the right of the headline, and under the image on phones.',
    }),
    ctaField('primaryCta', 'Main button', 'Optional. The filled black button.'),
    ctaField('secondaryCta', 'Second button', 'Optional. The outlined button.'),
    imageField('image', 'Image'),
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Hero', subtitle: 'Hero', media };
    },
  },
});
