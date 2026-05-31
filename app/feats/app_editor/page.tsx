import { useCallback } from "react"
import Editor from "@monaco-editor/react"
import * as zustand from "zustand"
import * as zustandMiddleware from "zustand/middleware"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { editorPageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(editorPageInfo)

const LANGUAGES = [
  { label: "Plain Text", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSON", value: "json" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Python", value: "python" },
  { label: "Markdown", value: "markdown" },
  { label: "SQL", value: "sql" },
  { label: "YAML", value: "yaml" },
  { label: "TOML", value: "toml" },
  { label: "Shell", value: "shell" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
]

const THEMES = [
  { label: "Light", value: "vs" },
  { label: "Dark", value: "vs-dark" },
]

interface EditorStore {
  content: string
  setContent: (content: string) => void
  language: string
  setLanguage: (language: string) => void
  theme: string
  setTheme: (theme: string) => void
}

const useEditorStore = zustand.create<EditorStore>()(
  zustandMiddleware.persist(
    (set) => ({
      content: "",
      setContent: (content: string) => set({ content }),
      language: "plaintext",
      setLanguage: (language: string) => set({ language }),
      theme: "vs",
      setTheme: (theme: string) => set({ theme }),
    }),
    { name: "app_editor_store" }
  )
)

export default function EditorPage() {
  const content = useEditorStore(s => s.content)
  const setContent = useEditorStore(s => s.setContent)
  const language = useEditorStore(s => s.language)
  const setLanguage = useEditorStore(s => s.setLanguage)
  const theme = useEditorStore(s => s.theme)
  const setTheme = useEditorStore(s => s.setTheme)

  const handleChange = useCallback((value: string | undefined) => {
    setContent(value ?? "")
  }, [setContent])

  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{editorPageInfo.title}</h1>
        <p className="text-sm text-slate-500">{editorPageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-semibold">Editor</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Language:</label>
                <NativeSelect value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => (
                    <NativeSelectOption key={l.value} value={l.value}>{l.label}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Theme:</label>
                <NativeSelect value={theme} onChange={e => setTheme(e.target.value)}>
                  {THEMES.map(t => (
                    <NativeSelectOption key={t.value} value={t.value}>{t.label}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>
          </div>

          {typeof window !== "undefined" && (
            <Editor
            className="border"
              height="75vh"
              language={language}
              theme={theme}
              value={content}
              onChange={handleChange}
            />
          )}
        </section>
      </main>
    </section>
  )
}
