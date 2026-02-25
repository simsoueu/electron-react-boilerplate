import { useCallback } from 'react';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
      };
    };
  }
}

export const useElectronIPC = () => {
  const readFileContent = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }, []);

  const ingestFiles = useCallback(
    async (datasetI: File | null, datasetII: File | null) => {
      const files: { datasetI?: string; datasetII?: string } = {};

      if (datasetI) {
        files.datasetI = await readFileContent(datasetI);
      }
      if (datasetII) {
        files.datasetII = await readFileContent(datasetII);
      }

      return window.electron.ipcRenderer.invoke('data:ingest-files', files);
    },
    [readFileContent],
  );

  const runSaneamento = useCallback(async () => {
    return window.electron.ipcRenderer.invoke('engine:run-saneamento');
  }, []);

  const overrideStatus = useCallback(
    async (data: {
      itemId: string;
      quoteId: string;
      newStatus: string;
      justification: string;
    }) => {
      return window.electron.ipcRenderer.invoke('item:override-status', data);
    },
    [],
  );

  const generatePDF = useCallback(async (data: unknown) => {
    return window.electron.ipcRenderer.invoke('export:generate-pdf', data);
  }, []);

  const generateExcel = useCallback(async (data: unknown) => {
    return window.electron.ipcRenderer.invoke('export:generate-excel', data);
  }, []);

  return {
    ingestFiles,
    runSaneamento,
    overrideStatus,
    generatePDF,
    generateExcel,
  };
};
