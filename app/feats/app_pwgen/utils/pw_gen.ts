import { securelyPickCharFromString, securelyShuffleString } from "./secure_random"

/**
 * Generates a password while ensuring that at least one character is chosen
 * from each palette, unless impossible due to password length.
 */
export function generateByDistinctGroups(length: number, palettes: string[]): string {
  if (palettes.length === 0) {
    throw new Error("At least one character palette must be enabled.")
  }

  for (let i = 0; i < palettes.length; i++) {
    if (palettes[i].length === 0) {
      throw new Error(`Character palette ${i} cannot be empty.`)
    }
  }

  let pwd: string = ""

  for (let i = 0; i < Math.min(palettes.length, length); i++) {
    pwd += securelyPickCharFromString(palettes[i])
  }

  // NOTE: DO NOT pick a palette then sample a char from it. That makes the
  // distribution non-uniform.
  const pool = palettes.join("")
  for (let i = pwd.length; i < length; i++) {
    pwd += securelyPickCharFromString(pool)
  }

  // Shuffle because the prefix's distribution is predictable
  pwd = securelyShuffleString(pwd)

  return pwd
}

