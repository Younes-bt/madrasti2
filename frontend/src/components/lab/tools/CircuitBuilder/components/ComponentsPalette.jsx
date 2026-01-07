import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BatteryCharging, Minus, Lightbulb, ToggleRight } from 'lucide-react';

import { COMPONENT_PALETTE, COMPONENT_TYPES } from '../constants/circuitComponents.jsx';

// Icon mapping
const ICON_MAP = {
  'battery-charging': BatteryCharging,
  'minus': Minus,
  'lightbulb': Lightbulb,
  'toggle-right': ToggleRight,
};

const ComponentsPalette = ({ onAddComponent }) => {
  const [draggedType, setDraggedType] = useState(null);

  const handleDragStart = (componentType) => {
    setDraggedType(componentType);
  };

  const handleDragEnd = () => {
    setDraggedType(null);
  };

  const handleClick = (componentType) => {
    // Add component to center of canvas when clicked
    const centerPosition = {
      x: 500,
      y: 300,
    };
    onAddComponent(componentType, centerPosition);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Components</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {COMPONENT_PALETTE.map((component) => {
          const Icon = ICON_MAP[component.icon];
          const isDragging = draggedType === component.type;

          return (
            <Button
              key={component.type}
              variant="outline"
              className="w-full justify-start"
              style={{
                borderColor: component.color,
                opacity: isDragging ? 0.5 : 1,
              }}
              onClick={() => handleClick(component.type)}
              onDragStart={() => handleDragStart(component.type)}
              onDragEnd={handleDragEnd}
              draggable
            >
              <div className="flex items-center gap-2 w-full">
                {Icon && (
                  <Icon
                    className="w-5 h-5"
                    style={{ color: component.color }}
                  />
                )}
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{component.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {component.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Click or drag components to the canvas to add them
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentsPalette;
