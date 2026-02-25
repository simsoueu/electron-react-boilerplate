import Papa from 'papaparse';

interface Quote {
  id: string;
  datasetFonte: string;
  fornecedorNome: string;
  fornecedorCNPJ: string;
  dataCompra: string;
  valorOriginal: number;
  valorAtualizado: number;
  status: string;
  motivoExclusao: string;
}

interface ItemMetrics {
  media: number;
  mediana: number;
  desvioPadrao: number;
  cv: number;
}

interface Item {
  numeroItem: number;
  descricao: string;
  quantidadeEstimada: number;
  metrics: ItemMetrics;
  cotacoes: Quote[];
}

interface Project {
  items: Item[];
}

interface RawCSVRow {
  'Número do Item da Pesquisa': string;
  'Fonte da Pesquisa': string;
  'Número da Compra': string;
  'Data/Hora da Compra': string;
  'Data/Hora da Cotação': string;
  'Anulada/Revogada': string;
  'Número do Item da Compra': string;
  Modalidade: string;
  'Critério Julgamento Item': string;
  'Código do Item': string;
  'Descrição do Item': string;
  'Unidade de Fornecimento': string;
  'Quantidade Ofertada': string;
  'Preço Unitário': string;
  'Identificação do Fornecedor': string;
  'Nome do Fornecedor / Identificação da Fonte': string;
  Órgão: string;
  UASG: string;
  'Nome UASG': string;
  Referência: string;
}

function parseDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  const cleaned = priceStr
    .replace(/["']/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function parseCSVFile(fileContent: string): Project {
  if (!fileContent || fileContent.trim().length === 0) {
    console.log('Empty CSV content, returning empty project');
    return { items: [] };
  }

  const firstLine = fileContent.split('\n')[0];
  const semicolonCount = (firstLine.match(/;/g) || []).length;

  if (semicolonCount < 10) {
    console.log(
      'CSV does not appear to have correct format (less than 10 semicolons in header)',
    );
    return { items: [] };
  }

  const result = Papa.parse<RawCSVRow>(fileContent, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    console.error('CSV Parse Errors:', result.errors);
  }

  const rows = result.data;

  if (rows.length === 0) {
    return { items: [] };
  }

  const itemsMap = new Map<number, Item>();

  for (const row of rows) {
    const itemNumber = parseInt(row['Número do Item da Pesquisa'] || '1', 10);

    if (!itemsMap.has(itemNumber)) {
      itemsMap.set(itemNumber, {
        numeroItem: itemNumber,
        descricao: row['Descrição do Item'] || '',
        quantidadeEstimada: 0,
        metrics: {
          media: 0,
          mediana: 0,
          desvioPadrao: 0,
          cv: 0,
        },
        cotacoes: [],
      });
    }

    const item = itemsMap.get(itemNumber)!;

    const rawPrice = row['Preço Unitário'];
    const price = parsePrice(rawPrice);
    const rawQty = row['Quantidade Ofertada'] || '0';
    const qty = parseInt(rawQty.replace(/\./g, '').replace(',', '.'), 10) || 0;
    const dateField = row['Data/Hora da Compra'] || '';
    const dataCompra = dateField.split(' ')[0]
      ? parseDate(dateField.split(' ')[0])
      : '';
    const fornecedorCNPJ = row['Identificação do Fornecedor'] || '';
    const fornecedorNome =
      row['Nome do Fornecedor / Identificação da Fonte'] || '';

    const quote: Quote = {
      id: `${itemNumber}-${Math.random().toString(36).substr(2, 9)}`,
      datasetFonte: 'PARAM_I_SISTEMAS_OFICIAIS',
      fornecedorNome,
      fornecedorCNPJ,
      dataCompra,
      valorOriginal: price,
      valorAtualizado: price,
      status: 'VALIDO',
      motivoExclusao: '',
    };

    item.cotacoes.push(quote);
    item.quantidadeEstimada += qty;
  }

  const items = Array.from(itemsMap.values());

  for (const item of items) {
    const validQuotes = item.cotacoes.filter(
      (q: Quote) => q.status === 'VALIDO',
    );
    if (validQuotes.length > 0) {
      const prices = validQuotes
        .map((q: Quote) => q.valorAtualizado)
        .sort((a: number, b: number) => a - b);
      const sum = prices.reduce((a: number, b: number) => a + b, 0);
      item.metrics.media = sum / prices.length;

      const mid = Math.floor(prices.length / 2);
      item.metrics.mediana =
        prices.length % 2 !== 0
          ? prices[mid]
          : (prices[mid - 1] + prices[mid]) / 2;

      if (prices.length > 1) {
        const squaredDiffs = prices.map((p: number) =>
          Math.pow(p - item.metrics.media, 2),
        );
        const avgSquaredDiff =
          squaredDiffs.reduce((a: number, b: number) => a + b, 0) /
          prices.length;
        item.metrics.desvioPadrao = Math.sqrt(avgSquaredDiff);
        item.metrics.cv =
          (item.metrics.desvioPadrao / item.metrics.media) * 100;
      }
    }
  }

  return {
    items,
  };
}
