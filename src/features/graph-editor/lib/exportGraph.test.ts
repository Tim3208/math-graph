import { describe, expect, it } from 'vitest'
import {
  SVG_EXPORT_FILE_NAME,
  SVG_MIME_TYPE,
  createSvgBlob,
} from './exportGraph'

describe('createSvgBlob', () => {
  it('creates an SVG blob with the expected type and file name', async () => {
    const blob = createSvgBlob('<svg xmlns="http://www.w3.org/2000/svg" />')

    expect(SVG_EXPORT_FILE_NAME).toBe('math-graph.svg')
    expect(blob.type).toBe(SVG_MIME_TYPE)
    await expect(blob.text()).resolves.toContain('<svg')
  })
})
