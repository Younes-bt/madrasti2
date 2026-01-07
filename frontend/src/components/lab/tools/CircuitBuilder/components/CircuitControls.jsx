import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  Trash2,
  Save,
  FolderOpen,
  Download,
  Upload,
} from 'lucide-react';

import {
  saveCircuit,
  loadAllCircuits,
  exportCircuitJSON,
  importCircuitJSON,
  EXAMPLE_CIRCUITS,
  getExampleCircuit,
} from '../utils/circuitSerializer';

const CircuitControls = ({
  isRunning,
  canRun,
  onPlayPause,
  onClear,
  circuitState,
  onLoad,
}) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [circuitName, setCircuitName] = useState('');
  const [savedCircuits, setSavedCircuits] = useState([]);

  const handleSave = () => {
    const name = circuitName.trim() || 'Untitled Circuit';
    const state = circuitState.getCircuitState();

    const result = saveCircuit(state, { name });

    if (result.success) {
      alert(`Circuit "${name}" saved successfully!`);
      setCircuitName('');
      setSaveDialogOpen(false);
    } else {
      alert(`Failed to save circuit: ${result.error}`);
    }
  };

  const handleLoadDialog = () => {
    const circuits = loadAllCircuits();
    setSavedCircuits(circuits);
    setLoadDialogOpen(true);
  };

  const handleLoadCircuit = (circuit) => {
    onLoad(circuit);
    setLoadDialogOpen(false);
  };

  const handleLoadExample = (exampleId) => {
    const example = getExampleCircuit(exampleId);
    if (example) {
      onLoad(example);
      setLoadDialogOpen(false);
    }
  };

  const handleExport = () => {
    const state = circuitState.getCircuitState();
    const name = prompt('Enter circuit name:') || 'Exported Circuit';
    exportCircuitJSON(state, { name });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const circuit = await importCircuitJSON(file);
        onLoad(circuit);
        alert('Circuit imported successfully!');
      } catch (error) {
        alert(`Failed to import circuit: ${error.message}`);
      }
    };

    input.click();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Play/Pause */}
      <Button
        onClick={onPlayPause}
        disabled={!canRun}
        variant={isRunning ? "default" : "outline"}
        size="lg"
      >
        {isRunning ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Play
          </>
        )}
      </Button>

      {/* Clear */}
      <Button
        onClick={onClear}
        variant="outline"
        size="lg"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        Clear
      </Button>

      {/* Save */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg">
            <Save className="w-5 h-5 mr-2" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Circuit</DialogTitle>
            <DialogDescription>
              Give your circuit a name to save it for later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="circuit-name">Circuit Name</Label>
              <Input
                id="circuit-name"
                placeholder="My Circuit"
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Circuit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" onClick={handleLoadDialog}>
            <FolderOpen className="w-5 h-5 mr-2" />
            Load
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Load Circuit</DialogTitle>
            <DialogDescription>
              Choose a saved circuit or example to load
            </DialogDescription>
          </DialogHeader>

          {/* Example Circuits */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Example Circuits</h3>
            <div className="grid gap-2">
              {EXAMPLE_CIRCUITS.map((example) => (
                <Button
                  key={example.id}
                  variant="outline"
                  className="justify-start h-auto py-3"
                  onClick={() => handleLoadExample(example.id)}
                >
                  <div className="text-left">
                    <div className="font-semibold">{example.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {example.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Saved Circuits */}
          {savedCircuits.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="font-semibold text-sm">Saved Circuits</h3>
              <div className="grid gap-2">
                {savedCircuits.map((circuit) => (
                  <Button
                    key={circuit.id}
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => handleLoadCircuit(circuit)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">
                        {circuit.metadata?.name || 'Untitled'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(circuit.metadata?.created).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export */}
      <Button variant="outline" size="lg" onClick={handleExport}>
        <Download className="w-5 h-5 mr-2" />
        Export
      </Button>

      {/* Import */}
      <Button variant="outline" size="lg" onClick={handleImport}>
        <Upload className="w-5 h-5 mr-2" />
        Import
      </Button>
    </div>
  );
};

export default CircuitControls;
