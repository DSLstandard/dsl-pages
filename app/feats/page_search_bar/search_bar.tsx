import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SearchIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { DSL_PAGE_INFOS } from "../page_info/dsl_page_infos"
import type { PageInfo } from "../page_info/page_info"
import clsx from "clsx"

interface PageEntryProps {
  page: PageInfo
  onClick: () => void
}

function PageEntry({ page, onClick }: PageEntryProps) {
  return (
    <Link
      key={page.pathname}
      to={`/${page.pathname}`}
      viewTransition
      onClick={() => onClick()}
    >
      <div className="p-3 border rounded">
        <div className="font-semibold">{page.title}</div>
        <div className="text-sm text-slate-600">{page.description}</div>
      </div>
    </Link>
  )
}

export interface SearchBarProps {
  className?: string
}

export function SearchBar(props: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")

  const filtered = DSL_PAGE_INFOS.filter(p => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className={clsx("w-48 justify-start", props.className)}>
          <SearchIcon className="mr-2" />
          Search Page...
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find a tool</DialogTitle>
          <DialogDescription>Search for tools by name or description</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 items-center mb-4">
          <SearchIcon />
          <Input
            placeholder="Search tools by name, description or slug..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="destructive" onClick={() => setQuery("")}>Clear</Button>
        </div>

        <div className="space-y-3 overflow-auto max-h-[60dvh]">
          {filtered.length === 0 && (
            <Button
              variant="destructive"
              className="w-full h-14"
              onClick={() => setQuery("")}
            >
              No tools found. Clear search <TrashIcon />
            </Button>
          )}

          {filtered.map((page) => (
            <PageEntry
              key={page.pathname}
              page={page}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}