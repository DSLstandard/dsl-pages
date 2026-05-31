import { createMetaFromPageInfo } from "../page_info/meta_util";
import { LIPSUM_LA } from "./data";
import { loremIpsumPageInfo } from "./page_info";

export const meta = createMetaFromPageInfo(loremIpsumPageInfo)

const PARAGRAPHS = LIPSUM_LA.split("\n\n")

interface ParagraphProps {
  text: string
}

function Paragraph({ text }: ParagraphProps) {
  return (
    <div className="border-l-2 border-gray-600 py-1 pl-2 hover:bg-slate-100 transition-colors duration-150">
      <p className="text-justify font-serif tracking-tight leading-5">
        {text}
      </p>
    </div>
  )
}

export default function Page() {
  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">Lorem Ipsum Dump</h1>
        <p className="text-sm text-slate-500">Select and copy this text yourself.</p>
        <p className="text-sm mt-4"><b>NOTE:</b> The exact text here is sourced from <a className="underline" href="https://github.com/PhelypeOleinik/lipsum/blob/c01ed1ccf17592da089b1ab68a9c14626b513b99/lipsum-la.txt">https://github.com/PhelypeOleinik/lipsum/blob/c01ed1ccf17592da089b1ab68a9c14626b513b99/lipsum-la.txt</a></p>
        <p className="text-sm mt-4"><b>HINT:</b> <em>TRIPLE-CLICK</em> on the first paragraph to select the whole paragraph, and (while holding left click) drag to the following paragraphs. SCROLL with your MIDDLE FINGER.</p>
      </header>
      <main>
        <div className="space-y-5 px-4">
          {PARAGRAPHS.map((text, i) => <Paragraph key={i} text={text} />)}
        </div>
      </main>
    </section>
  )
}