import { useState, useEffect, useCallback, useMemo } from 'react';
import { solveCircuit, updateLampStates, getCircuitAnalysis } from '../utils/circuitSolver';
import { validateCircuit } from '../utils/circuitValidation';

export function useCircuitSimulation(components, connections) {
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1.0); // 0.5x to 2x
  const [simulationResult, setSimulationResult] = useState(null);

  // Calculate simulation results when circuit changes
  const calculatedResult = useMemo(() => {
    if (components.length === 0) {
      return null;
    }

    return solveCircuit(components, connections);
  }, [components, connections]);

  // Validation results
  const validation = useMemo(() => {
    return validateCircuit(components, connections);
  }, [components, connections]);

  // Circuit analysis data
  const analysis = useMemo(() => {
    if (!calculatedResult) {
      return null;
    }

    return getCircuitAnalysis(components, calculatedResult);
  }, [components, calculatedResult]);

  // Update simulation result when running
  useEffect(() => {
    if (isRunning) {
      setSimulationResult(calculatedResult);
    } else {
      setSimulationResult(null);
    }
  }, [isRunning, calculatedResult]);

  // Start simulation
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Stop simulation
  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Toggle simulation
  const toggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // Update animation speed
  const setSpeed = useCallback((speed) => {
    setAnimationSpeed(Math.max(0.5, Math.min(2.0, speed)));
  }, []);

  // Get updated components with lamp states
  const getUpdatedComponents = useCallback(() => {
    if (!simulationResult) {
      return components;
    }

    return updateLampStates(components, simulationResult);
  }, [components, simulationResult]);

  return {
    // State
    isRunning,
    animationSpeed,
    simulationResult,
    validation,
    analysis,

    // Actions
    start,
    stop,
    toggle,
    setSpeed,

    // Data
    getUpdatedComponents,

    // Helper getters
    isValid: validation.isValid,
    canRun: validation.hasCompletedCircuit,
    errors: validation.errors,
    warnings: validation.warnings,
    totalCurrent: simulationResult?.totalCurrent || 0,
    totalVoltage: simulationResult?.totalVoltage || 0,
    totalResistance: simulationResult?.totalResistance || Infinity,
    currentFlows: simulationResult?.currentFlows || [],
  };
}
