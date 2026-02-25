'use client';

import { useState } from 'react';
import type { Item, Quote, QuoteStatus } from '../../types/chad';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { OverrideModal } from './override-modal';
import { Ban, RotateCcw } from 'lucide-react';

interface QuotesTableProps {
  item: Item;
  onOverrideStatus: (
    quoteId: string,
    newStatus: QuoteStatus,
    justification: string,
  ) => void;
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function getStatusBadge(status: QuoteStatus) {
  const map: Record<QuoteStatus, { label: string; variant: string }> = {
    VALIDO: { label: 'Valido', variant: 'success' },
    EXCLUIDO_TEMPO: { label: 'Excl. Tempo', variant: 'destructive' },
    EXCLUIDO_OUTLIER_ALTO: { label: 'Outlier Alto', variant: 'destructive' },
    EXCLUIDO_OUTLIER_BAIXO: { label: 'Outlier Baixo', variant: 'destructive' },
    EXCLUIDO_MANUAL: { label: 'Excl. Manual', variant: 'warning' },
  };

  const { label, variant } = map[status];

  return (
    <Badge
      variant={variant === 'success' ? 'default' : 'destructive'}
      className={cn(
        'text-[10px] font-semibold',
        variant === 'success' &&
          'bg-success/15 text-success hover:bg-success/20',
        variant === 'warning' &&
          'bg-warning/15 text-warning hover:bg-warning/20',
      )}
    >
      {label}
    </Badge>
  );
}

function getFonteBadge(fonte: string) {
  const isI = fonte === 'PARAM_I_SISTEMAS_OFICIAIS';
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[10px] font-mono',
        isI
          ? 'border-chart-1/30 text-chart-1'
          : 'border-chart-2/30 text-chart-2',
      )}
    >
      {isI ? 'Parametro I' : 'Parametro II'}
    </Badge>
  );
}

export function QuotesTable({ item, onOverrideStatus }: QuotesTableProps) {
  const [modalQuote, setModalQuote] = useState<Quote | null>(null);
  const [modalAction, setModalAction] = useState<'exclude' | 'restore'>(
    'exclude',
  );

  const isExcluded = (status: QuoteStatus) => status !== 'VALIDO';

  const handleExclude = (quote: Quote) => {
    setModalQuote(quote);
    setModalAction('exclude');
  };

  const handleRestore = (quote: Quote) => {
    setModalQuote(quote);
    setModalAction('restore');
  };

  const handleConfirm = (justification: string) => {
    if (!modalQuote) return;
    const newStatus: QuoteStatus =
      modalAction === 'exclude' ? 'EXCLUIDO_MANUAL' : 'VALIDO';
    onOverrideStatus(modalQuote.id, newStatus, justification);
    setModalQuote(null);
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            Cotacoes do Item {item.numeroItem}
          </h3>
          <span className="text-xs text-muted-foreground">
            {item.cotacoes.length} registro(s)
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fonte
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fornecedor
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CNPJ
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Data
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Valor Unit.
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Acoes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {item.cotacoes.map((quote) => {
              const excluded = isExcluded(quote.status);
              return (
                <TableRow
                  key={quote.id}
                  className={cn(
                    'border-border transition-colors',
                    excluded && 'bg-muted/30',
                  )}
                >
                  <TableCell>{getFonteBadge(quote.datasetFonte)}</TableCell>
                  <TableCell
                    className={cn(
                      'text-sm',
                      excluded ? 'text-muted-foreground' : 'text-foreground',
                    )}
                  >
                    {quote.fornecedorNome}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {quote.fornecedorCNPJ}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(quote.dataCompra)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-mono text-sm font-semibold',
                      excluded
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground',
                    )}
                  >
                    {formatBRL(quote.valorAtualizado)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(quote.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {quote.status === 'VALIDO' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleExclude(quote)}
                      >
                        <Ban className="h-3 w-3" />
                        Excluir
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleRestore(quote)}
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restaurar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <OverrideModal
        open={!!modalQuote}
        onClose={() => setModalQuote(null)}
        onConfirm={handleConfirm}
        action={modalAction}
        quote={modalQuote}
      />
    </>
  );
}
