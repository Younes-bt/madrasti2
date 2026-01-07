import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import labService from '../../services/lab'
import { useLabContext } from '../../contexts/LabContext'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/Layout'

// Lazy load tool components
const ScientificCalculator = lazy(() => import('../../components/lab/tools/ScientificCalculator/Calculator'))
const UnitConverter = lazy(() => import('../../components/lab/tools/UnitConverter/UnitConverter'))
const FunctionGrapher = lazy(() => import('../../components/lab/tools/FunctionGrapher/FunctionGrapher'))
const EquationSolver = lazy(() => import('../../components/lab/tools/EquationSolver/EquationSolver'))
const PeriodicTable = lazy(() => import('../../components/lab/tools/PeriodicTable/PeriodicTable'))
const GeometryToolkit = lazy(() => import('../../components/lab/tools/GeometryToolkit/GeometryToolkit'));
const StatisticsLab = lazy(() => import('../../components/lab/tools/StatisticsLab/StatisticsLab'));
const LogicSetTheory = lazy(() => import('../../components/lab/tools/LogicSetTheory/LogicSetTheory'));
const MoleculeBondingTools = lazy(() => import('../../components/lab/tools/MoleculeBondingTools/MoleculeBondingTools'));
const ChemicalEquationTools = lazy(() => import('../../components/lab/tools/ChemicalEquationTools/ChemicalEquationTools'));
const SolutionsConcentrations = lazy(() => import('../../components/lab/tools/SolutionsConcentrations/SolutionsConcentrations'));
const AcidBaseRedox = lazy(() => import('../../components/lab/tools/AcidBaseRedox/AcidBaseRedox'));
const ReactionKinetics = lazy(() => import('../../components/lab/tools/ReactionKinetics/ReactionKinetics'));
const MatterStates = lazy(() => import('../../components/lab/tools/MatterStates/MatterStates'));
const MechanicsToolkit = lazy(() => import('../../components/lab/tools/MechanicsToolkit/MechanicsToolkit'));
const PhysicsToolkit = lazy(() => import('../../components/lab/tools/PhysicsToolkit/PhysicsToolkit'));
const BiologyToolkit = lazy(() => import('../../components/lab/tools/BiologyToolkit/BiologyToolkit'));
const CircuitBuilder = lazy(() => import('../../components/lab/tools/CircuitBuilder/CircuitBuilder'));

