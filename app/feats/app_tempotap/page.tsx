import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { tempoTapPageInfo } from "./page_info"
import { createPreciseInterval, type PreciseInterval } from "./precise_interval"

export const meta = createMetaFromPageInfo(tempoTapPageInfo)

function playClick(audioCtx: AudioContext, accent: boolean) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = "square"
  osc.frequency.value = accent ? 1200 : 880
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(audioCtx.currentTime)
  osc.stop(audioCtx.currentTime + 0.08)
}

function computeBpm(times: number[], sampleCount: number): number {
  if (times.length < 2) return 0
  const recent = times.slice(-sampleCount)
  if (recent.length < 2) return 0
  let totalInterval = 0
  for (let i = 1; i < recent.length; i++) {
    totalInterval += recent[i] - recent[i - 1]
  }
  const avgInterval = totalInterval / (recent.length - 1)
  if (avgInterval <= 0) return 0
  return Math.round((60_000 / avgInterval) * 10) / 10
}

export default function TempoTapPage() {
  const [beatsPerBar, setBeatsPerBar] = useState(4)

  /* Number of user taps to consider for BPM calculation. */
  const [sampleCount, setSampleCount] = useState(16)

  /* Current estimated BPM */
  const [bpm, setBpm] = useState(0)

  const [metronomeOn, setMetronomeOn] = useState(true)
  const [muted, setMuted] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const userTapSamplesRef = useRef<number[]>([])
  const intervalRef = useRef<PreciseInterval | null>(null)
  const beatRef = useRef(0)
  const bpmRef = useRef(0)

  bpmRef.current = bpm

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const stopMetronome = useCallback(() => {
    if (intervalRef.current !== null) {
      intervalRef.current.destroy()
      intervalRef.current = null
    }
  }, [])

  const startMetronome = useCallback(() => {
    stopMetronome()
    if (bpmRef.current <= 0) return

    const intervalMs = 60_000 / bpmRef.current
    beatRef.current = 0
    setCurrentBeat(0)

    const tick = () => {
      const beat = beatRef.current % beatsPerBar
      setCurrentBeat(beat)
      if (!muted) {
        const ctx = getAudioCtx()
        playClick(ctx, beat === 0)
      }
      beatRef.current++
    }

    tick()
    intervalRef.current = createPreciseInterval(tick, { intervalMs })
  }, [stopMetronome, beatsPerBar, muted, getAudioCtx])

  useEffect(() => {
    if (metronomeOn) {
      startMetronome()
    } else {
      stopMetronome()
    }
    return stopMetronome
  }, [metronomeOn, startMetronome, stopMetronome])

  useEffect(() => {
    if (metronomeOn) {
      startMetronome()
    }
  }, [bpm, beatsPerBar])

  const handleTap = useCallback(() => {
    const now = performance.now()
    userTapSamplesRef.current.push(now)
    if (userTapSamplesRef.current.length > sampleCount * 2) {
      userTapSamplesRef.current = userTapSamplesRef.current.slice(-sampleCount * 2)
    }
    const newBpm = computeBpm(userTapSamplesRef.current, sampleCount)
    setBpm(newBpm)
  }, [sampleCount])

  const handleReset = useCallback(() => {
    userTapSamplesRef.current = []
    setBpm(0)
    setCurrentBeat(0)
    beatRef.current = 0
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault()
      handleTap()
    }
  }, [handleTap])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const beatDots = Array.from({ length: beatsPerBar }, (_, i) => i)

  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{tempoTapPageInfo.title}</h1>
        <p className="text-sm text-slate-500">{tempoTapPageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <section className="border py-2 px-5 space-y-6">
          <h2 className="text-lg font-semibold">Tap Tempo</h2>

          <div className="flex flex-col items-center gap-3">
            <p className="text-5xl font-mono font-bold tabular-nums">
              {bpm > 0 ? bpm.toFixed(1) : "---.-"}
            </p>
            <p className="text-sm text-muted-foreground">BPM</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {beatDots.map(i => (
              <div
                key={i}
                className={`size-4 rounded-full transition-colors ${currentBeat === i && bpm > 0
                  ? i === 0
                    ? "bg-amber-500 scale-125"
                    : "bg-stone-400 dark:bg-stone-500"
                  : "bg-stone-200 dark:bg-stone-700"
                  }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              className="px-10 text-lg"
              onClick={handleTap}
            >
              Tap
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Tip: you can also tap with <kbd className="px-1 py-0.5 rounded border text-xs">Space</kbd> or <kbd className="px-1 py-0.5 rounded border text-xs">Enter</kbd>
          </p>

          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Beats per bar</label>
                  <span className="text-sm tabular-nums text-muted-foreground">{beatsPerBar}</span>
                </div>
                <Slider
                  min={1}
                  max={16}
                  step={1}
                  value={[beatsPerBar]}
                  onValueChange={([v]) => setBeatsPerBar(v)}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Tap window</label>
                  <span className="text-sm tabular-nums text-muted-foreground">{sampleCount} taps</span>
                </div>
                <Slider
                  min={3}
                  max={32}
                  step={1}
                  value={[sampleCount]}
                  onValueChange={([v]) => setSampleCount(v)}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant={metronomeOn ? "default" : "outline"}
                size="sm"
                onClick={() => setMetronomeOn(o => !o)}
                disabled={bpm <= 0}
              >
                {metronomeOn ? "Stop" : "Start"} Metronome
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMuted(m => !m)}
                disabled={!metronomeOn}
              >
                {muted ? "Unmute" : "Mute"}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </section>
  )
}
