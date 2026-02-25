'use client';

import type { Item } from '../../types/chad';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Package } from 'lucide-react';

interface ItemSidebarProps {
  items: Item[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ItemSidebar({
  items,
  selectedIndex,
  onSelect,
}: ItemSidebarProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-12 items-center gap-2 border-b border-sidebar-border px-4">
        <Package className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Itens da Pesquisa
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 p-2">
          {items.map((item, index) => {
            const validCount = item.cotacoes.filter(
              (q) => q.status === 'VALIDO',
            ).length;
            const totalCount = item.cotacoes.length;
            const isSelected = index === selectedIndex;

            return (
              <button
                key={item.numeroItem}
                onClick={() => onSelect(index)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                  isSelected
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {item.numeroItem}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-medium leading-tight">
                    {item.descricao.length > 50
                      ? item.descricao.slice(0, 50) + '...'
                      : item.descricao}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px] font-mono"
                    >
                      {validCount}/{totalCount}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {'cotacoes'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
