import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  BookOpen,
  Target,
  Clock,
  Award,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  PlayCircle,
  FileText,
  Trophy,
  Zap,
  X,
  Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const HomeworkExerciseGuide = ({ trigger, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const steps = [
    {
      title: "Welcome to the New System!",
      description: "We've improved how you manage assignments and practice exercises.",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Enhanced Teaching Tools</h3>
            <p className="text-muted-foreground">
              We've separated homework and exercises to give you better control over
              mandatory assignments and optional practice activities.
            </p>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This guide will show you the key differences and how to use each type effectively.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      title: "Understanding the Difference",
      description: "Learn when to use homework vs exercises",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Homework Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <FileText className="h-5 w-5" />
                  Homework (Mandatory)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Has due dates</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Graded assignments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span>Required for all students</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Tracked completion</span>
                </div>
              </CardContent>
            </Card>

            {/* Exercises Card */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Target className="h-5 w-5" />
                  Exercises (Optional Practice)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <PlayCircle className="h-4 w-4 text-green-600" />
                  <span>Self-paced learning</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span>Gamified with rewards</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>Multiple attempts allowed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span>Tied to specific lessons</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <HelpCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tip:</strong> Use homework for assessments and exercises for practice and reinforcement.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      title: "Navigation Changes",
      description: "Find your tools in the new organized sidebar",
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Lessons & Content
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  My Lessons - Manage your lesson content
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Lesson Exercises - Create practice exercises for lessons
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Materials & Media - Upload teaching resources
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-orange-50">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Assignments & Assessment
              </h4>
              <ul className="space-y-2 text-sm text-orange-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Homework - Create mandatory assignments with due dates
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Exams - Formal assessments and tests
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Grading - Review and grade submissions
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Best Practices",
      description: "Make the most of both homework and exercises",
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-800 mb-2">For Homework (Mandatory)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Set clear due dates and expectations</li>
                <li>• Use for assessments that count toward grades</li>
                <li>• Include detailed instructions and rubrics</li>
                <li>• Monitor submission rates and follow up</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-800 mb-2">For Exercises (Practice)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Create after each lesson for reinforcement</li>
                <li>• Allow multiple attempts to encourage learning</li>
                <li>• Use gamification to motivate students</li>
                <li>• Provide immediate feedback when possible</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-800 mb-2">Combining Both</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use exercises to prepare students for homework</li>
                <li>• Reference exercise content in homework assignments</li>
                <li>• Create a progression from practice to assessment</li>
                <li>• Use exercise analytics to identify struggling students</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start using the improved system",
      content: (
        <div className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready to Start!</h3>
          <p className="text-muted-foreground mb-4">
            You now understand how to use homework and exercises effectively.
            Start creating engaging content for your students!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button className="w-full" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Create Lesson Exercise
            </Button>
            <Button className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Create Homework
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You can access this guide anytime from the help menu.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsOpen(false)
    setCurrentStep(0)
    if (onComplete) {
      onComplete()
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Learn About Homework vs Exercises
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {currentStepData.description}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="py-4"
        >
          {currentStepData.content}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentStep ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            ))}
          </div>

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={handleComplete}>
              Skip Guide
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default HomeworkExerciseGuide