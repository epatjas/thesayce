# lili-site

Lili Sayce's portfolio. Next.js 16 (App Router) with [Sanity](https://sanity.io)
as the CMS.

- **Site:** rendered from Sanity content, published changes appear without a
  redeploy
- **Studio:** embedded at `/studio`
- **Editor guide (Finnish):** [`LILI-OHJE.md`](./LILI-OHJE.md)
- **First-time setup:** [`SANITY-SETUP.md`](./SANITY-SETUP.md)

## Requirements

Node **22.12+** (the Sanity CLI requires it). `.nvmrc` pins the version:

```bash
nvm use
```

## Running locally

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Studio: http://localhost:3000/studio

Needs `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` and
`SANITY_API_READ_TOKEN` in `.env.local` — see
[`SANITY-SETUP.md`](./SANITY-SETUP.md).

## Content model

Pages and case studies are built from **blocks** — an ordered list the editor
picks from, rather than a fixed set of fields. Adding a section is a content
change, not a code change.

| Path | What |
| --- | --- |
| `sanity/schemaTypes/blocks/` | One file per block type |
| `sanity/schemaTypes/documents/` | `page`, `caseStudy`, `siteSettings` |
| `sanity/schemaTypes/objects/richText.ts` | The constrained Portable Text config |
| `sanity/structure.ts` | Studio sidebar layout |
| `sanity/queries.ts` | All GROQ queries |
| `app/components/blocks/` | One renderer per block type |

The same block types render differently on a page than inside a case study —
see the `variant` prop in `app/components/blocks/Blocks.tsx`.

### Adding a block type

1. Add a schema file in `sanity/schemaTypes/blocks/`
2. Register it in `sanity/schemaTypes/index.ts` and in
   `sanity/schemaTypes/objects/blockArrays.ts`
3. Add a renderer in `app/components/blocks/` and a case to `Blocks.tsx`
4. Run `npm run typegen`

## Types

Query result types are generated from the schema and committed as
`sanity.types.ts`. Regenerate after any schema or query change:

```bash
npm run typegen
```

## Migration from TinaCMS

The old Tina JSON lives in `content/` and is read by
`scripts/migrate-to-sanity.mjs`. Once the migrated content is verified in
production, both can be deleted.
