import * as braille from "./braille_util"
import * as zustand from "zustand"

export interface BrailleEditorStore {
  char: braille.BrailleChar
  setChar: (char: braille.BrailleChar) => void
}

export const useEditorStore = zustand.create<BrailleEditorStore>()((set) => ({
  char:
    // Make it look interesting by default so it isn't just blank on the UI on
    // load
    braille.BrailleChar.empty()
      .setLogicalID(0)
      .setLogicalID(3)
      .setLogicalID(4)
      .setLogicalID(5)
      .setLogicalID(7)
      .setLogicalID(8)
  ,
  setChar:
    (char: braille.BrailleChar) => set(() => ({ char })),
}))