import type { Item, ItemMetrics, Quote } from "./types"

function calcMetrics(quotes: Quote[]): ItemMetrics {
  const valid = quotes.filter((q) => q.status === "VALIDO")
  const values = valid.map((q) => q.valorAtualizado)

  if (values.length === 0) {
    return { media: 0, mediana: 0, desvioPadrao: 0, cv: 0 }
  }

  const media = values.reduce((a, b) => a + b, 0) / values.length

  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const mediana =
    sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / values.length
  const desvioPadrao = Math.sqrt(variance)

  const cv = media !== 0 ? (desvioPadrao / media) * 100 : 0

  return { media, mediana, desvioPadrao, cv }
}

export function runSaneamento(item: Item): Item {
  const updatedCotacoes = [...item.cotacoes.map((q) => ({ ...q }))]

  let iterations = 0
  const maxIterations = 50

  while (iterations < maxIterations) {
    const validQuotes = updatedCotacoes.filter((q) => q.status === "VALIDO")
    if (validQuotes.length <= 2) break

    const values = validQuotes.map((q) => q.valorAtualizado)
    const media = values.reduce((a, b) => a + b, 0) / values.length
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / values.length
    const sd = Math.sqrt(variance)
    const cv = media !== 0 ? (sd / media) * 100 : 0

    if (cv <= 25) break

    const upperLimit = media + sd
    const lowerLimit = media - sd

    let worstQuote: Quote | null = null
    let worstDistance = 0

    for (const q of validQuotes) {
      let distance = 0
      if (q.valorAtualizado > upperLimit) {
        distance = q.valorAtualizado - upperLimit
      } else if (q.valorAtualizado < lowerLimit) {
        distance = lowerLimit - q.valorAtualizado
      }
      if (distance > worstDistance) {
        worstDistance = distance
        worstQuote = q
      }
    }

    if (!worstQuote || worstDistance === 0) break

    const idx = updatedCotacoes.findIndex((q) => q.id === worstQuote!.id)
    if (idx !== -1) {
      const isHigh = updatedCotacoes[idx].valorAtualizado > media
      updatedCotacoes[idx].status = isHigh
        ? "EXCLUIDO_OUTLIER_ALTO"
        : "EXCLUIDO_OUTLIER_BAIXO"
      updatedCotacoes[idx].motivoExclusao =
        "Valor discrepante removido para homogeneizacao (CV > 25%)"
    }

    iterations++
  }

  const metrics = calcMetrics(updatedCotacoes)

  return {
    ...item,
    cotacoes: updatedCotacoes,
    metrics,
  }
}

export function recalcMetrics(item: Item): Item {
  return {
    ...item,
    metrics: calcMetrics(item.cotacoes),
  }
}
