import { useEditorStore } from "../editor_store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CopyIcon, EditIcon } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export function BrailleSnippet() {
  const char = useEditorStore((store) => store.char)
  const codepoint = char.getUnicodeCodepoint()
  const [scratchpadText, setScratchpadText] = useState("")

  const onCopy = async () => {
    await navigator.clipboard.writeText(String.fromCodePoint(codepoint))
    toast.success(`Copied U+${codepoint.toString(16).toUpperCase().padStart(4, '0')} to clipboard!`)
  }

  const onAppendToScratchpad = () => {
    setScratchpadText((prev) => prev + String.fromCodePoint(codepoint))
  }

  return (
    <div className="p-4 border">
      <div className="grid grid-cols-[max-content_1fr] mb-4 gap-4">
        <div>
          <div className="font-mono text-[80px] w-fit border px-4">
            {String.fromCharCode(codepoint)}
          </div>
        </div>
        <div className="flex-col">
          <div className="flex flex-wrap gap-1">
            <Button onClick={() => onCopy()}>
              <CopyIcon /> Copy [{String.fromCodePoint(codepoint)}]
            </Button>
            <Button onClick={() => onAppendToScratchpad()}>
              <EditIcon /> Append to scratchpad
            </Button>
          </div>
          <div>
            Codepoint: U+{codepoint.toString(16).toUpperCase().padStart(4, '0')}
          </div>
          <div>
            Character: <span className="border rounded p-1 inline-block">{String.fromCodePoint(codepoint)}</span>
          </div>
        </div>
      </div>
      <Textarea placeholder="Scratchpad..." value={scratchpadText} onChange={(e) => setScratchpadText(e.target.value)} />
    </div>
  )
}