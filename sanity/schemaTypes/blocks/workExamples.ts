import { defineArrayMember, defineField, defineType } from 'sanity';
import { advancedFieldset, anchorField } from '../objects/shared';

type ExampleItem = {
  _key?: string;
  title?: string;
  client?: string;
  slug?: { current?: string };
  story?: unknown[];
};

export const workExamples = defineType({
  name: 'workExamples',
  title: 'Work examples',
  type: 'object',
  description:
    'Examples of real engagements: a photo, how long it took, the client and a short description. An example with a full story gets its own page, and its card links to it.',
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
              title: 'Short description',
              description:
                'One or two sentences for the card. If the example has a story page, this is also the line under its title. The longer text goes in "Full story" below.',
              validation: (Rule) =>
                Rule.max(220).warning(
                  'This is getting long for a card. Move the detail into "Full story" below.',
                ),
            },
            {
              name: 'story',
              type: 'array',
              title: 'Full story',
              description:
                'Optional. Gives this example its own page, and the card becomes a link to it. Add one part per heading, e.g. "The question", "What I did", "What came out", "The insight".',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'storySection',
                  title: 'Part',
                  fields: [
                    {
                      name: 'heading',
                      type: 'string',
                      title: 'Heading',
                      description: 'E.g. "The question".',
                    },
                    {
                      name: 'body',
                      type: 'richText',
                      title: 'Text',
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                  preview: {
                    select: { title: 'heading', body: 'body' },
                    prepare({ title, body }) {
                      const first = Array.isArray(body)
                        ? body.find((b) => b?._type === 'block')
                        : null;
                      const text = (first?.children || [])
                        .map((c: { text?: string }) => c.text || '')
                        .join('');
                      return { title: title || 'Untitled part', subtitle: text };
                    },
                  },
                }),
              ],
            },
            {
              name: 'slug',
              type: 'slug',
              title: 'Web address',
              description:
                'Click Generate. Becomes /work/… — avoid changing it once the page is live.',
              options: {
                source: (_doc, context) => {
                  const parent = context.parent as ExampleItem | undefined;
                  return [parent?.client, parent?.title].filter(Boolean).join(' ');
                },
                maxLength: 96,
                // Sanity's built-in check compares documents, not items inside
                // one. Duplicates are caught on the list of examples instead.
                isUnique: () => true,
              },
              // Only matters once there is a story to link to.
              hidden: ({ parent }) => !(parent as ExampleItem | undefined)?.story?.length,
              validation: (Rule) =>
                Rule.custom((slug, context) => {
                  const parent = context.parent as ExampleItem | undefined;
                  if (parent?.story?.length && !(slug as ExampleItem['slug'])?.current) {
                    return 'Click Generate so the story page gets a web address.';
                  }
                  return true;
                }),
            },
          ],
          preview: {
            select: {
              title: 'title',
              client: 'client',
              duration: 'duration',
              media: 'image',
              story: 'story',
            },
            prepare({ title, client, duration, media, story }) {
              const meta = [client, duration, story?.length ? 'has a story page' : null]
                .filter(Boolean)
                .join(' · ');
              return { title: title || 'Work example', subtitle: meta, media };
            },
          },
        }),
      ],
      validation: (Rule) => [
        Rule.required().min(1).max(6).error('Add between one and six examples.'),
        Rule.custom((items) => {
          const seen = new Set<string>();
          for (const item of (items || []) as ExampleItem[]) {
            const slug = item.slug?.current;
            if (!slug) continue;
            if (seen.has(slug)) {
              return {
                message: `Two examples share the web address "${slug}". Change one of them.`,
                path: [{ _key: item._key! }, 'slug'],
              };
            }
            seen.add(slug);
          }
          return true;
        }),
      ],
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
