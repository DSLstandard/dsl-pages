import { useCallback, useEffect, useState } from "react"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { clientInfoPageInfo } from "./page_info"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const meta = createMetaFromPageInfo(clientInfoPageInfo)

/* ─── Types ─── */

interface ClientInfo {
  userAgent: string
  platform: string
  languages: string[]
  cookiesEnabled: boolean
  onLine: boolean
  screen: { width: number; height: number; availWidth: number; availHeight: number; colorDepth: number }
  viewport: { innerWidth: number; innerHeight: number; devicePixelRatio: number }
  prefersColorScheme: "light" | "dark" | "no-preference" | "unknown"
  touch: boolean
  hardwareConcurrency: number | "unknown"
  deviceMemory: number | "unknown"
  timezone: string
  localTime: string
  connection: Record<string, unknown> | "not supported"
  permissions: Record<string, unknown>
  battery: Record<string, unknown> | "not supported" | "unavailable"
  geolocation: Record<string, unknown> | "not supported" | "not requested"
}

/* ─── Data gathering ─── */

interface NavigatorWithBattery extends Navigator {
  getBattery(): Promise<{
    charging: boolean
    level: number
    chargingTime: number
    dischargingTime: number
  }>
}

interface NavigatorWithConnection extends Navigator {
  connection: {
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
  }
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
}

async function getBatteryInfo(): Promise<Record<string, unknown> | "not supported" | "unavailable"> {
  const nav = navigator as NavigatorWithBattery
  if (!nav.getBattery) return "not supported"
  try {
    const b = await nav.getBattery()
    return {
      charging: b.charging,
      level: Math.round(b.level * 100) + "%",
      chargingTime: Number.isFinite(b.chargingTime) ? b.chargingTime + "s" : "unknown",
      dischargingTime: Number.isFinite(b.dischargingTime) ? b.dischargingTime + "s" : "unknown",
    }
  } catch {
    return "unavailable"
  }
}

async function gatherInfo(): Promise<ClientInfo> {
  // Connection
  let connection: Record<string, unknown> | "not supported" = "not supported"
  const navConn = navigator as NavigatorWithConnection
  if (navConn.connection) {
    const c = navConn.connection
    connection = {
      effectiveType: c.effectiveType ?? "unknown",
      downlink: c.downlink ?? "unknown",
      rtt: c.rtt ?? "unknown",
      saveData: c.saveData ?? false,
    }
  }

  // Permissions
  const permissions: Record<string, unknown> = {}
  if (navigator.permissions?.query) {
    const names = ["geolocation", "camera", "microphone", "notifications", "persistent-storage"]
    for (const name of names) {
      try {
        const status = await (navigator.permissions.query as (desc: { name: string }) => Promise<{ state: string }>)({ name }).catch(() => null)
        permissions[name] = status ? status.state : "unknown"
      } catch {
        permissions[name] = "error"
      }
    }
  } else {
    permissions.note = "Permissions API not supported"
  }

  // Battery
  const battery = await getBatteryInfo()

  // Geolocation
  let geolocation: Record<string, unknown> | "not supported" | "not requested" = "not supported"
  if ("geolocation" in navigator) {
    geolocation = await new Promise<Record<string, unknown>>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy_m: pos.coords.accuracy,
          }),
        (err) => resolve({ error: err.message || String(err.code) }),
        { maximumAge: 60_000, timeout: 5000 },
      )
    })
  }

  // Color scheme
  let prefersColorScheme: ClientInfo["prefersColorScheme"] = "unknown"
  if (window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) prefersColorScheme = "dark"
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) prefersColorScheme = "light"
    else prefersColorScheme = "no-preference"
  }

  return {
    userAgent: navigator.userAgent || "n/a",
    platform: navigator.platform || "n/a",
    languages: navigator.languages && navigator.languages.length ? [...navigator.languages] : navigator.language ? [navigator.language] : [],
    cookiesEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
    },
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    },
    prefersColorScheme,
    touch: "ontouchstart" in window || (navigator.maxTouchPoints > 0),
    hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
    deviceMemory: (navigator as NavigatorWithMemory).deviceMemory ?? "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    localTime: new Date().toString(),
    connection,
    permissions,
    battery,
    geolocation,
  }
}

