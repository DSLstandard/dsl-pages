import { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import * as zustand from "zustand"
import { Slider } from "@/components/ui/slider"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { clampNumber } from "../utils/clamp"
import { rulerPageInfo } from "./page_info"
import * as zustandMiddleware from 'zustand/middleware'

export const meta = createMetaFromPageInfo(rulerPageInfo)

const CSS_PX_PER_INCH = 96
const MM_PER_INCH = 25.4
const DEFAULT_PX_PER_MM = CSS_PX_PER_INCH / MM_PER_INCH
const A4_SHORT_MM = 210

interface Tick {
  position: number
  height: number
  width: number
  label?: { text: string; offset: number }
}

function generateCmTicks(maxCm: number): Tick[] {
  const ticks: Tick[] = []
  for (let cm = 0; cm <= maxCm; cm++) {
    ticks.push({ position: cm * 10, height: 16, width: 1.5, label: { text: `${cm}`, offset: 0 } })
    ticks.push({ position: cm * 10 + 5, height: 10, width: 1 })
    if (cm < maxCm) {
      for (let mm = 1; mm <= 9; mm++) {
        if (mm === 5) continue
        ticks.push({ position: cm * 10 + mm, height: 5, width: 0.5 })
      }
    }
  }
  return ticks
}

function generateInchTicks(maxInches: number): Tick[] {
  const ticks: Tick[] = []
  for (let inch = 0; inch <= maxInches; inch++) {
    ticks.push({ position: inch * 25.4, height: 18, width: 1.5, label: { text: `${inch}`, offset: 16 } })
    if (inch < maxInches) {
      ticks.push({ position: inch * 25.4 + 12.7, height: 12, width: 1 })
      ticks.push({ position: inch * 25.4 + 6.35, height: 8, width: 0.5 })
      ticks.push({ position: inch * 25.4 + 19.05, height: 8, width: 0.5 })
    }
  }
  return ticks
}

interface RulerStore {
  scale: number
  setScale: (newScale: number) => void
}

const useRulerStore = zustand.create<RulerStore>()(
  zustandMiddleware.persist(
    (set) => ({
      scale: 1,
      setScale: (newScale: number) => set({ scale: newScale }),
    }),
    { name: "app_ruler_store" }
  )
)

export default function RulerPage() {
  const { scale, setScale } = useRulerStore()

  const pxPerMm = DEFAULT_PX_PER_MM * scale

  const calWidthPx = A4_SHORT_MM * pxPerMm

  const cmTicks = useMemo(() => generateCmTicks(60), [])
  const inchTicks = useMemo(() => generateInchTicks(30), [])

  return (
    <section className="mx-auto max-md:px-2 md:px-4">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{rulerPageInfo.title}</h1>
        <p className="text-sm text-slate-500">{rulerPageInfo.description}</p>
      </header>

      <main className="space-y-6">
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold">Calibration</h2>
          <p className="text-sm text-slate-600">
            Hold an A4 paper's <strong>short edge (210mm)</strong> against your
            screen (Grab your tax report or corporate letter). Adjust the slider until the on-screen bar matches your
            physical paper exactly (Hint: You can use arrow keys (← →) to make fine adjustments, given that the slider widget is focused).
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Slider
                value={[scale]}
                onValueChange={([v]) => setScale(+v.toFixed(3))}
                min={0.5}
                max={3}
                step={0.001}
                className="flex-1"
              />
              <span className="text-sm font-mono w-16 text-right">
                {scale.toFixed(3)}&times;
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="h-12 bg-blue-500"
              style={{ width: calWidthPx }}
            />
            <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
              210&nbsp;mm
            </span>
          </div>
        </div>
      </main>

      <main className="space-y-8">
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-400">
            Scale: {scale.toFixed(3)}&times; ({Math.round(pxPerMm * 100) / 100} px/mm)
          </span>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Centimeters</h2>
          <Ruler ticks={cmTicks} pxPerMm={pxPerMm} tickColor="border-slate-700" labelColor="text-slate-700" />
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Inches</h2>
          <Ruler ticks={inchTicks} pxPerMm={pxPerMm} tickColor="border-slate-700" labelColor="text-slate-700" />
        </section>
      </main>
    </section>
  )
}

function Ruler({ ticks, pxPerMm, tickColor, labelColor }: {
  ticks: Tick[]
  pxPerMm: number
  tickColor: string
  labelColor: string
}) {
  const maxPos = ticks[ticks.length - 1]?.position ?? 0
  const rulerWidth = maxPos * pxPerMm

  return (
    <div className="overflow-x-clip border bg-white border-b-black">
      <div className="relative" style={{ width: rulerWidth + 40, height: 60 }}>
        {ticks.map((t, i) => (
          <div
            key={i}
            className={`absolute bottom-0 border-l ${tickColor}`}
            style={{
              left: t.position * pxPerMm,
              height: t.height,
              borderLeftWidth: t.width,
            }}
          >
            {t.label && (
              <span
                className={`absolute text-[10px] font-mono ${labelColor}`}
                style={{ top: -14, whiteSpace: "nowrap" }}
              >
                {t.label.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
