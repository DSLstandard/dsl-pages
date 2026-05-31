import { useMemo, useState } from "react"
import * as braille from "../braille_util"
import { trueModulo } from "../../utils/true_modulo"
import { Slider } from "@/components/ui/slider"
import { TextAnimator } from "./text_animator"

function makeSnakeSample(snake_length: number, direction: "clockwise" | "counter-clockwise"): braille.BrailleChar[] {
  /**
   * Position matrix:
   * [0] [7]
   * [1] [6]
   * [2] [5]
   * [3] [4]
   */
  const posToLogicalID: braille.LogicalID[] = braille.makeLogicalMap([0, 7, 1, 6, 2, 5, 3, 4])

  const outputChars: braille.BrailleChar[] = []

  for (let frameIx = 0; frameIx < 8; frameIx++) {
    let char = braille.BrailleChar.empty()

    for (let d = 0; d < snake_length; d++) {
      let pos = frameIx + d
      if (direction === "clockwise") {
        pos = -pos
      }
      pos = trueModulo(pos, 8)
      char = char.setLogicalID(posToLogicalID[pos])
    }

    outputChars.push(char)
  }

  return outputChars
}

export function BrailleGallery() {
  const [fps, setFps] = useState(12)

  const snakeSamples = useMemo(() => {
    const samples: string[] = []
    for (let len = 1; len <= 7; len++) {
      samples.push(makeSnakeSample(len, "clockwise").map(char => char.getUnicodeChar()).join(""))
      samples.push(makeSnakeSample(len, "counter-clockwise").map(char => char.getUnicodeChar()).join(""))
    }
    return samples
  }, [])

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-gray-600">
        Frames per second: {fps}
      </div>
      <Slider value={[fps]} onValueChange={([new_fps]) => setFps(new_fps)} />

      <div className="grid grid-cols-2 gap-2 mt-4">
        <TextAnimator fps={fps} initialText="Braille Gallery" />
        <TextAnimator fps={fps} initialText="Try adjusting the 'Frames per second' slider" />
        <TextAnimator fps={fps} initialText="⡀⡈⡌⡜⡞⡾⡿⣿⢿⢷⢳⢣⢡⢁⢀" />
        <TextAnimator fps={fps} initialText="⠀⠀⠁⠃⠇⡇⡇⡇⡇⠇⠃⠃⠓⠳⢳⣳⣳⣳⢳⠳⠳⠳⠷⡷⣷⣷⣷⣷⡷⠷⠳⠓⠃⠁⠀⠀⢀⣀⣄⣄⣆⣆⣄⣀⢀⠀" />
        {snakeSamples.map((sample, i) => <TextAnimator key={i} fps={fps} initialText={sample} />)}
      </div>

    </div>
  )
}