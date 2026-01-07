import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Trash2, RotateCw, Zap } from 'lucide-react';

import { COMPONENT_TYPES } from '../constants/circuitComponents.jsx';

const PropertiesPanel = ({
  selectedComponent,
  selectedConnection,
  onUpdateProperties,
  onDelete,
  onRotate,
  isSimulating,
}) => {
  if (!selectedComponent && !selectedConnection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a component or connection to view its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  if (selectedConnection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wire Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Connection</Label>
            <p className="text-sm text-muted-foreground">
              Wire connecting components
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isSimulating}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Wire
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Component properties
  const { type, properties } = selectedComponent;

  const renderComponentProperties = () => {
    switch (type) {
      case COMPONENT_TYPES.BATTERY:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Voltage (V)</Label>
                <Badge variant="outline">{properties.voltage}V</Badge>
              </div>
              <Slider
                value={[properties.voltage]}
                onValueChange={(value) => onUpdateProperties({ voltage: value[0] })}
                min={1.5}
                max={24}
                step={0.5}
                disabled={isSimulating}
              />
              <p className="text-xs text-muted-foreground">
                Common values: 1.5V (AA), 9V (9V battery), 12V (car battery)
              </p>
            </div>
          </div>
        );

      case COMPONENT_TYPES.RESISTOR:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Resistance (Ω)</Label>
                <Badge variant="outline">{properties.resistance}Ω</Badge>
              </div>
              <Slider
                value={[properties.resistance]}
                onValueChange={(value) => onUpdateProperties({ resistance: value[0] })}
                min={10}
                max={1000}
                step={10}
                disabled={isSimulating}
              />
              <p className="text-xs text-muted-foreground">
                Higher resistance = lower current
              </p>
            </div>
          </div>
        );

      case COMPONENT_TYPES.LAMP:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Resistance (Ω)</Label>
                <Badge variant="outline">{properties.resistance}Ω</Badge>
              </div>
              <Slider
                value={[properties.resistance]}
                onValueChange={(value) => onUpdateProperties({ resistance: value[0] })}
                min={10}
                max={500}
                step={10}
                disabled={isSimulating}
              />
            </div>

            {properties.burnedOut && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">Lamp Burned Out!</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  Current exceeded maximum limit. Replace the lamp.
                </p>
              </div>
            )}

            {isSimulating && !properties.burnedOut && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Brightness</span>
                  <Badge variant="outline">{Math.round(properties.brightness || 0)}%</Badge>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${properties.brightness || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case COMPONENT_TYPES.SWITCH:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>State</Label>
                <Badge variant={properties.closed ? "default" : "secondary"}>
                  {properties.closed ? 'Closed' : 'Open'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateProperties({ closed: !properties.closed })}
                disabled={isSimulating}
                className="w-full"
              >
                Toggle Switch
              </Button>
              <p className="text-xs text-muted-foreground">
                {properties.closed
                  ? 'Switch is closed - current can flow'
                  : 'Switch is open - no current flows'
                }
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg capitalize">
          {type} Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderComponentProperties()}

        <div className="pt-4 border-t space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRotate}
            disabled={isSimulating}
            className="w-full"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate 90°
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isSimulating}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Component
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;
