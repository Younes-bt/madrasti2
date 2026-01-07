import React, { useState, useRef, useCallback } from 'react';
import {
  COMPONENT_RENDERERS,
  GRID_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TERMINAL_RADIUS,
  WIRE_STYLES,
} from '../constants/circuitComponents.jsx';
import CurrentFlowAnimation from './CurrentFlowAnimation';

// Snap position to grid
const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

// Convert screen coordinates to SVG coordinates
const getSVGPoint = (svg, clientX, clientY) => {
  const CTM = svg.getScreenCTM();
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const svgPoint = point.matrixTransform(CTM.inverse());
  return {
    x: snapToGrid(svgPoint.x),
    y: snapToGrid(svgPoint.y),
  };
};

// Calculate distance between two points
const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const CircuitCanvas = ({
  components,
  connections,
  selectedId,
  selectedType,
  onSelectComponent,
  onSelectConnection,
  onUpdateComponentPosition,
  onAddConnection,
  isSimulating,
  currentFlows,
  simulationResult,
}) => {
  const svgRef = useRef(null);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [hoveredTerminal, setHoveredTerminal] = useState(null);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionPreview, setConnectionPreview] = useState(null);

  // Handle component drag start
  const handleComponentPointerDown = useCallback((e, component) => {
    if (isSimulating) return; // Don't allow dragging during simulation

    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;

    const point = getSVGPoint(svg, e.clientX, e.clientY);
    setDraggedComponent(component.id);
    setDragOffset({
      x: point.x - component.position.x,
      y: point.y - component.position.y,
    });
    onSelectComponent(component.id);
  }, [isSimulating, onSelectComponent]);

  // Handle pointer move (drag or connection preview)
  const handlePointerMove = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;

    const point = getSVGPoint(svg, e.clientX, e.clientY);

    // Handle component dragging
    if (draggedComponent) {
      const newPosition = {
        x: snapToGrid(point.x - dragOffset.x),
        y: snapToGrid(point.y - dragOffset.y),
      };

      // Keep component within bounds
      newPosition.x = Math.max(50, Math.min(CANVAS_WIDTH - 50, newPosition.x));
      newPosition.y = Math.max(50, Math.min(CANVAS_HEIGHT - 50, newPosition.y));

      onUpdateComponentPosition(draggedComponent, newPosition);
    }

    // Handle connection preview
    if (connectionStart) {
      setConnectionPreview({
        from: connectionStart.position,
        to: point,
      });
    }
  }, [draggedComponent, dragOffset, onUpdateComponentPosition, connectionStart]);

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    setDraggedComponent(null);
    setConnectionPreview(null);

    // Complete connection if we're over a terminal
    if (connectionStart && hoveredTerminal) {
      // Don't connect to the same component
      if (connectionStart.componentId !== hoveredTerminal.componentId) {
        onAddConnection(
          {
            componentId: connectionStart.componentId,
            terminalId: connectionStart.terminalId,
          },
          {
            componentId: hoveredTerminal.componentId,
            terminalId: hoveredTerminal.terminalId,
          }
        );
      }
      setConnectionStart(null);
      setHoveredTerminal(null);
    } else if (connectionStart) {
      // Cancel connection if not over a terminal
      setConnectionStart(null);
    }
  }, [connectionStart, hoveredTerminal, onAddConnection]);

  // Handle terminal click (start or end connection)
  const handleTerminalClick = useCallback((e, component, terminal) => {
    e.stopPropagation();

    if (isSimulating) return; // Don't allow connections during simulation

    const terminalPosition = {
      x: component.position.x + terminal.position.x,
      y: component.position.y + terminal.position.y,
    };

    if (connectionStart) {
      // End connection
      if (connectionStart.componentId !== component.id) {
        onAddConnection(
          {
            componentId: connectionStart.componentId,
            terminalId: connectionStart.terminalId,
          },
          {
            componentId: component.id,
            terminalId: terminal.id,
          }
        );
      }
      setConnectionStart(null);
    } else {
      // Start connection
      setConnectionStart({
        componentId: component.id,
        terminalId: terminal.id,
        position: terminalPosition,
      });
    }
  }, [connectionStart, isSimulating, onAddConnection]);

  // Handle canvas click (clear selection)
  const handleCanvasClick = useCallback((e) => {
    if (e.target === svgRef.current || e.target.tagName === 'rect') {
      if (connectionStart) {
        setConnectionStart(null);
      }
      // Note: We don't clear selection here to allow properties panel to stay open
    }
  }, [connectionStart]);

  // Render grid pattern
  const renderGrid = () => (
    <defs>
      <pattern
        id="grid"
        width={GRID_SIZE}
        height={GRID_SIZE}
        patternUnits="userSpaceOnUse"
      >
        <rect width={GRID_SIZE} height={GRID_SIZE} fill="none" />
        <circle cx={GRID_SIZE / 2} cy={GRID_SIZE / 2} r="1" fill="#e2e8f0" />
      </pattern>
    </defs>
  );

  // Render a connection wire
  const renderConnection = (connection) => {
    const isSelected = selectedType === 'connection' && selectedId === connection.id;
    const isActive = isSimulating && currentFlows.some(flow =>
      flow.path.includes(connection.from.componentId) &&
      flow.path.includes(connection.to.componentId)
    );

    const style = isActive ? WIRE_STYLES.active : isSelected ? WIRE_STYLES.hovered : WIRE_STYLES.default;

    // Build path string from points
    const pathData = connection.points.map((point, index) =>
      index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
    ).join(' ');

    return (
      <g key={connection.id}>
        <path
          d={pathData}
          fill="none"
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          strokeLinecap="round"
          className={isActive ? 'wire-active' : ''}
          style={{
            filter: isActive ? 'drop-shadow(0 0 4px #3b82f6)' : 'none',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectConnection(connection.id);
          }}
        />
      </g>
    );
  };

  // Render a component
  const renderComponent = (component) => {
    const isSelected = selectedType === 'component' && selectedId === component.id;
    const isHovered = hoveredComponent === component.id;
    const isDragging = draggedComponent === component.id;

    const renderer = COMPONENT_RENDERERS[component.type];
    if (!renderer) return null;

    // Get brightness from simulation result for lamps
    const brightness = simulationResult?.componentVoltages?.[component.id]
      ? component.properties.brightness || 0
      : 0;

    return (
      <g
        key={component.id}
        transform={`translate(${component.position.x}, ${component.position.y}) rotate(${component.rotation || 0})`}
        style={{
          cursor: isSimulating ? 'default' : 'move',
          opacity: isDragging ? 0.7 : 1,
        }}
        onPointerDown={(e) => handleComponentPointerDown(e, component)}
        onPointerEnter={() => setHoveredComponent(component.id)}
        onPointerLeave={() => setHoveredComponent(null)}
      >
        {/* Render component symbol */}
        {renderer({
          selected: isSelected,
          hovered: isHovered,
          ...component.properties,
          brightness,
        })}

        {/* Render terminals */}
        {component.terminals.map((terminal) => {
          const terminalHovered = hoveredTerminal?.componentId === component.id &&
            hoveredTerminal?.terminalId === terminal.id;
          const isConnecting = connectionStart?.componentId === component.id &&
            connectionStart?.terminalId === terminal.id;

          return (
            <circle
              key={terminal.id}
              cx={terminal.position.x}
              cy={terminal.position.y}
              r={TERMINAL_RADIUS}
              fill={isConnecting ? '#10b981' : terminalHovered ? '#60a5fa' : terminal.connectedTo ? '#3b82f6' : '#94a3b8'}
              stroke="#fff"
              strokeWidth="2"
              style={{
                cursor: isSimulating ? 'default' : 'pointer',
                opacity: isSimulating ? 0.3 : 0.8,
              }}
              onClick={(e) => handleTerminalClick(e, component, terminal)}
              onPointerEnter={() => setHoveredTerminal({
                componentId: component.id,
                terminalId: terminal.id,
              })}
              onPointerLeave={() => setHoveredTerminal(null)}
            />
          );
        })}
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={CANVAS_HEIGHT}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className="bg-white border border-gray-200"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleCanvasClick}
      style={{ touchAction: 'none' }}
    >
      {/* Grid pattern */}
      {renderGrid()}
      <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid)" />

      {/* Connections (drawn first, behind components) */}
      {connections.map(renderConnection)}

      {/* Connection preview */}
      {connectionPreview && (
        <line
          x1={connectionPreview.from.x}
          y1={connectionPreview.from.y}
          x2={connectionPreview.to.x}
          y2={connectionPreview.to.y}
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
      )}

      {/* Components */}
      {components.map(renderComponent)}

      {/* Current flow animations */}
      {isSimulating && currentFlows.map((flow, index) => (
        <CurrentFlowAnimation
          key={`flow-${index}`}
          flow={flow}
          components={components}
          connections={connections}
        />
      ))}

      {/* Help text when empty */}
      {components.length === 0 && (
        <g>
          <text
            x={CANVAS_WIDTH / 2}
            y={CANVAS_HEIGHT / 2 - 20}
            textAnchor="middle"
            fontSize="20"
            fill="#94a3b8"
            fontWeight="600"
          >
            Drag components from the palette to get started
          </text>
          <text
            x={CANVAS_WIDTH / 2}
            y={CANVAS_HEIGHT / 2 + 10}
            textAnchor="middle"
            fontSize="14"
            fill="#cbd5e1"
          >
            Then click on terminals to connect them with wires
          </text>
        </g>
      )}
    </svg>
  );
};

export default CircuitCanvas;
