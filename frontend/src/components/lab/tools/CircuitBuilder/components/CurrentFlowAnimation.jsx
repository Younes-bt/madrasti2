import React, { useMemo } from 'react';

// Build SVG path from component IDs
const buildFlowPath = (componentIds, components, connections) => {
  const points = [];

  for (let i = 0; i < componentIds.length; i++) {
    const currentId = componentIds[i];
    const nextId = componentIds[(i + 1) % componentIds.length];

    // Find the connection between current and next component
    const connection = connections.find(conn =>
      (conn.from.componentId === currentId && conn.to.componentId === nextId) ||
      (conn.to.componentId === currentId && conn.from.componentId === nextId)
    );

    if (connection) {
      // Add connection points to the path
      connection.points.forEach((point, idx) => {
        if (i === 0 && idx === 0) {
          points.push(point); // First point
        } else if (idx > 0) {
          points.push(point); // Subsequent points
        }
      });
    }
  }

  // Build SVG path string
  if (points.length < 2) return '';

  return points.map((point, index) =>
    index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
  ).join(' ');
};

const CurrentFlowAnimation = ({ flow, components, connections }) => {
  // Build the path for this current flow
  const pathData = useMemo(() => {
    return buildFlowPath(flow.path, components, connections);
  }, [flow.path, components, connections]);

  if (!pathData) return null;

  // Calculate number of particles based on current magnitude
  const numParticles = Math.max(1, Math.min(10, Math.ceil(Math.abs(flow.current) * 10)));

  // Animation duration (inversely proportional to current)
  const duration = 2000 / Math.max(0.1, Math.abs(flow.current));

  // Create particles
  const particles = Array.from({ length: numParticles }, (_, i) => (
    <circle
      key={`particle-${i}`}
      r="4"
      fill="#3b82f6"
      opacity="0.8"
      style={{
        filter: 'drop-shadow(0 0 3px #3b82f6)',
      }}
    >
      <animateMotion
        dur={`${duration}ms`}
        repeatCount="indefinite"
        path={pathData}
        begin={`${(i / numParticles) * duration}ms`}
      />
    </circle>
  ));

  return (
    <g className="current-flow-animation">
      {particles}
    </g>
  );
};

export default CurrentFlowAnimation;
