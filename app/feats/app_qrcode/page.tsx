import { ExternalLinkIcon } from "lucide-react"
import { createMetaFromPageInfo } from "../page_info/meta_util"
import { qrCodePageInfo } from "./page_info"

export const meta = createMetaFromPageInfo(qrCodePageInfo)

export default function QrCodePage() {
  return (
    <section className="mx-auto container max-w-200 px-2">
      <header className="my-4">
        <h1 className="text-2xl font-semibold">{qrCodePageInfo.title}</h1>
        <p className="text-sm text-slate-500">{qrCodePageInfo.description}</p>
      </header>

      <main className="space-y-8">
        <section className="border py-8 px-5 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <a
              href="https://qr-code-styling.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-2xl font-semibold hover:text-muted-foreground transition-colors"
            >
              Use <span className="underline">qr-code-styling.com</span>!
              <ExternalLinkIcon className="size-5" />
            </a>

            <p className="text-sm">
              Created by <a href="https://github.com/kozakdenys" className="font-bold">Denys Kozak</a>. GitHub Repository: <a
                href="https://github.com/kozakdenys/qr-code-styling"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                kozakdenys/qr-code-styling
              </a>
            </p>
          </div>

          <p className="text-sm">
            It is already a powerful <em>open-source(!)</em> QR code generator with a lot of very useful styling options
            (like adding an image in the center, changing colors, shapes, etc.).
          </p>

          <p className="text-sm">
            Top Google search result for <code>"qr code generator"</code> often lists
            a lot of ad-ridden / sign-up required sites. This one is a great alternative
            if you want to quickly generate a nice QR code.
          </p>
        </section>
      </main>
    </section>
  )
}
