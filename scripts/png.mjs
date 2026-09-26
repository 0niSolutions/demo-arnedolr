/** Decodificador PNG minimo (8-bit, no entrelazado, colorType 2 o 6) para leer pixeles. */
import { inflateSync } from 'node:zlib'

export function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('no es PNG')

  let pos = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let colorType = 0
  let interlace = 0
  const idat = []

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      interlace = data[12]
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') {
      break
    }
    pos += 12 + len
  }

  if (bitDepth !== 8) throw new Error(`bitDepth ${bitDepth} no soportado`)
  if (interlace !== 0) throw new Error('PNG entrelazado no soportado')
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0
  if (!channels) throw new Error(`colorType ${colorType} no soportado`)

  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  const out = Buffer.alloc(height * stride)

  const paeth = (a, b, c) => {
    const p = a + b - c
    const pa = Math.abs(p - a)
    const pb = Math.abs(p - b)
    const pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }

  let src = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[src++]
    const row = y * stride
    const prev = row - stride
    for (let x = 0; x < stride; x++) {
      const rawByte = raw[src + x]
      const a = x >= channels ? out[row + x - channels] : 0
      const b = y > 0 ? out[prev + x] : 0
      const c = x >= channels && y > 0 ? out[prev + x - channels] : 0
      let v
      switch (filter) {
        case 0: v = rawByte; break
        case 1: v = rawByte + a; break
        case 2: v = rawByte + b; break
        case 3: v = rawByte + ((a + b) >> 1); break
        case 4: v = rawByte + paeth(a, b, c); break
        default: throw new Error(`filtro PNG ${filter} desconocido`)
      }
      out[row + x] = v & 0xff
    }
    src += stride
  }

  return { width, height, channels, data: out }
}

/**
 * Color de fondo dominante en una region, ignorando pixeles casi transparentes.
 * Usa un mapa de conteo: el glifo es minoria, asi que el color modal es el fondo real.
 */
export function modalColor(img, x0, y0, x1, y1) {
  const counts = new Map()
  const cx0 = Math.max(0, Math.round(x0))
  const cy0 = Math.max(0, Math.round(y0))
  const cx1 = Math.min(img.width, Math.round(x1))
  const cy1 = Math.min(img.height, Math.round(y1))

  for (let y = cy0; y < cy1; y++) {
    for (let x = cx0; x < cx1; x++) {
      const i = (y * img.width + x) * img.channels
      if (img.channels === 4 && img.data[i + 3] < 250) continue
      // Cuantiza a 5 bits por canal para agrupar casi-iguales (JPEG/antialias).
      const key = ((img.data[i] >> 3) << 10) | ((img.data[i + 1] >> 3) << 5) | (img.data[i + 2] >> 3)
      counts.set(key, (counts.get(key) || 0) + 1)
    }
  }

  if (counts.size === 0) return null
  let bestKey = 0
  let bestN = -1
  for (const [k, n] of counts) {
    if (n > bestN) { bestN = n; bestKey = k }
  }
  return [((bestKey >> 10) & 31) * 8 + 4, ((bestKey >> 5) & 31) * 8 + 4, (bestKey & 31) * 8 + 4]
}
