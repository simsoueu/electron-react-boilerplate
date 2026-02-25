import React, { useState } from 'react';
import { Quote, QuoteStatus } from '../types';
import { getStatusLabel, getStatusClass } from '../data/mockData';
import { OverrideModal } from './OverrideModal';

interface DataTableProps {
  quotes: Quote[];
  onOverrideStatus: (
    quoteId: string,
    newStatus: QuoteStatus,
    justification: string,
  ) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  quotes,
  onOverrideStatus,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleActionClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setModalOpen(true);
  };

  const handleConfirm = (justification: string) => {
    if (selectedQuote) {
      const newStatus =
        selectedQuote.status === 'VALIDO' ? 'EXCLUIDO_MANUAL' : 'VALIDO';
      onOverrideStatus(selectedQuote.id, newStatus, justification);
      setModalOpen(false);
      setSelectedQuote(null);
    }
  };

  const getDatasetLabel = (source: string) => {
    return source === 'PARAM_I_SISTEMAS_OFICIAIS' ? 'Dataset I' : 'Dataset II';
  };

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Fonte</th>
            <th>Fornecedor</th>
            <th>CNPJ</th>
            <th>Data</th>
            <th>Valor Unitário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => {
            const isExcluded = quote.status !== 'VALIDO';

            return (
              <tr key={quote.id} className={isExcluded ? 'row-excluded' : ''}>
                <td>
                  <span
                    className={`badge ${quote.datasetFonte === 'PARAM_I_SISTEMAS_OFICIAIS' ? 'badge-primary' : 'badge-secondary'}`}
                  >
                    {getDatasetLabel(quote.datasetFonte)}
                  </span>
                </td>
                <td>{quote.fornecedorNome}</td>
                <td className="text-mono">{quote.fornecedorCNPJ}</td>
                <td>{formatDate(quote.dataCompra)}</td>
                <td
                  className={isExcluded ? 'text-strikethrough text-muted' : ''}
                >
                  {formatCurrency(quote.valorAtualizado)}
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(quote.status)}`}
                  >
                    {getStatusLabel(quote.status)}
                  </span>
                </td>
                <td>
                  {quote.status === 'VALIDO' ? (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleActionClick(quote)}
                      title="Excluir manualmente"
                    >
                      Excluir
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleActionClick(quote)}
                      title="Restaurar cotação"
                    >
                      Restaurar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {quotes.some((q) => q.status !== 'VALIDO') && (
        <div className="exclusion-log">
          <h4>Justificativas de Exclusão</h4>
          <ul>
            {quotes
              .filter((q) => q.status !== 'VALIDO' && q.motivoExclusao)
              .map((q) => (
                <li key={q.id}>
                  <strong>{q.fornecedorNome}:</strong> {q.motivoExclusao}
                </li>
              ))}
          </ul>
        </div>
      )}

      <OverrideModal
        isOpen={modalOpen}
        currentStatus={selectedQuote?.status || 'VALIDO'}
        onClose={() => {
          setModalOpen(false);
          setSelectedQuote(null);
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
