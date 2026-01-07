import { useState, useCallback } from 'react';
import {
  COMPONENT_TYPES,
  DEFAULT_PROPERTIES,
  COMPONENT_TERMINALS,
} from '../constants/circuitComponents.jsx';

// Generate unique IDs
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create a new component
const createComponent = (type, position, rotation = 0) => {
  const terminals = COMPONENT_TERMINALS[type].map(terminal => ({
    ...terminal,
    connectedTo: null,
  }));

  return {
    id: generateId('comp'),
    type,
    position,
    rotation,
    properties: { ...DEFAULT_PROPERTIES[type] },
    terminals,
  };
};

// Create a new connection
const createConnection = (from, to, points) => ({
  id: generateId('conn'),
  from, // { componentId, terminalId }
  to,   // { componentId, terminalId }
  points: points || [from.position, to.position],
});

export function useCircuitState() {
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'component' | 'connection'

  // Add a component to the canvas
  const addComponent = useCallback((type, position, rotation = 0) => {
    const newComponent = createComponent(type, position, rotation);
    setComponents(prev => [...prev, newComponent]);
    setSelectedId(newComponent.id);
    setSelectedType('component');
    return newComponent;
  }, []);

  // Update a component
  const updateComponent = useCallback((componentId, updates) => {
    setComponents(prev => prev.map(comp =>
      comp.id === componentId
        ? { ...comp, ...updates }
        : comp
    ));
  }, []);

  // Update component properties
  const updateComponentProperties = useCallback((componentId, properties) => {
    setComponents(prev => prev.map(comp =>
      comp.id === componentId
        ? { ...comp, properties: { ...comp.properties, ...properties } }
        : comp
    ));
  }, []);

  // Update component position
  const updateComponentPosition = useCallback((componentId, position) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === componentId) {
        // Also update any connected wires
        return { ...comp, position };
      }
      return comp;
    }));

    // Update connection points for wires connected to this component
    setConnections(prev => prev.map(conn => {
      const component = components.find(c => c.id === componentId);
      if (!component) return conn;

      const newPoints = [...conn.points];

      if (conn.from.componentId === componentId) {
        const terminal = component.terminals.find(t => t.id === conn.from.terminalId);
        if (terminal) {
          newPoints[0] = {
            x: position.x + terminal.position.x,
            y: position.y + terminal.position.y,
          };
        }
      }

      if (conn.to.componentId === componentId) {
        const terminal = component.terminals.find(t => t.id === conn.to.terminalId);
        if (terminal) {
          newPoints[newPoints.length - 1] = {
            x: position.x + terminal.position.x,
            y: position.y + terminal.position.y,
          };
        }
      }

      return { ...conn, points: newPoints };
    }));
  }, [components]);

  // Rotate a component
  const rotateComponent = useCallback((componentId) => {
    setComponents(prev => prev.map(comp =>
      comp.id === componentId
        ? { ...comp, rotation: (comp.rotation + 90) % 360 }
        : comp
    ));
  }, []);

  // Delete a component
  const deleteComponent = useCallback((componentId) => {
    // Remove the component
    setComponents(prev => prev.filter(comp => comp.id !== componentId));

    // Remove any connections to this component
    setConnections(prev => prev.filter(conn =>
      conn.from.componentId !== componentId && conn.to.componentId !== componentId
    ));

    // Clear selection if this component was selected
    if (selectedId === componentId) {
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [selectedId]);

  // Add a connection
  const addConnection = useCallback((from, to, points = null) => {
    // Validate that we're not connecting a terminal to itself
    if (from.componentId === to.componentId && from.terminalId === to.terminalId) {
      return null;
    }

    // Check if this connection already exists
    const existingConnection = connections.find(conn =>
      (conn.from.componentId === from.componentId && conn.from.terminalId === from.terminalId &&
       conn.to.componentId === to.componentId && conn.to.terminalId === to.terminalId) ||
      (conn.from.componentId === to.componentId && conn.from.terminalId === to.terminalId &&
       conn.to.componentId === from.componentId && conn.to.terminalId === from.terminalId)
    );

    if (existingConnection) {
      return null;
    }

    // Calculate terminal positions if points not provided
    let connectionPoints = points;
    if (!connectionPoints) {
      const fromComp = components.find(c => c.id === from.componentId);
      const toComp = components.find(c => c.id === to.componentId);

      if (fromComp && toComp) {
        const fromTerminal = fromComp.terminals.find(t => t.id === from.terminalId);
        const toTerminal = toComp.terminals.find(t => t.id === to.terminalId);

        if (fromTerminal && toTerminal) {
          connectionPoints = [
            {
              x: fromComp.position.x + fromTerminal.position.x,
              y: fromComp.position.y + fromTerminal.position.y,
            },
            {
              x: toComp.position.x + toTerminal.position.x,
              y: toComp.position.y + toTerminal.position.y,
            },
          ];
        }
      }
    }

    const newConnection = createConnection(from, to, connectionPoints);
    setConnections(prev => [...prev, newConnection]);
    setSelectedId(newConnection.id);
    setSelectedType('connection');

    // Update terminal connected status
    setComponents(prev => prev.map(comp => {
      if (comp.id === from.componentId || comp.id === to.componentId) {
        return {
          ...comp,
          terminals: comp.terminals.map(terminal => {
            if (comp.id === from.componentId && terminal.id === from.terminalId) {
              return { ...terminal, connectedTo: newConnection.id };
            }
            if (comp.id === to.componentId && terminal.id === to.terminalId) {
              return { ...terminal, connectedTo: newConnection.id };
            }
            return terminal;
          }),
        };
      }
      return comp;
    }));

    return newConnection;
  }, [components, connections]);

  // Delete a connection
  const deleteConnection = useCallback((connectionId) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    // Remove the connection
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));

    // Update terminal connected status
    setComponents(prev => prev.map(comp => ({
      ...comp,
      terminals: comp.terminals.map(terminal =>
        terminal.connectedTo === connectionId
          ? { ...terminal, connectedTo: null }
          : terminal
      ),
    })));

    // Clear selection if this connection was selected
    if (selectedId === connectionId) {
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [connections, selectedId]);

  // Clear all components and connections
  const clearCircuit = useCallback(() => {
    setComponents([]);
    setConnections([]);
    setSelectedId(null);
    setSelectedType(null);
  }, []);

  // Load circuit state
  const loadCircuitState = useCallback((state) => {
    setComponents(state.components || []);
    setConnections(state.connections || []);
    setSelectedId(null);
    setSelectedType(null);
  }, []);

  // Get circuit state for saving
  const getCircuitState = useCallback(() => ({
    components,
    connections,
  }), [components, connections]);

  // Get selected component or connection
  const getSelected = useCallback(() => {
    if (!selectedId || !selectedType) return null;

    if (selectedType === 'component') {
      return components.find(c => c.id === selectedId);
    } else if (selectedType === 'connection') {
      return connections.find(c => c.id === connectionId);
    }

    return null;
  }, [selectedId, selectedType, components, connections]);

  // Select a component or connection
  const select = useCallback((id, type) => {
    setSelectedId(id);
    setSelectedType(type);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setSelectedType(null);
  }, []);

  // Get component by ID
  const getComponent = useCallback((componentId) => {
    return components.find(c => c.id === componentId);
  }, [components]);

  // Get connection by ID
  const getConnection = useCallback((connectionId) => {
    return connections.find(c => c.id === connectionId);
  }, [connections]);

  // Get all connections for a component
  const getComponentConnections = useCallback((componentId) => {
    return connections.filter(conn =>
      conn.from.componentId === componentId || conn.to.componentId === componentId
    );
  }, [connections]);

  // Check if a terminal is connected
  const isTerminalConnected = useCallback((componentId, terminalId) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return false;

    const terminal = component.terminals.find(t => t.id === terminalId);
    return terminal && terminal.connectedTo !== null;
  }, [components]);

  return {
    // State
    components,
    connections,
    selectedId,
    selectedType,

    // Component operations
    addComponent,
    updateComponent,
    updateComponentProperties,
    updateComponentPosition,
    rotateComponent,
    deleteComponent,
    getComponent,

    // Connection operations
    addConnection,
    deleteConnection,
    getConnection,
    getComponentConnections,
    isTerminalConnected,

    // Selection operations
    select,
    clearSelection,
    getSelected,

    // Circuit operations
    clearCircuit,
    loadCircuitState,
    getCircuitState,
  };
}
