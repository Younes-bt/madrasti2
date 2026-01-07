import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Rocket, MonitorPlay, Zap, Scale, MoveDiagonal, Timer, Pause, Play, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MechanicsToolkit = () => {
    const [activeTab, setActiveTab] = useState("kinematics");

    // --- Kinematics: Projectile Motion State ---
    const [v0, setV0] = useState(20); // Initial velocity m/s
    const [angle, setAngle] = useState(45); // Degrees
    const [gravity, setGravity] = useState(9.81);
    const [height0, setHeight0] = useState(0); // Initial height

    // Animation state
    const [isPlaying, setIsPlaying] = useState(false);
    const [simTime, setSimTime] = useState(0);
    const animRef = useRef(null);

    const projectileData = useMemo(() => {
        const rad = angle * (Math.PI / 180);
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);

        // Time of flight (simple case y=0)
        // y = h + vy*t - 0.5*g*t^2 = 0
        const disc = vy * vy + 2 * gravity * height0;
        const totalTime = (vy + Math.sqrt(disc)) / gravity;

        const points = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * totalTime;
            points.push({
                t: t,
                x: vx * t,
                y: height0 + vy * t - 0.5 * gravity * t * t
            });
        }
        return { points, totalTime, maxH: height0 + (vy * vy) / (2 * gravity), maxR: vx * totalTime };
    }, [v0, angle, gravity, height0]);

    // Animation Loop for Kinematics
    useEffect(() => {
        if (isPlaying) {
            let lastTime = performance.now();
            const step = (now) => {
                const dt = (now - lastTime) / 1000; // seconds
                lastTime = now;
                setSimTime(prev => {
                    const next = prev + dt; // Speed multiplier could go here
                    if (next >= projectileData.totalTime) {
                        setIsPlaying(false);
                        return projectileData.totalTime;
                    }
                    return next;
                });
                animRef.current = requestAnimationFrame(step);
            };
            animRef.current = requestAnimationFrame(step);
        } else {
            cancelAnimationFrame(animRef.current);
        }
        return () => cancelAnimationFrame(animRef.current);
    }, [isPlaying, projectileData.totalTime]);

    const getCurrentPos = () => {
        const rad = angle * (Math.PI / 180);
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);
        // y = h + vy*t - 0.5*g*t^2
        const x = vx * simTime;
        const y = height0 + vy * simTime - 0.5 * gravity * simTime * simTime;
        return { x, y: Math.max(0, y), vx, vy: vy - gravity * simTime };
    };
    const currentPos = getCurrentPos();


    // --- Dynamics: Forces State ---
    const [mass, setMass] = useState(5); // kg
    const [force, setForce] = useState(20); // N
    const [frictionCoef, setFrictionCoef] = useState(0.2);
    const [dynTime, setDynTime] = useState(0);
    const [dynPlaying, setDynPlaying] = useState(false);

    // Simple 1D dynamics: block on surface
    // a = (F - f_k) / m. f_k = mu * m * g.
    const dynamicsCalc = useMemo(() => {
        const g = 9.81;
        const Fn = mass * g;
        const fFriction = frictionCoef * Fn;
        const netForce = Math.max(0, force - fFriction); // No backslide
        const accel = netForce / mass;
        return { accel, fFriction, netForce };
    }, [mass, force, frictionCoef]);

    // Dynamics Animation
    useEffect(() => {
        let handle;
        if (dynPlaying) {
            let start = performance.now();
            const loop = (now) => {
                setDynTime((now - start) / 1000);
                handle = requestAnimationFrame(loop);
            };
            handle = requestAnimationFrame(loop);
        } else {
            setDynTime(0);
        }
        return () => cancelAnimationFrame(handle);
    }, [dynPlaying]);

    const dynPos = 0.5 * dynamicsCalc.accel * dynTime * dynTime; // x = 1/2 a t^2
    const dynVel = dynamicsCalc.accel * dynTime;


    // --- Energy State ---
    const [energyHeight, setEnergyHeight] = useState(10); // m
    const [energyMass, setEnergyMass] = useState(2); // kg

    // Just calculating values
    const pe = energyMass * 9.81 * energyHeight;
    const ke = 0; // Initial drop
    // const me = pe + ke;
    const impactVel = Math.sqrt(2 * 9.81 * energyHeight);


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Rocket className="w-8 h-8 text-blue-600" />
                        Newtonian Mechanics
                    </h1>
                    <p className="text-muted-foreground">
                        Explore Motion, Forces (Dynamics), and Energy Conservation.
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-[600px]">
                    <TabsTrigger value="kinetics" className="flex items-center gap-2">
                        <MoveDiagonal className="w-4 h-4" /> Kinematics (Motion)
                    </TabsTrigger>
                    <TabsTrigger value="dynamics" className="flex items-center gap-2">
                        <Scale className="w-4 h-4" /> Dynamics (Forces)
                    </TabsTrigger>
                    <TabsTrigger value="energy" className="flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Energy & Work
                    </TabsTrigger>
                </TabsList>

                {/* --- Kinematics Tab --- */}
                <TabsContent value="kinetics" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Projectile Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between"><Label>Initial Velocity $v_0$</Label><span className="text-sm font-mono">{v0} m/s</span></div>
                                        <Slider min={0} max={100} step={1} value={[v0]} onValueChange={v => setV0(v[0])} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between"><Label>Launch Angle $\alpha$</Label><span className="text-sm font-mono">{angle}°</span></div>
                                        <Slider min={0} max={90} step={1} value={[angle]} onValueChange={v => setAngle(v[0])} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between"><Label>Initial Height $h_0$</Label><span className="text-sm font-mono">{height0} m</span></div>
                                        <Slider min={0} max={50} step={1} value={[height0]} onValueChange={v => setHeight0(v[0])} />
                                    </div>
                                    <div className="space-y-1 border-t pt-4">
                                        <Label>Gravity $g$</Label>
                                        <Select value={gravity.toString()} onValueChange={v => setGravity(parseFloat(v))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="9.81">Earth (9.81 m/s²)</SelectItem>
                                                <SelectItem value="1.62">Moon (1.62 m/s²)</SelectItem>
                                                <SelectItem value="3.72">Mars (3.72 m/s²)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm"><span>Max Range ($x_{'{'}max{'}'}$):</span> <span className="font-bold">{projectileData.maxR.toFixed(1)} m</span></div>
                                    <div className="flex justify-between text-sm"><span>Max Height ($y_{'{'}max{'}'}$):</span> <span className="font-bold">{projectileData.maxH.toFixed(1)} m</span></div>
                                    <div className="flex justify-between text-sm"><span>Flight Time:</span> <span className="font-bold">{projectileData.totalTime.toFixed(2)} s</span></div>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1" onClick={() => setIsPlaying(!isPlaying)}>
                                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                        {isPlaying ? "Pause" : "Simulate"}
                                    </Button>
                                    <Button variant="outline" onClick={() => { setIsPlaying(false); setSimTime(0); }}>
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Trajectory</CardTitle>
                                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                        t: {simTime.toFixed(2)}s | x: {currentPos.x.toFixed(1)}m | y: {currentPos.y.toFixed(1)}m
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[400px] relative bg-slate-50 dark:bg-slate-950/50 rounded-md border overflow-hidden">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={projectileData.points} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                        <XAxis dataKey="x" type="number" domain={[0, 'auto']} label={{ value: 'Distance (m)', position: 'insideBottom', offset: -10 }} />
                                        <YAxis dataKey="y" type="number" domain={[0, 'auto']} label={{ value: 'Height (m)', angle: -90, position: 'insideLeft' }} />
                                        <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />

                                        {/* Animated Ball as Reference Dot Logic is tricky in pure Recharts, using custom overlay instead */}
                                    </LineChart>
                                </ResponsiveContainer>

                                {/* Overlay Ball */}
                                {/* Note: Mapping coordinate space of SVG to div is hard without exact scale. 
                                    Visual ball omitted for reliability, replaced by the LIVE data display above.
                                    Or we can use a simple Canvas if needed. Sticking to chart for accuracy.
                                */}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- Dynamics Tab --- */}
                <TabsContent value="dynamics" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader><CardTitle>Newton's Second Law Simulator ($F = ma$)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><Label>Applied Force ($F$)</Label> <span>{force} N</span></div>
                                        <Slider min={0} max={100} step={1} value={[force]} onValueChange={v => setForce(v[0])} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><Label>Mass ($m$)</Label> <span>{mass} kg</span></div>
                                        <Slider min={1} max={50} step={1} value={[mass]} onValueChange={v => setMass(v[0])} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><Label>Friction Coefficient ($\mu$)</Label> <span>{frictionCoef}</span></div>
                                        <Slider min={0} max={1} step={0.05} value={[frictionCoef]} onValueChange={v => setFrictionCoef(v[0])} />
                                    </div>

                                    <div className="bg-muted p-4 rounded text-sm space-y-1">
                                        <div className="flex justify-between"><span>Weight ($P=mg$):</span> <span className="font-mono">{(mass * 9.81).toFixed(1)} N</span></div>
                                        <div className="flex justify-between text-red-500"><span>Friction ($f=\mu N$):</span> <span className="font-mono">{dynamicsCalc.fFriction.toFixed(1)} N</span></div>
                                        <div className="flex justify-between text-green-600 font-bold border-t pt-1 mt-1"><span>Net Force:</span> <span className="font-mono">{dynamicsCalc.netForce.toFixed(1)} N</span></div>
                                        <div className="flex justify-between text-blue-600 font-bold text-lg"><span>Acceleration ($a$):</span> <span className="font-mono">{dynamicsCalc.accel.toFixed(2)} m/s²</span></div>
                                    </div>

                                    <Button className="w-full" onMouseDown={() => setDynPlaying(true)} onMouseUp={() => setDynPlaying(false)} onMouseLeave={() => setDynPlaying(false)}>
                                        Hold to Accelerate
                                    </Button>
                                </div>

                                <div className="relative bg-slate-200 dark:bg-slate-800 rounded-lg border overflow-hidden flex items-center justify-start px-4">
                                    {/* Track */}
                                    <div className="absolute bottom-10 left-0 w-full h-1 bg-slate-400"></div>

                                    {/* Block */}
                                    {/* Simple visual representation. dynPos grows quadratically. */}
                                    {/* We'll wrap position modulo width for infinite scroll effect */}
                                    <div
                                        className="w-16 h-16 bg-blue-500 rounded shadow-lg absolute bottom-10 flex items-center justify-center text-white font-bold transition-transform duration-75"
                                        style={{ transform: `translateX(${Math.min(dynPos * 20, 500)}px)` }} // Scale for visibility
                                    >
                                        {mass} kg
                                    </div>

                                    {/* Force Vectors */}
                                    <div
                                        className="absolute bottom-16 h-4 bg-green-500 flex items-center justify-center text-[10px] text-white transition-all duration-75"
                                        style={{ left: `${Math.min(dynPos * 20, 500) + 64}px`, width: `${force * 2}px` }}
                                    >
                                        F
                                    </div>
                                    {dynamicsCalc.fFriction > 0 && (
                                        <div
                                            className="absolute bottom-16 h-2 bg-red-500 transition-all duration-75"
                                            style={{ left: `${Math.min(dynPos * 20, 500) - (dynamicsCalc.fFriction * 2)}px`, width: `${dynamicsCalc.fFriction * 2}px` }}
                                        />
                                    )}

                                    <div className="absolute top-4 right-4 text-right font-mono text-xs text-muted-foreground">
                                        v = {dynVel.toFixed(1)} m/s<br />
                                        x = {dynPos.toFixed(1)} m
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Energy Tab --- */}
                <TabsContent value="energy" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Potential to Kinetic Energy</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Height ($h$)</Label>
                                        <div className="flex gap-4 items-center">
                                            <Slider className="flex-1" min={0} max={100} value={[energyHeight]} onValueChange={v => setEnergyHeight(v[0])} />
                                            <Input type="number" className="w-20" value={energyHeight} onChange={e => setEnergyHeight(parseFloat(e.target.value) || 0)} />
                                            <span>m</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mass ($m$)</Label>
                                        <div className="flex gap-4 items-center">
                                            <Slider className="flex-1" min={1} max={100} value={[energyMass]} onValueChange={v => setEnergyMass(v[0])} />
                                            <Input type="number" className="w-20" value={energyMass} onChange={e => setEnergyMass(parseFloat(e.target.value) || 0)} />
                                            <span>kg</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <span className="text-xs text-muted-foreground uppercase font-bold">Initial P.E. ($E_{'{'}pp{'}'}$)</span>
                                        <div className="text-2xl font-bold text-blue-600">{pe.toFixed(0)} J</div>
                                        <div className="text-xs text-muted-foreground">m · g · h</div>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                                        <span className="text-xs text-muted-foreground uppercase font-bold">Final K.E. ($E_c$)</span>
                                        <div className="text-2xl font-bold text-orange-600">{pe.toFixed(0)} J</div>
                                        <div className="text-xs text-muted-foreground">Max Speed: <strong>{impactVel.toFixed(1)} m/s</strong></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Work Calculation</CardTitle></CardHeader>
                            <CardContent className="flex flex-col justify-center items-center h-full space-y-4">
                                <p className="text-center text-muted-foreground">
                                    Work done by gravity falling from height {energyHeight}m:
                                </p>
                                <div className="text-4xl font-bold">
                                    W = {pe.toFixed(0)} J
                                </div>
                                <div className="w-full h-40 relative border-b border-black dark:border-white">
                                    {/* Simple illustration of ball falling */}
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 shadow-lg flex items-center justify-center text-[10px] text-white"
                                        style={{ bottom: `${Math.min(energyHeight * 2, 120) + 10}px` }}
                                    >
                                        m
                                    </div>
                                    <div className="absolute right-10 bottom-0 h-full border-l border-dashed border-gray-400"></div>
                                    <div className="absolute right-2 bottom-[50%] translate-y-1/2 text-xs">h</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MechanicsToolkit;
