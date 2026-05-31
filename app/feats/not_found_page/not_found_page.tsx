import { useLocation } from "react-router"
import { SearchBar } from "../page_search_bar/search_bar"

export default function NotFoundPage() {
  const location = useLocation()

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl border p-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Page Not Found</h1>
        <p className="mt-2 mb-4 break-all text-sm text-gray-500">
          Router path: <span className="font-mono">{location.pathname}</span>
        </p>
        <SearchBar />
      </div>
    </div>
  )
}