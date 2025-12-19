import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      // Case Studies Collection
      {
        name: "caseStudy",
        label: "Case Studies",
        path: "content/case-studies",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
          router: ({ document }) => `/case-studies/${document._sys.filename}`,
        },
        fields: [
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
            description: "Used in the URL (e.g., 'gerresheimer-innovation' becomes /case-studies/gerresheimer-innovation)",
          },
          {
            type: "boolean",
            name: "published",
            label: "Published",
            description: "Toggle off to save as draft (won't appear on the site)",
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image",
            description: "Main image at the top of the case study",
          },
          // Context box
          {
            type: "object",
            name: "context",
            label: "Context Box",
            fields: [
              {
                type: "string",
                name: "client",
                label: "Client Name (short)",
                description: "Short client name for preview cards (e.g., 'Gerresheimer'). Should match existing proof items if replacing them.",
              },
              {
                type: "string",
                name: "clientFull",
                label: "Client Name (full)",
                description: "Full client description shown on case study page (e.g., 'Gerresheimer AG (€2B+ revenue, 10,000+ employees)')",
              },
              {
                type: "string",
                name: "year",
                label: "Year / Timeline",
              },
              {
                type: "string",
                name: "role",
                label: "Role",
              },
              {
                type: "string",
                name: "industry",
                label: "Industry",
              },
            ],
          },
          // Sections array
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.heading || "Section",
              }),
            },
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Section Heading",
              },
              {
                type: "rich-text",
                name: "content",
                label: "Content",
                description: "Supports markdown formatting",
              },
              // Optional quote/callout
              {
                type: "object",
                name: "quote",
                label: "Quote / Callout (optional)",
                fields: [
                  {
                    type: "string",
                    name: "text",
                    label: "Quote Text",
                    ui: {
                      component: "textarea",
                    },
                  },
                ],
              },
              // Optional images
              {
                type: "object",
                name: "images",
                label: "Images (optional)",
                fields: [
                  {
                    type: "string",
                    name: "layout",
                    label: "Image Layout",
                    options: [
                      { value: "full", label: "Full Width (1 image)" },
                      { value: "three", label: "Three in a Row" },
                    ],
                  },
                  {
                    type: "image",
                    name: "image1",
                    label: "Image 1",
                  },
                  {
                    type: "image",
                    name: "image2",
                    label: "Image 2 (for three layout)",
                  },
                  {
                    type: "image",
                    name: "image3",
                    label: "Image 3 (for three layout)",
                  },
                  {
                    type: "image",
                    name: "logo",
                    label: "Logo Overlay (optional)",
                    description: "SVG or image logo to display on the bottom-left of images",
                  },
                ],
              },
            ],
          },
          // Preview card settings (for homepage)
          {
            type: "object",
            name: "preview",
            label: "Preview Card (for Experience section)",
            fields: [
              {
                type: "image",
                name: "image",
                label: "Card Image",
              },
              {
                type: "string",
                name: "title",
                label: "Card Title",
                description: "Short title for the card (e.g., the main result)",
              },
            ],
          },
        ],
      },
      // Site Content Collection
      {
        name: "site",
        label: "Site Content",
        path: "content/site",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          // Header
          {
            type: "object",
            name: "header",
            label: "Header",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "object",
                name: "nav",
                label: "Navigation Links",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.label || "Nav Item",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "Link",
                    required: true,
                  },
                ],
              },
              {
                type: "object",
                name: "cta",
                label: "Call to Action Button",
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "Link",
                    required: true,
                  },
                ],
              },
            ],
          },
          // Hero
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Headline",
                required: true,
              },
              {
                type: "string",
                name: "subline",
                label: "Subline",
              },
              {
                type: "image",
                name: "image",
                label: "Image",
              },
            ],
          },
          // Problem
          {
            type: "object",
            name: "problem",
            label: "Problem Section",
            fields: [
              {
                type: "string",
                name: "text",
                label: "Text",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "pullquote",
                label: "Pullquote",
              },
              {
                type: "image",
                name: "image",
                label: "Image",
              },
            ],
          },
          // Question
          {
            type: "object",
            name: "question",
            label: "Question Section",
            fields: [
              {
                type: "string",
                name: "text",
                label: "Text",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "pullquote",
                label: "Pullquote",
              },
              {
                type: "image",
                name: "image",
                label: "Image",
              },
            ],
          },
          // What I Do
          {
            type: "object",
            name: "whatIDo",
            label: "What I Do Section",
            fields: [
              {
                type: "string",
                name: "text",
                label: "Text",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "pullquote",
                label: "Pullquote",
              },
              {
                type: "image",
                name: "image",
                label: "Image",
              },
            ],
          },
          // Proof
          {
            type: "object",
            name: "proof",
            label: "Proof / Clients Section",
            fields: [
              {
                type: "boolean",
                name: "show",
                label: "Show Section",
              },
              {
                type: "object",
                name: "items",
                label: "Client Stories",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.client || "Client",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "client",
                    label: "Client Name",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Title / Result",
                    required: true,
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Image",
                  },
                  {
                    type: "string",
                    name: "slug",
                    label: "Link to Case Study (optional)",
                    description: "Enter the slug of a case study to make this card link to it (e.g., 'gerresheimer-innovation')",
                  },
                ],
              },
            ],
          },
          // Contact
          {
            type: "object",
            name: "contact",
            label: "Contact Section",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Headline",
              },
              {
                type: "string",
                name: "text",
                label: "Text",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "email",
                label: "Email",
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn URL",
              },
              {
                type: "image",
                name: "image",
                label: "Image",
              },
            ],
          },
        ],
      },
    ],
  },
});
