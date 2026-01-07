import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  User, Utensils, Wind, Heart, Droplet, Brain, Dumbbell, Shield,
  Activity, Info, Maximize2, X
} from 'lucide-react';
import AnatomyModel3D from './AnatomyModel3D';
import { ANATOMY_MODELS } from '@/constants/anatomyModels';

const BiologyToolkit = ({ tool }) => {
  // Map tool_id to specific body system
  const { t } = useTranslation();
  const getSystemMapping = (toolId) => {
    const mappings = {
      'human-body-explorer': 'overview',
      'digestive-system': 'digestive',
      'respiratory-system': 'respiratory',
      'circulatory-system': 'circulatory',
      'urinary-system': 'urinary',
      'nervous-system': 'nervous',
      'muscular-system': 'muscular',
      'immune-system': 'immune',
    };
    return mappings[toolId] || 'overview';
  };

  const [activeSystem, setActiveSystem] = useState(getSystemMapping(tool?.tool_id));
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState(null);

  // Body system data
  const bodySystems = {
    digestive: {
      name: 'Digestive System',
      nameAr: 'الجهاز الهضمي',
      nameFr: 'Système digestif',
      icon: Utensils,
      color: 'bg-orange-500',
      modelUrl: ANATOMY_MODELS.stomach,
      organs: [
        { name: 'Stomach (المعدة)', function: 'Chemical digestion with HCl and pepsin' },
        { name: 'Small Intestine (الأمعاء الدقيقة)', function: 'Nutrient absorption, enzymes', modelUrl: ANATOMY_MODELS.SmallIntestine },
        { name: 'Large Intestine (الأمعاء الغليظة)', function: 'Water absorption', modelUrl: ANATOMY_MODELS.LargeIntestine },
        { name: 'Liver (الكبد)', function: 'Bile production, detoxification', modelUrl: ANATOMY_MODELS.liver },
        { name: 'Pancreas (البنكرياس)', function: 'Digestive enzymes, insulin', modelUrl: ANATOMY_MODELS.pancreas },
      ],
      process: [
        '1. Ingestion - Food enters mouth',
        '2. Digestion - Mechanical and chemical breakdown',
        '3. Absorption - Nutrients absorbed in small intestine',
        '4. Egestion - Waste eliminated',
      ],
    },
    respiratory: {
      name: 'Respiratory System',
      nameAr: 'الجهاز التنفسي',
      nameFr: 'Système respiratoire',
      icon: Wind,
      color: 'bg-cyan-500',
      modelUrl: ANATOMY_MODELS.lungs,
      organs: [
        { name: 'Trachea (القصبة الهوائية)', function: 'Air passage to lungs', modelUrl: ANATOMY_MODELS.trachea },
        { name: 'Bronchi (القصبات)', function: 'Branch into lungs', modelUrl: ANATOMY_MODELS.bronchi },
        { name: 'Lungs (الرئتان)', function: 'Gas exchange (O₂/CO₂)', modelUrl: ANATOMY_MODELS.lungs },
      ],
      process: [
        '1. Inhalation - Air enters lungs',
        '2. Gas Exchange - O₂ absorbed, CO₂ released',
        '3. Oxygen Transport - O₂ carried by red blood cells',
        '4. Exhalation - CO₂ expelled',
      ],
    },
    circulatory: {
      name: 'Circulatory System',
      nameAr: 'الجهاز الدوري',
      nameFr: 'Système circulatoire',
      icon: Heart,
      color: 'bg-red-500',
      modelUrl: ANATOMY_MODELS.heart,
      organs: [
        { name: 'Heart (القلب)', function: '4 chambers pump blood', modelUrl: ANATOMY_MODELS.heart },
        { name: 'Arteries (الشرايين)', function: 'Carry oxygenated blood from heart', modelUrl: ANATOMY_MODELS.arteries },
        { name: 'Veins (الأوردة)', function: 'Return deoxygenated blood to heart', modelUrl: ANATOMY_MODELS.veins }
      ],
      process: [
        '1. Heart Pumps - Deoxygenated blood to lungs',
        '2. Oxygenation - Blood receives O₂ in lungs',
        '3. Circulation - Oxygenated blood to body',
        '4. Return - Deoxygenated blood back to heart',
      ],
    },
    urinary: {
      name: 'Urinary System',
      nameAr: 'الجهاز البولي',
      nameFr: 'Système urinaire',
      icon: Droplet,
      color: 'bg-yellow-500',
      modelUrl: ANATOMY_MODELS.kidney,
      organs: [
        { name: 'Kidneys (الكليتان)', function: 'Filter blood, produce urine', modelUrl: ANATOMY_MODELS.kidney },
        { name: 'Ureters (الحالبان)', function: 'Transport urine to bladder', modelUrl: ANATOMY_MODELS.ureters },
        { name: 'Bladder (المثانة)', function: 'Store urine', modelUrl: ANATOMY_MODELS.bladder },
      ],
      process: [
        '1. Filtration - Blood filtered in kidneys',
        '2. Reabsorption - Useful substances reabsorbed',
        '3. Secretion - Waste products secreted',
        '4. Excretion - Urine eliminated',
      ],
    },
    nervous: {
      name: 'Nervous System',
      nameAr: 'الجهاز العصبي',
      nameFr: 'Système nerveux',
      icon: Brain,
      color: 'bg-purple-500',
      modelUrl: ANATOMY_MODELS.brain,
      organs: [
        { name: 'Brain (الدماغ)', function: 'Control center, thinking, memory', modelUrl: ANATOMY_MODELS.brain },
        { name: 'Spinal Cord (الحبل الشوكي)', function: 'Message highway, reflexes', modelUrl: ANATOMY_MODELS.spinalCord },
        { name: 'Neurons (الخلايا العصبية)', function: 'Transmit electrical signals', modelUrl: ANATOMY_MODELS.neurons },
      ],
      process: [
        '1. Stimulus Detection - Sensory neurons detect',
        '2. Signal Transmission - Electrical impulses',
        '3. Processing - Brain interprets signals',
        '4. Response - Motor neurons activate muscles',
      ],
    },
    muscular: {
      name: 'Muscular System',
      nameAr: 'الجهاز العضلي',
      nameFr: 'Système musculaire',
      icon: Dumbbell,
      color: 'bg-rose-500',
      modelUrl: ANATOMY_MODELS.muscles,
      organs: [
        { name: 'Skeletal Muscles (عضلات هيكلية)', function: 'Voluntary movement' },
      ],
      process: [
        '1. Signal Received - Nerve impulse to muscle',
        '2. Contraction - Muscle fibers shorten',
        '3. Movement - Bones pulled by tendons',
        '4. Relaxation - Muscle returns to rest',
      ],
    },
    immune: {
      name: 'Immune System',
      nameAr: 'الجهاز المناعي',
      nameFr: 'Système immunitaire',
      icon: Shield,
      color: 'bg-green-500',
      modelUrl: ANATOMY_MODELS.lymphNode,
      organs: [
        { name: 'Lymph Nodes (العقد اللمفاوية)', function: 'Filter pathogens' },
        { name: 'Spleen (الطحال)', function: 'Blood filtration, immune response', modelUrl: ANATOMY_MODELS.spleen },
        { name: 'Thymus (الغدة الزعترية)', function: 'T-cell maturation', modelUrl: ANATOMY_MODELS.thymus },
      ],
      process: [
        '1. Recognition - Identify pathogens',
        '2. Response - White blood cells attack',
        '3. Antibodies - Proteins neutralize threats',
        '4. Memory - Remember pathogens for future',
      ],
    },
  };

  const SystemIcon = bodySystems[activeSystem]?.icon || User;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-8 h-8 text-green-600" />
            {t('lab.tools.biologyToolkit.title')}
          </h1>
          <p className="text-muted-foreground">
            مستكشف جسم الإنسان - Interactive 3D body systems (3AC SVT)
          </p>
        </div>
      </div>

      <Tabs value={activeSystem} onValueChange={setActiveSystem} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 max-w-[1000px]">
          <TabsTrigger value="digestive" className="flex items-center gap-1">
            <Utensils className="w-4 h-4" />
            <span className="hidden sm:inline">Digestive</span>
          </TabsTrigger>
          <TabsTrigger value="respiratory" className="flex items-center gap-1">
            <Wind className="w-4 h-4" />
            <span className="hidden sm:inline">Respiratory</span>
          </TabsTrigger>
          <TabsTrigger value="circulatory" className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Circulatory</span>
          </TabsTrigger>
          <TabsTrigger value="urinary" className="flex items-center gap-1">
            <Droplet className="w-4 h-4" />
            <span className="hidden sm:inline">Urinary</span>
          </TabsTrigger>
          <TabsTrigger value="nervous" className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Nervous</span>
          </TabsTrigger>
          <TabsTrigger value="muscular" className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            <span className="hidden sm:inline">Muscular</span>
          </TabsTrigger>
          <TabsTrigger value="immune" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Immune</span>
          </TabsTrigger>
        </TabsList>

        {/* Dynamic System Content */}
        {Object.entries(bodySystems).map(([systemKey, system]) => (
          <TabsContent key={systemKey} value={systemKey} className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${system.color} text-white`}>
                    <system.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl">{system.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {system.nameAr} • {system.nameFr}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Organs & Components */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Main Organs & Components
                    </h3>
                    <div className="space-y-2">
                      {system.organs.map((organ, idx) => (
                        <div
                          key={idx}
                          className="bg-muted p-3 rounded-lg cursor-pointer hover:bg-muted/80 hover:shadow-md transition-all group relative"
                          onClick={() => {
                            setSelectedOrgan(organ);
                            setShowFullscreen(true);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{organ.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{organ.function}</div>
                            </div>
                            <Maximize2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Process/Function */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      How It Works
                    </h3>
                    <div className="space-y-3">
                      {system.process.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Badge className={`${system.color} text-white shrink-0`}>
                            Step {idx + 1}
                          </Badge>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>

                    {/* 3D Model Viewer */}
                    {system.modelUrl ? (
                      <div className="mt-6">
                        <AnatomyModel3D
                          modelPath={system.modelUrl}
                          systemName={system.name}
                          onPartClick={(partName) => {
                            console.log('Clicked:', partName);
                            // Future: Show info about this organ part
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mt-6 p-8 bg-gradient-to-br from-muted to-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center">
                        <system.icon className={`w-16 h-16 mb-4 ${system.color.replace('bg-', 'text-')}`} />
                        <p className="text-sm text-muted-foreground text-center">
                          <strong>Interactive 3D Model</strong><br />
                          Full 3D visualization with animations coming soon!<br />
                          <span className="text-xs">Rotate, zoom, and explore in detail</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Educational Notes */}
                <div className="mt-6 p-4 bg-primary/5 border-l-4 border-primary rounded">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-primary">Note for Students (3AC SVT):</strong>
                    This system is part of your curriculum. Study each organ's function and how they work together to maintain life.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Fullscreen 3D Model Modal */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0">
          <DialogHeader className="absolute top-4 left-4 z-10 bg-black/70 text-white px-4 py-2 rounded-lg">
            <DialogTitle className="text-white">
              {bodySystems[activeSystem]?.name}
              {selectedOrgan && (
                <span className="text-sm font-normal opacity-90 ml-2">
                  - {selectedOrgan.name}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {(selectedOrgan?.modelUrl || bodySystems[activeSystem]?.modelUrl) ? (
            <div className="w-full h-full">
              <AnatomyModel3D
                modelPath={selectedOrgan?.modelUrl || bodySystems[activeSystem].modelUrl}
                systemName={bodySystems[activeSystem].name}
                onPartClick={(partName) => {
                  console.log('Clicked:', partName);
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p>3D model not available for this organ</p>
              </div>
            </div>
          )}

          {/* Selected Organ Info */}
          {selectedOrgan && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg">
              <h4 className="font-semibold text-base mb-1">{selectedOrgan.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedOrgan.function}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BiologyToolkit;
