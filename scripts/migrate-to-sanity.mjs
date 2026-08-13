/**
 * One-off migration: TinaCMS JSON files -> Sanity.
 *
 *   node scripts/migrate-to-sanity.mjs           # dry run, writes nothing
 *   node scripts/migrate-to-sanity.mjs --commit  # uploads images and documents
 *
 * Safe to re-run: every document uses a fixed _id and is written with
 * createOrReplace, and uploaded images are matched by their original filename
 * so they are not duplicated on a second run.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMMIT = process.argv.includes('--commit');

// ---------------------------------------------------------------- env

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const value = m[2].replace(/^["']|["']$/g, '');
      if (!process.env[m[1]]) process.env[m[1]] = value;
    }
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID. See SANITY-SETUP.md.');
  process.exit(1);
}
if (COMMIT && !token) {
  console.error('Missing SANITY_API_WRITE_TOKEN (needs Editor permissions).');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-08-13',
  useCdn: false,
});

// ---------------------------------------------------------------- helpers

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`;

/**
 * Plain string -> Portable Text.
 *
 * The old model stored body copy as one string, so the line breaks the author
 * typed never rendered. Every non-empty line becomes its own paragraph, which
 * restores the paragraph breaks that were intended all along. Lines starting
 * with "-" or "*" become bullets, matching the old ad-hoc renderer.
 */
function toPortableText(text) {
  if (!text || typeof text !== 'string') return undefined;

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return undefined;

  return lines.map((line) => {
    const bullet = /^[-*]\s+/.test(line);
    return {
      _type: 'block',
      _key: key(),
      style: 'normal',
      ...(bullet ? { listItem: 'bullet', level: 1 } : {}),
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: key(),
          text: bullet ? line.replace(/^[-*]\s+/, '') : line,
          marks: [],
        },
      ],
    };
  });
}

const assetCache = new Map();
let existingAssets = null;

