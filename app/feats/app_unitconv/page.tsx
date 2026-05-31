import { useCallback, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { unitConvPageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(unitConvPageInfo)

interface UnitDef {
  id: string
  label: string
  description: string
  toBase: (v: number) => number
  fromBase: (v: number) => number
}

interface UnitGroup {
  id: string
  title: string
  units: UnitDef[]
}

function lin(factor: number): Pick<UnitDef, "toBase" | "fromBase"> {
  return {
    toBase: (v: number) => v * factor,
    fromBase: (v: number) => v / factor,
  }
}

const DATA_UNITS: UnitGroup = {
  id: "data",
  title: "Data Storage",
  units: [
    { id: "bit", label: "bit", description: "Bit — fundamental unit of digital data (binary digit)", ...lin(1) },
    { id: "B", label: "B", description: "Byte — 8 bits", ...lin(8) },
    { id: "KiB", label: "KiB", description: "1 KiB = 1024 B (kibibyte, IEC binary)", ...lin(1024 * 8) },
    { id: "MiB", label: "MiB", description: "1 MiB = 1024 KiB = 1,048,576 B (mebibyte)", ...lin(1024 ** 2 * 8) },
    { id: "GiB", label: "GiB", description: "1 GiB = 1024 MiB (gibibyte)", ...lin(1024 ** 3 * 8) },
    { id: "TiB", label: "TiB", description: "1 TiB = 1024 GiB (tebibyte)", ...lin(1024 ** 4 * 8) },
    { id: "PiB", label: "PiB", description: "1 PiB = 1024 TiB (pebibyte)", ...lin(1024 ** 5 * 8) },
    { id: "EiB", label: "EiB", description: "1 EiB = 1024 PiB (exbibyte)", ...lin(1024 ** 6 * 8) },
    { id: "KB", label: "KB", description: "1 KB = 1000 B (kilobyte, SI decimal)", ...lin(1000 * 8) },
    { id: "MB", label: "MB", description: "1 MB = 1000 KB = 1,000,000 B (megabyte)", ...lin(1000 ** 2 * 8) },
    { id: "GB", label: "GB", description: "1 GB = 1000 MB (gigabyte)", ...lin(1000 ** 3 * 8) },
    { id: "TB", label: "TB", description: "1 TB = 1000 GB (terabyte)", ...lin(1000 ** 4 * 8) },
    { id: "PB", label: "PB", description: "1 PB = 1000 TB (petabyte)", ...lin(1000 ** 5 * 8) },
    { id: "EB", label: "EB", description: "1 EB = 1000 PB (exabyte)", ...lin(1000 ** 6 * 8) },
    {
      id: "states", label: "states", description: "Number of distinct states — n bits = 2ⁿ states. 1 B = 256 states",
      toBase: (v: number) => Math.log2(Math.max(v, 1)),
      fromBase: (v: number) => 2 ** v,
    },
  ],
}

const LENGTH_UNITS: UnitGroup = {
  id: "length",
  title: "Length",
  units: [
    { id: "nm", label: "nm", description: "1 nm = 1×10⁻⁹ m (nanometer)", ...lin(1e-9) },
    { id: "hair", label: "hair", description: "Average width of a human hair ≈ 70 µm = 7×10⁻⁵ m (range: 17–181 µm)", ...lin(7e-5) },
    { id: "um", label: "µm", description: "1 µm = 1×10⁻⁶ m (micrometer)", ...lin(1e-6) },
    { id: "mm", label: "mm", description: "1 mm = 0.001 m (millimeter)", ...lin(1e-3) },
    { id: "cm", label: "cm", description: "100 cm = 1 m (centimeter)", ...lin(1e-2) },
    { id: "m", label: "m", description: "Meter — SI base unit of length", ...lin(1) },
    { id: "km", label: "km", description: "1 km = 1000 m (kilometer)", ...lin(1000) },
    { id: "inch", label: "in", description: "1 inch = 2.54 cm = 0.0254 m", ...lin(0.0254) },
    { id: "ft", label: "ft", description: "1 ft = 12 inches = 0.3048 m (foot)", ...lin(0.3048) },
    { id: "yard", label: "yd", description: "1 yard = 3 ft = 0.9144 m", ...lin(0.9144) },
    { id: "mile", label: "mi", description: "1 mile = 5280 ft ≈ 1609.344 m", ...lin(1609.344) },
    { id: "nmi", label: "nmi", description: "1 nautical mile = 1852 m (1′ of latitude arc)", ...lin(1852) },
    { id: "AU", label: "AU", description: "1 AU = 149,597,870,700 m — mean Earth–Sun distance", ...lin(149597870700) },
    { id: "ls", label: "ls", description: "1 light-second = 299,792,458 m (distance light travels in 1 s)", ...lin(299792458) },
    { id: "lmin", label: "lmin", description: "1 light-minute = 60 light-seconds ≈ 1.79875×10¹⁰ m", ...lin(299792458 * 60) },
    { id: "lhour", label: "lhour", description: "1 light-hour = 60 light-minutes ≈ 1.07925×10¹² m", ...lin(299792458 * 3600) },
    { id: "ly", label: "ly", description: "1 light-year ≈ 9.46073×10¹⁵ m (distance light travels in 1 Julian year)", ...lin(299792458 * 86400 * 365.25) },
    { id: "Mpc", label: "Mpc", description: "1 megaparsec = 1 million pc ≈ 3.08568×10²² m. 1 pc ≈ 3.26 ly — used for intergalactic distances", ...lin(3.085677581491367e22) },
  ],
}

const C2 = 299792458 ** 2

const MASS_UNITS: UnitGroup = {
  id: "mass",
  title: "Mass / Energy",
  units: [
    { id: "mg", label: "mg", description: "1 mg = 0.001 g = 1×10⁻⁶ kg (milligram)", ...lin(1e-6) },
    { id: "g", label: "g", description: "1000 g = 1 kg (gram)", ...lin(1e-3) },
    { id: "kg", label: "kg", description: "Kilogram — SI base unit of mass", ...lin(1) },
    { id: "tonne", label: "t", description: "1 metric ton = 1000 kg (tonne)", ...lin(1000) },
    { id: "oz", label: "oz", description: "1 oz ≈ 28.3495 g (avoirdupois ounce)", ...lin(0.028349523125) },
    { id: "lb", label: "lb", description: "1 lb = 16 oz ≈ 0.453592 kg (avoirdupois pound)", ...lin(0.45359237) },
    { id: "st", label: "st", description: "1 stone = 14 lb ≈ 6.35029 kg", ...lin(6.35029318) },
    { id: "J", label: "J", description: "Energy (E = mc²). 1 J ≈ 1.1127×10⁻¹⁷ kg. 1 kg ≈ 8.98755×10¹⁶ J", ...lin(1 / C2) },
    { id: "kJ", label: "kJ", description: "1 kJ = 1000 J. 1 kg ≈ 8.98755×10¹³ kJ", ...lin(1000 / C2) },
    { id: "Cal", label: "Cal", description: "1 food Calorie = 4184 J — energy to heat 1 kg water by 1 °C. 1 kg ≈ 2.148×10¹⁰ Cal", ...lin(4184 / C2) },
    { id: "tTNT", label: "tTNT", description: "1 ton of TNT ≈ 4.184×10⁹ J. 1 kg ≈ 2.148×10⁷ t TNT", ...lin(4.184e9 / C2) },
    { id: "hiroshima", label: "Hiroshima", description: "1 Hiroshima bomb ≈ 63 TJ (6.3×10¹³ J). 1 kg ≈ 0.701 gram of mass-energy", ...lin(63e12 / C2) },
  ],
}

const VOLUME_UNITS: UnitGroup = {
  id: "volume",
  title: "Volume",
  units: [
    { id: "mL", label: "mL", description: "1000 mL = 1 L (milliliter)", ...lin(1e-3) },
    { id: "tsp", label: "tsp", description: "1 US teaspoon ≈ 4.928922 mL", ...lin(0.004928922) },
    { id: "L", label: "L", description: "Liter — metric unit of volume. 1 L = 1 dm³ = 1000 cm³. 1 L of water ≈ 1 kg on Earth", ...lin(1) },
    { id: "m3", label: "m³", description: "1 m³ = 1000 L (cubic meter, SI)", ...lin(1000) },
    { id: "floz", label: "fl oz", description: "1 US fl oz ≈ 29.5735 mL", ...lin(0.0295735295625) },
    { id: "cup", label: "cup", description: "1 US cup = 8 fl oz ≈ 236.588 mL", ...lin(0.2365882365) },
    { id: "pt", label: "pt", description: "1 US pint = 2 cups ≈ 0.473176 L", ...lin(0.473176473) },
    { id: "qt", label: "qt", description: "1 US quart = 2 pints ≈ 0.946353 L", ...lin(0.946352946) },
    { id: "gal", label: "gal", description: "1 US gallon = 4 quarts ≈ 3.78541 L", ...lin(3.785411784) },
  ],
}

const AREA_UNITS: UnitGroup = {
  id: "area",
  title: "Area",
  units: [
    { id: "mm2", label: "mm²", description: "1 mm² = 1×10⁻⁶ m² (square millimeter)", ...lin(1e-6) },
    { id: "cm2", label: "cm²", description: "1 cm² = 0.0001 m² (square centimeter)", ...lin(1e-4) },
    { id: "m2", label: "m²", description: "Square meter — SI derived unit of area", ...lin(1) },
    { id: "ha", label: "ha", description: "1 hectare = 10,000 m²", ...lin(1e4) },
    { id: "km2", label: "km²", description: "1 km² = 1,000,000 m² (square kilometer)", ...lin(1e6) },
    { id: "in2", label: "in²", description: "1 sq inch ≈ 0.00064516 m²", ...lin(0.00064516) },
    { id: "ft2", label: "ft²", description: "1 sq ft ≈ 0.092903 m²", ...lin(0.09290304) },
    { id: "acre", label: "acre", description: "1 acre = 43,560 ft² ≈ 4046.86 m²", ...lin(4046.8564224) },
    { id: "mi2", label: "mi²", description: "1 sq mile ≈ 2.58999 km²", ...lin(2589988.110336) },
    { id: "pctEarth", label: "% Earth", description: "1% of Earth's surface area ≈ 5.1007×10¹² m² (Earth total ≈ 510.1 million km²)", ...lin(5.10072e12) },
  ],
}

const TEMPERATURE_UNITS: UnitGroup = {
  id: "temperature",
  title: "Temperature",
  units: [
    {
      id: "C", label: "°C", description: "Celsius — water freezes at 0°C, boils at 100°C",
      toBase: (v: number) => v + 273.15,
      fromBase: (v: number) => v - 273.15,
    },
    {
      id: "F", label: "°F", description: "Fahrenheit — water freezes at 32°F, boils at 212°F",
      toBase: (v: number) => (v - 32) * 5 / 9 + 273.15,
      fromBase: (v: number) => (v - 273.15) * 9 / 5 + 32,
    },
    {
      id: "K", label: "K", description: "Kelvin — SI base unit, 0 K = absolute zero ≈ −273.15°C",
      toBase: (v: number) => v,
      fromBase: (v: number) => v,
    },
  ],
}

const TIME_UNITS: UnitGroup = {
  id: "time",
  title: "Time",
  units: [
    { id: "s", label: "s", description: "Second — SI base unit of time", ...lin(1) },
    { id: "min", label: "min", description: "1 minute = 60 s", ...lin(60) },
    { id: "hour", label: "h", description: "1 hour = 60 min = 3600 s", ...lin(3600) },
    { id: "day", label: "d", description: "1 mean solar day = 24 h = 86,400 s", ...lin(86400) },
    { id: "week", label: "wk", description: "1 week = 7 d = 604,800 s", ...lin(604800) },
    { id: "month", label: "mo", description: "1 mean Gregorian month = ¹⁄₁₂ year ≈ 30.437 d = 2,629,746 s", ...lin(2629746) },
    { id: "year", label: "yr", description: "1 Julian year = 365.25 d = 31,557,600 s (astronomy standard)", ...lin(31557600) },
    { id: "decade", label: "decade", description: "1 decade = 10 Julian years", ...lin(315576000) },
    { id: "century", label: "century", description: "1 century = 100 Julian years", ...lin(3155760000) },
    { id: "millennium", label: "millennium", description: "1 millennium = 1000 Julian years", ...lin(31557600000) },
    { id: "mars", label: "Mars yr", description: "1 Mars year ≈ 686.971 Earth days — orbital period of Mars around the Sun", ...lin(686.971 * 86400) },
    { id: "jupiter", label: "Jupiter yr", description: "1 Jupiter year ≈ 4,332.59 Earth days — orbital period of Jupiter around the Sun", ...lin(4332.59 * 86400) },
    { id: "saturn", label: "Saturn yr", description: "1 Saturn year ≈ 10,759.22 Earth days — orbital period of Saturn around the Sun", ...lin(10759.22 * 86400) },
    { id: "uranus", label: "Uranus yr", description: "1 Uranus year ≈ 30,687.15 Earth days — orbital period of Uranus around the Sun", ...lin(30687.15 * 86400) },
    { id: "neptune", label: "Neptune yr", description: "1 Neptune year ≈ 60,190.03 Earth days — orbital period of Neptune around the Sun", ...lin(60190.03 * 86400) },
    { id: "galactic", label: "galactic yr", description: "1 galactic year ≈ 225 million Earth years — Solar System orbit around Milky Way centre", ...lin(225e6 * 31557600) },
    { id: "planck", label: "t_P", description: "Planck time ≈ 5.391×10⁻⁴⁴ s — smallest meaningful time interval in physics", ...lin(5.391247e-44) },
    { id: "ns", label: "ns", description: "1 ns = 10⁻⁹ s (nanosecond) — time for light to travel ~30 cm", ...lin(1e-9) },
    { id: "μs", label: "µs", description: "1 µs = 10⁻⁶ s (microsecond)", ...lin(1e-6) },
    { id: "ms", label: "ms", description: "1 ms = 0.001 s (millisecond)", ...lin(1e-3) },
  ],
}

const ALL_GROUPS: UnitGroup[] = [
  DATA_UNITS,
  LENGTH_UNITS,
  MASS_UNITS,
  TIME_UNITS,
  VOLUME_UNITS,
  AREA_UNITS,
  TEMPERATURE_UNITS,
]

function formatNumber(n: number): string {
  if (!isFinite(n)) return ""
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString()
  const s = n.toPrecision(10)
  return s.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")
}

export default function UnitConvPage() {
  return (
    <section className="mx-auto container px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{unitConvPageInfo.title}</h1>
        <p className="text-sm text-slate-500">{unitConvPageInfo.description}</p>
        <p className="text-sm text-slate-500 mt-1">
          <b>HINT: </b> Press Ctrl-F (or Cmd-F on Mac) to search for specific units. This page has a lot of units.
        </p>
      </header>

      <main className="space-y-8">
        {ALL_GROUPS.map(group => (
          <UnitGroupSection key={group.id} group={group} />
        ))}
      </main>
    </section>
  )
}

function UnitGroupSection({ group }: { group: UnitGroup }) {
  const [sourceUnit, setSourceUnit] = useState(group.units[0].id)
  const [sourceValue, setSourceValue] = useState("1000") // Only as an example to make the UI not blank.

  const unitMap = useMemo(
    () => new Map(group.units.map(u => [u.id, u])),
    [group.units]
  )

  const computed = useMemo(() => {
    const numeric = parseFloat(sourceValue)
    if (Number.isNaN(numeric) || sourceValue.trim() === "")
      return null

    const srcUnit = unitMap.get(sourceUnit)
    if (!srcUnit)
      return null

    const base = srcUnit.toBase(numeric)
    const result = new Map<string, number>()
    for (const u of group.units) {
      result.set(u.id, u.fromBase(base))
    }
    return result
  }, [sourceValue, sourceUnit, group.units, unitMap])

  const onFieldChange = useCallback((unitId: string, raw: string) => {
    setSourceUnit(unitId)
    setSourceValue(raw)
  }, [])

  return (
    <section className="border py-2 px-5 space-y-3">
      <h2 className="text-lg font-semibold">{group.title}</h2>

      <div
        className="grid gap-x-3 gap-y-2"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(200px, 100%), 1fr))` }}
      >
        {group.units.map(u => (
          <div key={u.id} className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <label className="text-xs font-semibold">{u.label}</label>
              <span className="text-[10px] text-muted-foreground truncate" title={u.description}>
                {u.description}
              </span>
            </div>
            <Input
              className="font-mono text-sm h-8"
              value={u.id === sourceUnit ? sourceValue : (computed ? formatNumber(computed.get(u.id)!) : "")}
              onChange={e => onFieldChange(u.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
