import { createMetaFromPageInfo } from "../page_info/meta_util"
import { pwgenPageInfo } from "./page_info"
import { PasswordGenerator } from "./components/password_generator"
import { PassphraseGenerator } from "./components/passphrase_generator"

export const meta = createMetaFromPageInfo(pwgenPageInfo)


export default function PwgenPage() {
  return (
    <section className="mx-auto container max-w-200 px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{pwgenPageInfo.title}</h1>
        <p className="text-sm text-slate-500">{pwgenPageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <PasswordGenerator />
        <PassphraseGenerator />
      </main>
    </section>
  )
}
