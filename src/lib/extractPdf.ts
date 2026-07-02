import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'

// Dynamically matches CDN worker to whatever version is installed
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise

  const textPages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? (item as TextItem).str : ''))
      .join(' ')
    textPages.push(pageText)
  }

  return textPages.join('\n').replace(/\s+/g, ' ').trim()
}
