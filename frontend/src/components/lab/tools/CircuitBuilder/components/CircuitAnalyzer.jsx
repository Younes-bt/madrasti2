import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Zap, Info, Activity } from 'lucide-react';

const CircuitAnalyzer = ({ components, simulation, analysis, isRunning }) => {
  if (!isRunning || !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">
            No simulation running
          </p>
          <p className="text-sm text-muted-foreground">
            Build a circuit and click Play to see analysis
          </p>
        </div>
      </div>
    );
  }

  const { overview, components: componentAnalysis } = analysis;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Circuit Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Voltage</div>
              <div className="text-2xl font-bold">{overview.totalVoltage}V</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Current</div>
              <div className="text-2xl font-bold">{overview.totalCurrent}A</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Resistance</div>
              <div className="text-2xl font-bold">{overview.totalResistance}Ω</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Power</div>
              <div className="text-2xl font-bold">{overview.power}W</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Component Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Voltage (V)</TableHead>
                <TableHead className="text-right">Current (A)</TableHead>
                <TableHead className="text-right">Power (W)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentAnalysis.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          comp.type === 'battery' ? 'bg-green-50' :
                          comp.type === 'resistor' ? 'bg-amber-50' :
                          comp.type === 'lamp' ? 'bg-yellow-50' :
                          'bg-blue-50'
                        }
                      >
                        {comp.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{comp.value}</TableCell>
                  <TableCell className="text-right font-mono">
                    {comp.voltage}V
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {comp.current}A
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {comp.power}W
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Physics Formulas */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Info className="w-5 h-5" />
            Key Physics Formulas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>Ohm's Law:</strong> V = I × R
            <p className="text-xs text-blue-600">
              Voltage equals Current times Resistance
            </p>
          </div>
          <div>
            <strong>Power:</strong> P = V × I = I² × R
            <p className="text-xs text-blue-600">
              Power equals Voltage times Current
            </p>
          </div>
          <div>
            <strong>Series Resistance:</strong> R_total = R1 + R2 + R3 + ...
            <p className="text-xs text-blue-600">
              Total resistance is the sum of individual resistances
            </p>
          </div>
          <div>
            <strong>Series Current:</strong> Current is the same through all components
            <p className="text-xs text-blue-600">
              In a series circuit, I1 = I2 = I3 = I_total
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Flow Visualization */}
      {simulation.currentFlows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Flow Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {simulation.currentFlows.map((flow, index) => (
                <Alert key={index} variant="default" className="border-blue-200 bg-blue-50">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Path {index + 1}:</strong> Current = {flow.current.toFixed(3)}A
                    <span className="text-xs block mt-1 text-blue-600">
                      {flow.path.length} components in series
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CircuitAnalyzer;
