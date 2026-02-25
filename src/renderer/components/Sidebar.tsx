import React from 'react';
import { Item } from '../types';

interface SidebarProps {
  items: Item[];
  selectedItemId: number | null;
  onSelectItem: (itemId: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  selectedItemId,
  onSelectItem,
}) => {
  const getQuoteCount = (item: Item) => {
    return item.cotacoes.length;
  };

  const getValidQuoteCount = (item: Item) => {
    return item.cotacoes.filter((q) => q.status === 'VALIDO').length;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Itens</h2>
        <span className="item-count">{items.length}</span>
      </div>
      <ul className="sidebar-list">
        {items.map((item) => {
          const isSelected = selectedItemId === item.numeroItem;
          const validCount = getValidQuoteCount(item);
          const totalCount = getQuoteCount(item);

          return (
            <li
              key={item.numeroItem}
              className={`sidebar-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectItem(item.numeroItem)}
            >
              <div className="sidebar-item-content">
                <span className="item-number">Item {item.numeroItem}</span>
                <span className="item-description">{item.descricao}</span>
              </div>
              <div className="sidebar-item-badge">
                <span
                  className={`badge ${validCount === totalCount ? 'badge-success' : 'badge-warning'}`}
                >
                  {validCount}/{totalCount}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
