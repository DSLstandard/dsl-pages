import * as randomjs from "random-js"

export function securelyPickCharFromString(str: string): string {
  if (str.length === 0) {
    throw new Error("Cannot pick a character from an empty string.")
  }

  const index = randomjs.integer(0, str.length - 1)(randomjs.browserCrypto)
  return str[index]
}

export function securelyPickFromArray<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error("Cannot pick an element from an empty array.")
  }

  return randomjs.pick(randomjs.browserCrypto, arr)
}

export function securelyShuffleString(str: string): string {
  const arr = str.split("")

  // See https://github.com/ckknight/random-js/blob/master/src/distribution/shuffle.ts
  //
  // The 'arr' is mutated in-place
  randomjs.shuffle(randomjs.browserCrypto, arr)

  return arr.join("")
}
