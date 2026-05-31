function assertIsChar(char: string) {
  if (char.length !== 1) {
    throw new Error(`Expected a single character, but got "${char}".`)
  }
}


/**
 * Type-safe character mutable set implementation.
 *
 * Exists because 'string' for both char and string is too confusing.
 */
export class CharSet {
  private set: Set<string>

  private constructor() {
    this.set = new Set()
  }

  [Symbol.iterator]() {
    return this.set[Symbol.iterator]()
  }

  /**
   * Adds a character to the set. Throws if the input string is not exactly one
   * character long.
   */
  addChar(char: string) {
    assertIsChar(char)
    this.set.add(char)
  }

  /**
   * Adds all characters in the input string to the set.
   */
  addString(chars: string) {
    for (const ch of chars) {
      this.addChar(ch)
    }
  }

  addSet(other: CharSet) {
    for (const ch of other.set) {
      this.set.add(ch)
    }
  }

  /**
   * Returns true if the character is in the set.
   */
  hasChar(char: string): boolean {
    assertIsChar(char)
    return this.set.has(char)
  }

  filterInplace(predicate: (char: string) => boolean) {
    const set = new Set<string>()
    for (const ch of this.set) {
      if (predicate(ch)) {
        set.add(ch)
      }
    }
    this.set = set
  }

  size(): number {
    return this.set.size
  }

  isEmpty(): boolean {
    return this.set.size === 0
  }

  getString(): string {
    return Array.from(this.set).join("")
  }

  static fromString(chars: string): CharSet {
    const set = new CharSet()
    set.addString(chars)
    return set
  }

  static createEmpty(): CharSet {
    return new CharSet()
  }

  static cloned(source: CharSet): CharSet {
    const set = new CharSet()
    set.addSet(source)
    return set
  }

  static filtered(source: CharSet, predicate: (char: string) => boolean): CharSet {
    const set = new CharSet()
    for (const ch of source.set) {
      if (predicate(ch)) {
        set.addChar(ch)
      }
    }
    return set
  }
}
