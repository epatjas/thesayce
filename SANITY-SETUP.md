# Sanity setup

Everything in the codebase is done. These are the steps that need a Sanity
login, so they could not be scripted ahead of time.

Do this on the `sanity-migration` branch. The live site on `main` keeps running
off the old TinaCMS content until you merge.

---

## 0. Node 22.12 or newer

The Sanity CLI requires it. This machine defaults to Node 20, so switch first:

```bash
nvm use 24
```

`.nvmrc` pins `22.12` for anyone else who clones the repo.

---

## 1. Create the Sanity project

```bash
npx sanity login
```

Then create the project and dataset:

```bash
npx sanity init --create-project "Lili Sayce" --dataset production
```

When it asks whether to add configuration files or a schema, decline — the
repo already has `sanity.config.ts`, `sanity.cli.ts` and the full schema.

Note the **project ID** it prints.

> **Account ownership.** Whoever runs `sanity login` here becomes the project
> owner. Decide this deliberately: if the site should outlive your involvement,
> create the project under Lili's own email and add yourself as an admin
> afterwards, rather than the other way round.

---

## 2. Environment variables

Add to `.env.local` (it is gitignored):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token
SANITY_API_WRITE_TOKEN=your-write-token
```

The old `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` lines can go.

Create both tokens at **sanity.io/manage → your project → API → Tokens**:

| Token | Permission | Used for |
| --- | --- | --- |
| `SANITY_API_READ_TOKEN` | Viewer | Draft previews and live updates |
| `SANITY_API_WRITE_TOKEN` | Editor | The one-off migration only |

The write token is only needed for step 3. You can delete it afterwards.

---

## 3. Migrate the content

Dry run first — this writes nothing and produces
`scripts/migration-preview.json` so you can inspect exactly what will be
created:

```bash
npm run migrate
```

Then commit it for real:

```bash
npm run migrate -- --commit
```

This uploads every referenced image from `public/images` to Sanity and creates:

- `siteSettings` — name, nav, CTA
- `page-home` — the homepage, as four blocks
- 4 case studies, with their original URLs and running order preserved
- `drafts.page-unused-sections` — see the note at the bottom

Re-running is safe: documents use fixed IDs and images are matched by filename,
so nothing gets duplicated.

---

## 4. Allow the studio to talk to the project

In **sanity.io/manage → API → CORS origins**, add, all with credentials
allowed:

- `http://localhost:3000`
- `https://thesayce.com`
- `https://www.thesayce.com`

---

## 5. Run it

```bash
npm run dev
```

- Site: http://localhost:3000
- Studio: http://localhost:3000/studio

In the studio, open **Presentation** in the top bar to get the site side by
side with the editing form, with click-to-edit on the text.

Compare against the current live site before merging. If anything looks off,
the old content is still in `content/` and `main` is untouched.

---

## 6. Deploy

Add the same three variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`) in **Vercel → Project →
Settings → Environment Variables**, then merge to `main`.

Also set `NEXT_PUBLIC_SITE_URL` to the production URL so social sharing images
resolve to absolute addresses.

Publishing from the studio updates the live site without a redeploy — the live
content API pushes the change. No build wait.

---

## 7. Invite Lili

**sanity.io/manage → Members → Invite**. Give her the **Editor** role, which
lets her write and publish content but not change the schema or billing.

Then walk her through [`LILI-OHJE.md`](./LILI-OHJE.md).

---

## 8. Clean up (after you are happy)

- Delete `content/` — the old Tina JSON, kept until the migration is verified
- Delete `SANITY_API_WRITE_TOKEN` from `.env.local` and from sanity.io
- Cancel the tina.io account

---

## Two things to decide with Lili

**The unused sections.** The old `site.json` carried two sections, "question"
and "What I Do", that the homepage never rendered — they were editable in Tina
and wired to nothing, so anything she typed there vanished. The copy reads like
unfinished placeholder text. They are migrated into a page called **"Unused
sections (from the old site)"** which is left as a draft, so it is not on the
site. Ask her whether she wants them finished and published, or deleted.

**Node version.** If she ever runs this locally she needs Node 22.12+. If she
only ever uses the studio in a browser, this does not affect her.
