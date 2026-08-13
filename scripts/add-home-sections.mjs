/**
 * One-off: build the "When to call me" cards and the "What this looks like in
 * practise" work examples on the homepage, and wire up the hero buttons.
 *
 *   node scripts/add-home-sections.mjs                    # dry run
 *   node scripts/add-home-sections.mjs --commit
 *   node scripts/add-home-sections.mjs --commit --booking-url https://cal.com/...
 *
 * Patches the existing homepage rather than replacing it, so the copy edited
 * in the studio is left alone. Re-running is safe: blocks are matched by their
 * anchor and replaced in place, and images are matched by filename so they are
 * not uploaded twice.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMMIT = process.argv.includes('--commit');

const bookingIdx = process.argv.indexOf('--booking-url');
const BOOKING_URL = bookingIdx > -1 ? process.argv[bookingIdx + 1] : null;
const EMAIL = 'lili@thesayce.com';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID.');
  process.exit(1);
}
if (COMMIT && !token) {
  console.error('Missing SANITY_API_WRITE_TOKEN (Editor permissions).');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-08-13',
  useCdn: false,
});

let n = 0;
const key = () => `s${(n++).toString(36).padStart(3, '0')}`;

const para = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

let assetsByName = null;
async function uploadImage(filename) {
  const filePath = path.join(ROOT, 'public/images', filename);
  if (!fs.existsSync(filePath)) throw new Error(`Image not found: ${filename}`);

  if (!COMMIT) return { _type: 'image', asset: { _type: 'reference', _ref: `DRYRUN-${filename}` } };

  if (assetsByName === null) {
    assetsByName = new Map();
    const rows = await client.fetch('*[_type == "sanity.imageAsset"]{_id, originalFilename}');
    for (const r of rows) if (r.originalFilename) assetsByName.set(r.originalFilename, r._id);
  }

  let id = assetsByName.get(filename);
  if (id) {
    console.log(`  = reusing ${filename}`);
  } else {
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), { filename });
    id = asset._id;
    assetsByName.set(filename, id);
    console.log(`  + uploaded ${filename}`);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: id } };
}

// ---------------------------------------------------------------- blocks

function buildCards() {
  return {
    _type: 'cards',
    _key: key(),
    anchor: 'question',
    heading: 'When to call me',
    intro: [
      para(
        "I work best in the area of innovation and transformation. My experience is from inside regulated industries and complex global organisations. These are the situations I'm built for:",
      ),
    ],
    items: [
      {
        _key: key(),
        _type: 'card',
        title:
          "You've been handed an innovation or transformation mandate that sounds important, but nobody can tell you what done looks like.",
        body: 'I help you turn it into something you can actually start.',
      },
      {
        _key: key(),
        _type: 'card',
        title:
          "A strategic initiative has stalled, and the reasons people give you don't explain it.",
        body: "The plan is fine, the team is competent, it still isn't moving. I find the real blocker, which is rarely the stated one.",
      },
      {
        _key: key(),
        _type: 'card',
        title:
          'You need senior innovation leadership for a few days a week or a few months, not a hire and not an agency.',
        body: 'Interim or fractional. Someone who works at leadership level from day one and leaves behind structure, not slides.',
      },
    ],
  };
}

async function buildWorkExamples() {
  return {
    _type: 'workExamples',
    _key: key(),
    anchor: 'in-practise',
    heading: 'What this looks like in practise',
    intro: [
      para(
        'Engagements range from a four-hour keynote to a multi-week sprint, but the job is the same: get a group of smart people from talking about innovation to doing it.',
      ),
    ],
    items: [
      {
        _key: key(),
        _type: 'workExample',
        image: {
          ...(await uploadImage('innovation-sprint-coaching.png')),
          alt: 'Sprint workshop board with a project charter and assumption notes',
        },
        duration: '8 weeks',
        client: 'Invacare International',
        title: 'Innovation Sprint coaching',
        description:
          'Two teams working on product innovation. Sprint design and facilitation.',
      },
      {
        _key: key(),
        _type: 'workExample',
        image: {
          ...(await uploadImage('bootcamp-facilitation.png')),
          alt: 'Participants working around a table during a bootcamp session',
        },
        duration: '1 day',
        client: 'University of Basel, Innovation Office',
        title: 'Bootcamp facilitation / Entrepreneurship course',
        description: 'Participants, appr. 30 phD and post-doc students',
      },
      {
        _key: key(),
        _type: 'workExample',
        image: {
          ...(await uploadImage('keynote-roche.png')),
          alt: 'Presenting a definition of innovation to a room of professionals',
        },
        duration: '4 hours',
        client: 'Roche',
        title: 'Keynote on Practical Innovation, and external viewpoint',
        description:
          'Participants appr. 20 professionals working on Breast Cancer Strategy for LMIM (Low & Middle Income Markets)',
      },
    ],
  };
}

// ---------------------------------------------------------------- run

async function main() {
  console.log(
    `\nUpdating homepage on ${projectId}/${dataset}` +
      (COMMIT ? '' : '  (DRY RUN — pass --commit to write)') +
      '\n',
  );

  // Must be raw: the default perspective overlays drafts onto the base id, so
  // a query for "drafts.page-home" silently matches nothing even when a draft
  // exists. That is exactly how a stale draft went unnoticed for a whole day.
  const draft = await client
    .withConfig({ perspective: 'raw' })
    .fetch('*[_id == "drafts.page-home"][0]{_id, _updatedAt}');

  if (draft) {
    console.warn(
      `! An unpublished draft of the homepage exists (updated ${draft._updatedAt}).\n` +
        '  This script patches the PUBLISHED document, so the draft will not get\n' +
        '  these changes — and publishing it later would revert them.\n' +
        '  Discard or publish the draft in the studio first.\n',
    );
  }

  const page = await client.fetch('*[_id == "page-home"][0]{_id, blocks}');
  if (!page) throw new Error('page-home not found.');

  const cards = buildCards();
  const work = await buildWorkExamples();

  const existing = page.blocks || [];
  const next = [];
  let replaced = false;

  for (const b of existing) {
    // Replace whatever currently occupies the #question slot (the migrated
    // text section, or an earlier run of this script) with the cards.
    if (b.anchor === 'question') {
      next.push(cards, work);
      replaced = true;
      continue;
    }
    // Drop a previous run's work examples so re-running doesn't duplicate it.
    if (b._type === 'workExamples' && b.anchor === 'in-practise') continue;
    next.push(b);
  }

  if (!replaced) {
    // No #question block: insert both before the case study grid.
    const at = next.findIndex((b) => b._type === 'caseStudyGrid');
    const idx = at === -1 ? next.length : at;
    next.splice(idx, 0, cards, work);
  }

  console.log('Resulting homepage blocks:');
  for (const b of next) {
    console.log(`  ${String(b._type).padEnd(15)} ${b.anchor ? '#' + b.anchor : ''}`);
  }

  const hero = next.find((b) => b._type === 'hero');
  const heroPatch = {};
  if (hero) {
    heroPatch.secondaryCta = { label: 'Send a message', href: `mailto:${EMAIL}` };
    if (BOOKING_URL) {
      heroPatch.primaryCta = { label: 'Book a meeting', href: BOOKING_URL };
    }
    console.log(
      `\nHero buttons: Send a message -> mailto:${EMAIL}` +
        (BOOKING_URL ? `, Book a meeting -> ${BOOKING_URL}` : '  (no --booking-url given, left as is)'),
    );
    Object.assign(hero, heroPatch);
  }

  if (!COMMIT) {
    console.log('\nDry run complete. Re-run with --commit to write.\n');
    return;
  }

  await client.patch('page-home').set({ blocks: next }).commit();
  console.log('\nDone. Homepage updated.\n');
}

main().catch((err) => {
  console.error('\nFailed:', err.message);
  process.exit(1);
});
