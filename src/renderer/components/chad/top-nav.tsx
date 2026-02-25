'use client';

import type { Project } from '../../types/chad';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { FileText, Table, ChevronDown, Scale } from 'lucide-react';

interface TopNavProps {
  project: Project;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function TopNav({ project, onExportPDF, onExportExcel }: TopNavProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <Scale className="h-5 w-5 text-primary" />
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-foreground">
            Pesquisa de Precos
          </h1>
          <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
            IN 65/2021
          </span>
        </div>
        <span className="mx-2 h-4 w-px bg-border" />
        <span className="text-sm text-muted-foreground">
          Processo {project.numeroProcesso}
        </span>
        <span className="text-sm text-muted-foreground">
          {'/ '}
          {project.uasg}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {project.responsavel}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Exportar Relatorios
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2" onClick={onExportPDF}>
              <FileText className="h-4 w-4" />
              Nota Tecnica (PDF)
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={onExportExcel}>
              <Table className="h-4 w-4" />
              Memoria de Calculo (Excel)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
