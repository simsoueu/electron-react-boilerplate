import React, { useState } from 'react';
import { QuoteStatus } from '../types';

interface OverrideModalProps {
  isOpen: boolean;
  currentStatus: QuoteStatus;
  onClose: () => void;
  onConfirm: (justification: string) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  isOpen,
  currentStatus,
  onClose,
  onConfirm,
}) => {
  const [justification, setJustification] = useState('');

  if (!isOpen) return null;

  const isExcluding = currentStatus === 'VALIDO';

  const handleConfirm = () => {
    if (justification.trim().length > 0) {
      onConfirm(justification.trim());
      setJustification('');
    }
  };

  const handleClose = () => {
    setJustification('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isExcluding ? 'Excluir Manualmente' : 'Restaurar Cotação'}</h3>
          <button className="modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-description">
            {isExcluding
              ? 'Esta ação excluirá a cotação do cálculo. Forneça uma justificativa conforme art. 3º, V da IN 65/2021.'
              : 'Esta ação restaurará a cotação para cálculo.'}
          </p>
          <div className="form-group">
            <label htmlFor="justification">Justificativa</label>
            <textarea
              id="justification"
              className="form-control"
              rows={4}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Digite a justificativa para esta ação..."
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className={`btn ${isExcluding ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
            disabled={justification.trim().length === 0}
          >
            {isExcluding ? 'Excluir' : 'Restaurar'}
          </button>
        </div>
      </div>
    </div>
  );
};
