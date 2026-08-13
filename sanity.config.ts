'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

export default defineConfig({
  name: 'lili-site',
  title: 'Lili Sayce',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Presentation puts the real site next to the form: click any text on the
    // preview and it jumps to the field that produced it.
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        mainDocuments: [
          { route: '/', filter: '_type == "page" && slug.current == "home"' },
          { route: '/:slug', filter: '_type == "page" && slug.current == $slug' },
          {
            route: '/case-studies/:slug',
            filter: '_type == "caseStudy" && slug.current == $slug',
          },
        ],
      },
    }),
    // Developer tool for running GROQ queries. Hidden from non-admin users.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
