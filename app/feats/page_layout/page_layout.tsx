import { Link, Outlet } from "react-router"
import { SearchBar } from "../page_search_bar/search_bar"


export default function PageLayout() {
  return (
    <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-99 bg-white border-b shadow">
        <div className="mx-auto container flex flex-row gap-x-8 items-center">
          <Link to="/" prefetch="none" viewTransition>
            <div className="p-1 text-xl font-black bg-[#e32743] text-white select-none hover:bg-[#c81e34] transition-colors cursor-pointer">
              DSL Pages
            </div>
          </Link>
          <div className="mr-2">
            <SearchBar />
          </div>
        </div>
      </header>
      <main className="flex-1 pb-[30dvh]">
        <Outlet />
      </main>
    </section>
  )
}