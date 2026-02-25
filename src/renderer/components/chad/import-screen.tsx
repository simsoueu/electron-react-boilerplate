'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle,
  X,
  Loader2,
} from 'lucide-react';

interface ImportScreenProps {
  onComplete: (
    data: { numeroProcesso: string; uasg: string },
    datasetI: File | null,
    datasetII: File | null,
  ) => void;
  loading?: boolean;
}

interface FileState {
  file: File | null;
  name: string;
  loaded: boolean;
}

export function ImportScreen({ onComplete, loading }: ImportScreenProps) {
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [uasg, setUasg] = useState('');
  const [datasetI, setDatasetI] = useState<FileState | null>(null);
  const [datasetII, setDatasetII] = useState<FileState | null>(null);
  const [dragOverI, setDragOverI] = useState(false);
  const [dragOverII, setDragOverII] = useState(false);

  const fileInputRefI = useRef<HTMLInputElement>(null);
  const fileInputRefII = useRef<HTMLInputElement>(null);

  const handleFile = (file: File, setFile: (f: FileState) => void) => {
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (validExtensions.includes(ext)) {
      setFile({ file, name: file.name, loaded: true });
    } else {
      alert('Por favor, insira um arquivo CSV, XLS ou XLSX');
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    setFile: (f: FileState) => void,
    setDragOver: (b: boolean) => void,
  ) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file, setFile);
    }
  };

  const handleDragOver = (
    e: React.DragEvent,
    setDragOver: (b: boolean) => void,
  ) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (setDragOver: (b: boolean) => void) => {
    setDragOver(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(
      { numeroProcesso, uasg },
      datasetI?.file || null,
      datasetII?.file || null,
    );
  };

  const handleClearFile = (
    e: React.MouseEvent,
    setFile: (f: FileState | null) => void,
  ) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Nova Pesquisa de Preços
          </CardTitle>
          <CardDescription>
            Configure os parâmetros da pesquisa e importe os dados conforme IN
            65/2021
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Process Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processo">Número do Processo</Label>
                <Input
                  id="processo"
                  placeholder="138/2025"
                  value={numeroProcesso}
                  onChange={(e) => setNumeroProcesso(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uasg">UASG</Label>
                <Input
                  id="uasg"
                  placeholder="420001"
                  value={uasg}
                  onChange={(e) => setUasg(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Drop Zones */}
            <div className="grid grid-cols-2 gap-4">
              {/* Dataset I */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Painel de Preços (Art. 5, I)
                </Label>
                <input
                  type="file"
                  ref={fileInputRefI}
                  className="hidden"
                  accept=".csv,.xls,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file, setDatasetI);
                  }}
                  disabled={loading}
                />
                <div
                  className={`group relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    dragOverI
                      ? 'border-primary bg-primary/10'
                      : datasetI?.loaded
                        ? 'border-success bg-success/10'
                        : 'border-border bg-muted/50 hover:border-primary hover:bg-muted'
                  } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => !loading && fileInputRefI.current?.click()}
                  onDrop={(e) =>
                    !loading && handleDrop(e, setDatasetI, setDragOverI)
                  }
                  onDragOver={(e) =>
                    !loading && handleDragOver(e, setDragOverI)
                  }
                  onDragLeave={() => !loading && handleDragLeave(setDragOverI)}
                >
                  {datasetI?.loaded ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-success" />
                      <span className="mt-2 text-sm font-medium text-success">
                        {datasetI.name}
                      </span>
                      {!loading && (
                        <button
                          type="button"
                          onClick={(e) => handleClearFile(e, setDatasetI)}
                          className="absolute right-2 top-2 rounded-full p-1 hover:bg-success/20"
                        >
                          <X className="h-4 w-4 text-success" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                      <span className="mt-2 text-sm text-muted-foreground">
                        Arraste ou clique
                      </span>
                      <span className="text-xs text-muted-foreground">
                        CSV, XLS, XLSX
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Dataset II */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Contratações Similares (Art. 5, II)
                </Label>
                <input
                  type="file"
                  ref={fileInputRefII}
                  className="hidden"
                  accept=".csv,.xls,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file, setDatasetII);
                  }}
                  disabled={loading}
                />
                <div
                  className={`group relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    dragOverII
                      ? 'border-primary bg-primary/10'
                      : datasetII?.loaded
                        ? 'border-success bg-success/10'
                        : 'border-border bg-muted/50 hover:border-primary hover:bg-muted'
                  } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => !loading && fileInputRefII.current?.click()}
                  onDrop={(e) =>
                    !loading && handleDrop(e, setDatasetII, setDragOverII)
                  }
                  onDragOver={(e) =>
                    !loading && handleDragOver(e, setDragOverII)
                  }
                  onDragLeave={() => !loading && handleDragLeave(setDragOverII)}
                >
                  {datasetII?.loaded ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-success" />
                      <span className="mt-2 text-sm font-medium text-success">
                        {datasetII.name}
                      </span>
                      {!loading && (
                        <button
                          type="button"
                          onClick={(e) => handleClearFile(e, setDatasetII)}
                          className="absolute right-2 top-2 rounded-full p-1 hover:bg-success/20"
                        >
                          <X className="h-4 w-4 text-success" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                      <span className="mt-2 text-sm text-muted-foreground">
                        Arraste ou clique
                      </span>
                      <span className="text-xs text-muted-foreground">
                        CSV, XLS, XLSX
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Processar Dados
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
