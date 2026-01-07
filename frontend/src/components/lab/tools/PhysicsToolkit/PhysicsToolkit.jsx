import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Gauge, MoveRight, TrendingUp, ArrowDown, CircleDot, RotateCw,
  Move, Rocket, Scale, Grip, Orbit, Hammer, Zap, Mountain,
  Infinity, Lightbulb, Activity, TrendingDown, Waves, Radio,
  Battery, Timer, Magnet, Compass, Workflow, Sparkles, Bolt,
  Cpu, Plus, Network, ChevronLeft, ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

const PhysicsToolkit = ({ tool }) => {
  const { t } = useTranslation();
  // Map tool_id to category and specific tool
  const getToolMapping = (toolId) => {
    const mappings = {
      // Kinematics tools
      'average-speed-calculator': { category: 'kinematics', tool: 'average-speed' },
      'uniform-motion-simulator': { category: 'kinematics', tool: 'uniform' },
      'accelerated-motion': { category: 'kinematics', tool: 'accelerated' },
      'free-fall-simulator': { category: 'kinematics', tool: 'free-fall' },
      'projectile-motion': { category: 'kinematics', tool: 'projectile' },
      'circular-motion': { category: 'kinematics', tool: 'circular' },
      'rotation-simulator': { category: 'kinematics', tool: 'rotation' },
      // Dynamics tools
      'force-vector-visualizer': { category: 'dynamics', tool: 'force-vectors' },
      'newtons-laws-simulator': { category: 'dynamics', tool: 'newton' },
      'weight-mass-calculator': { category: 'dynamics', tool: 'weight' },
      'equilibrium-forces': { category: 'dynamics', tool: 'equilibrium' },
      'friction-calculator': { category: 'dynamics', tool: 'friction' },
      'satellite-motion': { category: 'dynamics', tool: 'satellite' },
      // Energy tools
      'work-calculator': { category: 'energy', tool: 'work' },
      'kinetic-energy': { category: 'energy', tool: 'kinetic' },
      'potential-energy': { category: 'energy', tool: 'potential' },
      'energy-conservation': { category: 'energy', tool: 'conservation' },
      'power-calculator': { category: 'energy', tool: 'power' },
      // Oscillations & Waves tools
      'shm-simulator': { category: 'waves', tool: 'shm' },
      'damped-oscillations': { category: 'waves', tool: 'damped' },
      'mechanical-waves': { category: 'waves', tool: 'mechanical' },
      'sound-waves': { category: 'waves', tool: 'sound' },
      // Electricity & Magnetism - Basic Circuits
      'circuit-builder': { category: 'electricity', tool: 'circuit-builder' },
      'ohms-law': { category: 'electricity', tool: 'ohms-law' },
      'series-parallel-circuits': { category: 'electricity', tool: 'series-parallel' },
      'voltage-addition': { category: 'electricity', tool: 'voltage-addition' },
      'nodal-law': { category: 'electricity', tool: 'nodal-law' },
      'electrical-power': { category: 'electricity', tool: 'electrical-power' },
      'electrical-energy': { category: 'electricity', tool: 'electrical-energy' },
      // Electricity & Magnetism - Advanced Circuits
      'rc-circuit': { category: 'electricity', tool: 'rc-circuit' },
      'rl-circuit': { category: 'electricity', tool: 'rl-circuit' },
      'rlc-circuit': { category: 'electricity', tool: 'rlc-circuit' },
      'ac-circuit-analyzer': { category: 'electricity', tool: 'ac-circuit' },
      // Electricity & Magnetism - Electromagnetism
      'magnetic-field': { category: 'electricity', tool: 'magnetic-field' },
      'lorentz-force': { category: 'electricity', tool: 'lorentz-force' },
      'electromagnetic-induction': { category: 'electricity', tool: 'em-induction' },
      // Electricity & Magnetism - Electrostatics
      'electric-field': { category: 'electricity', tool: 'electric-field' },
      'coulombs-law': { category: 'electricity', tool: 'coulombs-law' },
      'electric-potential-energy': { category: 'electricity', tool: 'electric-potential' },
    };
    return mappings[toolId] || { category: 'kinematics', tool: 'average-speed' };
  };

  const toolMapping = getToolMapping(tool?.tool_id);
  const [activeTab, setActiveTab] = useState(toolMapping.category);
  const [kinematicsTool, setKinematicsTool] = useState(toolMapping.category === 'kinematics' ? toolMapping.tool : 'average-speed');
  const [dynamicsTool, setDynamicsTool] = useState(toolMapping.category === 'dynamics' ? toolMapping.tool : 'force-vectors');
  const [energyTool, setEnergyTool] = useState(toolMapping.category === 'energy' ? toolMapping.tool : 'work');
  const [wavesTool, setWavesTool] = useState(toolMapping.category === 'waves' ? toolMapping.tool : 'shm');
  const [electricityTool, setElectricityTool] = useState(toolMapping.category === 'electricity' ? toolMapping.tool : 'ohms-law');

  // Ref for scrollable tabs
  const electricityTabsRef = useRef(null);

  // Scroll functions for electricity tabs
  const scrollElectricityTabs = (direction) => {
    if (electricityTabsRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left'
        ? electricityTabsRef.current.scrollLeft - scrollAmount
        : electricityTabsRef.current.scrollLeft + scrollAmount;
      electricityTabsRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  // ==================== KINEMATICS STATES ====================
  // Average Speed Calculator
  const [distance, setDistance] = useState(100); // meters
  const [time, setTime] = useState(10); // seconds

  // Uniform Motion
  const [uniformVelocity, setUniformVelocity] = useState(5); // m/s
  const [uniformTime, setUniformTime] = useState(10); // s

  // Accelerated Motion
  const [initialVelocity, setInitialVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(2); // m/s²
  const [accelTime, setAccelTime] = useState(10);

  // Free Fall
  const [fallHeight, setFallHeight] = useState(20); // meters
  const [gravity, setGravity] = useState(9.81);

  // Projectile Motion
  const [projectileV0, setProjectileV0] = useState(20);
  const [projectileAngle, setProjectileAngle] = useState(45);
  const [projectileH0, setProjectileH0] = useState(0);

  // Circular Motion
  const [circularRadius, setCircularRadius] = useState(5); // m
  const [angularVelocity, setAngularVelocity] = useState(2); // rad/s

  // Rotation
  const [rotationInertia, setRotationInertia] = useState(10); // kg·m²
  const [torque, setTorque] = useState(50); // N·m

  // ==================== DYNAMICS STATES ====================
  // Force Vectors
  const [force1Magnitude, setForce1Magnitude] = useState(10);
  const [force1Angle, setForce1Angle] = useState(0);
  const [force2Magnitude, setForce2Magnitude] = useState(10);
  const [force2Angle, setForce2Angle] = useState(90);

  // Newton's Laws
  const [newtonMass, setNewtonMass] = useState(10);
  const [newtonForce, setNewtonForce] = useState(50);

  // Weight/Mass
  const [mass, setMass] = useState(70); // kg
  const [planetGravity, setPlanetGravity] = useState(9.81);

  // Equilibrium
  const [eqForce1, setEqForce1] = useState(10);
  const [eqAngle1, setEqAngle1] = useState(30);
  const [eqForce2, setEqForce2] = useState(10);
  const [eqAngle2, setEqAngle2] = useState(150);

  // Friction
  const [frictionMass, setFrictionMass] = useState(5);
  const [frictionCoef, setFrictionCoef] = useState(0.3);
  const [appliedForce, setAppliedForce] = useState(20);

  // Satellite Motion
  const [satelliteMass, setSatelliteMass] = useState(1000); // kg
  const [orbitRadius, setOrbitRadius] = useState(7000); // km

  // ==================== ENERGY STATES ====================
  // Work
  const [workForce, setWorkForce] = useState(50);
  const [workDistance, setWorkDistance] = useState(10);
  const [workAngle, setWorkAngle] = useState(0);

  // Kinetic Energy
  const [keMass, setKeMass] = useState(10);
  const [velocity, setVelocity] = useState(5);

  // Potential Energy
  const [peMass, setPeMass] = useState(10);
  const [height, setHeight] = useState(10);
  const [peType, setPeType] = useState("gravitational");

  // Energy Conservation
  const [conservationHeight, setConservationHeight] = useState(20);
  const [conservationMass, setConservationMass] = useState(5);

  // Power
  const [powerWork, setPowerWork] = useState(1000);
  const [powerTime, setPowerTime] = useState(10);

  // ==================== OSCILLATIONS & WAVES STATES ====================
  // SHM - Mass-Spring System
  const [springMass, setSpringMass] = useState(1); // kg
  const [springConstant, setSpringConstant] = useState(10); // N/m
  const [springAmplitude, setSpringAmplitude] = useState(0.1); // m
  const [shmSystem, setShmSystem] = useState('mass-spring'); // mass-spring, simple-pendulum, physical-pendulum

  // Simple Pendulum
  const [pendulumLength, setPendulumLength] = useState(1); // m
  const [pendulumAmplitude, setPendulumAmplitude] = useState(0.1); // rad

  // Damped Oscillations
  const [dampedMass, setDampedMass] = useState(1);
  const [dampedK, setDampedK] = useState(10);
  const [dampingCoef, setDampingCoef] = useState(0.2); // damping coefficient
  const [dampedAmplitude, setDampedAmplitude] = useState(0.1);

  // Mechanical Waves
  const [waveAmplitude, setWaveAmplitude] = useState(0.05); // m
  const [waveFrequency, setWaveFrequency] = useState(2); // Hz
  const [waveSpeed, setWaveSpeed] = useState(5); // m/s

  // Sound Waves
  const [soundFrequency, setSoundFrequency] = useState(440); // Hz (A4 note)
  const [soundIntensity, setSoundIntensity] = useState(60); // dB

  // ==================== ELECTRICITY & MAGNETISM STATES ====================
  // Ohm's Law
  const [ohmVoltage, setOhmVoltage] = useState(12); // V
  const [ohmCurrent, setOhmCurrent] = useState(2); // A
  const [ohmResistance, setOhmResistance] = useState(6); // Ω
  const [ohmCalculateFor, setOhmCalculateFor] = useState('resistance'); // voltage, current, resistance

  // Series/Parallel Circuits
  const [r1, setR1] = useState(10); // Ω
  const [r2, setR2] = useState(20); // Ω
  const [r3, setR3] = useState(30); // Ω
  const [circuitType, setCircuitType] = useState('series'); // series, parallel

  // Voltage Addition
  const [v1, setV1] = useState(5); // V
  const [v2, setV2] = useState(10); // V
  const [v3, setV3] = useState(15); // V

  // Electrical Power
  const [powerVoltage, setPowerVoltage] = useState(220); // V
  const [powerCurrent, setPowerCurrent] = useState(5); // A

  // Electrical Energy
  const [energyPower, setEnergyPower] = useState(1000); // W
  const [energyTime, setEnergyTime] = useState(2); // hours

  // RC Circuit
  const [rcResistance, setRcResistance] = useState(1000); // Ω
  const [rcCapacitance, setRcCapacitance] = useState(0.001); // F (1 mF)
  const [rcVoltage, setRcVoltage] = useState(12); // V

  // RL Circuit
  const [rlResistance, setRlResistance] = useState(100); // Ω
  const [rlInductance, setRlInductance] = useState(0.5); // H
  const [rlVoltage, setRlVoltage] = useState(12); // V

  // RLC Circuit
  const [rlcResistance, setRlcResistance] = useState(10); // Ω
  const [rlcInductance, setRlcInductance] = useState(0.1); // H
  const [rlcCapacitance, setRlcCapacitance] = useState(0.0001); // F (100 μF)
  const [rlcVoltage, setRlcVoltage] = useState(12); // V

  // Magnetic Field
  const [magneticCurrent, setMagneticCurrent] = useState(5); // A
  const [magneticDistance, setMagneticDistance] = useState(0.1); // m
  const [magneticFieldType, setMagneticFieldType] = useState('wire'); // wire, loop

  // Lorentz Force
  const [lorentzCharge, setLorentzCharge] = useState(1.6e-19); // C (electron)
  const [lorentzVelocity, setLorentzVelocity] = useState(1e6); // m/s
  const [lorentzField, setLorentzField] = useState(0.5); // T
  const [lorentzAngle, setLorentzAngle] = useState(90); // degrees

  // Electric Field
  const [electricCharge, setElectricCharge] = useState(1e-6); // C (1 μC)
  const [electricDistance, setElectricDistance] = useState(0.1); // m

  // Coulomb's Law
  const [coulombQ1, setCoulombQ1] = useState(1e-6); // C
  const [coulombQ2, setCoulombQ2] = useState(2e-6); // C
  const [coulombDistance, setCoulombDistance] = useState(0.1); // m

  // Electric Potential Energy
  const [potentialCharge, setPotentialCharge] = useState(1e-6); // C
  const [potentialVoltage, setPotentialVoltage] = useState(100); // V

  // ==================== CALCULATIONS ====================
  // Average Speed
  const averageSpeed = distance / time;

  // Uniform Motion Data
  const uniformMotionData = useMemo(() => {
    const points = [];
    for (let t = 0; t <= uniformTime; t += 0.5) {
      points.push({
        t,
        x: uniformVelocity * t,
        v: uniformVelocity
      });
    }
    return points;
  }, [uniformVelocity, uniformTime]);

  // Accelerated Motion Data
  const acceleratedMotionData = useMemo(() => {
    const points = [];
    for (let t = 0; t <= accelTime; t += 0.5) {
      const x = initialVelocity * t + 0.5 * acceleration * t * t;
      const v = initialVelocity + acceleration * t;
      points.push({ t, x, v });
    }
    return points;
  }, [initialVelocity, acceleration, accelTime]);

  // Free Fall
  const fallTime = Math.sqrt((2 * fallHeight) / gravity);
  const freeFallFinalVelocity = gravity * fallTime;

  // Projectile Motion
  const projectileData = useMemo(() => {
    const rad = projectileAngle * (Math.PI / 180);
    const vx = projectileV0 * Math.cos(rad);
    const vy = projectileV0 * Math.sin(rad);
    const disc = vy * vy + 2 * gravity * projectileH0;
    const totalTime = (vy + Math.sqrt(disc)) / gravity;

    const points = [];
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * totalTime;
      points.push({
        x: vx * t,
        y: projectileH0 + vy * t - 0.5 * gravity * t * t
      });
    }

    return {
      points,
      maxHeight: projectileH0 + (vy * vy) / (2 * gravity),
      maxRange: vx * totalTime,
      flightTime: totalTime
    };
  }, [projectileV0, projectileAngle, projectileH0, gravity]);

  // Circular Motion
  const linearVelocity = circularRadius * angularVelocity;
  const centripetalAccel = (linearVelocity * linearVelocity) / circularRadius;
  const period = (2 * Math.PI) / angularVelocity;

  // Rotation
  const angularAccel = torque / rotationInertia;

  // Force Vector Resultant
  const f1x = force1Magnitude * Math.cos(force1Angle * Math.PI / 180);
  const f1y = force1Magnitude * Math.sin(force1Angle * Math.PI / 180);
  const f2x = force2Magnitude * Math.cos(force2Angle * Math.PI / 180);
  const f2y = force2Magnitude * Math.sin(force2Angle * Math.PI / 180);
  const resultantX = f1x + f2x;
  const resultantY = f1y + f2y;
  const resultantMagnitude = Math.sqrt(resultantX * resultantX + resultantY * resultantY);
  const resultantAngle = Math.atan2(resultantY, resultantX) * 180 / Math.PI;

  // Newton's Second Law
  const newtonAccel = newtonForce / newtonMass;

  // Weight
  const weight = mass * planetGravity;

  // Friction
  const normalForce = frictionMass * 9.81;
  const frictionForce = frictionCoef * normalForce;
  const netForce = Math.max(0, appliedForce - frictionForce);
  const frictionAccel = netForce / frictionMass;

  // Satellite
  const orbitalVelocity = Math.sqrt((6.674e-11 * 5.972e24) / (orbitRadius * 1000)); // Simplified for Earth

  // Work
  const work = workForce * workDistance * Math.cos(workAngle * Math.PI / 180);

  // Kinetic Energy
  const kineticEnergy = 0.5 * keMass * velocity * velocity;

  // Potential Energy
  const potentialEnergy = peType === "gravitational"
    ? peMass * 9.81 * height
    : 0.5 * 100 * height * height; // k=100 for elastic

  // Energy Conservation
  const initialPE = conservationMass * 9.81 * conservationHeight;
  const finalKE = initialPE;
  const conservationFinalVelocity = Math.sqrt(2 * 9.81 * conservationHeight);

  // Power
  const power = powerWork / powerTime;

  // ==================== OSCILLATIONS & WAVES CALCULATIONS ====================
  // SHM - Mass-Spring System
  const springOmega = Math.sqrt(springConstant / springMass); // angular frequency
  const springPeriod = (2 * Math.PI) / springOmega;
  const springFreq = 1 / springPeriod;

  // Simple Pendulum
  const pendulumOmega = Math.sqrt(9.81 / pendulumLength);
  const pendulumPeriod = (2 * Math.PI) / pendulumOmega;
  const pendulumFreq = 1 / pendulumPeriod;

  // Damped Oscillations
  const dampedOmega0 = Math.sqrt(dampedK / dampedMass); // natural frequency
  const dampedGamma = dampingCoef / (2 * dampedMass); // damping coefficient
  const dampedOmega = Math.sqrt(dampedOmega0 * dampedOmega0 - dampedGamma * dampedGamma); // damped frequency
  const dampingType = dampedGamma < dampedOmega0 ? 'Under-damped' : (dampedGamma === dampedOmega0 ? 'Critically damped' : 'Over-damped');

  // Mechanical Waves
  const waveLength = waveSpeed / waveFrequency; // λ = v / f
  const waveOmega = 2 * Math.PI * waveFrequency;
  const waveNumber = (2 * Math.PI) / waveLength; // k = 2π/λ

  // Sound Waves
  const soundWaveLength = 343 / soundFrequency; // Speed of sound in air = 343 m/s
  const soundPeriod = 1 / soundFrequency;

  // ==================== ELECTRICITY & MAGNETISM CALCULATIONS ====================
  // Ohm's Law: V = I × R
  const ohmCalculatedValue = useMemo(() => {
    if (ohmCalculateFor === 'voltage') {
      return ohmCurrent * ohmResistance;
    } else if (ohmCalculateFor === 'current') {
      return ohmVoltage / ohmResistance;
    } else {
      return ohmVoltage / ohmCurrent;
    }
  }, [ohmCalculateFor, ohmVoltage, ohmCurrent, ohmResistance]);

  // Series/Parallel Circuits
  const totalResistance = useMemo(() => {
    if (circuitType === 'series') {
      return r1 + r2 + r3;
    } else {
      return 1 / (1/r1 + 1/r2 + 1/r3);
    }
  }, [circuitType, r1, r2, r3]);

  // Voltage Addition (series circuit)
  const totalVoltage = v1 + v2 + v3;

  // Electrical Power: P = U × I
  const electricalPower = powerVoltage * powerCurrent;

  // Electrical Energy: E = P × t
  const electricalEnergy = energyPower * energyTime; // Wh
  const electricalEnergyKwh = electricalEnergy / 1000; // kWh

  // RC Circuit - Time constant: τ = R × C
  const rcTimeConstant = rcResistance * rcCapacitance;
  const rcChargingData = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * (5 * rcTimeConstant);
      const voltage = rcVoltage * (1 - Math.exp(-t / rcTimeConstant));
      const current = (rcVoltage / rcResistance) * Math.exp(-t / rcTimeConstant);
      points.push({ t, voltage, current });
    }
    return points;
  }, [rcResistance, rcCapacitance, rcVoltage, rcTimeConstant]);

  // RL Circuit - Time constant: τ = L / R
  const rlTimeConstant = rlInductance / rlResistance;
  const rlCurrentData = useMemo(() => {
    const points = [];
    const finalCurrent = rlVoltage / rlResistance;
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * (5 * rlTimeConstant);
      const current = finalCurrent * (1 - Math.exp(-t / rlTimeConstant));
      points.push({ t, current });
    }
    return points;
  }, [rlResistance, rlInductance, rlVoltage, rlTimeConstant]);

  // RLC Circuit - Natural frequency and damping
  const rlcOmega0 = Math.sqrt(1 / (rlcInductance * rlcCapacitance)); // natural frequency
  const rlcGamma = rlcResistance / (2 * rlcInductance); // damping coefficient
  const rlcFrequency = rlcOmega0 / (2 * Math.PI);
  const rlcDampingType = rlcGamma < rlcOmega0 ? 'Under-damped (oscillations)' :
                         (rlcGamma === rlcOmega0 ? 'Critically damped' : 'Over-damped');

  // Magnetic Field
  const mu0 = 4 * Math.PI * 1e-7; // Permeability of free space
  const magneticFieldStrength = magneticFieldType === 'wire'
    ? (mu0 * magneticCurrent) / (2 * Math.PI * magneticDistance) // Straight wire
    : (mu0 * magneticCurrent) / (2 * magneticDistance); // Center of loop (simplified)

  // Lorentz Force: F = q × v × B × sin(θ)
  const lorentzForce = lorentzCharge * lorentzVelocity * lorentzField * Math.sin(lorentzAngle * Math.PI / 180);

  // Electric Field: E = k × Q / r²
  const k = 8.99e9; // Coulomb's constant
  const electricFieldStrength = (k * electricCharge) / (electricDistance * electricDistance);

  // Coulomb's Law: F = k × Q₁ × Q₂ / r²
  const coulombForce = (k * coulombQ1 * coulombQ2) / (coulombDistance * coulombDistance);

  // Electric Potential Energy: U = q × V
  const electricPotentialEnergy = potentialCharge * potentialVoltage;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-purple-600" />
            {t('lab.tools.physicsToolkit.mainTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('lab.tools.physicsToolkit.interactiveTools')}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-[1000px]">
          <TabsTrigger value="kinematics" className="flex items-center gap-2">
            <MoveRight className="w-4 h-4" /> {t('lab.tools.physicsToolkit.kinematics')}
          </TabsTrigger>
          <TabsTrigger value="dynamics" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" /> {t('lab.tools.physicsToolkit.dynamics')}
          </TabsTrigger>
          <TabsTrigger value="energy" className="flex items-center gap-2">
            <Zap className="w-4 h-4" /> {t('lab.tools.physicsToolkit.energy')}
          </TabsTrigger>
          <TabsTrigger value="waves" className="flex items-center gap-2">
            <Activity className="w-4 h-4" /> {t('lab.tools.physicsToolkit.waves')}
          </TabsTrigger>
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> {t('lab.tools.physicsToolkit.electricity')}
          </TabsTrigger>
        </TabsList>

        {/* ==================== KINEMATICS TAB ==================== */}
        <TabsContent value="kinematics" className="space-y-6 mt-6">
          <Tabs value={kinematicsTool} onValueChange={setKinematicsTool}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="average-speed">
                <Gauge className="w-4 h-4 mr-1" /> {t('lab.tools.physicsToolkit.speed')}
              </TabsTrigger>
              <TabsTrigger value="uniform">
                <MoveRight className="w-4 h-4 mr-1" /> {t('lab.tools.physicsToolkit.uniform')}
              </TabsTrigger>
              <TabsTrigger value="accelerated">
                <TrendingUp className="w-4 h-4 mr-1" /> {t('lab.tools.physicsToolkit.accelerated')}
              </TabsTrigger>
              <TabsTrigger value="free-fall">
                <ArrowDown className="w-4 h-4 mr-1" /> {t('lab.tools.physicsToolkit.freeFall')}
              </TabsTrigger>
              <TabsTrigger value="projectile">
                <TrendingUp className="w-4 h-4 mr-1" /> {t('lab.tools.physicsToolkit.projectile')}
              </TabsTrigger>
              <TabsTrigger value="circular">
                <CircleDot className="w-4 h-4 mr-1" /> {t('lab.tools.physicsToolkit.circular')}
              </TabsTrigger>
              <TabsTrigger value="rotation">
                <RotateCw className="w-4 h-4 mr-1" /> {t('lab.tools.physicsToolkit.rotation')}
              </TabsTrigger>
            </TabsList>

            {/* Average Speed Calculator */}
            <TabsContent value="average-speed" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    {t('lab.tools.physicsToolkit.averageSpeedCalculator.title')}
                  </CardTitle>
                  <CardDescription>{t('lab.tools.physicsToolkit.averageSpeedCalculator.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t('lab.tools.physicsToolkit.averageSpeedCalculator.distance')} (m)</Label>
                        <div className="flex gap-4 items-center">
                          <Slider className="flex-1" min={1} max={1000} value={[distance]} onValueChange={v => setDistance(v[0])} />
                          <Input type="number" className="w-24" value={distance} onChange={e => setDistance(parseFloat(e.target.value) || 0)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('lab.tools.physicsToolkit.averageSpeedCalculator.time')} (s)</Label>
                        <div className="flex gap-4 items-center">
                          <Slider className="flex-1" min={1} max={100} value={[time]} onValueChange={v => setTime(v[0])} />
                          <Input type="number" className="w-24" value={time} onChange={e => setTime(parseFloat(e.target.value) || 1)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">{t('lab.tools.physicsToolkit.averageSpeedCalculator.averageSpeed')}</div>
                        <div className="text-4xl font-bold text-blue-600">{averageSpeed.toFixed(2)} m/s</div>
                        <div className="text-sm text-muted-foreground mt-2">v = d / t</div>
                      </div>
                      <div className="text-sm text-muted-foreground bg-muted p-4 rounded">
                        <strong>{t('lab.tools.physicsToolkit.averageSpeedCalculator.formula')}:</strong> v = d / t<br />
                        <strong>{t('lab.tools.physicsToolkit.averageSpeedCalculator.calculation')}:</strong> v = {distance} m / {time} s = {averageSpeed.toFixed(2)} m/s
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Uniform Motion Simulator */}
            <TabsContent value="uniform" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MoveRight className="w-5 h-5" />
                    Uniform Motion Simulator
                  </CardTitle>
                  <CardDescription>Simulate constant velocity motion with graphs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Velocity (m/s)</Label>
                        <Slider min={0} max={20} step={0.5} value={[uniformVelocity]} onValueChange={v => setUniformVelocity(v[0])} />
                        <div className="text-right text-sm font-mono">{uniformVelocity} m/s</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Time Range (s)</Label>
                        <Slider min={5} max={30} value={[uniformTime]} onValueChange={v => setUniformTime(v[0])} />
                        <div className="text-right text-sm font-mono">{uniformTime} s</div>
                      </div>
                      <div className="bg-muted p-4 rounded space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Distance covered:</span>
                          <span className="font-bold">{(uniformVelocity * uniformTime).toFixed(1)} m</span>
                        </div>
                        <div className="text-xs text-muted-foreground">x = v × t</div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={uniformMotionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Position (m)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="x" stroke="#3b82f6" name="Position" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accelerated Motion */}
            <TabsContent value="accelerated" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Accelerated Motion
                  </CardTitle>
                  <CardDescription>Simulate uniformly accelerated motion with equations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Initial Velocity v₀ (m/s)</Label>
                        <Slider min={0} max={20} value={[initialVelocity]} onValueChange={v => setInitialVelocity(v[0])} />
                        <div className="text-right text-sm font-mono">{initialVelocity} m/s</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Acceleration a (m/s²)</Label>
                        <Slider min={0} max={10} step={0.5} value={[acceleration]} onValueChange={v => setAcceleration(v[0])} />
                        <div className="text-right text-sm font-mono">{acceleration} m/s²</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Time Range (s)</Label>
                        <Slider min={5} max={20} value={[accelTime]} onValueChange={v => setAccelTime(v[0])} />
                        <div className="text-right text-sm font-mono">{accelTime} s</div>
                      </div>
                      <div className="bg-muted p-4 rounded space-y-2 text-sm">
                        <div className="font-semibold mb-2">Equations:</div>
                        <div>x = v₀t + ½at²</div>
                        <div>v = v₀ + at</div>
                        <div className="border-t pt-2 mt-2">
                          <div>Final velocity: <span className="font-bold">{(initialVelocity + acceleration * accelTime).toFixed(1)} m/s</span></div>
                          <div>Distance: <span className="font-bold">{(initialVelocity * accelTime + 0.5 * acceleration * accelTime * accelTime).toFixed(1)} m</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={acceleratedMotionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Position (m)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="x" stroke="#3b82f6" name="Position" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={acceleratedMotionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="v" stroke="#10b981" name="Velocity" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Free Fall Simulator */}
            <TabsContent value="free-fall" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDown className="w-5 h-5" />
                    Free Fall Simulator
                  </CardTitle>
                  <CardDescription>Simulate free fall with g = 9.8 m/s²</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Height (m)</Label>
                        <Slider min={1} max={100} value={[fallHeight]} onValueChange={v => setFallHeight(v[0])} />
                        <div className="text-right text-sm font-mono">{fallHeight} m</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Gravity (m/s²)</Label>
                        <Select value={gravity.toString()} onValueChange={v => setGravity(parseFloat(v))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9.81">Earth (9.81 m/s²)</SelectItem>
                            <SelectItem value="1.62">Moon (1.62 m/s²)</SelectItem>
                            <SelectItem value="3.72">Mars (3.72 m/s²)</SelectItem>
                            <SelectItem value="24.79">Jupiter (24.79 m/s²)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Time to Fall</div>
                        <div className="text-4xl font-bold text-orange-600">{fallTime.toFixed(2)} s</div>
                        <div className="text-sm text-muted-foreground mt-2">t = √(2h/g)</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Final Velocity</div>
                        <div className="text-4xl font-bold text-red-600">{freeFallFinalVelocity.toFixed(2)} m/s</div>
                        <div className="text-sm text-muted-foreground mt-2">v = g × t</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projectile Motion */}
            <TabsContent value="projectile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projectile Motion (2D)</CardTitle>
                  <CardDescription>Simulate 2D projectile motion with trajectory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Initial Velocity v₀ (m/s)</Label>
                        <Slider min={5} max={50} value={[projectileV0]} onValueChange={v => setProjectileV0(v[0])} />
                        <div className="text-right text-sm font-mono">{projectileV0} m/s</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Launch Angle (°)</Label>
                        <Slider min={0} max={90} value={[projectileAngle]} onValueChange={v => setProjectileAngle(v[0])} />
                        <div className="text-right text-sm font-mono">{projectileAngle}°</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Initial Height h₀ (m)</Label>
                        <Slider min={0} max={20} value={[projectileH0]} onValueChange={v => setProjectileH0(v[0])} />
                        <div className="text-right text-sm font-mono">{projectileH0} m</div>
                      </div>
                      <div className="bg-muted p-4 rounded space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Max Height:</span>
                          <span className="font-bold">{projectileData.maxHeight.toFixed(1)} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Range:</span>
                          <span className="font-bold">{projectileData.maxRange.toFixed(1)} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Flight Time:</span>
                          <span className="font-bold">{projectileData.flightTime.toFixed(2)} s</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectileData.points}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="x" type="number" domain={[0, 'auto']} label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }} />
                          <YAxis dataKey="y" type="number" domain={[0, 'auto']} label={{ value: 'Height (m)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="y" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Circular Motion */}
            <TabsContent value="circular" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDot className="w-5 h-5" />
                    Circular Motion
                  </CardTitle>
                  <CardDescription>Simulate uniform circular motion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Radius (m)</Label>
                        <Slider min={1} max={20} value={[circularRadius]} onValueChange={v => setCircularRadius(v[0])} />
                        <div className="text-right text-sm font-mono">{circularRadius} m</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Angular Velocity ω (rad/s)</Label>
                        <Slider min={0.1} max={5} step={0.1} value={[angularVelocity]} onValueChange={v => setAngularVelocity(v[0])} />
                        <div className="text-right text-sm font-mono">{angularVelocity} rad/s</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Linear Velocity</div>
                        <div className="text-2xl font-bold text-blue-600">{linearVelocity.toFixed(2)} m/s</div>
                        <div className="text-xs text-muted-foreground">v = r × ω</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Centripetal Acceleration</div>
                        <div className="text-2xl font-bold text-purple-600">{centripetalAccel.toFixed(2)} m/s²</div>
                        <div className="text-xs text-muted-foreground">a = v²/r</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Period</div>
                        <div className="text-2xl font-bold text-green-600">{period.toFixed(2)} s</div>
                        <div className="text-xs text-muted-foreground">T = 2π/ω</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rotation Simulator */}
            <TabsContent value="rotation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5" />
                    Rotation Simulator
                  </CardTitle>
                  <CardDescription>Simulate rotation with angular velocity and torque</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Moment of Inertia I (kg·m²)</Label>
                        <Slider min={1} max={50} value={[rotationInertia]} onValueChange={v => setRotationInertia(v[0])} />
                        <div className="text-right text-sm font-mono">{rotationInertia} kg·m²</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Torque τ (N·m)</Label>
                        <Slider min={0} max={200} value={[torque]} onValueChange={v => setTorque(v[0])} />
                        <div className="text-right text-sm font-mono">{torque} N·m</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Angular Acceleration</div>
                        <div className="text-4xl font-bold text-indigo-600">{angularAccel.toFixed(2)} rad/s²</div>
                        <div className="text-sm text-muted-foreground mt-2">α = τ / I</div>
                      </div>
                      <div className="text-sm text-muted-foreground bg-muted p-4 rounded">
                        <strong>Equation:</strong> τ = I × α<br />
                        Similar to Newton's F = ma, but for rotation
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ==================== DYNAMICS TAB ==================== */}
        <TabsContent value="dynamics" className="space-y-6 mt-6">
          <Tabs value={dynamicsTool} onValueChange={setDynamicsTool}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="force-vectors">
                <Move className="w-4 h-4 mr-1" /> Vectors
              </TabsTrigger>
              <TabsTrigger value="newton">
                <Rocket className="w-4 h-4 mr-1" /> Newton
              </TabsTrigger>
              <TabsTrigger value="weight">
                <Scale className="w-4 h-4 mr-1" /> Weight
              </TabsTrigger>
              <TabsTrigger value="equilibrium">
                <Activity className="w-4 h-4 mr-1" /> Equilibrium
              </TabsTrigger>
              <TabsTrigger value="friction">
                <Grip className="w-4 h-4 mr-1" /> Friction
              </TabsTrigger>
              <TabsTrigger value="satellite">
                <Orbit className="w-4 h-4 mr-1" /> Satellite
              </TabsTrigger>
            </TabsList>

            {/* Force Vector Visualizer */}
            <TabsContent value="force-vectors" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Move className="w-5 h-5" />
                    Force Vector Visualizer
                  </CardTitle>
                  <CardDescription>Visualize and analyze force vectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Force 1</h4>
                        <div className="space-y-2">
                          <Label>Magnitude (N)</Label>
                          <Slider min={0} max={50} value={[force1Magnitude]} onValueChange={v => setForce1Magnitude(v[0])} />
                          <div className="text-right text-sm font-mono">{force1Magnitude} N</div>
                        </div>
                        <div className="space-y-2">
                          <Label>Angle (°)</Label>
                          <Slider min={0} max={360} value={[force1Angle]} onValueChange={v => setForce1Angle(v[0])} />
                          <div className="text-right text-sm font-mono">{force1Angle}°</div>
                        </div>
                      </div>

                      <div className="space-y-4 border-t pt-4">
                        <h4 className="font-semibold">Force 2</h4>
                        <div className="space-y-2">
                          <Label>Magnitude (N)</Label>
                          <Slider min={0} max={50} value={[force2Magnitude]} onValueChange={v => setForce2Magnitude(v[0])} />
                          <div className="text-right text-sm font-mono">{force2Magnitude} N</div>
                        </div>
                        <div className="space-y-2">
                          <Label>Angle (°)</Label>
                          <Slider min={0} max={360} value={[force2Angle]} onValueChange={v => setForce2Angle(v[0])} />
                          <div className="text-right text-sm font-mono">{force2Angle}°</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                        <h4 className="font-semibold mb-4">Resultant Force</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Magnitude</div>
                            <div className="text-3xl font-bold text-purple-600">{resultantMagnitude.toFixed(2)} N</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Direction</div>
                            <div className="text-2xl font-bold text-blue-600">{resultantAngle.toFixed(1)}°</div>
                          </div>
                          <div className="text-sm border-t pt-3 mt-3">
                            <div>Fx = {resultantX.toFixed(2)} N</div>
                            <div>Fy = {resultantY.toFixed(2)} N</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newton's Laws Simulator */}
            <TabsContent value="newton" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Newton's Laws Simulator
                  </CardTitle>
                  <CardDescription>Interactive simulation of Newton's three laws (F = ma)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mass (kg)</Label>
                        <Slider min={1} max={100} value={[newtonMass]} onValueChange={v => setNewtonMass(v[0])} />
                        <div className="text-right text-sm font-mono">{newtonMass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Applied Force (N)</Label>
                        <Slider min={0} max={200} value={[newtonForce]} onValueChange={v => setNewtonForce(v[0])} />
                        <div className="text-right text-sm font-mono">{newtonForce} N</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Acceleration</div>
                        <div className="text-4xl font-bold text-blue-600">{newtonAccel.toFixed(2)} m/s²</div>
                        <div className="text-sm text-muted-foreground mt-2">a = F / m</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Newton's Second Law:</strong><br />
                        F = ma<br />
                        {newtonForce} N = {newtonMass} kg × {newtonAccel.toFixed(2)} m/s²
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weight vs Mass Calculator */}
            <TabsContent value="weight" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Weight vs Mass Calculator
                  </CardTitle>
                  <CardDescription>Calculate weight (P = mg) and distinguish mass vs weight</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mass (kg)</Label>
                        <Slider min={1} max={200} value={[mass]} onValueChange={v => setMass(v[0])} />
                        <div className="text-right text-sm font-mono">{mass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Planet/Location</Label>
                        <Select value={planetGravity.toString()} onValueChange={v => setPlanetGravity(parseFloat(v))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9.81">Earth (9.81 m/s²)</SelectItem>
                            <SelectItem value="1.62">Moon (1.62 m/s²)</SelectItem>
                            <SelectItem value="3.72">Mars (3.72 m/s²)</SelectItem>
                            <SelectItem value="24.79">Jupiter (24.79 m/s²)</SelectItem>
                            <SelectItem value="8.87">Venus (8.87 m/s²)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Weight</div>
                        <div className="text-4xl font-bold text-purple-600">{weight.toFixed(2)} N</div>
                        <div className="text-sm text-muted-foreground mt-2">P = m × g</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Note:</strong> Mass remains constant ({mass} kg), but weight changes with gravity.<br />
                        <strong>Calculation:</strong> P = {mass} kg × {planetGravity} m/s² = {weight.toFixed(2)} N
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Equilibrium of Forces */}
            <TabsContent value="equilibrium" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Equilibrium of Forces</CardTitle>
                  <CardDescription>Equilibrium of 2 or 3 forces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Force 1</h4>
                        <div className="space-y-2">
                          <Label>Magnitude (N)</Label>
                          <Slider min={0} max={50} value={[eqForce1]} onValueChange={v => setEqForce1(v[0])} />
                          <div className="text-right text-sm font-mono">{eqForce1} N</div>
                        </div>
                        <div className="space-y-2">
                          <Label>Angle (°)</Label>
                          <Slider min={0} max={360} value={[eqAngle1]} onValueChange={v => setEqAngle1(v[0])} />
                          <div className="text-right text-sm font-mono">{eqAngle1}°</div>
                        </div>
                      </div>

                      <div className="space-y-4 border-t pt-4">
                        <h4 className="font-semibold">Force 2</h4>
                        <div className="space-y-2">
                          <Label>Magnitude (N)</Label>
                          <Slider min={0} max={50} value={[eqForce2]} onValueChange={v => setEqForce2(v[0])} />
                          <div className="text-right text-sm font-mono">{eqForce2} N</div>
                        </div>
                        <div className="space-y-2">
                          <Label>Angle (°)</Label>
                          <Slider min={0} max={360} value={[eqAngle2]} onValueChange={v => setEqAngle2(v[0])} />
                          <div className="text-right text-sm font-mono">{eqAngle2}°</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {(() => {
                        const f1x = eqForce1 * Math.cos(eqAngle1 * Math.PI / 180);
                        const f1y = eqForce1 * Math.sin(eqAngle1 * Math.PI / 180);
                        const f2x = eqForce2 * Math.cos(eqAngle2 * Math.PI / 180);
                        const f2y = eqForce2 * Math.sin(eqAngle2 * Math.PI / 180);
                        const sumX = f1x + f2x;
                        const sumY = f1y + f2y;
                        const isEquilibrium = Math.abs(sumX) < 0.5 && Math.abs(sumY) < 0.5;

                        return (
                          <div className="space-y-4">
                            <div className={`p-6 rounded-lg ${isEquilibrium ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                              <div className="text-sm text-muted-foreground mb-2">System Status</div>
                              <div className={`text-3xl font-bold ${isEquilibrium ? 'text-green-600' : 'text-red-600'}`}>
                                {isEquilibrium ? '✓ In Equilibrium' : '✗ Not in Equilibrium'}
                              </div>
                              <div className="mt-4 text-sm space-y-1">
                                <div>ΣFx = {sumX.toFixed(2)} N</div>
                                <div>ΣFy = {sumY.toFixed(2)} N</div>
                              </div>
                            </div>
                            <div className="text-sm bg-muted p-4 rounded">
                              <strong>Equilibrium Conditions:</strong><br />
                              ΣFx = 0 and ΣFy = 0
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Friction Force Calculator */}
            <TabsContent value="friction" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grip className="w-5 h-5" />
                    Friction Force Calculator
                  </CardTitle>
                  <CardDescription>Calculate static and kinetic friction forces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mass (kg)</Label>
                        <Slider min={1} max={50} value={[frictionMass]} onValueChange={v => setFrictionMass(v[0])} />
                        <div className="text-right text-sm font-mono">{frictionMass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Friction Coefficient μ</Label>
                        <Slider min={0} max={1} step={0.05} value={[frictionCoef]} onValueChange={v => setFrictionCoef(v[0])} />
                        <div className="text-right text-sm font-mono">{frictionCoef}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Applied Force (N)</Label>
                        <Slider min={0} max={100} value={[appliedForce]} onValueChange={v => setAppliedForce(v[0])} />
                        <div className="text-right text-sm font-mono">{appliedForce} N</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Normal Force</div>
                        <div className="text-2xl font-bold text-amber-600">{normalForce.toFixed(1)} N</div>
                        <div className="text-xs text-muted-foreground">N = m × g</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Friction Force</div>
                        <div className="text-2xl font-bold text-red-600">{frictionForce.toFixed(1)} N</div>
                        <div className="text-xs text-muted-foreground">f = μ × N</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Net Force</div>
                        <div className="text-2xl font-bold text-green-600">{netForce.toFixed(1)} N</div>
                        <div className="text-xs text-muted-foreground">F_net = F_applied - f</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Acceleration</div>
                        <div className="text-2xl font-bold text-blue-600">{frictionAccel.toFixed(2)} m/s²</div>
                        <div className="text-xs text-muted-foreground">a = F_net / m</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Satellite & Planetary Motion */}
            <TabsContent value="satellite" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Orbit className="w-5 h-5" />
                    Satellite & Planetary Motion
                  </CardTitle>
                  <CardDescription>Simulate satellite and planetary motion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Satellite Mass (kg)</Label>
                        <Slider min={100} max={10000} step={100} value={[satelliteMass]} onValueChange={v => setSatelliteMass(v[0])} />
                        <div className="text-right text-sm font-mono">{satelliteMass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Orbit Radius (km)</Label>
                        <Slider min={6500} max={400000} step={100} value={[orbitRadius]} onValueChange={v => setOrbitRadius(v[0])} />
                        <div className="text-right text-sm font-mono">{orbitRadius} km</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Reference:</strong><br />
                        Earth's radius: ~6,371 km<br />
                        ISS orbit: ~6,771 km<br />
                        Moon orbit: ~384,400 km
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Orbital Velocity</div>
                        <div className="text-4xl font-bold text-indigo-600">{(orbitalVelocity / 1000).toFixed(2)} km/s</div>
                        <div className="text-sm text-muted-foreground mt-2">v = √(GM/r)</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Centripetal Force:</strong><br />
                        Gravity provides the centripetal force needed for circular orbit.<br />
                        F = GMm/r² = mv²/r
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ==================== ENERGY TAB ==================== */}
        <TabsContent value="energy" className="space-y-6 mt-6">
          <Tabs value={energyTool} onValueChange={setEnergyTool}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="work">
                <Hammer className="w-4 h-4 mr-1" /> Work
              </TabsTrigger>
              <TabsTrigger value="kinetic">
                <Zap className="w-4 h-4 mr-1" /> Kinetic
              </TabsTrigger>
              <TabsTrigger value="potential">
                <Mountain className="w-4 h-4 mr-1" /> Potential
              </TabsTrigger>
              <TabsTrigger value="conservation">
                <Infinity className="w-4 h-4 mr-1" /> Conservation
              </TabsTrigger>
              <TabsTrigger value="power">
                <Lightbulb className="w-4 h-4 mr-1" /> Power
              </TabsTrigger>
            </TabsList>

            {/* Work Calculator */}
            <TabsContent value="work" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hammer className="w-5 h-5" />
                    Work Calculator
                  </CardTitle>
                  <CardDescription>Calculate work (W = F × d × cos θ)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Force (N)</Label>
                        <Slider min={0} max={200} value={[workForce]} onValueChange={v => setWorkForce(v[0])} />
                        <div className="text-right text-sm font-mono">{workForce} N</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Distance (m)</Label>
                        <Slider min={0} max={50} value={[workDistance]} onValueChange={v => setWorkDistance(v[0])} />
                        <div className="text-right text-sm font-mono">{workDistance} m</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Angle θ (°)</Label>
                        <Slider min={0} max={180} value={[workAngle]} onValueChange={v => setWorkAngle(v[0])} />
                        <div className="text-right text-sm font-mono">{workAngle}°</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Work Done</div>
                        <div className="text-4xl font-bold text-blue-600">{work.toFixed(2)} J</div>
                        <div className="text-sm text-muted-foreground mt-2">W = F × d × cos θ</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Calculation:</strong><br />
                        W = {workForce} N × {workDistance} m × cos({workAngle}°)<br />
                        W = {workForce} × {workDistance} × {Math.cos(workAngle * Math.PI / 180).toFixed(3)}<br />
                        W = {work.toFixed(2)} J
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Kinetic Energy */}
            <TabsContent value="kinetic" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Kinetic Energy
                  </CardTitle>
                  <CardDescription>Calculate kinetic energy (KE = ½mv²)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mass (kg)</Label>
                        <Slider min={1} max={100} value={[keMass]} onValueChange={v => setKeMass(v[0])} />
                        <div className="text-right text-sm font-mono">{keMass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Velocity (m/s)</Label>
                        <Slider min={0} max={50} value={[velocity]} onValueChange={v => setVelocity(v[0])} />
                        <div className="text-right text-sm font-mono">{velocity} m/s</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Kinetic Energy</div>
                        <div className="text-4xl font-bold text-orange-600">{kineticEnergy.toFixed(2)} J</div>
                        <div className="text-sm text-muted-foreground mt-2">KE = ½mv²</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Calculation:</strong><br />
                        KE = ½ × {keMass} kg × ({velocity} m/s)²<br />
                        KE = 0.5 × {keMass} × {velocity * velocity}<br />
                        KE = {kineticEnergy.toFixed(2)} J
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Potential Energy */}
            <TabsContent value="potential" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mountain className="w-5 h-5" />
                    Potential Energy
                  </CardTitle>
                  <CardDescription>Potential energy (gravitational, elastic, electric)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={peType} onValueChange={setPeType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gravitational">Gravitational (mgh)</SelectItem>
                            <SelectItem value="elastic">Elastic (½kx²)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Mass (kg)</Label>
                        <Slider min={1} max={100} value={[peMass]} onValueChange={v => setPeMass(v[0])} />
                        <div className="text-right text-sm font-mono">{peMass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>{peType === "gravitational" ? "Height (m)" : "Displacement (m)"}</Label>
                        <Slider min={0} max={50} value={[height]} onValueChange={v => setHeight(v[0])} />
                        <div className="text-right text-sm font-mono">{height} m</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Potential Energy</div>
                        <div className="text-4xl font-bold text-green-600">{potentialEnergy.toFixed(2)} J</div>
                        <div className="text-sm text-muted-foreground mt-2">
                          {peType === "gravitational" ? "PE = mgh" : "PE = ½kx²"}
                        </div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        {peType === "gravitational" ? (
                          <>
                            <strong>Gravitational PE:</strong><br />
                            PE = {peMass} kg × 9.81 m/s² × {height} m<br />
                            PE = {potentialEnergy.toFixed(2)} J
                          </>
                        ) : (
                          <>
                            <strong>Elastic PE (k=100 N/m):</strong><br />
                            PE = ½ × 100 × ({height})²<br />
                            PE = {potentialEnergy.toFixed(2)} J
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Energy Conservation */}
            <TabsContent value="conservation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Infinity className="w-5 h-5" />
                    Mechanical Energy Conservation
                  </CardTitle>
                  <CardDescription>Simulate mechanical energy conservation principle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mass (kg)</Label>
                        <Slider min={1} max={50} value={[conservationMass]} onValueChange={v => setConservationMass(v[0])} />
                        <div className="text-right text-sm font-mono">{conservationMass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Initial Height (m)</Label>
                        <Slider min={1} max={50} value={[conservationHeight]} onValueChange={v => setConservationHeight(v[0])} />
                        <div className="text-right text-sm font-mono">{conservationHeight} m</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Initial Potential Energy</div>
                        <div className="text-2xl font-bold text-blue-600">{initialPE.toFixed(2)} J</div>
                        <div className="text-xs text-muted-foreground">PE = mgh</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Final Kinetic Energy</div>
                        <div className="text-2xl font-bold text-orange-600">{finalKE.toFixed(2)} J</div>
                        <div className="text-xs text-muted-foreground">KE = ½mv²</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Final Velocity</div>
                        <div className="text-2xl font-bold text-green-600">{conservationFinalVelocity.toFixed(2)} m/s</div>
                        <div className="text-xs text-muted-foreground">v = √(2gh)</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Conservation Law:</strong><br />
                        PE_initial = KE_final<br />
                        {initialPE.toFixed(2)} J = {finalKE.toFixed(2)} J ✓
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Power Calculator */}
            <TabsContent value="power" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Power Calculator
                  </CardTitle>
                  <CardDescription>Calculate power (P = W/t)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Work Done (J)</Label>
                        <Slider min={100} max={10000} step={100} value={[powerWork]} onValueChange={v => setPowerWork(v[0])} />
                        <div className="text-right text-sm font-mono">{powerWork} J</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Time (s)</Label>
                        <Slider min={1} max={100} value={[powerTime]} onValueChange={v => setPowerTime(v[0])} />
                        <div className="text-right text-sm font-mono">{powerTime} s</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Power</div>
                        <div className="text-4xl font-bold text-yellow-600">{power.toFixed(2)} W</div>
                        <div className="text-sm text-muted-foreground mt-2">P = W / t</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Calculation:</strong><br />
                        P = {powerWork} J / {powerTime} s<br />
                        P = {power.toFixed(2)} W<br />
                        <br />
                        <strong>Also in:</strong><br />
                        {(power / 1000).toFixed(3)} kW<br />
                        {(power / 745.7).toFixed(3)} hp
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ==================== OSCILLATIONS & WAVES TAB ==================== */}
        <TabsContent value="waves" className="space-y-6 mt-6">
          <Tabs value={wavesTool} onValueChange={setWavesTool}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="shm">
                <Activity className="w-4 h-4 mr-1" /> SHM
              </TabsTrigger>
              <TabsTrigger value="damped">
                <TrendingDown className="w-4 h-4 mr-1" /> Damped
              </TabsTrigger>
              <TabsTrigger value="mechanical">
                <Waves className="w-4 h-4 mr-1" /> Mechanical
              </TabsTrigger>
              <TabsTrigger value="sound">
                <Radio className="w-4 h-4 mr-1" /> Sound
              </TabsTrigger>
            </TabsList>

            {/* Simple Harmonic Motion */}
            <TabsContent value="shm" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Simple Harmonic Motion (SHM) Simulator
                  </CardTitle>
                  <CardDescription>Simulate oscillating systems: mass-spring, simple pendulum, and physical pendulum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>System Type</Label>
                      <Select value={shmSystem} onValueChange={setShmSystem}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mass-spring">Mass-Spring System</SelectItem>
                          <SelectItem value="simple-pendulum">Simple Pendulum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {shmSystem === 'mass-spring' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Mass (kg)</Label>
                            <Slider min={0.1} max={10} step={0.1} value={[springMass]} onValueChange={v => setSpringMass(v[0])} />
                            <div className="text-right text-sm font-mono">{springMass} kg</div>
                          </div>
                          <div className="space-y-2">
                            <Label>Spring Constant k (N/m)</Label>
                            <Slider min={1} max={100} value={[springConstant]} onValueChange={v => setSpringConstant(v[0])} />
                            <div className="text-right text-sm font-mono">{springConstant} N/m</div>
                          </div>
                          <div className="space-y-2">
                            <Label>Amplitude A (m)</Label>
                            <Slider min={0.01} max={0.5} step={0.01} value={[springAmplitude]} onValueChange={v => setSpringAmplitude(v[0])} />
                            <div className="text-right text-sm font-mono">{springAmplitude} m</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground">Angular Frequency ω</div>
                            <div className="text-2xl font-bold text-blue-600">{springOmega.toFixed(2)} rad/s</div>
                            <div className="text-xs text-muted-foreground">ω = √(k/m)</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground">Period T</div>
                            <div className="text-2xl font-bold text-green-600">{springPeriod.toFixed(3)} s</div>
                            <div className="text-xs text-muted-foreground">T = 2π/ω</div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground">Frequency f</div>
                            <div className="text-2xl font-bold text-purple-600">{springFreq.toFixed(2)} Hz</div>
                            <div className="text-xs text-muted-foreground">f = 1/T</div>
                          </div>
                          <div className="text-sm bg-muted p-4 rounded">
                            <strong>Equation of motion:</strong><br />
                            x(t) = A cos(ωt)<br />
                            x(t) = {springAmplitude} cos({springOmega.toFixed(2)}t)
                          </div>
                        </div>
                      </div>
                    )}

                    {shmSystem === 'simple-pendulum' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Length L (m)</Label>
                            <Slider min={0.1} max={5} step={0.1} value={[pendulumLength]} onValueChange={v => setPendulumLength(v[0])} />
                            <div className="text-right text-sm font-mono">{pendulumLength} m</div>
                          </div>
                          <div className="space-y-2">
                            <Label>Amplitude θ₀ (rad)</Label>
                            <Slider min={0.01} max={0.5} step={0.01} value={[pendulumAmplitude]} onValueChange={v => setPendulumAmplitude(v[0])} />
                            <div className="text-right text-sm font-mono">{pendulumAmplitude} rad ({(pendulumAmplitude * 180 / Math.PI).toFixed(1)}°)</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground">Angular Frequency ω</div>
                            <div className="text-2xl font-bold text-blue-600">{pendulumOmega.toFixed(2)} rad/s</div>
                            <div className="text-xs text-muted-foreground">ω = √(g/L)</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground">Period T</div>
                            <div className="text-2xl font-bold text-green-600">{pendulumPeriod.toFixed(3)} s</div>
                            <div className="text-xs text-muted-foreground">T = 2π√(L/g)</div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground">Frequency f</div>
                            <div className="text-2xl font-bold text-purple-600">{pendulumFreq.toFixed(2)} Hz</div>
                            <div className="text-xs text-muted-foreground">f = 1/T</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Damped Oscillations */}
            <TabsContent value="damped" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Damped Oscillations
                  </CardTitle>
                  <CardDescription>Study damped oscillations and damping coefficient effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mass (kg)</Label>
                        <Slider min={0.1} max={10} step={0.1} value={[dampedMass]} onValueChange={v => setDampedMass(v[0])} />
                        <div className="text-right text-sm font-mono">{dampedMass} kg</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Spring Constant k (N/m)</Label>
                        <Slider min={1} max={100} value={[dampedK]} onValueChange={v => setDampedK(v[0])} />
                        <div className="text-right text-sm font-mono">{dampedK} N/m</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Damping Coefficient b (kg/s)</Label>
                        <Slider min={0} max={10} step={0.1} value={[dampingCoef]} onValueChange={v => setDampingCoef(v[0])} />
                        <div className="text-right text-sm font-mono">{dampingCoef} kg/s</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Initial Amplitude (m)</Label>
                        <Slider min={0.01} max={0.5} step={0.01} value={[dampedAmplitude]} onValueChange={v => setDampedAmplitude(v[0])} />
                        <div className="text-right text-sm font-mono">{dampedAmplitude} m</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`p-6 rounded-lg ${dampingType === 'Under-damped' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                        <div className="text-sm text-muted-foreground mb-2">Damping Type</div>
                        <div className={`text-3xl font-bold ${dampingType === 'Under-damped' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {dampingType}
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Natural Frequency ω₀</div>
                        <div className="text-2xl font-bold text-green-600">{dampedOmega0.toFixed(2)} rad/s</div>
                        <div className="text-xs text-muted-foreground">ω₀ = √(k/m)</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Damping Ratio γ</div>
                        <div className="text-2xl font-bold text-purple-600">{dampedGamma.toFixed(3)} s⁻¹</div>
                        <div className="text-xs text-muted-foreground">γ = b/(2m)</div>
                      </div>
                      {dampingType === 'Under-damped' && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Damped Frequency ω</div>
                          <div className="text-2xl font-bold text-indigo-600">{dampedOmega.toFixed(2)} rad/s</div>
                          <div className="text-xs text-muted-foreground">ω = √(ω₀² - γ²)</div>
                        </div>
                      )}
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Equation:</strong><br />
                        x(t) = A e^(-γt) cos(ωt)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mechanical Waves */}
            <TabsContent value="mechanical" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="w-5 h-5" />
                    Mechanical Wave Simulator
                  </CardTitle>
                  <CardDescription>Simulate progressive and periodic waves with speed, frequency, and wavelength</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Amplitude A (m)</Label>
                        <Slider min={0.01} max={0.2} step={0.01} value={[waveAmplitude]} onValueChange={v => setWaveAmplitude(v[0])} />
                        <div className="text-right text-sm font-mono">{waveAmplitude} m</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Frequency f (Hz)</Label>
                        <Slider min={0.1} max={10} step={0.1} value={[waveFrequency]} onValueChange={v => setWaveFrequency(v[0])} />
                        <div className="text-right text-sm font-mono">{waveFrequency} Hz</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Wave Speed v (m/s)</Label>
                        <Slider min={1} max={20} step={0.5} value={[waveSpeed]} onValueChange={v => setWaveSpeed(v[0])} />
                        <div className="text-right text-sm font-mono">{waveSpeed} m/s</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Wavelength λ</div>
                        <div className="text-2xl font-bold text-blue-600">{waveLength.toFixed(2)} m</div>
                        <div className="text-xs text-muted-foreground">λ = v / f</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Angular Frequency ω</div>
                        <div className="text-2xl font-bold text-green-600">{waveOmega.toFixed(2)} rad/s</div>
                        <div className="text-xs text-muted-foreground">ω = 2πf</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Wave Number k</div>
                        <div className="text-2xl font-bold text-purple-600">{waveNumber.toFixed(2)} rad/m</div>
                        <div className="text-xs text-muted-foreground">k = 2π/λ</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Wave Equation:</strong><br />
                        y(x,t) = A sin(kx - ωt)<br />
                        y(x,t) = {waveAmplitude} sin({waveNumber.toFixed(2)}x - {waveOmega.toFixed(2)}t)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sound Waves */}
            <TabsContent value="sound" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Sound Waves
                  </CardTitle>
                  <CardDescription>Explore sound wave properties, frequency, intensity, and echo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Frequency (Hz)</Label>
                        <Slider min={20} max={20000} step={10} value={[soundFrequency]} onValueChange={v => setSoundFrequency(v[0])} />
                        <div className="text-right text-sm font-mono">{soundFrequency} Hz</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Intensity (dB)</Label>
                        <Slider min={0} max={120} value={[soundIntensity]} onValueChange={v => setSoundIntensity(v[0])} />
                        <div className="text-right text-sm font-mono">{soundIntensity} dB</div>
                      </div>
                      <div className="bg-muted p-4 rounded space-y-2 text-sm">
                        <div className="font-semibold">Reference Frequencies:</div>
                        <div className="flex justify-between">
                          <span>Middle C (C4):</span>
                          <Button size="sm" variant="outline" onClick={() => setSoundFrequency(261.63)}>261.63 Hz</Button>
                        </div>
                        <div className="flex justify-between">
                          <span>A4 (Concert pitch):</span>
                          <Button size="sm" variant="outline" onClick={() => setSoundFrequency(440)}>440 Hz</Button>
                        </div>
                        <div className="flex justify-between">
                          <span>C5:</span>
                          <Button size="sm" variant="outline" onClick={() => setSoundFrequency(523.25)}>523.25 Hz</Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Wavelength λ</div>
                        <div className="text-2xl font-bold text-blue-600">{soundWaveLength.toFixed(3)} m</div>
                        <div className="text-xs text-muted-foreground">λ = v / f (v = 343 m/s in air)</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Period T</div>
                        <div className="text-2xl font-bold text-green-600">{(soundPeriod * 1000).toFixed(3)} ms</div>
                        <div className="text-xs text-muted-foreground">T = 1/f</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Frequency Range</div>
                        <div className="text-lg font-bold text-purple-600">
                          {soundFrequency < 20 ? 'Infrasound' : soundFrequency > 20000 ? 'Ultrasound' : 'Audible'}
                        </div>
                        <div className="text-xs text-muted-foreground">Human range: 20 Hz - 20 kHz</div>
                      </div>
                      <div className="text-sm bg-muted p-4 rounded">
                        <strong>Sound Levels:</strong><br />
                        0 dB: Threshold of hearing<br />
                        60 dB: Normal conversation<br />
                        120 dB: Threshold of pain
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ==================== ELECTRICITY & MAGNETISM TAB ==================== */}
        <TabsContent value="electricity" className="space-y-6 mt-6">
          <Tabs value={electricityTool} onValueChange={setElectricityTool}>
            <div className="relative flex items-center gap-2">
              {/* Left scroll button */}
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => scrollElectricityTabs('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Scrollable tabs container */}
              <div ref={electricityTabsRef} className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth">
                <TabsList className="inline-flex w-auto gap-1 flex-nowrap">
                  <TabsTrigger value="circuit-builder" className="whitespace-nowrap">Circuit Builder</TabsTrigger>
                  <TabsTrigger value="ohms-law" className="whitespace-nowrap">Ohm's Law</TabsTrigger>
                  <TabsTrigger value="series-parallel" className="whitespace-nowrap">Series/Parallel</TabsTrigger>
                  <TabsTrigger value="voltage-addition" className="whitespace-nowrap">Voltage Addition</TabsTrigger>
                  <TabsTrigger value="nodal-law" className="whitespace-nowrap">Nodal Law</TabsTrigger>
                  <TabsTrigger value="electrical-power" className="whitespace-nowrap">Power</TabsTrigger>
                  <TabsTrigger value="electrical-energy" className="whitespace-nowrap">Energy</TabsTrigger>
                  <TabsTrigger value="rc-circuit" className="whitespace-nowrap">RC Circuit</TabsTrigger>
                  <TabsTrigger value="rl-circuit" className="whitespace-nowrap">RL Circuit</TabsTrigger>
                  <TabsTrigger value="rlc-circuit" className="whitespace-nowrap">RLC Circuit</TabsTrigger>
                  <TabsTrigger value="ac-circuit" className="whitespace-nowrap">AC Circuit</TabsTrigger>
                  <TabsTrigger value="magnetic-field" className="whitespace-nowrap">Magnetic Field</TabsTrigger>
                  <TabsTrigger value="lorentz-force" className="whitespace-nowrap">Lorentz Force</TabsTrigger>
                  <TabsTrigger value="em-induction" className="whitespace-nowrap">EM Induction</TabsTrigger>
                  <TabsTrigger value="electric-field" className="whitespace-nowrap">Electric Field</TabsTrigger>
                  <TabsTrigger value="coulombs-law" className="whitespace-nowrap">Coulomb's Law</TabsTrigger>
                  <TabsTrigger value="electric-potential" className="whitespace-nowrap">Potential Energy</TabsTrigger>
                </TabsList>
              </div>

              {/* Right scroll button */}
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => scrollElectricityTabs('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Circuit Builder */}
            <TabsContent value="circuit-builder" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" /> Circuit Builder
                  </CardTitle>
                  <CardDescription>Build simple circuits with battery, resistor, lamp, and switch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 p-8 rounded-lg text-center">
                    <p className="text-lg mb-4">Interactive Circuit Builder</p>
                    <p className="text-muted-foreground mb-6">
                      This tool allows you to build and simulate simple electrical circuits by connecting:<br />
                      • Battery (power source)<br />
                      • Resistors (resistance elements)<br />
                      • Lamps (output devices)<br />
                      • Switches (control elements)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-background p-4 rounded">
                        <h4 className="font-bold mb-2">Components</h4>
                        <p className="text-sm text-muted-foreground">Drag and drop circuit components to build your circuit</p>
                      </div>
                      <div className="bg-background p-4 rounded">
                        <h4 className="font-bold mb-2">Connections</h4>
                        <p className="text-sm text-muted-foreground">Connect components with wires to complete the circuit</p>
                      </div>
                      <div className="bg-background p-4 rounded">
                        <h4 className="font-bold mb-2">Simulation</h4>
                        <p className="text-sm text-muted-foreground">Test your circuit and observe current flow</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-6 italic">
                      Full interactive circuit builder coming soon! For now, use the other tools to study circuit properties.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ohm's Law Calculator */}
            <TabsContent value="ohms-law" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" /> Ohm's Law Calculator
                  </CardTitle>
                  <CardDescription>Calculate voltage, current, or resistance using V = I × R</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Calculate For:</Label>
                        <Select value={ohmCalculateFor} onValueChange={setOhmCalculateFor}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="voltage">Voltage (V)</SelectItem>
                            <SelectItem value="current">Current (I)</SelectItem>
                            <SelectItem value="resistance">Resistance (R)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {ohmCalculateFor !== 'voltage' && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Voltage (V): {ohmVoltage} V</Label>
                          </div>
                          <Slider
                            value={[ohmVoltage]}
                            onValueChange={([val]) => setOhmVoltage(val)}
                            min={0}
                            max={24}
                            step={0.1}
                          />
                        </div>
                      )}

                      {ohmCalculateFor !== 'current' && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Current (I): {ohmCurrent} A</Label>
                          </div>
                          <Slider
                            value={[ohmCurrent]}
                            onValueChange={([val]) => setOhmCurrent(val)}
                            min={0}
                            max={10}
                            step={0.1}
                          />
                        </div>
                      )}

                      {ohmCalculateFor !== 'resistance' && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Resistance (R): {ohmResistance} Ω</Label>
                          </div>
                          <Slider
                            value={[ohmResistance]}
                            onValueChange={([val]) => setOhmResistance(val)}
                            min={1}
                            max={100}
                            step={1}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">Results:</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Calculated {ohmCalculateFor === 'voltage' ? 'Voltage' : ohmCalculateFor === 'current' ? 'Current' : 'Resistance'}:</strong> {ohmCalculatedValue.toFixed(3)} {ohmCalculateFor === 'voltage' ? 'V' : ohmCalculateFor === 'current' ? 'A' : 'Ω'}</p>
                          <div className="mt-4 pt-4 border-t">
                            <p><strong>Ohm's Law:</strong> V = I × R</p>
                            <p className="text-muted-foreground mt-2">
                              V = Voltage (Volts)<br />
                              I = Current (Amperes)<br />
                              R = Resistance (Ohms)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Series/Parallel Circuits */}
            <TabsContent value="series-parallel" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Series vs Parallel Circuits</CardTitle>
                  <CardDescription>Compare total resistance in series and parallel configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Circuit Type:</Label>
                        <Select value={circuitType} onValueChange={setCircuitType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="series">Series Circuit</SelectItem>
                            <SelectItem value="parallel">Parallel Circuit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>R₁: {r1} Ω</Label>
                        <Slider value={[r1]} onValueChange={([val]) => setR1(val)} min={1} max={100} step={1} />
                      </div>

                      <div className="space-y-2">
                        <Label>R₂: {r2} Ω</Label>
                        <Slider value={[r2]} onValueChange={([val]) => setR2(val)} min={1} max={100} step={1} />
                      </div>

                      <div className="space-y-2">
                        <Label>R₃: {r3} Ω</Label>
                        <Slider value={[r3]} onValueChange={([val]) => setR3(val)} min={1} max={100} step={1} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">Results:</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Total Resistance:</strong> {totalResistance.toFixed(2)} Ω</p>
                          <div className="mt-4 pt-4 border-t">
                            <p><strong>{circuitType === 'series' ? 'Series' : 'Parallel'} Formula:</strong></p>
                            <p className="text-muted-foreground mt-2">
                              {circuitType === 'series'
                                ? 'Rₜₒₜₐₗ = R₁ + R₂ + R₃'
                                : '1/Rₜₒₜₐₗ = 1/R₁ + 1/R₂ + 1/R₃'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Voltage Addition */}
            <TabsContent value="voltage-addition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Voltage Addition
                  </CardTitle>
                  <CardDescription>Study voltage addition in series circuits (Additive Property of Voltages)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Voltage 1 (V₁): {v1} V</Label>
                        <Slider value={[v1]} onValueChange={([val]) => setV1(val)} min={0} max={20} step={0.5} />
                      </div>

                      <div className="space-y-2">
                        <Label>Voltage 2 (V₂): {v2} V</Label>
                        <Slider value={[v2]} onValueChange={([val]) => setV2(val)} min={0} max={20} step={0.5} />
                      </div>

                      <div className="space-y-2">
                        <Label>Voltage 3 (V₃): {v3} V</Label>
                        <Slider value={[v3]} onValueChange={([val]) => setV3(val)} min={0} max={20} step={0.5} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">Results:</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Total Voltage:</strong> {totalVoltage.toFixed(2)} V</p>
                          <div className="mt-4 pt-4 border-t">
                            <p><strong>Additive Property:</strong></p>
                            <p className="text-muted-foreground mt-2">
                              In a series circuit, the total voltage across multiple components is the sum of individual voltages:<br /><br />
                              Vₜₒₜₐₗ = V₁ + V₂ + V₃
                            </p>
                            <p className="text-muted-foreground mt-4">
                              <strong>Example:</strong> Three batteries in series (1AC curriculum)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nodal Law (Kirchhoff's Current Law) */}
            <TabsContent value="nodal-law" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" /> Nodal Law (Kirchhoff's Current Law)
                  </CardTitle>
                  <CardDescription>Apply Kirchhoff's current law: sum of currents entering a node equals sum leaving</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 p-8 rounded-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold mb-4">Kirchhoff's Current Law (KCL)</h3>
                      <p className="text-muted-foreground">
                        At any junction (node) in an electrical circuit, the sum of currents entering the node equals the sum of currents leaving the node.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-background p-6 rounded-lg">
                        <h4 className="font-bold mb-3">Mathematical Expression:</h4>
                        <p className="text-sm mb-2">∑ Iᵢₙ = ∑ Iₒᵤₜ</p>
                        <p className="text-sm text-muted-foreground">Or equivalently:</p>
                        <p className="text-sm">∑ I = 0</p>
                        <p className="text-xs text-muted-foreground mt-2">(Sum of all currents at a node = 0)</p>
                      </div>

                      <div className="bg-background p-6 rounded-lg">
                        <h4 className="font-bold mb-3">Example:</h4>
                        <p className="text-sm mb-2">At node A:</p>
                        <p className="text-sm">I₁ + I₂ = I₃ + I₄</p>
                        <p className="text-xs text-muted-foreground mt-3">
                          If I₁ = 5A, I₂ = 3A, I₃ = 6A<br />
                          Then I₄ = 5 + 3 - 6 = 2A
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Physical Principle:</strong> Conservation of electric charge - charge cannot accumulate at a node, so incoming charge must equal outgoing charge.
                      </p>
                      <p className="text-sm text-muted-foreground mt-3">
                        <strong>Application:</strong> Used to analyze complex circuits with multiple branches (1AC curriculum).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Electrical Power */}
            <TabsContent value="electrical-power" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" /> Electrical Power
                  </CardTitle>
                  <CardDescription>Calculate electrical power using P = U × I</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Voltage (U): {powerVoltage} V</Label>
                        <Slider value={[powerVoltage]} onValueChange={([val]) => setPowerVoltage(val)} min={0} max={240} step={1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Current (I): {powerCurrent} A</Label>
                        <Slider value={[powerCurrent]} onValueChange={([val]) => setPowerCurrent(val)} min={0} max={20} step={0.1} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">Results:</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Power:</strong> {electricalPower.toFixed(2)} W ({(electricalPower / 1000).toFixed(3)} kW)</p>
                          <div className="mt-4 pt-4 border-t">
                            <p><strong>Formula:</strong> P = U × I</p>
                            <p className="text-muted-foreground mt-2">
                              P = Power (Watts)<br />
                              U = Voltage (Volts)<br />
                              I = Current (Amperes)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Electrical Energy */}
            <TabsContent value="electrical-energy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="w-5 h-5" /> Electrical Energy
                  </CardTitle>
                  <CardDescription>Calculate electrical energy consumption using E = P × t</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Power (P): {energyPower} W</Label>
                        <Slider value={[energyPower]} onValueChange={([val]) => setEnergyPower(val)} min={0} max={3000} step={10} />
                      </div>

                      <div className="space-y-2">
                        <Label>Time (t): {energyTime} hours</Label>
                        <Slider value={[energyTime]} onValueChange={([val]) => setEnergyTime(val)} min={0} max={24} step={0.5} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">Results:</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Energy:</strong> {electricalEnergy.toFixed(2)} Wh</p>
                          <p><strong>Energy:</strong> {electricalEnergyKwh.toFixed(3)} kWh</p>
                          <div className="mt-4 pt-4 border-t">
                            <p><strong>Formula:</strong> E = P × t</p>
                            <p className="text-muted-foreground mt-2">
                              E = Energy (Watt-hours)<br />
                              P = Power (Watts)<br />
                              t = Time (hours)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* RC Circuit */}
            <TabsContent value="rc-circuit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="w-5 h-5" /> RC Circuit (Charge/Discharge)
                  </CardTitle>
                  <CardDescription>Capacitor charge and discharge in RC circuit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Resistance (R): {rcResistance} Ω</Label>
                        <Slider value={[rcResistance]} onValueChange={([val]) => setRcResistance(val)} min={100} max={10000} step={100} />
                      </div>

                      <div className="space-y-2">
                        <Label>Capacitance (C): {(rcCapacitance * 1000).toFixed(3)} mF</Label>
                        <Slider value={[rcCapacitance * 1000]} onValueChange={([val]) => setRcCapacitance(val / 1000)} min={0.1} max={10} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Supply Voltage: {rcVoltage} V</Label>
                        <Slider value={[rcVoltage]} onValueChange={([val]) => setRcVoltage(val)} min={1} max={24} step={1} />
                      </div>

                      <div className="bg-primary/10 p-4 rounded-lg text-sm">
                        <p><strong>Time Constant (τ):</strong> {rcTimeConstant.toFixed(4)} s</p>
                        <p className="text-muted-foreground mt-2">τ = R × C</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={rcChargingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="voltage" stroke="#8884d8" name="Voltage" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* RL Circuit */}
            <TabsContent value="rl-circuit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>RL Circuit</CardTitle>
                  <CardDescription>Current buildup in RL circuit with inductance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Resistance (R): {rlResistance} Ω</Label>
                        <Slider value={[rlResistance]} onValueChange={([val]) => setRlResistance(val)} min={10} max={1000} step={10} />
                      </div>

                      <div className="space-y-2">
                        <Label>Inductance (L): {rlInductance} H</Label>
                        <Slider value={[rlInductance]} onValueChange={([val]) => setRlInductance(val)} min={0.1} max={2} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Supply Voltage: {rlVoltage} V</Label>
                        <Slider value={[rlVoltage]} onValueChange={([val]) => setRlVoltage(val)} min={1} max={24} step={1} />
                      </div>

                      <div className="bg-primary/10 p-4 rounded-lg text-sm">
                        <p><strong>Time Constant (τ):</strong> {rlTimeConstant.toFixed(4)} s</p>
                        <p className="text-muted-foreground mt-2">τ = L / R</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={rlCurrentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="t" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="current" stroke="#82ca9d" name="Current" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* RLC Circuit */}
            <TabsContent value="rlc-circuit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" /> RLC Circuit (Oscillations)
                  </CardTitle>
                  <CardDescription>Study free and forced oscillations in RLC circuit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Resistance (R): {rlcResistance} Ω</Label>
                        <Slider value={[rlcResistance]} onValueChange={([val]) => setRlcResistance(val)} min={1} max={100} step={1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Inductance (L): {rlcInductance} H</Label>
                        <Slider value={[rlcInductance]} onValueChange={([val]) => setRlcInductance(val)} min={0.01} max={1} step={0.01} />
                      </div>

                      <div className="space-y-2">
                        <Label>Capacitance (C): {(rlcCapacitance * 1e6).toFixed(1)} μF</Label>
                        <Slider value={[rlcCapacitance * 1e6]} onValueChange={([val]) => setRlcCapacitance(val / 1e6)} min={10} max={1000} step={10} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg text-sm">
                        <p><strong>Natural Frequency (f₀):</strong> {rlcFrequency.toFixed(2)} Hz</p>
                        <p><strong>Damping Type:</strong> {rlcDampingType}</p>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-muted-foreground">
                            f₀ = 1 / (2π√(LC))<br />
                            Damping ratio: γ = R / (2L)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AC Circuit Analyzer */}
            <TabsContent value="ac-circuit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="w-5 h-5" /> AC Circuit Analyzer
                  </CardTitle>
                  <CardDescription>Analyze AC circuits: impedance and phase difference</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 p-8 rounded-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold mb-4">AC Circuit Analysis (2BAC PC)</h3>
                      <p className="text-muted-foreground">
                        Analysis of alternating current (AC) circuits with resistors, capacitors, and inductors
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-background p-6 rounded-lg">
                        <h4 className="font-bold mb-3">Impedance (Z):</h4>
                        <p className="text-sm mb-2">Z = √(R² + (Xₗ - Xc)²)</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Xₗ = ωL (Inductive reactance)<br />
                          Xc = 1/(ωC) (Capacitive reactance)<br />
                          ω = 2πf (Angular frequency)
                        </p>
                      </div>

                      <div className="bg-background p-6 rounded-lg">
                        <h4 className="font-bold mb-3">Phase Difference (φ):</h4>
                        <p className="text-sm mb-2">tan(φ) = (Xₗ - Xc) / R</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          φ &gt; 0: Inductive circuit (current lags voltage)<br />
                          φ &lt; 0: Capacitive circuit (current leads voltage)<br />
                          φ = 0: Resistive circuit (in phase)
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-bold mb-3">Key Concepts:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-background p-4 rounded">
                          <p className="font-semibold text-sm mb-1">Impedance</p>
                          <p className="text-xs text-muted-foreground">Total opposition to AC current (combines R, L, C)</p>
                        </div>
                        <div className="bg-background p-4 rounded">
                          <p className="font-semibold text-sm mb-1">Reactance</p>
                          <p className="text-xs text-muted-foreground">Opposition from L and C that varies with frequency</p>
                        </div>
                        <div className="bg-background p-4 rounded">
                          <p className="font-semibold text-sm mb-1">Phase Shift</p>
                          <p className="text-xs text-muted-foreground">Time delay between voltage and current waveforms</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-6 italic text-center">
                      Interactive AC circuit simulator with phasor diagrams coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Magnetic Field */}
            <TabsContent value="magnetic-field" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Magnet className="w-5 h-5" /> Magnetic Field Visualizer
                  </CardTitle>
                  <CardDescription>Calculate magnetic field strength from current-carrying conductors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Field Type:</Label>
                        <Select value={magneticFieldType} onValueChange={setMagneticFieldType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wire">Straight Wire</SelectItem>
                            <SelectItem value="loop">Current Loop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Current (I): {magneticCurrent} A</Label>
                        <Slider value={[magneticCurrent]} onValueChange={([val]) => setMagneticCurrent(val)} min={0} max={20} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Distance (r): {magneticDistance} m</Label>
                        <Slider value={[magneticDistance]} onValueChange={([val]) => setMagneticDistance(val)} min={0.01} max={1} step={0.01} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg text-sm">
                        <p><strong>Magnetic Field (B):</strong> {(magneticFieldStrength * 1e6).toFixed(3)} μT</p>
                        <div className="mt-4 pt-4 border-t">
                          <p><strong>Formula ({magneticFieldType}):</strong></p>
                          <p className="text-muted-foreground mt-2">
                            {magneticFieldType === 'wire'
                              ? 'B = (μ₀ × I) / (2π × r)'
                              : 'B = (μ₀ × I) / (2 × r)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lorentz Force */}
            <TabsContent value="lorentz-force" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="w-5 h-5" /> Lorentz Force Calculator
                  </CardTitle>
                  <CardDescription>Calculate force on moving charge in magnetic field</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Charge (q): {lorentzCharge.toExponential(2)} C</Label>
                        <div className="text-sm text-muted-foreground">Electron charge: 1.6 × 10⁻¹⁹ C</div>
                      </div>

                      <div className="space-y-2">
                        <Label>Velocity (v): {(lorentzVelocity / 1e6).toFixed(2)} × 10⁶ m/s</Label>
                        <Slider value={[lorentzVelocity / 1e6]} onValueChange={([val]) => setLorentzVelocity(val * 1e6)} min={0.1} max={10} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Magnetic Field (B): {lorentzField} T</Label>
                        <Slider value={[lorentzField]} onValueChange={([val]) => setLorentzField(val)} min={0} max={2} step={0.01} />
                      </div>

                      <div className="space-y-2">
                        <Label>Angle (θ): {lorentzAngle}°</Label>
                        <Slider value={[lorentzAngle]} onValueChange={([val]) => setLorentzAngle(val)} min={0} max={180} step={1} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg text-sm">
                        <p><strong>Lorentz Force (F):</strong> {lorentzForce.toExponential(3)} N</p>
                        <div className="mt-4 pt-4 border-t">
                          <p><strong>Formula:</strong></p>
                          <p className="text-muted-foreground mt-2">
                            F = q × v × B × sin(θ)<br /><br />
                            q = Charge (C)<br />
                            v = Velocity (m/s)<br />
                            B = Magnetic field (T)<br />
                            θ = Angle between v and B
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Electromagnetic Induction */}
            <TabsContent value="em-induction" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="w-5 h-5" /> Electromagnetic Induction
                  </CardTitle>
                  <CardDescription>Study Faraday's law and electromagnetic induction (2BAC PC)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 p-8 rounded-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold mb-4">Faraday's Law of Electromagnetic Induction</h3>
                      <p className="text-muted-foreground">
                        A changing magnetic field through a conductor induces an electromotive force (EMF)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-background p-6 rounded-lg">
                        <h4 className="font-bold mb-3">Faraday's Law:</h4>
                        <p className="text-sm mb-2">ε = -N × (dΦ/dt)</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          ε = Induced EMF (Volts)<br />
                          N = Number of turns in coil<br />
                          dΦ/dt = Rate of change of magnetic flux<br />
                          Φ = B × A × cos(θ)
                        </p>
                      </div>

                      <div className="bg-background p-6 rounded-lg">
                        <h4 className="font-bold mb-3">Lenz's Law:</h4>
                        <p className="text-sm mb-2">The negative sign indicates direction</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          The induced current creates a magnetic field that opposes the change in flux that produced it.
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">
                          <strong>Example:</strong> Moving a magnet toward a coil induces a current that creates a field opposing the magnet's approach.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-bold mb-3">Applications:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-background p-4 rounded">
                          <p className="font-semibold text-sm mb-1">Generators</p>
                          <p className="text-xs text-muted-foreground">Convert mechanical energy to electrical energy</p>
                        </div>
                        <div className="bg-background p-4 rounded">
                          <p className="font-semibold text-sm mb-1">Transformers</p>
                          <p className="text-xs text-muted-foreground">Change voltage levels in AC circuits</p>
                        </div>
                        <div className="bg-background p-4 rounded">
                          <p className="font-semibold text-sm mb-1">Induction Motors</p>
                          <p className="text-xs text-muted-foreground">Convert electrical to mechanical energy</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-bold mb-3">Key Factors Affecting Induced EMF:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Strength of magnetic field (B)</li>
                        <li>Speed of relative motion between field and conductor</li>
                        <li>Number of turns in coil (N)</li>
                        <li>Area of the coil (A)</li>
                        <li>Angle between field and coil surface (θ)</li>
                      </ul>
                    </div>

                    <p className="text-sm text-muted-foreground mt-6 italic text-center">
                      Interactive electromagnetic induction simulator with moving magnet and coil visualization coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Electric Field */}
            <TabsContent value="electric-field" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Electric Field Calculator
                  </CardTitle>
                  <CardDescription>Calculate electric field from point charges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Charge (Q): {(electricCharge * 1e6).toFixed(2)} μC</Label>
                        <Slider value={[electricCharge * 1e6]} onValueChange={([val]) => setElectricCharge(val / 1e6)} min={0.1} max={100} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Distance (r): {electricDistance} m</Label>
                        <Slider value={[electricDistance]} onValueChange={([val]) => setElectricDistance(val)} min={0.01} max={1} step={0.01} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg text-sm">
                        <p><strong>Electric Field (E):</strong> {electricFieldStrength.toExponential(3)} N/C</p>
                        <div className="mt-4 pt-4 border-t">
                          <p><strong>Formula:</strong></p>
                          <p className="text-muted-foreground mt-2">
                            E = k × Q / r²<br /><br />
                            k = 8.99 × 10⁹ N·m²/C² (Coulomb's constant)<br />
                            Q = Charge (C)<br />
                            r = Distance (m)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Coulomb's Law */}
            <TabsContent value="coulombs-law" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" /> Coulomb's Law
                  </CardTitle>
                  <CardDescription>Calculate electrostatic force between two charges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Charge 1 (Q₁): {(coulombQ1 * 1e6).toFixed(2)} μC</Label>
                        <Slider value={[coulombQ1 * 1e6]} onValueChange={([val]) => setCoulombQ1(val / 1e6)} min={0.1} max={100} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Charge 2 (Q₂): {(coulombQ2 * 1e6).toFixed(2)} μC</Label>
                        <Slider value={[coulombQ2 * 1e6]} onValueChange={([val]) => setCoulombQ2(val / 1e6)} min={0.1} max={100} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Distance (r): {coulombDistance} m</Label>
                        <Slider value={[coulombDistance]} onValueChange={([val]) => setCoulombDistance(val)} min={0.01} max={1} step={0.01} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg text-sm">
                        <p><strong>Force (F):</strong> {coulombForce.toExponential(3)} N</p>
                        <p><strong>Nature:</strong> {(coulombQ1 * coulombQ2) > 0 ? 'Repulsive' : 'Attractive'}</p>
                        <div className="mt-4 pt-4 border-t">
                          <p><strong>Formula:</strong></p>
                          <p className="text-muted-foreground mt-2">
                            F = k × Q₁ × Q₂ / r²<br /><br />
                            k = 8.99 × 10⁹ N·m²/C²
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Electric Potential Energy */}
            <TabsContent value="electric-potential" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bolt className="w-5 h-5" /> Electric Potential Energy
                  </CardTitle>
                  <CardDescription>Calculate potential energy of charge in electric field</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Charge (q): {(potentialCharge * 1e6).toFixed(2)} μC</Label>
                        <Slider value={[potentialCharge * 1e6]} onValueChange={([val]) => setPotentialCharge(val / 1e6)} min={0.1} max={100} step={0.1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Voltage (V): {potentialVoltage} V</Label>
                        <Slider value={[potentialVoltage]} onValueChange={([val]) => setPotentialVoltage(val)} min={0} max={1000} step={10} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-primary/10 p-6 rounded-lg text-sm">
                        <p><strong>Potential Energy (U):</strong> {electricPotentialEnergy.toExponential(3)} J</p>
                        <p><strong>In mJ:</strong> {(electricPotentialEnergy * 1000).toFixed(3)} mJ</p>
                        <div className="mt-4 pt-4 border-t">
                          <p><strong>Formula:</strong></p>
                          <p className="text-muted-foreground mt-2">
                            U = q × V<br /><br />
                            U = Potential energy (J)<br />
                            q = Charge (C)<br />
                            V = Voltage (V)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhysicsToolkit;
