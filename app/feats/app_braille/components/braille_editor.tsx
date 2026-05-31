import clsx from "clsx"
import { useEditorStore } from "../editor_store"
import * as braille from "../braille_util"
import { CELL_ID_TO_CSS_COLOR } from "../color_util"

export interface EditorBrailleDotProps {
  logicalID: braille.LogicalID
}

export function EditorBrailleDot({ logicalID }: EditorBrailleDotProps) {
  const cellID = braille.convertLogicalIDToCellID(logicalID)
  const cellHexValue = braille.convertLogicalIDToHexValue(logicalID)

  const isDotOn = useEditorStore((store) => store.char.isLogicalIDSet(logicalID))

  const char = useEditorStore((store) => store.char)
  const setChar = useEditorStore((store) => store.setChar)

  const toggle_dot = () => {
    setChar(char.setLogicalID(logicalID, !isDotOn))
  }

  return (
    <div>
      <div
        onClick={toggle_dot}
        className={clsx(
          "transition-all duration-200 ease-out hover:scale-105 hover:shadow-md",
          "cursor-pointer select-none w-16 h-16 rounded-full border-2",
          isDotOn ? "bg-black" : "bg-gray-100",
          "flex flex-col justify-center items-center text-xs shadow-sm",
          isDotOn ? "text-white" : "text-gray-500",
        )}
        style={{ borderColor: CELL_ID_TO_CSS_COLOR[braille.convertLogicalIDToCellID(logicalID)] }}
      >
        <div>
          #{cellID}
        </div>
        <div>
          Hex: <code>{cellHexValue.toString(16).padStart(2, '0')}</code>
        </div>
      </div>
    </div>
  )
}


export function BrailleEditor() {
  return (
    <div className="grid grid-cols-2 w-fit gap-4 p-4 border bg-white/80 shadow-lg backdrop-blur-sm">
      {braille.listLogicalIDs().map(
        logicalID => <EditorBrailleDot key={logicalID} logicalID={logicalID} />)
      }
    </div>
  )
}