/* ─── Row component ─── */

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-stone-200 last:border-b-0">
      <td className="w-1/3 px-3 py-2.5 text-sm font-medium text-stone-600 align-top">{label}</td>
      <td className="px-3 py-2.5 text-sm text-stone-900 break-all">{children}</td>
    </tr>
  )
}

/* ─── Helpers for display ─── */

function formatObject(obj: Record<string, unknown>): string {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

function PrettyObject({ obj }: { obj: Record<string | number, unknown> }) {
  const entries = Object.entries(obj)
  if (entries.length === 0) return <span className="text-stone-400">—</span>
  return (
    <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
      {entries.map(([k, v]) => (
        <div key={k}>
          <span className="text-stone-500">{k}:</span>{" "}
          <span className="text-stone-800">{typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)}</span>
        </div>
      ))}
    </div>
  )
}

function ConnectionDisplay({ conn }: { conn: Record<string, unknown> | "not supported" }) {
  if (conn === "not supported") return <span className="text-stone-400">Not supported</span>
  const effectiveType = String(conn.effectiveType ?? "")
  const downlink = String(conn.downlink ?? "")
  const rtt = String(conn.rtt ?? "")
  const saveData = Boolean(conn.saveData)
  return (
    <div className="space-y-0.5">
      {effectiveType && (
        <div>
          <span className="text-stone-500">Type:</span> <Badge variant="outline">{effectiveType}</Badge>
        </div>
      )}
      <div className="text-stone-600 text-xs">
        {downlink} Mbps / {rtt}ms RTT
        {saveData && <span className="ml-2">(save-data)</span>}
      </div>
    </div>
  )
}

function BatteryDisplay({ bat }: { bat: Record<string, unknown> | "not supported" | "unavailable" }) {
  if (typeof bat === "string") return <span className="text-stone-400">{bat}</span>
  const charging = Boolean(bat.charging)
  const level = String(bat.level ?? "")
  return (
    <div className="text-xs">
      <Badge variant={charging ? "default" : "secondary"} className="mr-2">
        {charging ? "Charging" : "Not charging"}
      </Badge>
      <span className="text-stone-700">{level}</span>
    </div>
  )
}

function GeoDisplay({ geo }: { geo: Record<string, unknown> | "not supported" | "not requested" }) {
  if (typeof geo === "string") return <span className="text-stone-400">{geo}</span>
  if (geo.error) return <span className="text-red-600">Error: {String(geo.error)}</span>
  const lat = Number(geo.latitude)
  const lon = Number(geo.longitude)
  const acc = Number(geo.accuracy_m)
  return (
    <span>
      {lat.toFixed(4)}, {lon.toFixed(4)}{" "}
      <span className="text-stone-400">(±{acc.toFixed(0)}m)</span>
    </span>
  )
}

/* ─── Page component ─── */

