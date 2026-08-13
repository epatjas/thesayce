import { draftMode } from 'next/headers';

/**
 * Leaves preview mode.
 *
 * Opening the studio or Presentation sets a draft-mode cookie on that browser,
 * after which the site renders unpublished content and can show a stale
 * snapshot — which reads exactly like published changes having disappeared.
 * There was no way back out without clearing cookies by hand.
 *
 * Visit /api/draft-mode/disable to return to the published site.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const target = searchParams.get('to') || '/';

  (await draftMode()).disable();

  // Only ever redirect within this site.
  const safe = target.startsWith('/') && !target.startsWith('//') ? target : '/';

  return new Response(null, {
    status: 307,
    headers: { Location: new URL(safe, origin).toString() },
  });
}
