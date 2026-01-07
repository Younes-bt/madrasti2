// Save/load circuit functionality with localStorage and JSON export/import

const STORAGE_KEY = 'madrasti_circuits';

// Save circuit to localStorage
export function saveCircuit(circuitState, metadata = {}) {
  const circuits = loadAllCircuits();

  const newCircuit = {
    id: `circuit_${Date.now()}`,
    ...circuitState,
    metadata: {
      name: metadata.name || 'Untitled Circuit',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      ...metadata,
    },
  };

  circuits.push(newCircuit);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
    return { success: true, circuit: newCircuit };
  } catch (error) {
    console.error('Failed to save circuit:', error);
    return { success: false, error: error.message };
  }
}

// Load all circuits from localStorage
export function loadAllCircuits() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load circuits:', error);
    return [];
  }
}

// Load a specific circuit by ID
export function loadCircuit(circuitId) {
  const circuits = loadAllCircuits();
  return circuits.find(c => c.id === circuitId) || null;
}

// Update an existing circuit
export function updateCircuit(circuitId, circuitState, metadata = {}) {
  const circuits = loadAllCircuits();
  const index = circuits.findIndex(c => c.id === circuitId);

  if (index === -1) {
    return { success: false, error: 'Circuit not found' };
  }

  circuits[index] = {
    ...circuits[index],
    ...circuitState,
    metadata: {
      ...circuits[index].metadata,
      ...metadata,
      modified: new Date().toISOString(),
    },
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
    return { success: true, circuit: circuits[index] };
  } catch (error) {
    console.error('Failed to update circuit:', error);
    return { success: false, error: error.message };
  }
}

// Delete a circuit
export function deleteCircuit(circuitId) {
  const circuits = loadAllCircuits();
  const filtered = circuits.filter(c => c.id !== circuitId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete circuit:', error);
    return { success: false, error: error.message };
  }
}

