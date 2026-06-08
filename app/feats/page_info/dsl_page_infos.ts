import type { PageInfo } from "./page_info";
import { asciiPageInfo } from "../app_ascii/page_info";
import { base64PageInfo } from "../app_base64/page_info";
import { braillePageInfo } from "../app_braille/page_info";
import { clientInfoPageInfo } from "../app_clientinfo/page_info";
import { editorPageInfo } from "../app_editor/page_info";
import { formatJsonPageInfo } from "../app_formatjson/page_info";
import { greekLetterPageInfo } from "../app_greekletter/page_info";
import { loremIpsumPageInfo } from "../app_lorem_ipsum/page_info";
import { morsePageInfo } from "../app_morse/page_info";
import { primePageInfo } from "../app_prime/page_info";
import { pwgenPageInfo } from "../app_pwgen/page_info";
import { qrCodePageInfo } from "../app_qrcode/page_info";
import { rulerPageInfo } from "../app_ruler/page_info";
import { tempoTapPageInfo } from "../app_tempotap/page_info";
import { unitConvPageInfo } from "../app_unitconv/page_info";

/*
 * IMPORTANT NOTE:
 *
 * This file is meant to be able to be imported by '@/routes.ts' by React
 * router.
 *
 * React router cannot resolve tsconfig paths. If the imports of this file has
 * ANY file dependencies with `import '@/components/ui/...'`, React router say
 * something like 'Error: Cannot find package '@/components/ui/button' imported
 * from '<YOUR_DIR>/app/feats/app_braille/components/braille_snippet.tsx'
 */

export const DSL_PAGE_INFOS: PageInfo[] = [
  asciiPageInfo,
  base64PageInfo,
  braillePageInfo,
  clientInfoPageInfo,
  editorPageInfo,
  formatJsonPageInfo,
  greekLetterPageInfo,
  loremIpsumPageInfo,
  morsePageInfo,
  primePageInfo,
  pwgenPageInfo,
  qrCodePageInfo,
  rulerPageInfo,
  tempoTapPageInfo,
  unitConvPageInfo,
]