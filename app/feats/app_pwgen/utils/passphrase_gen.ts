import { securelyPickFromArray } from "./secure_random"

export type CaseOption = "lower" | "upper" | "title" | "mixed"

function adjustCasing(word: string, casing: CaseOption) {
  word = word.toLowerCase()
  switch (casing) {
    case "upper": return word.toUpperCase()
    case "title": return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    case "mixed": {
      let out = ""
      for (const ch of word) {
        out += securelyPickFromArray([ch.toUpperCase(), ch.toLowerCase()])
      }
      return out
    }
    default: return word.toLowerCase()
  }
}

export interface GenOptions {
  wordPool: string[]
  wordCount: number
  separator: string
  casing: CaseOption
}

export function generatePassphrase(opts: GenOptions): string {
  let pickedWords: string[] = []

  for (let i = 0; i < opts.wordCount; i++) {
    let word = securelyPickFromArray(opts.wordPool)
    word = adjustCasing(word, opts.casing)
    pickedWords.push(word)
  }

  const pwd = pickedWords.join(opts.separator)
  return pwd
}