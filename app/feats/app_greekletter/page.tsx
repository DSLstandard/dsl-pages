import { CopyButton } from "../ui_components/copy_button"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { greekLetterPageInfo } from "./page_info"
import { toast } from "sonner"

export const meta = createMetaFromPageInfo(greekLetterPageInfo)

interface GreekLetter {
  upper: string
  lower: string
  name: string
  latex: string
}

const GREEK_LETTERS: GreekLetter[] = [
  { upper: "Α", lower: "α", name: "Alpha", latex: "\\alpha | A" },
  { upper: "Β", lower: "β", name: "Beta", latex: "\\beta | B" },
  { upper: "Γ", lower: "γ", name: "Gamma", latex: "\\gamma | \\Gamma" },
  { upper: "Δ", lower: "δ", name: "Delta", latex: "\\delta | \\Delta" },
  { upper: "Ε", lower: "ε", name: "Epsilon", latex: "\\epsilon (OR) \\varepsilon | \\Epsilon" },
  { upper: "Ζ", lower: "ζ", name: "Zeta", latex: "\\zeta | \\Zeta" },
  { upper: "Η", lower: "η", name: "Eta", latex: "\\eta | \\Eta" },
  { upper: "Θ", lower: "θ", name: "Theta", latex: "\\theta | \\Theta" },
  { upper: "Ι", lower: "ι", name: "Iota", latex: "\\iota | I" },
  { upper: "Κ", lower: "κ", name: "Kappa", latex: "\\Kappa | K" },
  { upper: "Λ", lower: "λ", name: "Lambda", latex: "\\lambda | \\Lambda" },
  { upper: "Μ", lower: "μ", name: "Mu", latex: "\\mu | \\Mu" },
  { upper: "Ν", lower: "ν", name: "Nu", latex: "\\nu | N" },
  { upper: "Ξ", lower: "ξ", name: "Xi", latex: "\\xi | \\Xi" },
  { upper: "Ο", lower: "ο", name: "Omicron", latex: "o | O" },
  { upper: "Π", lower: "π", name: "Pi", latex: "\\pi | \\Pi" },
  { upper: "Ρ", lower: "ρ", name: "Rho", latex: "\\rho (OR) \\varrho | P" },
  { upper: "Σ", lower: "σ", name: "Sigma", latex: "\\sigma | \\Sigma" },
  { upper: "Τ", lower: "τ", name: "Tau", latex: "\\tau | T" },
  { upper: "Υ", lower: "υ", name: "Upsilon", latex: "\\upsilon | \\Upsilon" },
  { upper: "Φ", lower: "φ", name: "Phi", latex: "\\phi (OR) \\varphi | \\Phi" },
  { upper: "Χ", lower: "χ", name: "Chi", latex: "\\chi | X" },
  { upper: "Ψ", lower: "ψ", name: "Psi", latex: "\\psi | \\Psi" },
  { upper: "Ω", lower: "ω", name: "Omega", latex: "\\omega | \\Omega" },
]

const LOWER_ALL = GREEK_LETTERS.map(l => l.lower).join("")
const UPPER_ALL = GREEK_LETTERS.map(l => l.upper).join("")

const CODE_SNIPPET_CONTENT: string = `\
lowercase = "${LOWER_ALL}"
uppercase = "${UPPER_ALL}"`

export default function GreekLetterPage() {
  return (
    <section className="mx-auto container max-w-200 px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{greekLetterPageInfo.title}</h1>
        <p className="text-sm text-slate-500">{greekLetterPageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <section className="border py-2 px-5 space-y-4">
          <h2 className="text-lg font-semibold">Code Snippet</h2>

          <pre className="bg-stone-100 dark:bg-stone-800 p-2 rounded text-xs font-mono overflow-auto">
            {CODE_SNIPPET_CONTENT}
          </pre>
        </section>

        <section className="border py-2 px-5 space-y-4">
          <h2 className="text-lg font-semibold">Letter Grid</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Lowercase</p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-0">
                {GREEK_LETTERS.map(letter => (
                  <div
                    key={`lower-${letter.name}`}
                    className="flex items-center justify-center aspect-square border text-lg font-mono cursor-pointer transition-opacity hover:opacity-50"
                    onClick={() => {
                      navigator.clipboard.writeText(letter.lower)
                      toast.success(`Copied '${letter.lower}' to clipboard`)
                    }}
                  >
                    {letter.lower}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Uppercase</p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-0">
                {GREEK_LETTERS.map(letter => (
                  <div
                    key={`upper-${letter.name}`}
                    className="flex items-center justify-center aspect-square border text-lg font-mono cursor-pointer transition-opacity hover:opacity-50"
                    onClick={() => {
                      navigator.clipboard.writeText(letter.upper)
                      toast.success(`Copied '${letter.upper}' to clipboard`)
                    }}
                  >
                    {letter.upper}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border py-2 px-5 space-y-4">
          <h2 className="text-lg font-semibold">Table</h2>

          <p className="text-sm">
            <b>References: </b>
            <a className="underline" href="https://web.mit.edu/jmorzins/www/greek-alphabet.html">https://web.mit.edu/jmorzins/www/greek-alphabet.html</a>
            {" & "}
            <a className="underline" href="https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols">https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols</a>
          </p>

          <div className="overflow-auto">
            <table className="border min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="border-b border-r border-stone-300 p-1 text-center w-16">Upper</th>
                  <th className="border-b border-r border-stone-300 p-1 text-center w-16">Lower</th>
                  <th className="border-b border-r border-stone-300 p-1 text-left">Name</th>
                  <th className="border-b border-stone-300 p-1 text-left font-mono">LaTeX</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {GREEK_LETTERS.map(letter => (
                  <tr key={letter.name} className="hover:bg-stone-50">
                    <td className="border-b border-r border-stone-300 px-1 text-center font-mono text-lg">
                      {letter.upper}
                    </td>
                    <td className="border-b border-r border-stone-300 px-1 text-center font-mono text-lg">
                      {letter.lower}
                    </td>
                    <td className="border-b border-r border-stone-300 px-2">
                      {letter.name}
                    </td>
                    <td className="border-b border-stone-300 px-2 font-mono text-stone-700">
                      {letter.latex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </section>
  )
}
