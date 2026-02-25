'use client';

import type { Item } from '../../types/chad';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import { CheckCircle, TrendingUp, DollarSign, ArrowUpDown } from 'lucide-react';

interface StatCardsProps {
  item: Item;
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function StatCards({ item }: StatCardsProps) {
  const validCount = item.cotacoes.filter((q) => q.status === 'VALIDO').length;
  const totalCount = item.cotacoes.length;
  const cv = item.metrics.cv;
  const cvOk = cv <= 25;
  const validValues = item.cotacoes
    .filter((q) => q.status === 'VALIDO')
    .map((q) => q.valorAtualizado);
  const minValue = validValues.length > 0 ? Math.min(...validValues) : 0;
  const maxValue = validValues.length > 0 ? Math.max(...validValues) : 0;

  const cards = [
    {
      label: 'Cotacoes Validas',
      value: `${validCount} / ${totalCount}`,
      sub: `${totalCount - validCount} excluida(s)`,
      icon: CheckCircle,
      accent: 'text-primary',
      bgAccent: 'bg-primary/10',
    },
    {
      label: 'Coeficiente de Variacao',
      value: `${cv.toFixed(1)}%`,
      sub: cvOk ? 'Homogeneo (CV <= 25%)' : 'Necessita saneamento (CV > 25%)',
      icon: TrendingUp,
      accent: cvOk ? 'text-success' : 'text-destructive',
      bgAccent: cvOk ? 'bg-success/10' : 'bg-destructive/10',
    },
    {
      label: 'Mediana (Preco Estimado)',
      value: formatBRL(item.metrics.mediana),
      sub: `Total: ${formatBRL(item.metrics.mediana * item.quantidadeEstimada)}`,
      icon: DollarSign,
      accent: 'text-chart-1',
      bgAccent: 'bg-chart-1/10',
    },
    {
      label: 'Faixa de Valores',
      value: `${formatBRL(minValue)} - ${formatBRL(maxValue)}`,
      sub: `Media: ${formatBRL(item.metrics.media)}`,
      icon: ArrowUpDown,
      accent: 'text-chart-2',
      bgAccent: 'bg-chart-2/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-border bg-card">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {card.label}
              </span>
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  card.bgAccent,
                )}
              >
                <card.icon className={cn('h-4 w-4', card.accent)} />
              </div>
            </div>
            <p
              className={cn(
                'text-xl font-bold font-mono tracking-tight',
                card.accent,
              )}
            >
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
