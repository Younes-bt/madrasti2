import { COMPONENT_TYPES } from '../constants/circuitComponents.jsx';

// Validate circuit and return errors/warnings
export function validateCircuit(components, connections) {
  const errors = [];
  const warnings = [];

  // Check for at least one battery
  const batteries = components.filter(c => c.type === COMPONENT_TYPES.BATTERY);
  if (batteries.length === 0) {
    errors.push({
      type: 'NO_BATTERY',
      message: 'Add at least one battery to power the circuit',
      severity: 'error',
    });
  }

  // Check for disconnected components
  const disconnectedComponents = findDisconnectedComponents(components, connections);
  if (disconnectedComponents.length > 0) {
    warnings.push({
      type: 'DISCONNECTED_COMPONENTS',
      message: `${disconnectedComponents.length} component(s) not connected to circuit`,
      severity: 'warning',
      components: disconnectedComponents,
    });
  }

  // Check for short circuits (battery directly to battery with no resistance)
  const shortCircuit = detectShortCircuit(components, connections);
  if (shortCircuit) {
    errors.push({
      type: 'SHORT_CIRCUIT',
      message: 'Short circuit detected! This will drain the battery instantly.',
      severity: 'error',
      path: shortCircuit.path,
    });
  }

  // Check for closed loops
  const loops = findClosedLoops(components, connections);
  if (loops.length === 0 && components.length > 0 && connections.length > 0) {
    warnings.push({
      type: 'OPEN_CIRCUIT',
      message: 'Circuit is open - no closed path for current flow',
      severity: 'warning',
    });
  }

  // Check for open switches in all loops
  const hasClosedLoop = loops.some(loop => !hasOpenSwitch(loop, components));
  if (!hasClosedLoop && loops.length > 0) {
    warnings.push({
      type: 'ALL_SWITCHES_OPEN',
      message: 'All switches are open - no current will flow',
      severity: 'info',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasCompletedCircuit: errors.length === 0 && loops.length > 0 && hasClosedLoop,
  };
}

// Find disconnected components
function findDisconnectedComponents(components, connections) {
  if (components.length === 0) return [];

  // Build adjacency list
  const adjacency = new Map();
  components.forEach(comp => {
    adjacency.set(comp.id, new Set());
  });

  connections.forEach(conn => {
    adjacency.get(conn.from.componentId)?.add(conn.to.componentId);
    adjacency.get(conn.to.componentId)?.add(conn.from.componentId);
  });

  // Find the largest connected component using DFS
  const visited = new Set();
  let largestComponent = [];

  const dfs = (componentId, current) => {
    if (visited.has(componentId)) return;
    visited.add(componentId);
    current.push(componentId);

    const neighbors = adjacency.get(componentId);
    if (neighbors) {
      neighbors.forEach(neighbor => dfs(neighbor, current));
    }
  };

  components.forEach(comp => {
    if (!visited.has(comp.id)) {
      const current = [];
      dfs(comp.id, current);
      if (current.length > largestComponent.length) {
        largestComponent = current;
      }
    }
  });

  // Components not in the largest connected component are disconnected
  const largestSet = new Set(largestComponent);
  return components.filter(comp => !largestSet.has(comp.id)).map(comp => comp.id);
}

// Detect short circuits (direct battery-to-battery connection with total resistance ≈ 0)
function detectShortCircuit(components, connections) {
  // Find all loops
  const loops = findClosedLoops(components, connections);

  for (const loop of loops) {
    // Check if loop has batteries
    const loopBatteries = loop.filter(compId =>
      components.find(c => c.id === compId)?.type === COMPONENT_TYPES.BATTERY
    );

    if (loopBatteries.length === 0) continue;

    // Calculate total resistance in loop
    let totalResistance = 0;
    let hasResistiveElement = false;

    loop.forEach(compId => {
      const comp = components.find(c => c.id === compId);
      if (!comp) return;

      if (comp.type === COMPONENT_TYPES.RESISTOR || comp.type === COMPONENT_TYPES.LAMP) {
        totalResistance += comp.properties.resistance || 0;
        hasResistiveElement = true;
      }
    });

    // Short circuit if resistance is very low (< 1 ohm) or no resistive elements
    if (totalResistance < 1 && !hasResistiveElement) {
      return {
        path: loop,
        resistance: totalResistance,
      };
    }
  }

  return null;
}

// Find all closed loops in the circuit using DFS
function findClosedLoops(components, connections) {
  if (connections.length === 0) return [];

  // Build adjacency list
  const adjacency = new Map();
  components.forEach(comp => {
    adjacency.set(comp.id, []);
  });

  connections.forEach(conn => {
    adjacency.get(conn.from.componentId)?.push(conn.to.componentId);
    adjacency.get(conn.to.componentId)?.push(conn.from.componentId);
  });

  const loops = [];
  const visited = new Set();
  const recursionStack = new Set();

  const dfs = (componentId, parent, path) => {
    visited.add(componentId);
    recursionStack.add(componentId);
    path.push(componentId);

    const neighbors = adjacency.get(componentId) || [];
    for (const neighbor of neighbors) {
      if (neighbor === parent) continue; // Skip immediate parent to avoid false loop detection

      if (recursionStack.has(neighbor)) {
        // Found a loop
        const loopStartIndex = path.indexOf(neighbor);
        const loop = path.slice(loopStartIndex);
        loops.push([...loop]);
      } else if (!visited.has(neighbor)) {
        dfs(neighbor, componentId, [...path]);
      }
    }

    recursionStack.delete(componentId);
  };

  // Start DFS from each unvisited component
  components.forEach(comp => {
    if (!visited.has(comp.id)) {
      dfs(comp.id, null, []);
    }
  });

  // Remove duplicate loops
  const uniqueLoops = [];
  const loopSignatures = new Set();

  loops.forEach(loop => {
    const sorted = [...loop].sort();
    const signature = sorted.join(',');

    if (!loopSignatures.has(signature)) {
      loopSignatures.add(signature);
      uniqueLoops.push(loop);
    }
  });

  return uniqueLoops;
}

// Check if a loop has an open switch
function hasOpenSwitch(loop, components) {
  return loop.some(compId => {
    const comp = components.find(c => c.id === compId);
    return comp && comp.type === COMPONENT_TYPES.SWITCH && !comp.properties.closed;
  });
}

// Check if circuit can conduct (has battery and closed loop)
export function canCircuitConduct(components, connections) {
  const validation = validateCircuit(components, connections);
  return validation.hasCompletedCircuit;
}

// Get circuit topology information
export function getCircuitTopology(components, connections) {
  const loops = findClosedLoops(components, connections);
  const disconnected = findDisconnectedComponents(components, connections);

  return {
    loops,
    disconnectedComponents: disconnected,
    isConnected: disconnected.length === 0,
    hasLoops: loops.length > 0,
  };
}
