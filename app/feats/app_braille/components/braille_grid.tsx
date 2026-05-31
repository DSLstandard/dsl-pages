import clsx from "clsx"
import type { JSX } from "react"

function generate_row(fromCodepoint: number, toCodepoint: number) {
  const elements: JSX.Element[] = []

  elements.push(
    <td key={`${fromCodepoint}-leader`} className="p-1 border text-center font-mono text-sm">
      U+{fromCodepoint.toString(16).toUpperCase().padStart(4, '0')}
    </td>
  )

  for (let c = fromCodepoint; c < toCodepoint; c++) {
    elements.push(
      <td key={c} className="p-1 border text-center font-mono">
        {String.fromCodePoint(c)}
      </td>
    )
  }

  return <>{elements}</>
}

export type BrailleGridProps = {
  className?: string
}

export function BrailleGrid(props: BrailleGridProps) {
  const rows: JSX.Element[] = []

  for (let i = 0; i < 16; i++) {
    const fromCodepoint = 0x2800 + i * 16
    const toCodepoint = fromCodepoint + 16
    rows.push(
      <tr key={i}>
        {generate_row(fromCodepoint, toCodepoint)}
      </tr>
    )
  }

  return (
    <table className={clsx("border-collapse border", props.className)}>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}