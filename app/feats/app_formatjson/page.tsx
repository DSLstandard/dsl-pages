import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/feats/ui_components/copy_button"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { formatJsonPageInfo } from "./page_info"
import Editor from '@monaco-editor/react';

const DEFAULT_JSON_EXAMPLE = `\
{"Containers":"1","CreatedAt":"2023-09-30 00:10:31 UTC",
"CreatedSince":"2 months ago","Digest":"\u003cnone\u003e",
"ID":"d7bc4a9bf173","Repository":"postgres","SharedSize":"N/A",
"Size":"524MB","Tag":"37","UniqueSize":"N/A"}
`

export const meta = createMetaFromPageInfo(formatJsonPageInfo)

export default function JsonPage() {
  const [input, setInput] = useState(DEFAULT_JSON_EXAMPLE)

  const result = useMemo(() => {
    const trimmed = input.trim()
    if (trimmed === "") return { formatted: "", error: null }
    try {
      const parsed = JSON.parse(trimmed)
      return { formatted: JSON.stringify(parsed, null, 2), error: null }
    } catch (e) {
      return { formatted: "", error: (e as Error).message }
    }
  }, [input])

  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{formatJsonPageInfo.title}</h1>
        <p className="text-sm text-slate-500">{formatJsonPageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <section className="border border-black py-2 px-5 grid grid-cols-2 gap-2">
          <div>
            {typeof window !== "undefined" && (
              <Editor
                height="90vh"
                defaultLanguage="json"
                defaultValue={DEFAULT_JSON_EXAMPLE}
                onChange={(value: any) => setInput(value || "")}
              />
            )}
          </div>

          <div>
            {result.error && (
              <pre className="border p-2 text-sm border-red-500 text-red-500 text-wrap">{result.error}</pre>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Formatted output</label>
                <CopyButton copyContent={result.formatted} />
              </div>
              {result.formatted ?
                <pre className="font-mono text-sm bg-neutral-50 dark:bg-neutral-900 rounded-lg border p-3 overflow-auto max-h-96">
                  {result.formatted}
                </pre> :
                <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center text-sm text-slate-500">
                  No output to display
                </div>
              }
            </div>
          </div>
        </section>
      </main>
    </section>
  )
}
