import { CANVAS_HEIGHT, CANVAS_WIDTH } from './graphMath'

export const SVG_EXPORT_FILE_NAME = 'math-graph.svg'
export const PNG_EXPORT_FILE_NAME = 'math-graph.png'
export const SVG_MIME_TYPE = 'image/svg+xml;charset=utf-8'

export function serializeSvgElement(svgElement: SVGSVGElement) {
  const clone = svgElement.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(CANVAS_WIDTH))
  clone.setAttribute('height', String(CANVAS_HEIGHT))

  return new XMLSerializer().serializeToString(clone)
}

export function createSvgBlob(svgString: string) {
  return new Blob([svgString], { type: SVG_MIME_TYPE })
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadSvg(svgString: string) {
  downloadBlob(createSvgBlob(svgString), SVG_EXPORT_FILE_NAME)
}

export async function downloadPng(svgString: string) {
  const svgUrl = URL.createObjectURL(createSvgBlob(svgString))

  try {
    const image = await loadImage(svgUrl)
    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('PNG 이미지를 만들 수 없습니다.')
    }

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const blob = await canvasToBlob(canvas)
    downloadBlob(blob, PNG_EXPORT_FILE_NAME)
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('SVG 이미지를 불러올 수 없습니다.'))
    image.src = src
  })
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('PNG 이미지를 만들 수 없습니다.'))
        return
      }

      resolve(blob)
    }, 'image/png')
  })
}
