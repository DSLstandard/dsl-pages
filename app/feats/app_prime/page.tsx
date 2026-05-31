import { useMemo, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { primePageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(primePageInfo)

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
}

function toSuperscript(n: number): string {
  if (n <= 1) return ""
  return String(n).split("").map(d => SUPERSCRIPTS[d] ?? d).join("")
}

function factorize(n: number): number[] {
  if (!Number.isInteger(n) || n < 2) return []
  const factors: number[] = []
  let x = n
  while (x % 2 === 0) { factors.push(2); x /= 2 }
  let d = 3
  while (d * d <= x) {
    while (x % d === 0) { factors.push(d); x /= d }
    d += 2
  }
  if (x > 1) factors.push(x)
  return factors
}

function countFactors(factors: number[]): Map<number, number> {
  const counts = new Map<number, number>()
  for (const f of factors) {
    counts.set(f, (counts.get(f) ?? 0) + 1)
  }
  return counts
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) { const t = b; b = a % b; a = t }
  return a
}

function gcdMany(nums: number[]): number {
  if (nums.length === 0) return 0
  if (nums.length === 1) return Math.abs(nums[0])
  return nums.reduce((acc, n) => gcd(acc, n))
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return (a / gcd(a, b)) * b
}

function lcmMany(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((acc, n) => lcm(acc, n))
}

export default function PrimePage() {
  return (
    <section className="mx-auto container max-w-200 px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{primePageInfo.title}</h1>
        <p className="text-sm text-slate-500">{primePageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <FactorizationSection />
        <GcdLcmSection />
      </main>
    </section>
  )
}

function FactorizationSection() {
  const [input, setInput] = useState("1920")

  const result = useMemo(() => {
    const trimmed = input.trim()
    if (trimmed === "") return null
    const n = Number(trimmed)
    if (!Number.isInteger(n) || n < 2 || !Number.isFinite(n) || trimmed !== String(n)) {
      return { error: "Please enter a positive integer ≥ 2" }
    }
    const factors = factorize(n)
    const isPrime = factors.length === 1 && factors[0] === n
    const counts = countFactors(factors)
    return { n, factors, counts, isPrime }
  }, [input])

  return (
    <section className="border py-2 px-5 space-y-4">
      <h2 className="text-lg font-semibold">Prime Factorization</h2>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Enter a number</label>
        <Textarea
          className="font-mono"
          rows={3}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. 1920"
        />
      </div>

      {result && "error" in result && (
        <p className="text-sm text-red-500">{result.error}</p>
      )}

      {result && !("error" in result) && (
        <div className="space-y-3">
          <p className="font-mono text-sm break-all">
            {result.n} = {result.factors.join("×")}
          </p>
          <p className="font-mono text-sm break-all">
            {result.n} = {
              Array.from(result.counts.entries()).map(([prime, count]) => (
                <span key={prime}>{prime}{toSuperscript(count)}</span>
              )).reduce((prev, curr) => <>{prev}×{curr}</>)
            }
          </p>
          <p className={`text-sm font-semibold ${result.isPrime ? "text-green-600" : "text-red-500"}`}>
            {result.isPrime ? "Prime" : "Not a prime"}
          </p>
        </div>
      )}
    </section>
  )
}

function GcdLcmSection() {
  const [input, setInput] = useState("1920, 1080, 720")
  const [rowCount, setRowCount] = useState(20)
  const [newWidth, setNewWidth] = useState(1280)

  const result = useMemo(() => {
    const trimmed = input.trim()
    if (trimmed === "") return null

    const parts = trimmed.split(",").map(s => s.trim()).filter(s => s !== "")
    if (parts.length < 2) return { error: "Please enter at least two comma-separated positive integers" }

    const nums: number[] = []
    for (const part of parts) {
      const n = Number(part)
      if (!Number.isInteger(n) || n <= 0 || !Number.isFinite(n) || part !== String(n)) {
        return { error: `"${part}" is not a valid positive integer` }
      }
      nums.push(n)
    }

    const gcd = gcdMany(nums)
    const lcm = lcmMany(nums)
    const quotients = nums.map(n => n / gcd)

    return { nums, gcd: gcd, lcm: lcm, quotients }
  }, [input])

  return (
    <section className="border py-2 px-5 space-y-4">
      <h2 className="text-lg font-semibold">GCD & LCM</h2>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Enter comma-separated numbers</label>
        <Textarea
          className="font-mono"
          rows={3}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='e.g. 1920, 1080, 720'
        />
      </div>

      {result && "error" in result && (
        <p className="text-sm text-red-500">{result.error}</p>
      )}

      {result && !("error" in result) && (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">GCD</p>
            <p className="font-mono text-sm">{result.gcd}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Each number = GCD × quotient</p>
            <div className="font-mono text-sm space-y-0.5">
              {result.nums.map((n, i) => (
                <p key={i}>{n} = {result.gcd} × {result.quotients[i]}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">LCM</p>
            <p className="font-mono text-sm">{result.lcm}</p>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Multiples of GCD</label>
              <span className="text-xs tabular-nums text-muted-foreground">{rowCount} rows</span>
            </div>
            <Slider
              min={10}
              max={200}
              step={5}
              value={[rowCount]}
              onValueChange={([v]) => setRowCount(v)}
            />
            <div className="max-h-72 overflow-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">k</TableHead>
                    <TableHead className="text-xs">{result.gcd} × k</TableHead>
                    <TableHead className="text-xs">Match</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: rowCount }, (_, i) => {
                    const k = i + 1
                    const val = result.gcd * k
                    const inInput = result.nums.includes(val)
                    return (
                      <TableRow
                        key={k}
                        className={inInput ? "bg-amber-100 dark:bg-amber-900/40 font-semibold" : undefined}
                      >
                        <TableCell className="font-mono text-xs py-1">{k}</TableCell>
                        <TableCell className="font-mono text-xs py-1">{val}</TableCell>
                        <TableCell className="text-xs py-1">
                          {inInput ? <span className="text-amber-700 dark:text-amber-400">Yes</span> : null}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {result.nums.length >= 2 && (() => {
            const w = result.nums[0]
            const h = result.nums[1]
            const whGcd = gcdMany([w, h])
            const qw = w / whGcd
            const qh = h / whGcd
            const computedH = Math.round(newWidth * qh / qw)
            return (
              <div className="border-t pt-3 space-y-2">
                <p className="text-sm font-medium">Extra Tool: FFmpeg Aspect Ratio & Video Resize</p>
                <p className="text-xs text-muted-foreground">
                  The GCD gives you the simplest integer ratio: {w}×{h} simplifies to {qw}:{qh}.
                  When resizing video with ffmpeg, picking dimensions that are exact multiples of this
                  ratio ensures both width and height stay integral while preserving the original aspect ratio.
                </p>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Target width</label>
                  <span className="text-xs tabular-nums text-muted-foreground">{newWidth}px</span>
                </div>
                <Slider
                  min={qw}
                  max={qw * 256}
                  step={qw}
                  value={[newWidth]}
                  onValueChange={([v]) => setNewWidth(v)}
                />
                <p className="text-xs text-muted-foreground">
                  Computed height: <span className="font-mono tabular-nums">{computedH}px</span>
                </p>
                <code className="block font-mono text-xs bg-stone-100 dark:bg-stone-800 p-2 rounded break-all">
                  ffmpeg -i input.mp4 -vf "scale={newWidth}:{computedH}" output.mp4
                </code>
              </div>
            )
          })()}
        </div>
      )}
    </section>
  )
}