// Export circuit as JSON file
export function exportCircuitJSON(circuitState, metadata = {}) {
  const exportData = {
    version: '1.0',
    ...circuitState,
    metadata: {
      name: metadata.name || 'Exported Circuit',
      exported: new Date().toISOString(),
      ...metadata,
    },
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `circuit_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { success: true };
}

// Import circuit from JSON file
export function importCircuitJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.includes('json')) {
      reject(new Error('Please select a valid JSON file'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate circuit data
        if (!data.components || !Array.isArray(data.components)) {
          reject(new Error('Invalid circuit file: missing components'));
          return;
        }

        if (!data.connections || !Array.isArray(data.connections)) {
          reject(new Error('Invalid circuit file: missing connections'));
          return;
        }

        resolve({
          components: data.components,
          connections: data.connections,
          metadata: data.metadata || {},
        });
      } catch (error) {
        reject(new Error('Failed to parse circuit file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

// Example circuits for students
export const EXAMPLE_CIRCUITS = [
  {
    id: 'example_simple_series',
    name: 'Simple Series Circuit',
    nameAr: 'دائرة توالي بسيطة',
    nameFr: 'Circuit simple en série',
    description: 'Battery → Resistor → Lamp (basic series connection)',
    components: [
      {
        id: 'battery_1',
        type: 'battery',
        position: { x: 200, y: 300 },
        rotation: 0,
        properties: { voltage: 9 },
        terminals: [
          { id: 't1', position: { x: 0, y: -40 }, label: '+', connectedTo: 'conn_1' },
          { id: 't2', position: { x: 0, y: 40 }, label: '-', connectedTo: 'conn_3' },
        ],
      },
      {
        id: 'resistor_1',
        type: 'resistor',
        position: { x: 400, y: 200 },
        rotation: 0,
        properties: { resistance: 100 },
        terminals: [
          { id: 't1', position: { x: -40, y: 0 }, label: '', connectedTo: 'conn_1' },
          { id: 't2', position: { x: 40, y: 0 }, label: '', connectedTo: 'conn_2' },
        ],
      },
      {
        id: 'lamp_1',
        type: 'lamp',
        position: { x: 600, y: 300 },
        rotation: 0,
        properties: { resistance: 50, minVoltage: 1.5, maxCurrent: 0.2, brightness: 0, burnedOut: false },
        terminals: [
          { id: 't1', position: { x: 0, y: -30 }, label: '', connectedTo: 'conn_2' },
          { id: 't2', position: { x: 0, y: 30 }, label: '', connectedTo: 'conn_3' },
        ],
      },
    ],
    connections: [
      {
        id: 'conn_1',
        from: { componentId: 'battery_1', terminalId: 't1' },
        to: { componentId: 'resistor_1', terminalId: 't1' },
        points: [{ x: 200, y: 260 }, { x: 360, y: 200 }],
      },
      {
        id: 'conn_2',
        from: { componentId: 'resistor_1', terminalId: 't2' },
        to: { componentId: 'lamp_1', terminalId: 't1' },
        points: [{ x: 440, y: 200 }, { x: 600, y: 270 }],
      },
      {
        id: 'conn_3',
        from: { componentId: 'lamp_1', terminalId: 't2' },
        to: { componentId: 'battery_1', terminalId: 't2' },
        points: [{ x: 600, y: 330 }, { x: 200, y: 340 }],
      },
    ],
    metadata: {
      name: 'Simple Series Circuit',
      created: '2025-12-29',
    },
  },
  {
    id: 'example_switch_control',
    name: 'Switch Control',
    nameAr: 'التحكم بالمفتاح',
    nameFr: 'Contrôle par interrupteur',
    description: 'Battery → Switch → Lamp (demonstrate switch control)',
    components: [
      {
        id: 'battery_1',
        type: 'battery',
        position: { x: 200, y: 300 },
        rotation: 0,
        properties: { voltage: 9 },
        terminals: [
          { id: 't1', position: { x: 0, y: -40 }, label: '+', connectedTo: 'conn_1' },
          { id: 't2', position: { x: 0, y: 40 }, label: '-', connectedTo: 'conn_3' },
        ],
      },
      {
        id: 'switch_1',
        type: 'switch',
        position: { x: 400, y: 200 },
        rotation: 0,
        properties: { closed: true },
        terminals: [
          { id: 't1', position: { x: -30, y: 0 }, label: '', connectedTo: 'conn_1' },
          { id: 't2', position: { x: 30, y: 0 }, label: '', connectedTo: 'conn_2' },
        ],
      },
      {
        id: 'lamp_1',
        type: 'lamp',
        position: { x: 600, y: 300 },
        rotation: 0,
        properties: { resistance: 50, minVoltage: 1.5, maxCurrent: 0.2, brightness: 0, burnedOut: false },
        terminals: [
          { id: 't1', position: { x: 0, y: -30 }, label: '', connectedTo: 'conn_2' },
          { id: 't2', position: { x: 0, y: 30 }, label: '', connectedTo: 'conn_3' },
        ],
      },
    ],
    connections: [
      {
        id: 'conn_1',
        from: { componentId: 'battery_1', terminalId: 't1' },
        to: { componentId: 'switch_1', terminalId: 't1' },
        points: [{ x: 200, y: 260 }, { x: 370, y: 200 }],
      },
      {
        id: 'conn_2',
        from: { componentId: 'switch_1', terminalId: 't2' },
        to: { componentId: 'lamp_1', terminalId: 't1' },
        points: [{ x: 430, y: 200 }, { x: 600, y: 270 }],
      },
      {
        id: 'conn_3',
        from: { componentId: 'lamp_1', terminalId: 't2' },
        to: { componentId: 'battery_1', terminalId: 't2' },
        points: [{ x: 600, y: 330 }, { x: 200, y: 340 }],
      },
    ],
    metadata: {
      name: 'Switch Control',
      created: '2025-12-29',
    },
  },
];

// Get example circuit by ID
export function getExampleCircuit(exampleId) {
  return EXAMPLE_CIRCUITS.find(ex => ex.id === exampleId) || null;
}
