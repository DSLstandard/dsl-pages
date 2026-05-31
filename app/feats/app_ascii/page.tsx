import clsx from "clsx"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { getAsciiCodes, type AsciiCode } from "./data"
import { asciiPageInfo } from "./page_info"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const meta = createMetaFromPageInfo(asciiPageInfo)

function RawTable() {
  const codes = getAsciiCodes()

  return (
    <table className="border min-w-full border-separate border-spacing-0 text-sm">
      <thead className="bg-stone-100 text-stone-700">
        <tr>
          <th className="border-b border-r border-stone-300 p-1 text-right font-semibold uppercase tracking-widest">Dec</th>
          <th className="border-b border-r border-stone-300 p-1 text-left font-semibold uppercase tracking-widest">Hex</th>
          <th className="border-b border-r border-stone-300 p-1 text-left font-semibold uppercase tracking-widest">Symbol</th>
          <th className="border-b border-r border-stone-300 p-1 text-left font-semibold uppercase tracking-widest">HTML Name</th>
          <th className="border-b border-stone-300 p-1 text-left font-semibold uppercase tracking-widest">Desc.</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {codes.map(code => {
          const isUnused = code.description === "Unused"

          return (
            <tr key={code.value} className={isUnused ? "bg-red-100" : "hover:bg-stone-50"}>
              <td className="border-b border-r border-stone-300 px-1 text-right font-medium text-stone-900">
                {code.value}
              </td>
              <td className="border-b border-r border-stone-300 px-1 font-mono text-stone-700">
                {code.value.toString(16).padStart(2, '0').toUpperCase()}<sub>16</sub>
              </td>
              <td className="border-b border-r border-stone-300 px-1 font-mono text-stone-900">
                {code.symbol}
              </td>
              <td className="border-b border-r border-stone-300 px-1 font-mono text-stone-700">
                {code.htmlName}
              </td>
              <td className="border-b border-stone-300 px-1 text-stone-600">
                {code.description}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

interface GridCellProps {
  code: AsciiCode
}

function GridCell({ code }: GridCellProps) {
  const isUnused = code.description === "Unused"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <td className={clsx("border border-stone-300 w-8 h-8 text-center text-xs font-mono hover:bg-stone-100", isUnused && "bg-red-100")} >
          {code.symbol}
        </td>
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-sm text-stone-600">
          {code.description}
        </div>
        <div>
          Dec: {code.value}
        </div>
        <div>
          Hex: <span className="font-mono">{code.value.toString(16).padStart(2, '0').toUpperCase()}<sub>16</sub></span>
        </div>
        <div>
          HTML: {code.htmlName === null ? "<none>" : <span className="font-mono">{code.htmlName}</span>}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function GridTable() {
  const codes = getAsciiCodes()

  return (
    <table className="border-collapse">
      <tbody>
        {Array.from({ length: 16 }).map((_, row) => (<tr key={row}>
          {Array.from({ length: 16 }).map((_, col) => {
            const index = row * 16 + col
            const code = codes[index]
            return (
              <GridCell key={col} code={code} />
            )
          })}
        </tr>))}
      </tbody>
    </table>
  )
}

export default function AppAsciiTablePage() {
  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">ASCII Table</h1>
        <p className="text-sm text-slate-500">Also see https://www.ascii-code.com/</p>
      </header>
      <main>
        <div className="space-y-6">
          <section className="mx-auto w-fit">
            <header className="mb-2">
              <h2 className="text-xl font-medium">Grid View</h2>
              <p className="text-sm text-slate-500">
                Click on any cell to see more details about that character.
              </p>
            </header>
            <GridTable />
          </section>
          <section>
            <header className="mb-2">
              <h2 className="text-xl font-medium">Raw Table</h2>
              <p className="text-sm text-slate-500">
                Lists all ASCII characters like https://www.ascii-code.com/.
              </p>
            </header>
            <RawTable />
          </section>
        </div>
      </main>
    </section>
  )
}