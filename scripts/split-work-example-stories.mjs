/**
 * One-off: give the homepage work examples a short card text plus a "Full
 * story", which gives each example its own page at /work/<slug>.
 *
 *   node scripts/split-work-example-stories.mjs             # dry run
 *   node scripts/split-work-example-stories.mjs --commit    # write a DRAFT
 *
 * The story texts are Lili's, from "261002_Improved text.docx". The Invacare
 * title and card text are hers too; the Roche card text is a one-line summary
 * of her "What I did" and is there to be reviewed.
 *
 * Writes to the homepage DRAFT, never the published document, so nothing
 * changes on the live site until someone presses Publish in the studio. Only
 * the listed fields are patched, by key, so an existing draft keeps every
 * other edit. Re-running is safe: a field that already matches is left alone.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMMIT = process.argv.includes('--commit');
const PAGE_ID = 'page-home';
const DRAFT_ID = `drafts.${PAGE_ID}`;

/** By the example's _key. `title` and `description` are optional overrides. */
const EXAMPLES = {
  // Invacare
  s009: {
    slug: 'invacare-innovation-sprint',
    title: 'Every market wanted their own version',
    description: 'A strategic sprint on portfolio complexity',
    story: [
      [
        'The question',
        'Care systems, tenders and regulations differ in every European market, and over the years the product range had grown to match. The question was whether Invacare could move to one modular platform, with a common core and configurable parts, and still win locally.',
      ],
      [
        'What I did',
        'I designed and facilitated a cross-functional sprint with Marketing, Product Management, local markets, R&D and Regulatory. My job was to build the process, and the technical answer came from them. We worked in four streams: market insight (including visits to nursing homes), market prioritisation, customer co-development, and portfolio and competition. Everything went onto one shared board, so the team could sort what customers really required from what was just product history, then move from insights to patterns, trade-offs, choices and actions.',
      ],
      [
        'What came out',
        'A recommendation in two horizons: a pragmatic short-term solution for upcoming tenders in the priority markets, and a longer-term modular platform. The team also left with one shared problem definition across commercial, R&D and Regulatory, and a decision that priority markets get more weight than every local request.',
      ],
      [
        'The insight',
        'Technology and adoption run on different clocks. A modular platform takes years to build, and a conservative market takes just as long to accept a new concept, so customers have to be involved long before there is anything to sell.',
      ],
    ],
  },
  // University of Basel
  s00a: {
    slug: 'university-of-basel-bootcamp',
    story: [
      [
        'The question',
        'The University of Basel Innovation Office runs a bootcamp for PhD students and post-docs who have deep expertise and, in some cases, an idea worth taking further. They are scientists, so they want detail and no surprises. How do you get around 30 of them from research thinking to a testable business idea in one day?',
      ],
      [
        'What I did',
        'I co-facilitated the day with the Innovation Office. In the morning I took the group through the design thinking process using real cases from my own work in medtech, including a precision syringe and a patient sling. In the afternoon the teams worked on their own ideas: problem statement, Lean Canvas, key assumptions, and how to test one thing at a time. A prototype can be a conversation, a fake website or a piece of paper, which tends to be news to people who are used to finished experiments. Each team pitched at the end of the day.',
      ],
      [
        'What came out',
        'Every team left with a pitched idea and a first assumption to test. I have run the bootcamp twice in 2026, and the Innovation Office has booked me for a third edition in November, this time for MBA students working on digital therapeutics.',
      ],
    ],
  },
  // Roche
  s00b: {
    slug: 'roche-keynote',
    description:
      'A keynote and open discussion for around 20 commercial and access professionals.',
    story: [
      [
        'The question',
        'Roche\'s teams from Egypt and Morocco came to Basel for a three-day workshop on breast cancer care in low- and middle-income countries. They wanted an outside voice on the first morning: how do you act like an innovator when innovation isn\'t in your job description, and the first answer you get is "no"?',
      ],
      [
        'What I did',
        'I gave a keynote to around 20 commercial and access professionals, followed by an open discussion. I used case studies from my own years in medtech: things nobody had tried before, and projects that started with a flat "no" and ended somewhere else. I came back the next day to listen to the teams\' pitches and give an outside perspective on them.',
      ],
    ],
  },
};

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
if (!token) {
  // Needed even for a dry run: an existing draft is only readable with a token.
  console.error('Missing SANITY_API_WRITE_TOKEN (Editor permissions).');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-08-13',
  useCdn: false,
  // Raw, so the draft and the published document are seen as the two separate
  // documents they are rather than overlaid.
  perspective: 'raw',
});

const key = () => randomUUID().replace(/-/g, '').slice(0, 12);

const para = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

/** A stored story reduced to [heading, text] pairs, to compare with EXAMPLES. */
const flatten = (story) =>
  (story || []).map((part) => [
    part.heading || '',
    (part.body || [])
      .map((block) => (block.children || []).map((c) => c.text || '').join(''))
      .join('\n\n'),
  ]);

const short = (s) => (s && s.length > 70 ? `${s.slice(0, 67)}...` : s || '(empty)');

async function main() {
  console.log(
    `\nSetting work example stories on ${projectId}/${dataset}` +
      (COMMIT ? '  (writing a draft)' : '  (DRY RUN — pass --commit to write a draft)') +
      '\n',
  );

  const published = await client.getDocument(PAGE_ID);
  if (!published) throw new Error(`${PAGE_ID} not found.`);
  const draft = await client.getDocument(DRAFT_ID);
  const source = draft || published;

  console.log(
    draft
      ? `An unpublished draft exists (updated ${draft._updatedAt}); patching it in place.\n`
      : 'No draft yet; one will be created from the published homepage.\n',
  );

  const set = {};
  for (const block of source.blocks || []) {
    if (block._type !== 'workExamples') continue;
    for (const item of block.items || []) {
      const want = EXAMPLES[item._key];
      if (!want) continue;

      const at = `blocks[_key=="${block._key}"].items[_key=="${item._key}"]`;
      const changes = [];

      for (const field of ['title', 'description']) {
        if (want[field] !== undefined && want[field] !== item[field]) {
          set[`${at}.${field}`] = want[field];
          changes.push(`${field}: ${short(item[field])}  ->  ${short(want[field])}`);
        }
      }
      if (item.slug?.current !== want.slug) {
        set[`${at}.slug`] = { _type: 'slug', current: want.slug };
        changes.push(`slug: ${item.slug?.current || '(none)'}  ->  ${want.slug}`);
      }
      if (JSON.stringify(flatten(item.story)) !== JSON.stringify(want.story)) {
        set[`${at}.story`] = want.story.map(([heading, text]) => ({
          _type: 'storySection',
          _key: key(),
          heading,
          body: [para(text)],
        }));
        changes.push(
          `story: ${(item.story || []).length} part(s)  ->  ${want.story.map(([h]) => h).join(' / ')}`,
        );
      }

      console.log(`${changes.length ? '+' : '='} ${item.client}  (/work/${want.slug})`);
      for (const change of changes) console.log(`    ${change}`);
      if (!changes.length) console.log('    already up to date');
      console.log('');
    }
  }

  if (!Object.keys(set).length) {
    console.log('Nothing to do.');
    return;
  }
  if (!COMMIT) {
    console.log('Dry run, nothing written.');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _rev, _updatedAt, ...copy } = published;
  await client
    .transaction()
    .createIfNotExists({ ...copy, _id: DRAFT_ID })
    .patch(DRAFT_ID, (p) => p.set(set))
    .commit();

  console.log(
    `Wrote ${DRAFT_ID}. Review it in the studio (Homepage) and press Publish to put it live.`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
