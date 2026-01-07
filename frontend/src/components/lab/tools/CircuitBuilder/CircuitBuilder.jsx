import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Zap, Info, AlertTriangle, AlertCircle } from 'lucide-react';

import { useCircuitState } from './hooks/useCircuitState';
import { useCircuitSimulation } from './hooks/useCircuitSimulation';

// Component imports (to be created)
import CircuitCanvas from './components/CircuitCanvas';
import ComponentsPalette from './components/ComponentsPalette';
import PropertiesPanel from './components/PropertiesPanel';
import CircuitControls from './components/CircuitControls';
import CircuitAnalyzer from './components/CircuitAnalyzer';

const CircuitBuilder = ({ tool }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('builder'); // 'builder' | 'analyze'

  // Circuit state management
  const circuitState = useCircuitState();
  const {
    components,
    connections,
    selectedId,
    selectedType,
    addComponent,
    updateComponent,
    updateComponentProperties,
    deleteComponent,
    deleteConnection,
    clearCircuit,
    loadCircuitState,
    getCircuitState,
    clearSelection,
  } = circuitState;

  // Circuit simulation
  const simulation = useCircuitSimulation(components, connections);
  const {
    isRunning,
    toggle: toggleSimulation,
    start: startSimulation,
    stop: stopSimulation,
    validation,
    analysis,
    currentFlows,
  } = simulation;

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Delete key - delete selected component or connection
    if (e.key === 'Delete' && selectedId) {
      if (selectedType === 'component') {
        deleteComponent(selectedId);
      } else if (selectedType === 'connection') {
        deleteConnection(selectedId);
      }
    }

    // Space key - toggle simulation
    if (e.key === ' ' && validation.canRun) {
      e.preventDefault();
      toggleSimulation();
    }

    // Escape key - clear selection
    if (e.key === 'Escape') {
      clearSelection();
    }
  }, [selectedId, selectedType, deleteComponent, deleteConnection, toggleSimulation, validation.canRun, clearSelection]);

  // Handle save circuit
  const handleSave = useCallback(() => {
    // This will be handled by CircuitControls component
    console.log('Save circuit:', getCircuitState());
  }, [getCircuitState]);

  // Handle load circuit
  const handleLoad = useCallback((circuitData) => {
    loadCircuitState(circuitData);
    stopSimulation();
  }, [loadCircuitState, stopSimulation]);

  // Handle clear circuit
  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear the circuit? This cannot be undone.')) {
      clearCircuit();
      stopSimulation();
    }
  }, [clearCircuit, stopSimulation]);

  // Render validation messages
  const renderValidationMessages = () => {
    if (!validation) return null;

    return (
      <div className="space-y-2">
        {/* Errors */}
        {validation.errors.map((error, index) => (
          <Alert key={`error-${index}`} variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ))}

        {/* Warnings */}
        {validation.warnings.map((warning, index) => (
          <Alert key={`warning-${index}`} variant="default" className="border-yellow-500 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">{warning.message}</AlertDescription>
          </Alert>
        ))}

        {/* Success message */}
        {validation.isValid && validation.hasCompletedCircuit && (
          <Alert variant="default" className="border-green-500 bg-green-50">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Circuit is ready! Click Play to start simulation.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full max-w-[1400px] mx-auto p-4 space-y-6"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('lab.tools.circuitBuilder.title')}</h1>
            <p className="text-muted-foreground">
              {t('lab.tools.circuitBuilder.description')}
            </p>
          </div>
        </div>

        {/* Circuit Controls */}
        <CircuitControls
          isRunning={isRunning}
          canRun={validation?.canRun || false}
          onPlayPause={toggleSimulation}
          onClear={handleClear}
          circuitState={circuitState}
          onLoad={handleLoad}
        />
      </div>

      {/* Validation Messages */}
      {renderValidationMessages()}

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="builder">
            Builder
          </TabsTrigger>
          <TabsTrigger value="analyze">
            Analyze
            {isRunning && (
              <Badge variant="default" className="ml-2 bg-green-500">
                Live
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="mt-6 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Left: Components Palette */}
            <div className="col-span-12 md:col-span-2">
              <ComponentsPalette
                onAddComponent={(type, position) => {
                  addComponent(type, position);
                }}
              />
            </div>

            {/* Center: Circuit Canvas */}
            <div className="col-span-12 md:col-span-7">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <CircuitCanvas
                    components={components}
                    connections={connections}
                    selectedId={selectedId}
                    selectedType={selectedType}
                    onSelectComponent={(id) => circuitState.select(id, 'component')}
                    onSelectConnection={(id) => circuitState.select(id, 'connection')}
                    onUpdateComponentPosition={circuitState.updateComponentPosition}
                    onAddConnection={circuitState.addConnection}
                    isSimulating={isRunning}
                    currentFlows={currentFlows}
                    simulationResult={simulation.simulationResult}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right: Properties Panel */}
            <div className="col-span-12 md:col-span-3">
              <PropertiesPanel
                selectedComponent={
                  selectedType === 'component'
                    ? components.find(c => c.id === selectedId)
                    : null
                }
                selectedConnection={
                  selectedType === 'connection'
                    ? connections.find(c => c.id === selectedId)
                    : null
                }
                onUpdateProperties={(props) => {
                  if (selectedId && selectedType === 'component') {
                    updateComponentProperties(selectedId, props);
                  }
                }}
                onDelete={() => {
                  if (selectedId) {
                    if (selectedType === 'component') {
                      deleteComponent(selectedId);
                    } else if (selectedType === 'connection') {
                      deleteConnection(selectedId);
                    }
                  }
                }}
                onRotate={() => {
                  if (selectedId && selectedType === 'component') {
                    circuitState.rotateComponent(selectedId);
                  }
                }}
                isSimulating={isRunning}
              />
            </div>
          </div>
        </TabsContent>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="mt-6">
          <CircuitAnalyzer
            components={components}
            simulation={simulation}
            analysis={analysis}
            isRunning={isRunning}
          />
        </TabsContent>
      </Tabs>

      {/* Educational Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Learning Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              <strong>Getting Started:</strong> Drag components from the palette to the canvas, then connect them by clicking terminals.
            </li>
            <li>
              <strong>Series Circuit:</strong> Connect components one after another (battery → resistor → lamp → back to battery).
            </li>
            <li>
              <strong>Switches:</strong> Use switches to control the circuit flow. Click on a switch in the properties panel to toggle it.
            </li>
            <li>
              <strong>Ohm's Law:</strong> Voltage (V) = Current (I) × Resistance (R). Try changing resistance values to see how current changes!
            </li>
            <li>
              <strong>Keyboard Shortcuts:</strong> Delete (remove selected), Space (play/pause), Escape (clear selection)
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CircuitBuilder;
