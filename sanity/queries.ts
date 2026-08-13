import { defineQuery } from 'next-sanity';

const IMAGE = /* groq */ `{
  ...,
  asset->{ _id, metadata { lqip, dimensions } }
}`;

const CARD = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  "client": context.client,
  "cardTitle": coalesce(preview.title, title),
  "image": coalesce(preview.image, heroImage) ${IMAGE}
}`;

const BLOCKS = /* groq */ `blocks[]{
  ...,
  _type == "hero" => { image ${IMAGE} },
  _type == "textSection" => { images[] ${IMAGE} },
  _type == "contactBlock" => { image ${IMAGE} },
  _type == "imageGroup" => { images[] ${IMAGE} },
  _type == "logoStrip" => { logos[]{ ..., image ${IMAGE} } },
  _type == "caseStudyGrid" => {
    "cards": select(
      source == "picked" => items[]-> ${CARD},
      *[_type == "caseStudy" && defined(slug.current)] | order(orderRank asc) ${CARD}
    )
  }
}`;

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    seoTitle,
    seoDescription,
    shareImage ${IMAGE},
    ${BLOCKS}
  }
`);

export const CASE_STUDY_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    heroImage ${IMAGE},
    heroLogo ${IMAGE},
    context,
    ${BLOCKS}
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    name,
    nav[]{ label, href },
    cta { label, href },
    seoDescription,
    shareImage ${IMAGE}
  }
`);

/** Slugs for generateStaticParams — published documents only. */
export const CASE_STUDY_SLUGS_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)].slug.current
`);

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && slug.current != "home"].slug.current
`);
