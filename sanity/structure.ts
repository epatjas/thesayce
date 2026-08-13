import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

/**
 * The studio sidebar. Shaped around what the editor actually does:
 * the homepage is pinned as a single entry rather than hidden inside a list,
 * and case studies are drag-orderable.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-home')
            .title('Homepage'),
        ),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'caseStudy',
        title: 'Case studies',
        S,
        context,
      }),

      S.listItem()
        .title('Other pages')
        .schemaType('page')
        .child(
          S.documentTypeList('page')
            .title('Other pages')
            // The homepage has its own pinned entry above.
            .filter('_type == "page" && _id != "page-home" && !(_id in path("drafts.page-home"))'),
        ),

      S.divider(),

      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),
    ]);
