import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAnimationFrame } from "../../utils/use_animation_frame"


export interface TextAnimatorProps {
  initialText: string
  fps?: number
}

export function TextAnimator(props: TextAnimatorProps) {
  const [text, setText] = useState(props.initialText)
  const [animChar, setAnimChar] = useState(props.initialText[0] ?? "?")
  const fps = props.fps ?? 12

  useAnimationFrame((ts) => {
    const i = (Math.floor(ts / 1000 * fps)) % text.length
    setAnimChar(text[i])
  }, [text, fps])

  return (
    <div className="border grid grid-cols-[5fr_1fr] items-center gap-x-2 p-2">
      <Input type="text" value={text} onChange={(e) => setText(e.target.value)} className="bg-white" />
      <div className="font-mono text-center text-lg">
        {animChar}
      </div>
    </div>
  )
}
