/**
 * See https://en.wikipedia.org/wiki/Braille_Patterns
 * 
 * Each dot in a Braille cell is numbered. The matrix looks like:
 * [1] [4]
 * [2] [5]
 * [3] [6]
 * [7] [8]
 */
export type CellID = number


export function isValidCellID(cellID: CellID): boolean {
  return cellID >= 1 && cellID <= 8
}

/**
 * A convenient logical ID for a Braille pattern. The matrix looks like:
 * [0] [1]
 * [2] [3]
 * [4] [5]
 * [6] [7]
 */
export type LogicalID = number

export function listLogicalIDs(): LogicalID[] {
  return [0, 1, 2, 3, 4, 5, 6, 7]
}

/**
 * Given a permutation of 0-7, return a logical ID to value map.
 */
export function makeLogicalMap(values: number[]): LogicalID[] {
  if (values.length !== 8) {
    throw new Error(`logical_array must have length 8, but got length ${values.length}`)
  }

  const logicalMap: number[] = new Array(8)
  for (const [logicalID, value] of values.entries()) {
    logicalMap[value] = logicalID
  }
  return logicalMap
}

export function isValidLogicalID(logicalID: LogicalID): boolean {
  return logicalID >= 0 && logicalID <= 7
}

export function convertLogicalIDToCellID(logicalID: LogicalID): CellID {
  return [1, 4, 2, 5, 3, 6, 7, 8][logicalID]
}

export function convertCellIDToLogicalID(cellID: CellID): LogicalID {
  return [0, 2, 4, 1, 3, 5, 6, 7][cellID - 1]
}

/**
 * See https://en.wikipedia.org/wiki/Braille_Patterns
 * 
 * Each dot in a Braille cell is also represented a hex value to add to the base code point U+2800. The matrix looks like:
 * [0x01] [0x08]
 * [0x02] [0x10]
 * [0x04] [0x20]
 * [0x40] [0x80]
 */
export function convertLogicalIDToHexValue(logicalID: LogicalID): number {
  return [0x01, 0x08, 0x02, 0x10, 0x04, 0x20, 0x40, 0x80][logicalID]
}

/**
 * Visual position of a Braille cell in a grid. Row and column are 0-indexed.
 * 
 * Matrix:
 * [row 0, col 0] [row 0, col 1]
 * [row 1, col 0] [row 1, col 1]
 * [row 2, col 0] [row 2, col 1]
 * [row 3, col 0] [row 3, col 1]
 */
export type VisualPosition = { row: number, col: number }

export function convertLogicalIDToVisualPosition(logical_id: LogicalID): VisualPosition {
  const row = Math.floor(logical_id / 2)
  const col = logical_id % 2
  return { row, col }
}

export function convertVisualPositionToLogicalID(visual_position: VisualPosition): LogicalID {
  return visual_position.row * 2 + visual_position.col
}

export class BrailleChar {
  private readonly hexValue: number

  private constructor(hex_value: number) {
    this.hexValue = hex_value
  }

  setLogicalID(logicalID: LogicalID, on: boolean = true): BrailleChar {
    const bit = convertLogicalIDToHexValue(logicalID)
    return new BrailleChar(on ? (this.hexValue | bit) : (this.hexValue & ~bit))
  }

  isLogicalIDSet(logicalID: LogicalID): boolean {
    const bit = convertLogicalIDToHexValue(logicalID)
    return (this.hexValue & bit) !== 0
  }

  setCellID(cellID: CellID, on: boolean = true): BrailleChar {
    return this.setLogicalID(convertCellIDToLogicalID(cellID), on)
  }

  isCellIDSet(cellID: CellID): boolean {
    return this.isLogicalIDSet(convertCellIDToLogicalID(cellID))
  }

  listSetLogicalIDs(): LogicalID[] {
    const logical_ids: LogicalID[] = []
    for (let logical_id = 0; logical_id < 8; logical_id++) {
      if (this.isLogicalIDSet(logical_id)) {
        logical_ids.push(logical_id)
      }
    }
    return logical_ids
  }

  listSetCellIDs(): CellID[] {
    const cell_ids = this.listSetLogicalIDs().map(convertLogicalIDToCellID)
    cell_ids.sort((a, b) => a - b) // More intuitive for caller to use
    return cell_ids
  }

  getUnicodeCodepoint() {
    return 0x2800 + this.hexValue
  }

  getUnicodeChar(): string {
    return String.fromCharCode(this.getUnicodeCodepoint())
  }

  static empty() {
    return new BrailleChar(0)
  }
}