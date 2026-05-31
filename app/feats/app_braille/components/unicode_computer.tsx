import { useEditorStore } from "../editor_store"
import * as braille_util from "../braille_util"
import { CELL_ID_TO_CSS_COLOR } from "../color_util"

export function UnicodeComputer() {
  const char = useEditorStore((store) => store.char)

  const codepoint = char.getUnicodeCodepoint()

  return (
    <div className="font-mono border p-4 space-y-3">
      <div className="leading-relaxed flex flex-wrap items-center gap-2">
        <span>U+2800</span>
        {char.listSetLogicalIDs().map(id => {
          const cell_id = braille_util.convertLogicalIDToCellID(id)
          const cell_hex_value = braille_util.convertLogicalIDToHexValue(id)
          return (
            <span className="inline-block" key={id}>
              <span>
                {"+ "}
              </span>
              <span className="inline-block mr-1 border rounded-md bg-gray-50 px-1">
                {String.fromCharCode(0x2800 + cell_hex_value)}
              </span>
              <span style={{ color: CELL_ID_TO_CSS_COLOR[cell_id] }}>
                {"0x" + cell_hex_value.toString(16).padStart(2, '0')}
              </span>
            </span>
          )
        })}
      </div>
      <div className="pt-2 border-t">
        <span>
          {" = "}
        </span>
        <span className="inline-block mr-1 border rounded-md bg-gray-50 px-1">
          {String.fromCharCode(codepoint)}
        </span>
        <span>
          {"U+" + codepoint.toString(16).toUpperCase().padStart(4, "0")}
        </span>
      </div>
    </div>
  )
}