export type DatasetFonte =
  | "PARAM_I_SISTEMAS_OFICIAIS"
  | "PARAM_II_CONTRATACOES_SIMILARES"

export type QuoteStatus =
  | "VALIDO"
  | "EXCLUIDO_TEMPO"
  | "EXCLUIDO_OUTLIER_ALTO"
  | "EXCLUIDO_OUTLIER_BAIXO"
  | "EXCLUIDO_MANUAL"

export interface Quote {
  id: string
  datasetFonte: DatasetFonte
  fornecedorNome: string
  fornecedorCNPJ: string
  dataCompra: string
  valorOriginal: number
  valorAtualizado: number
  status: QuoteStatus
  motivoExclusao: string
}

export interface ItemMetrics {
  media: number
  mediana: number
  desvioPadrao: number
  cv: number
}

export interface Item {
  numeroItem: number
  descricao: string
  quantidadeEstimada: number
  metrics: ItemMetrics
  cotacoes: Quote[]
}

export interface Project {
  id: string
  numeroProcesso: string
  uasg: string
  responsavel: string
  dataPesquisa: string
  items: Item[]
}
