import type { Route } from "../../+types/root";
import type { PageInfo } from "./page_info";

export function createMetaFromPageInfo(pageInfo: PageInfo) {
  return ({ }: Route.MetaArgs) => {
    return [
      { "title": `DSL Pages | ${pageInfo.title}` },
      { "name": "description", "content": pageInfo.description },
    ]
  }
}