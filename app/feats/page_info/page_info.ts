
/**
 * Page information.
 *
 * NOTE: All 'PageInfo' are collected in 'app/feats/page_info/dsl_page_infos.ts'
 * and are used for:
 *
 * - React-router, to generate routes in routes.ts.
 *
 * - Generating in-site menus that lists all pages, etc.
 */
export interface PageInfo {
  /*
   * For React-router
   */
  file: string
  pathname: string

  /*
   * For generating in-site menus.
   */
  title: string
  description: string
}