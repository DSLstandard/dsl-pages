import { useCallback, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  Table, TableBody, TableCell, TableRow,
} from "@/components/ui/table"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { morsePageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(morsePageInfo)

interface MorseEntry {
  char: string
  morse: string
}

const LETTER_MORSE: Record<string, string> = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".",
  "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---",
  "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---",
  "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
  "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--",
  "Z": "--..",
}

const DIGIT_MORSE: Record<string, string> = {
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
}

const PUNCT_MORSE: Record<string, string> = {
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", "\"": ".-..-.",
  "@": ".--.-.",
}

const TEXT_TO_MORSE: Record<string, string> = {
  ...LETTER_MORSE,
  ...DIGIT_MORSE,
  ...PUNCT_MORSE,
}

const MORSE_TO_TEXT: Record<string, string> = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([k, v]) => [v, k])
)

function encodeMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map(ch => {
      if (ch === " ") return " / "
      return TEXT_TO_MORSE[ch] ?? ch
    })
    .join(" ")
}

function decodeMorse(morse: string): string {
  return morse
    .split(" / ")
    .map(word =>
      word
        .trim()
        .split(/\s+/)
        .map(code => MORSE_TO_TEXT[code] ?? code)
        .join("")
    )
    .join(" ")
}

function buildEntries(map: Record<string, string>): MorseEntry[] {
  return Object.entries(map).map(([char, morse]) => ({ char, morse }))
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

function MorseTable({ entries, cols = 7 }: { entries: MorseEntry[], cols?: number }) {
  const rows = chunk(entries, cols)
  return (
    <Table>
      <TableBody>
        {rows.map((row, ri) => (
          <TableRow key={ri}>
            {row.map(e => (
              <TableCell key={e.char} className="font-mono">
                <span className="tabular-nums">{e.char}</span>
                {" "}
                <span className="text-muted-foreground">{e.morse}</span>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function MorseReference() {
  return (
    <section className="border py-2 px-5 space-y-4">
      <h2 className="text-lg font-semibold">Morse Code Mapping</h2>

      <div>
        <h3 className="text-sm font-medium mb-1">Letters</h3>
        <MorseTable entries={buildEntries(LETTER_MORSE)} cols={8} />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-1">Digits</h3>
        <MorseTable entries={buildEntries(DIGIT_MORSE)} cols={5} />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-1">Punctuation / Symbols</h3>
        <MorseTable entries={buildEntries(PUNCT_MORSE)} cols={6} />
      </div>
    </section>
  )
}

export default function MorsePage() {
  const [text, setText] = useState("")
  const [morse, setMorse] = useState("")

  const onTextChange = useCallback((value: string) => {
    setText(value)
    setMorse(encodeMorse(value))
  }, [])

  const onMorseChange = useCallback((value: string) => {
    setMorse(value)
    setText(decodeMorse(value))
  }, [])

  return (
    <section className="mx-auto container max-w-200 px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{morsePageInfo.title}</h1>
        <p className="text-sm text-slate-500">{morsePageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <section className="border py-2 px-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Text</label>
              <Textarea
                className="font-mono"
                rows={6}
                value={text}
                onChange={e => onTextChange(e.target.value)}
                placeholder="Enter text to encode..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Morse code</label>
              <Textarea
                className="font-mono"
                rows={6}
                value={morse}
                onChange={e => onMorseChange(e.target.value)}
                placeholder="Enter Morse code to decode..."
              />
            </div>
          </div>
        </section>

        <MorseReference />
      </main>
    </section>
  )
}
