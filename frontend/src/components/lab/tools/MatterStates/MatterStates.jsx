import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Snowflake, Droplets, Wind, Thermometer, Layers, Beaker } from 'lucide-react';

// --- Particle Simulation Logic ---
const PARTICLE_COUNT = 50;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;
const PARTICLE_RADIUS = 6;

const MatterStates = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("states");

    // --- State Simulator ---
    const canvasRef = useRef(null);
    const [temp, setTemp] = useState(50); // 0-100 scale (Solid < 30, Liquid 30-70, Gas > 70)
    const [stateMode, setStateMode] = useState('manual'); // 'manual' or presets 'solid', 'liquid', 'gas'

    // Mixture state
    const [mixType, setMixType] = useState('pure'); // pure, mix_homo, mix_hetero

    // Initial dummy data for rendering loop reference
    const particles = useRef([]);
    const animationRef = useRef(null);

    // Initialize particles
    const initParticles = useCallback((temperature, type) => {
        const newParticles = [];
        const isSolid = temperature < 30;
        const isLiquid = temperature >= 30 && temperature < 75;
        // Gas >= 75

        const count = PARTICLE_COUNT;

        // Lattice layout for solid
        const cols = 10;
        const spacing = 25;
        const offsetX = (CANVAS_WIDTH - cols * spacing) / 2;

        for (let i = 0; i < count; i++) {
            let x, y, vx, vy, color;

            // Define types for mixture
            // Type A: Blue, Type B: Red (for mixture)
            const isTypeB = type !== 'pure' && i % 2 === 0;

            if (type === 'mix_hetero' && isTypeB) {
                // Heterogeneous: Type B settles at bottom (like oil/water or sand/water)
                // Or separate clusters. Let's make Type B heavier/bottom.
                color = '#ef4444';
            } else if (isTypeB) {
                color = '#ef4444'; // Homogeneous mixed
            } else {
                color = '#3b82f6';
            }

            if (isSolid) {
                // Arranged in grid at bottom
                const col = i % cols;
                const row = Math.floor(i / cols);
                x = offsetX + col * spacing;
                y = CANVAS_HEIGHT - 30 - row * spacing; // Stack from bottom
                vx = (Math.random() - 0.5) * 0.5;
                vy = (Math.random() - 0.5) * 0.5;
            } else if (isLiquid) {
                // Random at bottom half
                x = Math.random() * (CANVAS_WIDTH - 20) + 10;
                y = CANVAS_HEIGHT - Math.random() * (CANVAS_HEIGHT * 0.6) - 10;
                vx = (Math.random() - 0.5) * 2;
                vy = (Math.random() - 0.5) * 2;
            } else {
                // Gas: Everywhere
                x = Math.random() * (CANVAS_WIDTH - 20) + 10;
                y = Math.random() * (CANVAS_HEIGHT - 20) + 10;
                vx = (Math.random() - 0.5) * 5;
                vy = (Math.random() - 0.5) * 5;
            }

            newParticles.push({
                x, y, vx, vy,
                baseX: isSolid ? x : null,
                baseY: isSolid ? y : null,
                color
            });
        }
        particles.current = newParticles;
    }, []);

    // Animation Loop
    useEffect(() => {
        initParticles(temp, mixType);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Params based on temp
            const isSolid = temp < 30;
            const isLiquid = temp >= 30 && temp < 75;

            // Speed factor
            const speed = (temp / 20) + 0.1;
            const vibration = isSolid ? (temp / 10) : 0;
            const gravity = isSolid || isLiquid ? 0.2 : 0;

            particles.current.forEach(p => {
                // Update physics
                if (isSolid) {
                    // Vibrate around base
                    p.x = p.baseX + (Math.random() - 0.5) * vibration;
                    p.y = p.baseY + (Math.random() - 0.5) * vibration;
                } else {
                    // Mobile
                    p.x += p.vx * speed;
                    p.y += p.vy * speed;
                    p.vy += gravity; // Gravity effect

                    // Bounds checking
                    // Floor
                    if (p.y > CANVAS_HEIGHT - PARTICLE_RADIUS) {
                        p.y = CANVAS_HEIGHT - PARTICLE_RADIUS;
                        p.vy *= -0.8; // Dampening
                    }
                    // Ceiling
                    if (p.y < PARTICLE_RADIUS) {
                        p.y = PARTICLE_RADIUS;
                        p.vy *= -0.8;
                    }
                    // Walls
                    if (p.x > CANVAS_WIDTH - PARTICLE_RADIUS) {
                        p.x = CANVAS_WIDTH - PARTICLE_RADIUS;
                        p.vx *= -0.8;
                    }
                    if (p.x < PARTICLE_RADIUS) {
                        p.x = PARTICLE_RADIUS;
                        p.vx *= -0.8;
                    }

                    // Simple Separation (prevent overlap - simplistic)
                    // ... skipped for performance/simplicity in this demo ...

                    // Specific Logic for Heterogeneous Mixture (Oil/Water type)
                    if (mixType === 'mix_hetero') {
                        // Heavier (Red) sinks more, Lighter (Blue) floats on top of Red
                        // This is a fake visual effect for "separation"
                        if (p.color === '#ef4444') {
                            if (p.y < CANVAS_HEIGHT / 2 && isLiquid) p.vy += 0.1; // Push down
                        } else {
                            if (p.y > CANVAS_HEIGHT / 2 && isLiquid && temp < 60) p.vy -= 0.1; // Float up slightly
                        }
                    }
                }

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.stroke();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationRef.current);
    }, [temp, mixType, initParticles]);


    // Handlers
    const handleTempChange = (val) => {
        setTemp(val[0]);
        if (stateMode !== 'manual') setStateMode('manual');
    };

    const setPreset = (mode) => {
        setStateMode(mode);
        if (mode === 'solid') setTemp(10);
        else if (mode === 'liquid') setTemp(50);
        else if (mode === 'gas') setTemp(90);
    };


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Snowflake className="w-8 h-8 text-cyan-600" />
                        {t('lab.tools.matterStates.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.matterStates.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="states" className="flex items-center gap-2">
                        <Beaker className="w-4 h-4" /> {t('lab.tools.matterStates.simulator')}
                    </TabsTrigger>
                    <TabsTrigger value="learn" className="flex items-center gap-2">
                        <Layers className="w-4 h-4" /> {t('lab.tools.matterStates.properties')}
                    </TabsTrigger>
                </TabsList>

                {/* --- Simulator Tab --- */}
                <TabsContent value="states" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Controls */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Controls</CardTitle>
                                <CardDescription>Adjust temperature and composition.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* State Presets */}
                                <div className="space-y-3">
                                    <Label>State of Matter</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={stateMode === 'solid' ? "default" : "outline"}
                                            className="flex-1"
                                            onClick={() => setPreset('solid')}
                                        >
                                            <Snowflake className="w-4 h-4 mr-1" /> Solid
                                        </Button>
                                        <Button
                                            variant={stateMode === 'liquid' ? "default" : "outline"}
                                            className="flex-1"
                                            onClick={() => setPreset('liquid')}
                                        >
                                            <Droplets className="w-4 h-4 mr-1" /> Liquid
                                        </Button>
                                        <Button
                                            variant={stateMode === 'gas' ? "default" : "outline"}
                                            className="flex-1"
                                            onClick={() => setPreset('gas')}
                                        >
                                            <Wind className="w-4 h-4 mr-1" /> Gas
                                        </Button>
                                    </div>
                                </div>

                                {/* Temp Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label className="flex items-center gap-2"><Thermometer className="w-4 h-4" /> Temperature</Label>
                                        <span className="font-mono bg-muted px-2 rounded">
                                            {temp < 30 ? 'Low' : temp > 75 ? 'High' : 'Medium'} ({Math.round(temp)}°C sim)
                                        </span>
                                    </div>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[temp]}
                                        onValueChange={handleTempChange}
                                        className="py-4"
                                    />
                                    <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500 opacity-50"></div>
                                </div>

                                {/* Composition */}
                                <div className="space-y-3 pt-4 border-t">
                                    <Label>Composition</Label>
                                    <RadioGroup value={mixType} onValueChange={setMixType} className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="pure" id="pure" />
                                            <Label htmlFor="pure" className="font-normal">Pure Substance</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="mix_homo" id="mix1" />
                                            <Label htmlFor="mix1" className="font-normal">Homogeneous Mixture</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="mix_hetero" id="mix2" />
                                            <Label htmlFor="mix2" className="font-normal">Heterogeneous Mixture</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visualization */}
                        <Card className="md:col-span-2 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
                            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                                <div className="relative border-4 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-black shadow-inner overflow-hidden">
                                    <canvas
                                        ref={canvasRef}
                                        width={CANVAS_WIDTH}
                                        height={CANVAS_HEIGHT}
                                        className="w-full h-auto cursor-crosshair"
                                    />

                                    {/* Labels overlaid */}
                                    <div className="absolute top-2 left-2 text-xs font-bold text-muted-foreground bg-white/80 dark:bg-black/80 px-2 py-1 rounded pointer-events-none">
                                        Current State: {temp < 30 ? 'SOLID' : temp > 75 ? 'GAS' : 'LIQUID'}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
                                    Observe how particles move.
                                    {temp < 30 && " In SOLIDS, particles vibrate in fixed positions."}
                                    {temp >= 30 && temp <= 75 && " In LIQUIDS, particles move freely but stay close."}
                                    {temp > 75 && " In GASES, particles move fast and fill the container."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- Properties Tab --- */}
                <TabsContent value="learn" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Solids", icon: Snowflake, color: "text-cyan-500", desc: "Definite shape and volume. Particles are packed closely together and vibrate." },
                            { title: "Liquids", icon: Droplets, color: "text-blue-500", desc: "Definite volume but no definite shape. Particles can slide past each other." },
                            { title: "Gases", icon: Wind, color: "text-gray-500", desc: "No definite shape or volume. Particles move quickly and are far apart." },
                        ].map((s) => (
                            <Card key={s.title}>
                                <CardHeader>
                                    <CardTitle className={`flex items-center gap-2 ${s.color}`}>
                                        <s.icon className="w-6 h-6" /> {s.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{s.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="mt-8 bg-amber-50 dark:bg-amber-900/10 border-amber-200">
                        <CardHeader>
                            <CardTitle>Mixtures vs Pure Substances</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p><strong>Pure Substance:</strong> Made of only one type of particle (atom or molecule). Example: Distilled Water, Pure Gold.</p>
                            <p><strong>Mixture:</strong> Made of two or more different particles physically combined.</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Homogeneous:</strong> Uniformally mixed (e.g., Salt water, Air). Particles are evenly distributed.</li>
                                <li><strong>Heterogeneous:</strong> Not uniform (e.g., Oil and Water, Salad). You can see the different parts.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MatterStates;
