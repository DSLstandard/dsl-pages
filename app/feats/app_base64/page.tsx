import { useCallback, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { base64PageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(base64PageInfo)

const DEFAULT_TEXT = `{"sub":"1234567890","name":"John Doe","admin":true,"iat":1516239022}`

function encodeBase64(text: string) {
  try {
    return btoa(text)
  } catch {
    return ""
  }
}

function decodeBase64(base64: string) {
  try {
    return atob(base64)
  } catch {
    return ""
  }
}

export default function Base64Page() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [base64, setBase64] = useState(encodeBase64(DEFAULT_TEXT))

  const onTextChange = useCallback((value: string) => {
    setText(value)
    setBase64(encodeBase64(value))
  }, [])

  const onBase64Change = useCallback((value: string) => {
    setBase64(value)
    setText(decodeBase64(value))
  }, [])

  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{base64PageInfo.title}</h1>
        <p className="text-sm text-slate-500">{base64PageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <section className="border py-2 px-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Plain text</label>
              <Textarea
                className="font-mono"
                rows={6}
                value={text}
                onChange={e => onTextChange(e.target.value)}
                placeholder="Enter text to encode..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Base64</label>
              <Textarea
                className="font-mono"
                rows={6}
                value={base64}
                onChange={e => onBase64Change(e.target.value)}
                placeholder="Enter Base64 to decode..."
              />
            </div>
          </div>
        </section>
      </main>
    </section>
  )
}
