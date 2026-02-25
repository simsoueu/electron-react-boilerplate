import React from 'react';
import { Item } from '../types';

interface ItemHeaderProps {
  item: Item;
  useInflationIndex: boolean;
  onToggleInflationIndex: () => void;
}

export const ItemHeader: React.FC<ItemHeaderProps> = ({
  item,
  useInflationIndex,
  onToggleInflationIndex,
}) => {
  return (
    <div className="item-header">
      <div className="item-header-info">
        <h2>Item {item.numeroItem}</h2>
        <p className="item-description">{item.descricao}</p>
        <p className="item-quantity">
          Quantidade Estimada: <strong>{item.quantidadeEstimada}</strong>{' '}
          unidades
        </p>
      </div>
      <div className="item-header-actions">
        <label className="toggle">
          <input
            type="checkbox"
            checked={useInflationIndex}
            onChange={onToggleInflationIndex}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            Aplicar correção monetária (IPCA/IGP-M)
          </span>
        </label>
      </div>
    </div>
  );
};