async function uploadImage(publicPath) {
  if (!publicPath || typeof publicPath !== 'string') return null;
  if (assetCache.has(publicPath)) return assetCache.get(publicPath);

  const filePath = path.join(ROOT, 'public', publicPath.replace(/^\//, ''));
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! image not found, skipping: ${publicPath}`);
    assetCache.set(publicPath, null);
    return null;
  }

  const filename = path.basename(filePath);

  if (!COMMIT) {
    const ref = { _type: 'image', asset: { _type: 'reference', _ref: `image-DRYRUN-${filename}` } };
    assetCache.set(publicPath, ref);
    return ref;
  }

  // Reuse an asset already uploaded under the same original filename so
  // re-running the script does not create duplicates.
  if (existingAssets === null) {
    existingAssets = new Map();
    const rows = await client.fetch(
      '*[_type == "sanity.imageAsset"]{_id, originalFilename}',
    );
    for (const row of rows) {
      if (row.originalFilename) existingAssets.set(row.originalFilename, row._id);
    }
  }

  let assetId = existingAssets.get(filename);
  if (assetId) {
    console.log(`  = reusing ${filename}`);
  } else {
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename,
    });
    assetId = asset._id;
    existingAssets.set(filename, assetId);
    console.log(`  + uploaded ${filename}`);
  }

  const ref = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
  assetCache.set(publicPath, ref);
  return ref;
}

async function uploadImages(paths) {
  const out = [];
  for (const p of paths) {
    const img = await uploadImage(p);
    if (img) out.push({ ...img, _key: key() });
  }
  return out;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------- read source

const site = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'content/site/site.json'), 'utf8'),
);

const caseStudyFiles = fs
  .readdirSync(path.join(ROOT, 'content/case-studies'))
  .filter((f) => f.endsWith('.json'));

const caseStudies = caseStudyFiles.map((f) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, 'content/case-studies', f), 'utf8')),
);

// ---------------------------------------------------------------- build docs

async function buildSiteSettings() {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: site.header?.name,
    nav: (site.header?.nav || []).map((item) => ({
      _key: key(),
      _type: 'navItem',
      label: item.label,
      href: item.href,
    })),
    cta: site.header?.cta
      ? { label: site.header.cta.label, href: site.header.cta.href }
      : undefined,
    seoDescription:
      'I create protected spaces where good ideas can survive long enough to prove themselves.',
    shareImage: await uploadImage('/images/share.png'),
  };
}

async function buildHomepage() {
  const blocks = [];

  if (site.hero) {
    blocks.push({
      _type: 'hero',
      _key: key(),
      headline: site.hero.headline,
      subline: site.hero.subline,
      image: await uploadImage(site.hero.image),
    });
  }

  if (site.problem) {
    blocks.push({
      _type: 'textSection',
      _key: key(),
      body: toPortableText(site.problem.text),
      pullquote: site.problem.pullquote,
      images: await uploadImages([site.problem.image].filter(Boolean)),
      // The header nav links to #problem.
      anchor: 'problem',
    });
  }

  // The "question" section never rendered on the old site because the homepage
  // section list was hardcoded. It was nonetheless rewritten into finished copy
  // and given a nav link ("When You Might Need Me" -> #question), so it is a
  // real section that was simply invisible. It belongs between problem and
  // experience, matching the nav order.
  if (site.question) {
    blocks.push({
      _type: 'textSection',
      _key: key(),
      body: toPortableText(site.question.text),
      pullquote: site.question.pullquote,
      images: await uploadImages([site.question.image].filter(Boolean)),
      anchor: 'question',
    });
  }

  blocks.push({
    _type: 'caseStudyGrid',
    _key: key(),
    heading: 'Experience',
    source: 'all',
    anchor: 'experience',
  });

  if (site.contact) {
    blocks.push({
      _type: 'contactBlock',
      _key: key(),
      headline: site.contact.headline,
      body: toPortableText(site.contact.text),
      email: site.contact.email,
      linkedin: site.contact.linkedin,
      image: await uploadImage(site.contact.image),
      anchor: 'contact',
    });
  }

  return {
    _id: 'page-home',
    _type: 'page',
    title: 'Homepage',
    slug: { _type: 'slug', current: 'home' },
    blocks,
  };
}

/**
 * "whatIDo" also never rendered, but unlike "question" it was never rewritten
 * and has no nav link — it is still the original jokey placeholder text. It is
 * migrated into a draft page so nothing is lost, but it does not go live.
 */
async function buildUnusedDraft() {
  const blocks = [];

  for (const [name, source] of [['What I Do', site.whatIDo]]) {
    if (!source) continue;
    blocks.push({
      _type: 'textSection',
      _key: key(),
      heading: name,
      body: toPortableText(source.text),
      pullquote: source.pullquote,
      images: await uploadImages([source.image].filter(Boolean)),
    });
  }

  if (!blocks.length) return null;

  return {
    // The "drafts." prefix keeps this unpublished and off the live site.
    _id: 'drafts.page-unused-sections',
    _type: 'page',
    title: 'Unused sections (from the old site)',
    slug: { _type: 'slug', current: 'unused-sections' },
    blocks,
  };
}

async function buildCaseStudies() {
  const sorted = [...caseStudies].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  );

  let rank = LexoRank.min();
  const docs = [];

  for (const cs of sorted) {
    rank = rank.genNext();
    const slug = cs.slug || slugify(cs.title);
    const blocks = [];

    for (const section of cs.sections || []) {
      const imagePaths = [
        section.images?.image1,
        section.images?.image2,
        section.images?.image3,
      ].filter((p) => p && String(p).trim());

      blocks.push({
        _type: 'textSection',
        _key: key(),
        tag: section.tag || undefined,
        heading: section.heading || undefined,
        body: toPortableText(section.content),
        pullquote: section.quote?.text || undefined,
        images: await uploadImages(imagePaths),
      });
    }

    docs.push({
      _id: `caseStudy-${slugify(slug)}`,
      _type: 'caseStudy',
      orderRank: rank.toString(),
      title: cs.title,
      slug: { _type: 'slug', current: slug },
      subtitle: cs.subtitle,
      heroImage: await uploadImage(cs.heroImage),
      heroLogo: await uploadImage(cs.heroLogo),
      context: cs.context,
      preview: {
        title: cs.preview?.title,
        image: await uploadImage(cs.preview?.image),
      },
      blocks,
      // `published: false` in Tina would mean "do not show". Sanity models this
      // with real drafts, so unpublished entries are written as drafts below.
      _wasPublished: cs.published !== false,
    });
  }

  return docs;
}

// ---------------------------------------------------------------- run

async function main() {
  console.log(
    `\nMigrating to Sanity project ${projectId} / ${dataset}` +
      (COMMIT ? '' : '  (DRY RUN — pass --commit to write)') +
      '\n',
  );

  console.log('Site settings…');
  const settings = await buildSiteSettings();

  console.log('Homepage…');
  const home = await buildHomepage();

  console.log('Unused sections (draft)…');
  const unused = await buildUnusedDraft();

  console.log('Case studies…');
  const studies = await buildCaseStudies();

  const docs = [settings, home, ...(unused ? [unused] : []), ...studies];

  // A case study that was unpublished in Tina becomes a Sanity draft.
  const normalised = docs.map((doc) => {
    if (doc._type !== 'caseStudy') return doc;
    const { _wasPublished, ...rest } = doc;
    return _wasPublished ? rest : { ...rest, _id: `drafts.${rest._id}` };
  });

  console.log('\nDocuments to write:');
  for (const doc of normalised) {
    const blockCount = Array.isArray(doc.blocks) ? doc.blocks.length : 0;
    console.log(
      `  ${doc._id.padEnd(38)} ${doc._type.padEnd(13)} ${blockCount} block(s)` +
        (doc._id.startsWith('drafts.') ? '  [draft]' : ''),
    );
  }

  if (!COMMIT) {
    const out = path.join(ROOT, 'scripts/migration-preview.json');
    fs.writeFileSync(out, JSON.stringify(normalised, null, 2));
    console.log(`\nDry run complete. Preview written to ${path.relative(ROOT, out)}`);
    console.log('Re-run with --commit to upload images and create documents.\n');
    return;
  }

  const tx = client.transaction();
  for (const doc of normalised) tx.createOrReplace(doc);
  await tx.commit();

  console.log(`\nDone. ${normalised.length} documents written.\n`);
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message);
  process.exit(1);
});
