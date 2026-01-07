import { COMPONENT_TYPES } from '../constants/circuitComponents.jsx';
import { canCircuitConduct, getCircuitTopology } from './circuitValidation';

// Solve the DC circuit and calculate current/voltage
export function solveCircuit(components, connections) {
  // Default result (no current)
  const defaultResult = {
    totalCurrent: 0,
    totalVoltage: 0,
    totalResistance: Infinity,
    componentCurrents: {},
    componentVoltages: {},
    currentFlows: [],
    nodeVoltages: {},
  };

  // Check if circuit can conduct
  if (!canCircuitConduct(components, connections)) {
    return defaultResult;
  }

  // Get circuit topology
  const topology = getCircuitTopology(components, connections);
  if (topology.loops.length === 0) {
    return defaultResult;
  }

  // For simple DC circuits, we'll solve each loop independently
  // In a more advanced version, we'd use nodal analysis or mesh analysis

  const results = [];

  topology.loops.forEach(loop => {
    const loopResult = solveLoop(loop, components, connections);
    if (loopResult) {
      results.push(loopResult);
    }
  });

  // Combine results from all loops
  if (results.length === 0) {
    return defaultResult;
  }

  // For now, use the first valid loop result
  // In a more advanced version, we'd combine parallel loops
  return results[0];
}

// Solve a single loop
function solveLoop(loop, components, connections) {
  // Check if loop has an open switch
  const hasOpenSwitch = loop.some(compId => {
    const comp = components.find(c => c.id === compId);
    return comp && comp.type === COMPONENT_TYPES.SWITCH && !comp.properties.closed;
  });

  if (hasOpenSwitch) {
    return null; // No current flows through this loop
  }

  // Calculate total voltage (sum of all batteries)
  let totalVoltage = 0;
  loop.forEach(compId => {
    const comp = components.find(c => c.id === compId);
    if (comp && comp.type === COMPONENT_TYPES.BATTERY) {
      totalVoltage += comp.properties.voltage || 0;
    }
  });

  // Calculate total resistance (sum of all resistors and lamps)
  let totalResistance = 0;
  loop.forEach(compId => {
    const comp = components.find(c => c.id === compId);
    if (comp && (comp.type === COMPONENT_TYPES.RESISTOR || comp.type === COMPONENT_TYPES.LAMP)) {
      totalResistance += comp.properties.resistance || 0;
    }
  });

  // Avoid division by zero
  if (totalResistance === 0) {
    totalResistance = 0.01; // Very small resistance for short circuit
  }

  // Apply Ohm's Law: I = V / R
  const totalCurrent = totalVoltage / totalResistance;

  // Calculate voltage drop across each component
  const componentVoltages = {};
  const componentCurrents = {};

  loop.forEach(compId => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return;

    // All components in a series loop have the same current
    componentCurrents[compId] = totalCurrent;

    // Calculate voltage drop using Ohm's law: V = I × R
    if (comp.type === COMPONENT_TYPES.RESISTOR || comp.type === COMPONENT_TYPES.LAMP) {
      const resistance = comp.properties.resistance || 0;
      componentVoltages[compId] = totalCurrent * resistance;
    } else if (comp.type === COMPONENT_TYPES.BATTERY) {
      componentVoltages[compId] = comp.properties.voltage || 0;
    } else {
      componentVoltages[compId] = 0;
    }
  });

  // Build current flow paths for animation
  const currentFlows = [{
    path: loop,
    current: totalCurrent,
    direction: 1, // Positive direction
  }];

  return {
    totalCurrent,
    totalVoltage,
    totalResistance,
    componentCurrents,
    componentVoltages,
    currentFlows,
    nodeVoltages: {}, // For simple series circuits, node voltages are not critical
  };
}

// Calculate lamp brightness based on voltage and current
export function calculateLampBrightness(voltage, current, lamp) {
  const minVoltage = lamp.properties.minVoltage || 1.5;
  const maxCurrent = lamp.properties.maxCurrent || 0.2;

  // Check if burned out
  if (lamp.properties.burnedOut) {
    return 0;
  }

  // Check if current exceeds maximum (burns out)
  if (current > maxCurrent) {
    return -1; // Indicates burnout
  }

  // Check if voltage is below minimum
  if (voltage < minVoltage) {
    return 0; // Too dim to light up
  }

  // Calculate brightness as a percentage (0-100)
  // Linear mapping: minVoltage -> 20%, higher voltage -> up to 100%
  const normalizedVoltage = Math.min(voltage / (minVoltage * 4), 1); // Cap at 4x min voltage
  const brightness = Math.round(20 + (normalizedVoltage * 80));

  return Math.min(100, brightness);
}

// Update lamp states based on simulation results
export function updateLampStates(components, simulationResult) {
  return components.map(comp => {
    if (comp.type !== COMPONENT_TYPES.LAMP) {
      return comp;
    }

    const voltage = simulationResult.componentVoltages[comp.id] || 0;
    const current = simulationResult.componentCurrents[comp.id] || 0;

    const brightness = calculateLampBrightness(voltage, current, comp);

    // Handle burnout
    if (brightness === -1) {
      return {
        ...comp,
        properties: {
          ...comp.properties,
          brightness: 0,
          burnedOut: true,
        },
      };
    }

    return {
      ...comp,
      properties: {
        ...comp.properties,
        brightness,
      },
    };
  });
}

// Get formatted circuit analysis data
export function getCircuitAnalysis(components, simulationResult) {
  const analysis = {
    overview: {
      totalVoltage: simulationResult.totalVoltage.toFixed(2),
      totalCurrent: simulationResult.totalCurrent.toFixed(3),
      totalResistance: simulationResult.totalResistance.toFixed(2),
      power: (simulationResult.totalVoltage * simulationResult.totalCurrent).toFixed(3),
    },
    components: [],
  };

  components.forEach(comp => {
    const voltage = simulationResult.componentVoltages[comp.id] || 0;
    const current = simulationResult.componentCurrents[comp.id] || 0;
    const power = voltage * current;

    let label = '';
    let value = '';

    switch (comp.type) {
      case COMPONENT_TYPES.BATTERY:
        label = 'Battery';
        value = `${comp.properties.voltage}V`;
        break;
      case COMPONENT_TYPES.RESISTOR:
        label = 'Resistor';
        value = `${comp.properties.resistance}Ω`;
        break;
      case COMPONENT_TYPES.LAMP:
        label = 'Lamp';
        value = `${comp.properties.resistance}Ω`;
        break;
      case COMPONENT_TYPES.SWITCH:
        label = 'Switch';
        value = comp.properties.closed ? 'Closed' : 'Open';
        break;
      default:
        label = 'Component';
        value = '';
    }

    analysis.components.push({
      id: comp.id,
      label,
      value,
      voltage: voltage.toFixed(2),
      current: current.toFixed(3),
      power: power.toFixed(3),
      type: comp.type,
    });
  });

  return analysis;
}
