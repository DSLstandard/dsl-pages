import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import { DSL_PAGE_INFOS } from "./feats/page_info/dsl_page_infos";

export default [
  layout("feats/page_layout/page_layout.tsx", [
    index("feats/index_page/page.tsx"),
    ...DSL_PAGE_INFOS.map((page) =>
      route(page.pathname, page.file)
    ),
    route("*", "feats/not_found_page/not_found_page.tsx")
  ])
] satisfies RouteConfig;
