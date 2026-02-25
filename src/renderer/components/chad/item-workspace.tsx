'use client';

import type { Item, QuoteStatus } from '../../types/chad';
import { StatCards } from './stat-cards';
import { QuotesTable } from './quotes-table';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

interface ItemWorkspaceProps {
  item: Item;
  onOverrideStatus: (
    quoteId: string,
    newStatus: QuoteStatus,
    justification: string,
  ) => void;
  onRunSaneamento: () => void;
}

export function ItemWorkspace({
  item,
  onOverrideStatus,
  onRunSaneamento,
}: ItemWorkspaceProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Item Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              {item.numeroItem}
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              Item {item.numeroItem}
            </h2>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {item.descricao}
          </p>
          <p className="text-xs text-muted-foreground">
            Quantidade estimada:{' '}
            <span className="font-mono font-semibold text-foreground">
              {item.quantidadeEstimada.toLocaleString('pt-BR')}
            </span>{' '}
            unidades
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
          onClick={onRunSaneamento}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Executar Saneamento
        </Button>
      </div>

      {/* Stats Cards */}
      <StatCards item={item} />

      {/* Quotes Table */}
      <QuotesTable item={item} onOverrideStatus={onOverrideStatus} />
    </div>
  );
}
