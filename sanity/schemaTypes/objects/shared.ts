import { defineField } from 'sanity';

/**
 * Optional anchor so a block can be a target for the header navigation
 * (e.g. an anchor of `experience` is linked from the nav as `#experience`).
 * Kept in a collapsed "Advanced" fieldset so it never clutters the form.
 */
export const anchorField = defineField({
  name: 'anchor',
  title: 'Link anchor',
  type: 'string',
  fieldset: 'advanced',
  description:
    'Optional. Lets a navigation link jump to this section. Use lowercase letters and dashes, e.g. "about". The nav link then points to "#about".',
  validation: (Rule) =>
    Rule.regex(/^[a-z0-9-]+$/, {
      name: 'anchor',
      invert: false,
    }).error('Use lowercase letters, numbers and dashes only (e.g. "about").'),
});

export const advancedFieldset = {
  name: 'advanced',
  title: 'Advanced',
  options: { collapsible: true, collapsed: true },
};

/** Image field with hotspot cropping and a required alt text for accessibility. */
export function imageField(name: string, title: string, extra: Record<string, unknown> = {}) {
  return defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    description:
      'After uploading, click the crop icon to set the focal point — the part of the image that must stay visible when it is cropped.',
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alt text',
        description:
          'Describes the image for screen readers and search engines. Leave empty only if the image is purely decorative.',
      },
    ],
    ...extra,
  });
}
