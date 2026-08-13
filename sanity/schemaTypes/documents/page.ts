import { defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'content',
      description:
        'The address of this page. Use "home" for the front page; anything else becomes e.g. /about.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Sections',
      type: 'pageBlocks',
      group: 'content',
      description:
        'The page is built from sections. Use "Add item" to add one, and drag to reorder.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Title in search results',
      type: 'string',
      group: 'seo',
      description: 'Optional. Defaults to the page title.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description in search results',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) =>
        Rule.max(160).warning('Search engines usually cut off after 160 characters.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Sharing image',
      type: 'image',
      group: 'seo',
      description:
        'Shown when the page is shared on LinkedIn or in messages. A wide image works best.',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return {
        title: title || 'Untitled page',
        subtitle: slug === 'home' ? '/' : slug ? `/${slug}` : 'No address set',
      };
    },
  },
});
