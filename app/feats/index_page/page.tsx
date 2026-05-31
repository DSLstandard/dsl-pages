import { Link } from "react-router"
import { DSL_PAGE_INFOS } from "../page_info/dsl_page_infos"
import type { PageInfo } from "../page_info/page_info"
import { SearchBar } from "../page_search_bar/search_bar"
import type { Route } from "./+types/page"

export function meta({ }: Route.MetaArgs) {
  let description = ""
  description += "A static website housing a collection of tools as a single-page application. No tracking. no ADs."
  description += " -- "
  description += DSL_PAGE_INFOS.map(page => page.title).join(" | ")

  return [
    { title: "DSL Pages | Home" },
    { name: "description", content: description}
  ]
}

function PageEntry({ page }: { page: PageInfo }) {
  return (
    <Link
      to={`/${page.pathname}`}
      viewTransition
      prefetch="intent"
      className="block p-3 border rounded-lg hover:border-slate-400 hover:shadow-sm transition-colors"
    >
      <div className="font-semibold text-sm">{page.title}</div>
      <div className="text-xs text-slate-500 mt-0.5">{page.description}</div>
    </Link>
  )
}

export default function IndexPage() {
  return (
    <div className="container mx-auto px-2">
      <h1 className="mt-12 text-center text-3xl font-semibold tracking-tight text-gray-900">
        Home Page
      </h1>
      <div className="mt-4 mb-6 w-fit mx-auto">
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {DSL_PAGE_INFOS.map(page => (
          <PageEntry key={page.pathname} page={page} />
        ))}
      </div>
    </div>
  )
}