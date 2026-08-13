import { defineArrayMember, defineType } from 'sanity';

/**
 * Deliberately constrained rich text.
 *
 * Paragraphs, one heading level, bold/italic, links and lists — and nothing
 * else. No font sizes, colours or alignment, so the editor cannot drift away
 * from the site's typography. This is the field that makes paragraph breaks
 * ("kappalejako") possible at all; the old Tina model stored body copy as a
 * single plain string.
 */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h3' },
      ],
      lists: [
        { title: 'Bullet list', value: 'bullet' },
        { title: 'Numbered list', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                description:
                  'https://…, mailto:someone@example.com, or /a-page-on-this-site',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                    allowRelative: true,
                  }),
              },
            ],
          }),
        ],
      },
    }),
  ],
});
