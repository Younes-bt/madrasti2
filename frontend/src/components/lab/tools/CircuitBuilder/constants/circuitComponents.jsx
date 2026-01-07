// Circuit component definitions, properties, and SVG symbols
import React from 'react';

export const COMPONENT_TYPES = {
  BATTERY: 'battery',
  RESISTOR: 'resistor',
  LAMP: 'lamp',
  SWITCH: 'switch',
};

// Default properties for each component type
export const DEFAULT_PROPERTIES = {
  [COMPONENT_TYPES.BATTERY]: {
    voltage: 9, // Volts
  },
  [COMPONENT_TYPES.RESISTOR]: {
    resistance: 100, // Ohms
  },
  [COMPONENT_TYPES.LAMP]: {
    resistance: 50, // Ohms
    minVoltage: 1.5, // Minimum voltage to light up
    maxCurrent: 0.2, // Maximum current before burnout (Amperes)
    brightness: 0, // 0-100% (calculated)
    burnedOut: false,
  },
  [COMPONENT_TYPES.SWITCH]: {
    closed: true, // true = closed, false = open
  },
};

// Component visual dimensions
export const COMPONENT_DIMENSIONS = {
  [COMPONENT_TYPES.BATTERY]: {
    width: 60,
    height: 80,
  },
  [COMPONENT_TYPES.RESISTOR]: {
    width: 80,
    height: 40,
  },
  [COMPONENT_TYPES.LAMP]: {
    width: 60,
    height: 60,
  },
  [COMPONENT_TYPES.SWITCH]: {
    width: 60,
    height: 40,
  },
};

// Terminal positions relative to component center
export const COMPONENT_TERMINALS = {
  [COMPONENT_TYPES.BATTERY]: [
    { id: 't1', position: { x: 0, y: -40 }, label: '+' },
    { id: 't2', position: { x: 0, y: 40 }, label: '-' },
  ],
  [COMPONENT_TYPES.RESISTOR]: [
    { id: 't1', position: { x: -40, y: 0 }, label: '' },
    { id: 't2', position: { x: 40, y: 0 }, label: '' },
  ],
  [COMPONENT_TYPES.LAMP]: [
    { id: 't1', position: { x: 0, y: -30 }, label: '' },
    { id: 't2', position: { x: 0, y: 30 }, label: '' },
  ],
  [COMPONENT_TYPES.SWITCH]: [
    { id: 't1', position: { x: -30, y: 0 }, label: '' },
    { id: 't2', position: { x: 30, y: 0 }, label: '' },
  ],
};

// Component palette metadata
export const COMPONENT_PALETTE = [
  {
    type: COMPONENT_TYPES.BATTERY,
    name: 'Battery',
    nameAr: 'بطارية',
    nameFr: 'Batterie',
    icon: 'battery-charging',
    description: 'Power source (voltage)',
    color: '#10b981', // green
  },
  {
    type: COMPONENT_TYPES.RESISTOR,
    name: 'Resistor',
    nameAr: 'مقاومة',
    nameFr: 'Résistance',
    icon: 'minus',
    description: 'Resists current flow',
    color: '#f59e0b', // amber
  },
  {
    type: COMPONENT_TYPES.LAMP,
    name: 'Lamp',
    nameAr: 'مصباح',
    nameFr: 'Lampe',
    icon: 'lightbulb',
    description: 'Light indicator',
    color: '#eab308', // yellow
  },
  {
    type: COMPONENT_TYPES.SWITCH,
    name: 'Switch',
    nameAr: 'مفتاح',
    nameFr: 'Interrupteur',
    icon: 'toggle-right',
    description: 'Circuit control',
    color: '#6366f1', // indigo
  },
];

// SVG rendering functions for each component
export const renderBatterySVG = (props = {}) => {
  const { selected = false, hovered = false } = props;
  const strokeColor = selected ? '#3b82f6' : hovered ? '#60a5fa' : 'currentColor';
  const strokeWidth = selected || hovered ? 2.5 : 2;

  return (
    <g className="battery-symbol">
      {/* Top terminal */}
      <line
        x1="0" y1="-40" x2="0" y2="-20"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Positive plate (long) */}
      <rect
        x="-20" y="-20" width="40" height="8"
        fill={strokeColor}
        rx="1"
      />
      {/* Negative plate (short) */}
      <rect
        x="-12" y="-5" width="24" height="6"
        fill={strokeColor}
        rx="1"
      />
      {/* Bottom terminal */}
      <line
        x1="0" y1="1" x2="0" y2="40"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* + and - labels */}
      <text
        x="25" y="-10"
        fontSize="14"
        fontWeight="bold"
        fill={strokeColor}
        textAnchor="middle"
      >
        +
      </text>
      <text
        x="-25" y="5"
        fontSize="14"
        fontWeight="bold"
        fill={strokeColor}
        textAnchor="middle"
      >
        −
      </text>
      {/* Selection indicator */}
      {selected && (
        <rect
          x="-30" y="-45" width="60" height="90"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4 2"
          rx="4"
        />
      )}
    </g>
  );
};

