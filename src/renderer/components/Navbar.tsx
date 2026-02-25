import React from 'react';
import { Project } from '../types';

interface NavbarProps {
  project: Project;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onExportPDF,
  onExportExcel,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="4" fill="#1a73e8" />
            <path
              d="M8 10h16M8 16h16M8 22h10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="navbar-title">
          <h1>Shiva</h1>
          <span className="navbar-subtitle">Pesquisa de Preços</span>
        </div>
      </div>

      <div className="navbar-info">
        <div className="navbar-info-item">
          <span className="label">Processo:</span>
          <span className="value">{project.numeroProcesso}</span>
        </div>
        <div className="navbar-info-item">
          <span className="label">UASG:</span>
          <span className="value">{project.uasg}</span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="dropdown">
          <button className="btn btn-outline dropdown-toggle" type="button">
            Exportar Relatórios
          </button>
          <div className="dropdown-menu">
            <button onClick={onExportPDF} className="dropdown-item">
              Nota Técnica (PDF)
            </button>
            <button onClick={onExportExcel} className="dropdown-item">
              Memória de Cálculo (Excel)
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
