import React from 'react';
import { Item } from '../types';

interface StatisticalSummaryCardsProps {
  item: Item;
  useInflationIndex: boolean;
  onToggleInflationIndex: () => void;
}

export const StatisticalSummaryCards: React.FC<
  StatisticalSummaryCardsProps
> = ({ item, useInflationIndex, onToggleInflationIndex }) => {
  const validQuotes = item.cotacoes.filter((q) => q.status === 'VALIDO');
  const totalQuotes = item.cotacoes.length;
  const cv = item.metrics.cv;
  const median = item.metrics.median;
  const mean = item.metrics.mean;

  const minPrice =
    validQuotes.length > 0
      ? Math.min(...validQuotes.map((q) => q.valorAtualizado))
      : 0;
  const maxPrice =
    validQuotes.length > 0
      ? Math.max(...validQuotes.map((q) => q.valorAtualizado))
      : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="card-content">
          <span className="card-label">Cotações Válidas</span>
          <span className="card-value">
            {validQuotes.length} / {totalQuotes}
          </span>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
        </div>
        <div className="card-content">
          <span className="card-label">Coeficiente de Variação</span>
          <span
            className={`card-value ${cv <= 25 ? 'text-success' : 'text-danger'}`}
          >
            {formatPercentage(cv)}
          </span>
        </div>
        {cv <= 25 ? (
          <span className="card-badge badge-success">Conforme</span>
        ) : (
          <span className="card-badge badge-danger">Acima do Limite</span>
        )}
      </div>

      <div className="summary-card">
        <div className="card-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div className="card-content">
          <span className="card-label">Mediana (Preço Unitário)</span>
          <span className="card-value">{formatCurrency(median)}</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 20L20 4" />
            <path d="M4 20v-4" />
            <path d="M4 20h4" />
            <path d="M20 4h-4" />
            <path d="M20 4v4" />
          </svg>
        </div>
        <div className="card-content">
          <span className="card-label">Faixa de Valores</span>
          <span className="card-value">
            {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
