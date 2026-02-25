import React, { useState } from 'react';
import { Item, QuoteStatus } from '../types';
import { ItemHeader } from './ItemHeader';
import { StatisticalSummaryCards } from './StatisticalSummaryCards';
import { DataTable } from './DataTable';

interface MainContentProps {
  item: Item;
  useInflationIndex: boolean;
  onToggleInflationIndex: () => void;
  onOverrideStatus: (
    quoteId: string,
    newStatus: QuoteStatus,
    justification: string,
  ) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  item,
  useInflationIndex,
  onToggleInflationIndex,
  onOverrideStatus,
}) => {
  return (
    <main className="main-content">
      <ItemHeader
        item={item}
        useInflationIndex={useInflationIndex}
        onToggleInflationIndex={onToggleInflationIndex}
      />

      <StatisticalSummaryCards
        item={item}
        useInflationIndex={useInflationIndex}
        onToggleInflationIndex={onToggleInflationIndex}
      />

      <div className="data-section">
        <h3>Cotações</h3>
        <DataTable quotes={item.cotacoes} onOverrideStatus={onOverrideStatus} />
      </div>
    </main>
  );
};
