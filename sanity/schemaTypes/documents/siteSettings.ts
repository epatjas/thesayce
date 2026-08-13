import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'header', title: 'Header', default: true },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'header',
      description: 'Shown top left, and used as the site title.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nav',
      title: 'Navigation links',
      type: 'array',
      group: 'header',
      description:
        'Links down the left side. To point at a section on the front page, set the section\'s "Link anchor" and write "#that-anchor" here.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              type: 'string',
              title: 'Link',
              description: 'e.g. "#about" for a section, or "/about" for a page.',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Button (top right)',
      type: 'object',
      group: 'header',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'Link' },
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default description in search results',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Used for any page that has no description of its own.',
      validation: (Rule) =>
        Rule.max(160).warning('Search engines usually cut off after 160 characters.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Default sharing image',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' };
    },
  },
});
