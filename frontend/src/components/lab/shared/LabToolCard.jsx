import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import {
  Calculator, LineChart, ArrowLeftRight, Equal, Grid3X3, Triangle,
  Ruler,
  BarChart,
  Binary,
  Wand2,
  BoxSelect,
  Atom,
  Hexagon,
  FlaskConical,
  Scale,
  Beaker,
  Zap,
  Timer,
  Snowflake,
  Droplets,
  Wind,
  Gauge,
  MoveRight,
  TrendingUp,
  ArrowDown,
  CircleDot,
  RotateCw,
  Move,
  Rocket,
  Grip,
  Orbit,
  Hammer,
  Mountain,
  Infinity,
  Lightbulb,
  Activity,
  TrendingDown,
  Waves,
  Radio,
  Cpu,
  GitBranch,
  Plus,
  Network,
  Battery,
  Codesandbox,
  Magnet,
  Compass,
  Workflow,
  Sparkles,
  Bolt,
  User,
  Utensils,
  Heart,
  Droplet,
  Brain,
  Dumbbell,
  Shield,
  Microscope
} from 'lucide-react'

const iconMap = {
  Calculator,
  ArrowLeftRight,
  LineChart,
  Equals: Equal,
  Grid3x3: Grid3X3,
  Triangle,
  Ruler,
  BarChart,
  Binary,
  Wand2,
  BoxSelect,
  Atom,
  Hexagon,
  FlaskConical,
  Scale,
  Beaker,
  Zap,
  Timer,
  Snowflake,
  Droplets,
  Wind,
  Gauge,
  MoveRight,
  TrendingUp,
  ArrowDown,
  CircleDot,
  RotateCw,
  Move,
  Rocket,
  Grip,
  Orbit,
  Hammer,
  Mountain,
  Infinity,
  Lightbulb,
  Activity,
  TrendingDown,
  Waves,
  Radio,
  Cpu,
  GitBranch,
  Plus,
  Network,
  Battery,
  Codesandbox,
  Magnet,
  Compass,
  Workflow,
  Sparkles,
  Bolt,
  User,
  Utensils,
  Heart,
  Droplet,
  Brain,
  Dumbbell,
  Shield,
  Microscope
}

export default function LabToolCard({ tool }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const Icon = iconMap[tool.icon] || Calculator

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/lab/${tool.tool_id}`)}
    >
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {tool.is_new && (
            <span className="px-2 py-1 text-xs bg-green-500 text-white rounded">{t('lab.new')}</span>
          )}
        </div>
        <CardTitle className="text-lg">{tool[`name_${i18n.language}`] || tool.name_en}</CardTitle>
        <CardDescription>{tool[`description_${i18n.language}`] || tool.description_en}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" variant="outline">
          {t('lab.openTool')}
        </Button>
      </CardContent>
    </Card>
  )
}
