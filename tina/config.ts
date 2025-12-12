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
