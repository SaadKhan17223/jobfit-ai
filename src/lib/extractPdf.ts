export async function extractTextFromPdf(file: File): Promise<string> {
  // Access at call time, not module init time
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs = (window as any).pdfjsLib

  if (!pdfjs) {
    throw new Error('PDF.js failed to load. Please refresh the page and try again.')
  }

  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  const textPages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
    textPages.push(pageText)
  }

  return textPages.join('\n').replace(/\s+/g, ' ').trim()
}
