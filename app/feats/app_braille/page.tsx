import { UnicodeComputer } from "./components/unicode_computer"
import { BrailleSnippet } from "./components/braille_snippet"
import { BrailleGallery } from "./components/braille_gallery"
import { BrailleEditor } from "./components/braille_editor"
import { BrailleGrid } from "./components/braille_grid"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { braillePageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(braillePageInfo)

export default function AppBraillePage() {
  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">Braille Tool</h1>
        <p className="text-sm text-slate-500">Build 4x2 dots braille patterns</p>
      </header>
      <main>
        <div className="grid max-lg:grid-rows-[max-content_1fr] lg:grid-cols-[max-content_1fr] gap-4 items-start">
          <div className="max-lg:mx-auto">
            <BrailleEditor />
          </div>
          <div className="space-y-4">
            <BrailleSnippet />
            <UnicodeComputer />
            <BrailleGallery />
            <BrailleGrid className="mx-auto" />
          </div>
        </div>
      </main>
    </section>
  )
}