export default function ClientInfoPage() {
  const [info, setInfo] = useState<ClientInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await gatherInfo()
      setInfo(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // live online/offline updates
  useEffect(() => {
    const goOnline = () => setInfo((prev) => (prev ? { ...prev, onLine: true } : prev))
    const goOffline = () => setInfo((prev) => (prev ? { ...prev, onLine: false } : prev))
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  const handleCopy = async () => {
    if (!info) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(info, null, 2))
    } catch {
      // fallback
      const t = document.createElement("textarea")
      t.value = JSON.stringify(info, null, 2)
      document.body.appendChild(t)
      t.select()
      document.execCommand("copy")
      t.remove()
    }
  }

  return (
    <section className="mx-auto container px-2 sm:px-4 py-4 max-w-4xl">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-stone-900">Client Info</h1>
        <p className="text-sm text-stone-500">
          Non-sensitive information your browser provides. No server requests are made.
        </p>
      </header>

      <div className="mb-4 flex items-center gap-2">
        <Button onClick={refresh} disabled={loading} variant="outline">
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
        <Button onClick={handleCopy} disabled={!info} variant="ghost">
          Copy JSON
        </Button>
        {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
      </div>

      <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-stone-500 w-1/3">
                Item
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-stone-500">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {!info ? (
              <tr>
                <td colSpan={2} className="px-3 py-8 text-center text-stone-400 text-sm">
                  {loading ? "Gathering information…" : "No data"}
                </td>
              </tr>
            ) : (
              <>
                <InfoRow label="User agent">
                  <code className="font-mono text-xs text-stone-700 break-all">{info.userAgent}</code>
                </InfoRow>

                <InfoRow label="Platform">
                  <span>{info.platform}</span>
                </InfoRow>

                <InfoRow label="Languages">
                  {info.languages.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {info.languages.map((l) => (
                        <Badge key={l} variant="outline" className="font-mono">
                          {l}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </InfoRow>

                <InfoRow label="Cookies enabled">
                  <Badge variant={info.cookiesEnabled ? "default" : "destructive"}>
                    {String(info.cookiesEnabled)}
                  </Badge>
                </InfoRow>

                <InfoRow label="Online">
                  <Badge variant={info.onLine ? "default" : "destructive"}>
                    {String(info.onLine)}
                  </Badge>
                </InfoRow>

                <InfoRow label="Screen size">
                  <span className="font-mono text-xs">
                    {info.screen.width}&times;{info.screen.height}{" "}
                    <span className="text-stone-400">
                      (avail {info.screen.availWidth}&times;{info.screen.availHeight}), {info.screen.colorDepth}-bit
                    </span>
                  </span>
                </InfoRow>

                <InfoRow label="Viewport">
                  <span className="font-mono text-xs">
                    {info.viewport.innerWidth}&times;{info.viewport.innerHeight}{" "}
                    <span className="text-stone-400">@{info.viewport.devicePixelRatio} DPR</span>
                  </span>
                </InfoRow>

                <InfoRow label="Color scheme">
                  <Badge variant="outline">{info.prefersColorScheme}</Badge>
                </InfoRow>

                <InfoRow label="Touch support">
                  <Badge variant={info.touch ? "default" : "secondary"}>
                    {info.touch ? "Yes" : "No"}
                  </Badge>
                </InfoRow>

                <InfoRow label="Hardware concurrency">
                  <span className="font-mono">{String(info.hardwareConcurrency)}</span>
                  {typeof info.hardwareConcurrency === "number" && (
                    <span className="text-stone-400 ml-1">CPUs</span>
                  )}
                </InfoRow>

                <InfoRow label="Device memory">
                  <span className="font-mono">{String(info.deviceMemory)}</span>
                  {typeof info.deviceMemory === "number" && <span className="text-stone-400 ml-1">GB</span>}
                </InfoRow>

                <InfoRow label="Battery">
                  <BatteryDisplay bat={info.battery} />
                </InfoRow>

                <InfoRow label="Connection">
                  <ConnectionDisplay conn={info.connection} />
                </InfoRow>

                <InfoRow label="Geolocation">
                  <GeoDisplay geo={info.geolocation} />
                </InfoRow>

                <InfoRow label="Permissions">
                  <PrettyObject obj={info.permissions} />
                </InfoRow>

                <InfoRow label="Timezone">
                  <span className="font-mono text-xs">{info.timezone}</span>
                </InfoRow>

                <InfoRow label="Local date/time">
                  <span className="font-mono text-xs">{info.localTime}</span>
                </InfoRow>
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
