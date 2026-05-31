import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useCallback, useMemo, useState, type JSX } from "react"
import { PasswordField } from "./password_field"
import { Option } from "effect"
import { CharSet } from "../utils/char_set"
import { generateByDistinctGroups } from "../utils/pw_gen"
import { Button } from "@/components/ui/button"
import clsx from "clsx"

export type CharGroupID = string

export interface CharGroup {
  id: CharGroupID
  label: JSX.Element
  chars: string
}

export const CHAR_GROUPS: CharGroup[] = [
  { id: "upper", label: <span>A-Z</span>, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { id: "lower", label: <span>a-z</span>, chars: "abcdefghijklmnopqrstuvwxyz" },
  { id: "digits", label: <span>0-9</span>, chars: "0123456789" },
  { id: "special1", label: <code># $ % & @ ^ ` ~</code>, chars: "#$%&@^`~" },
  { id: "special2", label: <code>. , : ;</code>, chars: ".,:;" },
  { id: "special3", label: <code>{`"'`}</code>, chars: `"'` },
  { id: "special4", label: <code>{`\\ / | _ -`}</code>, chars: "\\/|_-" },
  { id: "special5", label: <code>{`< > * + ! ? =`}</code>, chars: "<>*+!?=" },
  { id: "brackets", label: <code>{`{ [ ( ) ] }`}</code>, chars: "{[()]}" },
]

export const LOOKALIKE_CHARS = new Set(["O", "0", "l", "I", "i", "1"])

export function isLookalike(ch: string): boolean {
  return LOOKALIKE_CHARS.has(ch)
}

interface GenerateOptions {
  length: number
  enabledGroupIDs: Set<CharGroupID>
  alsoChoose: string
  doNotInclude: string
  excludeLookalike: boolean
  pickFromEveryGroup: boolean
}

/**
 * Returns 'Option.none()' if generation is impossible due to constraints (e.g.
 * excluding too many chars).
 */
function generatePassword(
  opts: GenerateOptions
): Option.Option<string> {
  let groups: CharSet[] = []

  // Consider 'also choose' as a group to ensure at least one char is
  // picked from it if 'pickFromEveryGroup' is set.
  if (opts.alsoChoose.length > 0) {
    groups.push(CharSet.fromString(opts.alsoChoose))
  }

  // Register other groups
  for (const group of CHAR_GROUPS) {
    if (opts.enabledGroupIDs.has(group.id)) {
      groups.push(CharSet.fromString(group.chars))
    }
  }

  // Gather excluded characters
  const excludedChars = CharSet.createEmpty()
  excludedChars.addString(opts.doNotInclude)
  if (opts.excludeLookalike) {
    for (const ch of LOOKALIKE_CHARS) {
      excludedChars.addChar(ch)
    }
  }

  /* Prune out duplicate/excluded characters and delete redundant groups */
  const seenChars = CharSet.createEmpty()
  seenChars.addSet(excludedChars)

  for (const group of groups) {
    group.filterInplace((ch) => !seenChars.hasChar(ch))
    seenChars.addSet(group)
  }

  groups = groups.filter((group) => !group.isEmpty())

  /* Finally generate */
  if (groups.length === 0) {
    return Option.none() // No valid characters to choose from
  }

  const palettes: string[] = []
  if (opts.pickFromEveryGroup) {
    for (const group of groups) {
      palettes.push(group.getString())
    }
  } else {
    // Just combine all groups into one big palette
    const palette: string = groups.map(g => g.getString()).join("")
    palettes.push(palette)
  }

  const pwd = generateByDistinctGroups(opts.length, palettes)
  return Option.some(pwd)
}

export function PasswordGenerator() {
  const [length, setLength] = useState(20)

  // NOTE: KeepassXC also has these enabled by default
  const [enabledGroupIDs, setEnabledGroupIDs] = useState<Set<string>>(new Set(["upper", "lower", "digits", "special5"]))

  const [alsoChoose, setAlsoChoose] = useState("")
  const [doNotInclude, setDoNotInclude] = useState("")

  // NOTE: KeepassXC also has these default to true.
  const [excludeLookalike, setExcludeLookalike] = useState(true)
  const [pickFromEveryGroup, setPickFromEveryGroup] = useState(true)

  const password = useMemo(
    () => {
      const pwd = generatePassword({ length, enabledGroupIDs, alsoChoose, doNotInclude, excludeLookalike, pickFromEveryGroup })
      return Option.getOrElse(pwd, () => "")
    },
    [length, enabledGroupIDs, alsoChoose, doNotInclude, excludeLookalike, pickFromEveryGroup]
  )

  const isGroupEnabled = useCallback((id: string) => {
    return enabledGroupIDs.has(id)
  }, [enabledGroupIDs])

  const toggleGroup = useCallback((id: string) => {
    setEnabledGroupIDs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <section className="border py-2 px-5 space-y-4">
      <h2 className="text-lg font-semibold">Password Generator</h2>

      <PasswordField plaintext={password} />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Password length</label>
          <span className="text-sm tabular-nums text-muted-foreground">{length}</span>
        </div>
        <Slider
          min={1}
          max={128}
          step={1}
          value={[length]}
          onValueChange={([v]) => setLength(v)}
        />
      </div>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium mb-2">Character groups</legend>
        <div className="flex flex-wrap gap-2">
          {CHAR_GROUPS.map(g => (
            <ToggleButton
              key={g.id}
              checked={isGroupEnabled(g.id)}
              onCheckedChange={() => toggleGroup(g.id)}
            >
              <span className="text-sm">{g.label}</span>
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Also choose from:</label>
          <Input
            value={alsoChoose}
            onChange={e => setAlsoChoose(e.target.value)}
            placeholder="e.g. αβζ"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Do not include:</label>
          <Input
            value={doNotInclude}
            onChange={e => setDoNotInclude(e.target.value)}
            placeholder="e.g. abc"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={excludeLookalike}
            onCheckedChange={v => setExcludeLookalike(v === true)}
          />
          <span className="text-sm">Exclude look-alike characters <code>"O 0 l I i 1"</code></span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={pickFromEveryGroup}
            onCheckedChange={v => setPickFromEveryGroup(v === true)}
          />
          <span className="text-sm">Pick characters from every group</span>
        </label>
      </div>
    </section>
  )
}

export interface ToggleButtonProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children?: React.ReactNode
}

function ToggleButton(props: ToggleButtonProps) {
  return (
    <Button className={clsx("px-4", props.checked && "bg-green-200 border-green-400 hover:bg-green-200")} variant="outline" size="lg" onClick={() => props.onCheckedChange(!props.checked)}>
      {props.children}
    </Button>
  )
}