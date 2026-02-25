import React, { useState, useCallback } from 'react';
import { ImportScreen } from './components/chad/import-screen';
import { TopNav } from './components/chad/top-nav';
import { ItemSidebar } from './components/chad/item-sidebar';
import { ItemWorkspace } from './components/chad/item-workspace';
import { mockProject } from './data/mockData';
import { Project, QuoteStatus, Item } from './types/chad';
import { useElectronIPC } from './hooks/useElectronIPC';
import './globals.css';

type Screen = 'import' | 'dashboard';

function App() {
  const [screen, setScreen] = useState<Screen>('import');
  const [project, setProject] = useState<Project>(mockProject);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const { ingestFiles } = useElectronIPC();

  const selectedItem = project.items[selectedIndex] || null;

  const handleImportComplete = useCallback(
    async (
      data: { numeroProcesso: string; uasg: string },
      datasetI: File | null,
      datasetII: File | null,
    ) => {
      setLoading(true);
      try {
        const result = (await ingestFiles(datasetI, datasetII)) as {
          success: boolean;
          project?: Project;
          message?: string;
        };

        if (result.success && result.project) {
          setProject({
            ...result.project,
            numeroProcesso:
              data.numeroProcesso || result.project.numeroProcesso,
            uasg: data.uasg || result.project.uasg,
          });
        } else {
          console.error('Error:', result.message);
          setProject({
            ...project,
            numeroProcesso: data.numeroProcesso || project.numeroProcesso,
            uasg: data.uasg || project.uasg,
          });
        }
        setScreen('dashboard');
      } catch (error) {
        console.error('Error importing files:', error);
      } finally {
        setLoading(false);
      }
    },
    [ingestFiles, project],
  );

  const handleSelectItem = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleOverrideStatus = useCallback(
    async (quoteId: string, newStatus: QuoteStatus, justification: string) => {
      setProject((prev: Project) => {
        const newItems = prev.items.map((item: Item, idx: number) => {
          if (idx === selectedIndex) {
            return {
              ...item,
              cotacoes: item.cotacoes.map((q) => {
                if (q.id === quoteId) {
                  return {
                    ...q,
                    status: newStatus,
                    motivoExclusao: justification,
                  };
                }
                return q;
              }),
            };
          }
          return item;
        });
        return { ...prev, items: newItems };
      });
    },
    [selectedIndex],
  );

  const handleRunSaneamento = useCallback(() => {
    console.log('Running saneamento...');
  }, []);

  const handleExportPDF = useCallback(async () => {
    console.log('Exporting PDF...');
  }, []);

  const handleExportExcel = useCallback(async () => {
    console.log('Exporting Excel...');
  }, []);

  if (screen === 'import') {
    return <ImportScreen onComplete={handleImportComplete} loading={loading} />;
  }

  return (
    <div className="dark flex h-screen flex-col bg-background">
      <TopNav
        project={project}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />
      <div className="flex flex-1 overflow-hidden">
        <ItemSidebar
          items={project.items}
          selectedIndex={selectedIndex}
          onSelect={handleSelectItem}
        />
        {selectedItem && (
          <ItemWorkspace
            item={selectedItem}
            onOverrideStatus={handleOverrideStatus}
            onRunSaneamento={handleRunSaneamento}
          />
        )}
      </div>
    </div>
  );
}

export default App;
