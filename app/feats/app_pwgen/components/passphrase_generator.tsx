import { useState, useMemo } from "react";
import { WORDS } from "../utils/passphrase_word_pool";
import { PasswordField } from "./password_field";
import { Slider } from "@/components/ui/slider";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { generatePassphrase, type CaseOption } from "../utils/passphrase_gen";



export function PassphraseGenerator() {
  const [wordCount, setWordCount] = useState(6)
  const [separator, setSeparator] = useState(" ")
  const [casing, setCasing] = useState<CaseOption>("lower")

  const passphrase = useMemo(
    () => {
      return generatePassphrase({ wordPool: WORDS, wordCount, separator, casing })
    },
    [wordCount, separator, casing]
  )

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-5">
      <h2 className="text-lg font-semibold">Passphrase Generator</h2>
      <p className="text-sm text-stone-500">
        <b>NOTE: </b>The word list is pulled from <a href="https://github.com/keepassxreboot/keepassxc/blob/develop/share/wordlists/eff_large.wordlist">https://github.com/keepassxreboot/keepassxc/blob/develop/share/wordlists/eff_large.wordlist</a>
      </p>

      <PasswordField plaintext={passphrase} />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Word count</label>
          <span className="text-sm tabular-nums text-muted-foreground">{wordCount}</span>
        </div>
        <Slider
          min={1}
          max={40}
          step={1}
          value={[wordCount]}
          onValueChange={([v]) => setWordCount(v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Word separator</label>
          <Input
            value={separator}
            onChange={e => setSeparator(e.target.value)}
            placeholder="e.g., ' ' or '-' or '_'"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Case</label>
          <NativeSelect
            value={casing}
            onChange={e => setCasing(e.target.value as CaseOption)}
          >
            <NativeSelectOption value="lower">lower case</NativeSelectOption>
            <NativeSelectOption value="upper">UPPER CASE</NativeSelectOption>
            <NativeSelectOption value="title">Title Case</NativeSelectOption>
            <NativeSelectOption value="mixed">MiXeD cAsE</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
    </section>
  )
}