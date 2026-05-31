import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import { CopyIcon, EyeClosedIcon, EyeIcon } from "lucide-react"
import { CopyButton } from "@/feats/ui_components/copy_button"
import { Input } from "@/components/ui/input"

export interface PasswordFieldProps {
  defaultIsCensored?: boolean

  /**
   * The password plaintext
   */
  plaintext: string
}

export function PasswordField({ defaultIsCensored = false, plaintext }: PasswordFieldProps) {
  const [censored, setCensored] = useState(defaultIsCensored)
  const toggleCensor = () => setCensored(c => !c)

  return (
    <div className="flex items-center gap-1">
      <CopyButton copyContent={plaintext} />
      <Button size="icon" onClick={toggleCensor}>
        {censored ? <EyeIcon /> : <EyeClosedIcon />}
      </Button>
      <Input
        readOnly
        className="font-mono"
        type={censored ? "password" : "text"} value={plaintext} placeholder="[No password]"
      />
    </div>
  )
}