const toolComponents = {
  'scientific-calculator': ScientificCalculator,
  'unit-converter': UnitConverter,
  'function-grapher': FunctionGrapher,
  'equation-solver': EquationSolver,
  'periodic-table': PeriodicTable,
  'geometry-toolkit': GeometryToolkit,
  'statistics-lab': StatisticsLab,
  'logic-set-theory': LogicSetTheory,
  'molecule-bonding': MoleculeBondingTools,
  'chemical-equations': ChemicalEquationTools,
  'solutions-concentrations': SolutionsConcentrations,
  'acid-base-redox': AcidBaseRedox,
  'reaction-kinetics': ReactionKinetics,
  'matter-states': MatterStates,
  'mechanics-toolkit': MechanicsToolkit,
  // Physics Mechanics - Kinematics (7 tools)
  'average-speed-calculator': PhysicsToolkit,
  'uniform-motion-simulator': PhysicsToolkit,
  'accelerated-motion': PhysicsToolkit,
  'free-fall-simulator': PhysicsToolkit,
  'projectile-motion': PhysicsToolkit,
  'circular-motion': PhysicsToolkit,
  'rotation-simulator': PhysicsToolkit,
  // Physics Mechanics - Dynamics (6 tools)
  'force-vector-visualizer': PhysicsToolkit,
  'newtons-laws-simulator': PhysicsToolkit,
  'weight-mass-calculator': PhysicsToolkit,
  'equilibrium-forces': PhysicsToolkit,
  'friction-calculator': PhysicsToolkit,
  'satellite-motion': PhysicsToolkit,
  // Physics Mechanics - Energy & Work (5 tools)
  'work-calculator': PhysicsToolkit,
  'kinetic-energy': PhysicsToolkit,
  'potential-energy': PhysicsToolkit,
  'energy-conservation': PhysicsToolkit,
  'power-calculator': PhysicsToolkit,
  // Physics - Oscillations & Waves (4 tools)
  'shm-simulator': PhysicsToolkit,
  'damped-oscillations': PhysicsToolkit,
  'mechanical-waves': PhysicsToolkit,
  'sound-waves': PhysicsToolkit,
  // Physics - Electricity & Magnetism - Basic Circuits (7 tools)
  'circuit-builder': CircuitBuilder,
  'ohms-law': PhysicsToolkit,
  'series-parallel-circuits': PhysicsToolkit,
  'voltage-addition': PhysicsToolkit,
  'nodal-law': PhysicsToolkit,
  'electrical-power': PhysicsToolkit,
  'electrical-energy': PhysicsToolkit,
  // Physics - Electricity & Magnetism - Advanced Circuits (4 tools)
  'rc-circuit': PhysicsToolkit,
  'rl-circuit': PhysicsToolkit,
  'rlc-circuit': PhysicsToolkit,
  'ac-circuit-analyzer': PhysicsToolkit,
  // Physics - Electricity & Magnetism - Electromagnetism (3 tools)
  'magnetic-field': PhysicsToolkit,
  'lorentz-force': PhysicsToolkit,
  'electromagnetic-induction': PhysicsToolkit,
  // Physics - Electricity & Magnetism - Electrostatics (3 tools)
  'electric-field': PhysicsToolkit,
  'coulombs-law': PhysicsToolkit,
  'electric-potential-energy': PhysicsToolkit,
  // Biology (SVT) - Human Body Systems (8 tools)
  'human-body-explorer': BiologyToolkit,
  'digestive-system': BiologyToolkit,
  'respiratory-system': BiologyToolkit,
  'circulatory-system': BiologyToolkit,
  'urinary-system': BiologyToolkit,
  'nervous-system': BiologyToolkit,
  'muscular-system': BiologyToolkit,
  'immune-system': BiologyToolkit,
};

export default function LabToolPage() {
  const { t, i18n } = useTranslation()
  const { toolId } = useParams()
  const navigate = useNavigate()
  const { addRecentTool, setCurrentSession, currentSession } = useLabContext()
  const [sessionStartTime, setSessionStartTime] = useState(null)

  const { data: toolResponse, isLoading, error } = useQuery({
    queryKey: ['lab-tool', toolId],
    queryFn: () => labService.getToolById(toolId)
  })

  const tool = toolResponse?.data

  // Start usage session
  useEffect(() => {
    if (tool && !currentSession) {
      const startSession = async () => {
        const response = await labService.startUsageSession(tool.id, {
          device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        })
        if (response.success) {
          setCurrentSession(response.data)
          setSessionStartTime(Date.now())
          addRecentTool(tool.id)
        }
      }
      startSession()
    }
  }, [tool, currentSession, setCurrentSession, addRecentTool])

  // End usage session on unmount
  useEffect(() => {
    return () => {
      if (currentSession && sessionStartTime) {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000)
        labService.endUsageSession(currentSession.id, duration, {})
        setCurrentSession(null)
      }
    }
  }, [currentSession, sessionStartTime, setCurrentSession])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !tool) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{t('lab.toolNotFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('lab.toolNotFoundDescription')}</p>
          <Button onClick={() => navigate('/lab')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('lab.backToLab')}
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const ToolComponent = toolComponents[toolId]

  if (!ToolComponent) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{t('lab.toolNotAvailable')}</h1>
          <p className="text-muted-foreground mb-6">{t('lab.toolNotAvailableDescription')}</p>
          <Button onClick={() => navigate('/lab')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('lab.backToLab')}
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/lab')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{tool[`name_${i18n.language}`] || tool.name_en}</h1>
            <p className="text-sm text-muted-foreground">{tool[`description_${i18n.language}`] || tool.description_en}</p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }>
          <ToolComponent tool={tool} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