export const renderResistorSVG = (props = {}) => {
  const { selected = false, hovered = false } = props;
  const strokeColor = selected ? '#3b82f6' : hovered ? '#60a5fa' : 'currentColor';
  const strokeWidth = selected || hovered ? 2.5 : 2;

  return (
    <g className="resistor-symbol">
      {/* Left terminal */}
      <line
        x1="-40" y1="0" x2="-20" y2="0"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Resistor body (zigzag pattern) */}
      <path
        d="M -20,0 L -15,-8 L -10,8 L -5,-8 L 0,8 L 5,-8 L 10,8 L 15,-8 L 20,0"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right terminal */}
      <line
        x1="20" y1="0" x2="40" y2="0"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Selection indicator */}
      {selected && (
        <rect
          x="-45" y="-15" width="90" height="30"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4 2"
          rx="4"
        />
      )}
    </g>
  );
};

export const renderLampSVG = (props = {}) => {
  const { selected = false, hovered = false, brightness = 0, burnedOut = false } = props;
  const strokeColor = selected ? '#3b82f6' : hovered ? '#60a5fa' : 'currentColor';
  const strokeWidth = selected || hovered ? 2.5 : 2;

  // Calculate glow intensity
  const glowOpacity = brightness / 100;
  const glowRadius = 20 + (brightness / 100) * 10;

  return (
    <g className="lamp-symbol">
      {/* Top terminal */}
      <line
        x1="0" y1="-30" x2="0" y2="-20"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Outer glow (when bright) */}
      {brightness > 30 && !burnedOut && (
        <circle
          cx="0" cy="0" r={glowRadius}
          fill={`rgba(255, 255, 0, ${glowOpacity * 0.3})`}
          filter="blur(8px)"
        />
      )}

      {/* Lamp bulb */}
      <circle
        cx="0" cy="0" r="20"
        fill={burnedOut ? '#6b7280' : brightness > 0 ? `rgba(255, 255, 0, ${glowOpacity})` : 'none'}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Filament (X pattern) */}
      <line
        x1="-12" y1="-12" x2="12" y2="12"
        stroke={burnedOut ? '#ef4444' : strokeColor}
        strokeWidth={burnedOut ? 3 : 1.5}
        strokeLinecap="round"
      />
      <line
        x1="-12" y1="12" x2="12" y2="-12"
        stroke={burnedOut ? '#ef4444' : strokeColor}
        strokeWidth={burnedOut ? 3 : 1.5}
        strokeLinecap="round"
      />

      {/* Bottom terminal */}
      <line
        x1="0" y1="20" x2="0" y2="30"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Burned out indicator */}
      {burnedOut && (
        <text
          x="0" y="50"
          fontSize="10"
          fill="#ef4444"
          textAnchor="middle"
          fontWeight="bold"
        >
          BURNED
        </text>
      )}

      {/* Selection indicator */}
      {selected && (
        <rect
          x="-35" y="-35" width="70" height="70"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4 2"
          rx="4"
        />
      )}
    </g>
  );
};

export const renderSwitchSVG = (props = {}) => {
  const { selected = false, hovered = false, closed = true } = props;
  const strokeColor = selected ? '#3b82f6' : hovered ? '#60a5fa' : 'currentColor';
  const strokeWidth = selected || hovered ? 2.5 : 2;

  return (
    <g className="switch-symbol">
      {/* Left terminal */}
      <line
        x1="-30" y1="0" x2="-10" y2="0"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle
        cx="-10" cy="0" r="3"
        fill={strokeColor}
      />

      {/* Switch arm */}
      <line
        x1="-10" y1="0"
        x2={closed ? "10" : "5"}
        y2={closed ? "0" : "-12"}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Right terminal */}
      <circle
        cx="10" cy="0" r="3"
        fill={strokeColor}
      />
      <line
        x1="10" y1="0" x2="30" y2="0"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* State label */}
      <text
        x="0" y="25"
        fontSize="10"
        fill={strokeColor}
        textAnchor="middle"
        fontWeight="bold"
      >
        {closed ? 'CLOSED' : 'OPEN'}
      </text>

      {/* Selection indicator */}
      {selected && (
        <rect
          x="-35" y="-20" width="70" height="50"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4 2"
          rx="4"
        />
      )}
    </g>
  );
};

// Map component types to their render functions
export const COMPONENT_RENDERERS = {
  [COMPONENT_TYPES.BATTERY]: renderBatterySVG,
  [COMPONENT_TYPES.RESISTOR]: renderResistorSVG,
  [COMPONENT_TYPES.LAMP]: renderLampSVG,
  [COMPONENT_TYPES.SWITCH]: renderSwitchSVG,
};

// Grid configuration
export const GRID_SIZE = 20; // Snap to 20px grid
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 600;

// Terminal radius for connection detection
export const TERMINAL_RADIUS = 8;

// Wire styling
export const WIRE_STYLES = {
  default: {
    stroke: '#94a3b8',
    strokeWidth: 2,
  },
  active: {
    stroke: '#3b82f6',
    strokeWidth: 3,
  },
  hovered: {
    stroke: '#60a5fa',
    strokeWidth: 2.5,
  },
};
