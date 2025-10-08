import React, { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { rewardsService } from '../../services'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table'
import { cn } from '../../lib/utils'
import {
  Zap,
  Coins as CoinsIcon,
  Crown,
  Flame,
  RefreshCw,
  Loader2,
  Target,
  Gift,
  Shield,
  Award,
  Medal,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Clock
} from 'lucide-react'

const LOCALE_MAP = {
  ar: 'ar-MA',
  fr: 'fr-FR',
  en: 'en-GB'
}

const NEGATIVE_TRANSACTION_TYPES = new Set(['penalty', 'spent'])
const XP_PER_LEVEL = 200

const TRANSACTION_ICONS = {
  earned: Zap,
  bonus: Gift,
  achievement: Award,
  spent: CoinsIcon,
  penalty: Shield,
  gift: Gift
}

const getLocale = (language) => LOCALE_MAP[language] ?? 'en-GB'

const calculateLevelProgress = (level = 1, experience = 0) => {
  const safeLevel = Math.max(1, Number(level) || 1)
  const safeXp = Math.max(0, Number(experience) || 0)
  const xpForCurrentLevel = (safeLevel - 1) * XP_PER_LEVEL
  const xpForNextLevel = safeLevel * XP_PER_LEVEL
  const xpIntoLevel = Math.max(0, safeXp - xpForCurrentLevel)
  const xpSpan = Math.max(1, xpForNextLevel - xpForCurrentLevel)
  const percent = Math.min(100, Math.max(0, (xpIntoLevel / xpSpan) * 100))

  return {
    percent,
    xpForCurrentLevel,
    xpForNextLevel,
    xpToNextLevel: Math.max(0, xpForNextLevel - safeXp)
  }
}

const formatDate = (value, locale) => {
  if (!value) return '--'
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value))
  } catch (error) {
    return value
  }
}

const formatNumber = (value, locale, options) => {
  const numeric = Number(value ?? 0)
  return new Intl.NumberFormat(locale, options).format(numeric)
}

const getSignedValue = (value, type) => {
  const numeric = Number(value ?? 0)
  if (!numeric) return 0
  return NEGATIVE_TRANSACTION_TYPES.has(type) ? -Math.abs(numeric) : Math.abs(numeric)
}

const getPeriodThreshold = (period) => {
  const now = Date.now()
  switch (period) {
    case '7d':
      return now - 7 * 24 * 60 * 60 * 1000
    case '30d':
      return now - 30 * 24 * 60 * 60 * 1000
    case '90d':
      return now - 90 * 24 * 60 * 60 * 1000
    default:
      return null
  }
}

const StudentPointsPage = () => {
  const { t, currentLanguage } = useLanguage()
  const locale = useMemo(() => getLocale(currentLanguage), [currentLanguage])

  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ type: 'all', period: '30d' })
  const [searchTerm, setSearchTerm] = useState('')
  const [historyPage, setHistoryPage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState(null)

  const pageSize = 10

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [walletResponse, transactionsResponse] = await Promise.all([
        rewardsService.getMyWallet(),
        rewardsService.getTransactions()
      ])

      setWallet(walletResponse)
      setTransactions(transactionsResponse.results ?? [])
      setHistoryPage(1)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to load reward data', err)
      setError(err?.userMessage || err?.message || 'Unable to load reward data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setHistoryPage(1)
  }, [filters, searchTerm])

  const levelInfo = useMemo(() => calculateLevelProgress(wallet?.level, wallet?.experience_points), [wallet])

  const filteredTransactions = useMemo(() => {
    if (!transactions?.length) return []
    const threshold = getPeriodThreshold(filters.period)
    const term = searchTerm.trim().toLowerCase()

    return transactions.filter((transaction) => {
      if (filters.type !== 'all' && transaction.transaction_type !== filters.type) {
        return false
      }

      if (threshold) {
        const created = new Date(transaction.created_at || transaction.updated_at || Date.now()).getTime()
        if (created < threshold) {
          return false
        }
      }

      if (term) {
        const haystack = [
          transaction.reason,
          transaction.reason_arabic,
          transaction.homework?.title,
          transaction.exercise?.title
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!haystack.includes(term)) {
          return false
        }
      }

      return true
    })
  }, [transactions, filters, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize) || 1)
  const currentTransactions = useMemo(() => {
    const start = (historyPage - 1) * pageSize
    return filteredTransactions.slice(start, start + pageSize)
  }, [filteredTransactions, historyPage])

  const summaryCards = useMemo(() => {
    if (!wallet) return []

    return [
      {
        key: 'points',
        icon: Zap,
        label: t('gamification.pointsPage.summary.totalPoints', 'Total Points'),
        value: formatNumber(wallet.total_points, locale),
        helper: t('gamification.pointsPage.summary.weeklyPoints', {
          defaultValue: 'This week: {{value}} pts',
          value: formatNumber(wallet.weekly_points, locale)
        }),
        gradient: 'from-blue-500 via-blue-400 to-indigo-500'
      },
      {
        key: 'coins',
        icon: CoinsIcon,
        label: t('gamification.pointsPage.summary.totalCoins', 'Coins'),
        value: formatNumber(wallet.total_coins, locale),
        helper: t('gamification.pointsPage.summary.weeklyCoins', {
          defaultValue: 'This week: {{value}} coins',
          value: formatNumber(wallet.weekly_coins, locale)
        }),
        gradient: 'from-amber-500 via-orange-400 to-yellow-500'
      },
      {
        key: 'level',
        icon: Crown,
        label: t('gamification.pointsPage.summary.level', 'Level'),
        value: formatNumber(wallet.level, locale),
        helper: wallet.current_level_name || t('gamification.pointsPage.summary.levelFallback', 'Unlocked tier'),
        gradient: 'from-purple-500 via-violet-400 to-purple-600'
      },
      {
        key: 'streak',
        icon: Flame,
        label: t('gamification.pointsPage.summary.streak', 'Current Streak'),
        value: t('gamification.pointsPage.summary.streakValue', {
          defaultValue: '{{value}} days',
          value: formatNumber(wallet.current_streak, locale)
        }),
        helper: t('gamification.pointsPage.summary.longestStreak', {
          defaultValue: 'Best: {{value}} days',
          value: formatNumber(wallet.longest_streak, locale)
        }),
        gradient: 'from-emerald-500 via-teal-400 to-emerald-600'
      }
    ]
  }, [wallet, locale, t])

  const typeOptions = useMemo(
    () => [
      { value: 'all', label: t('gamification.pointsPage.history.types.all', 'All types') },
      { value: 'earned', label: t('gamification.pointsPage.history.types.earned', 'Earned') },
      { value: 'bonus', label: t('gamification.pointsPage.history.types.bonus', 'Bonus') },
      { value: 'achievement', label: t('gamification.pointsPage.history.types.achievement', 'Achievement') },
      { value: 'gift', label: t('gamification.pointsPage.history.types.gift', 'Gift') },
      { value: 'spent', label: t('gamification.pointsPage.history.types.spent', 'Spent') },
      { value: 'penalty', label: t('gamification.pointsPage.history.types.penalty', 'Penalty') }
    ],
    [t]
  )

  const periodOptions = useMemo(
    () => [
      { value: 'all', label: t('gamification.pointsPage.history.periods.all', 'All time') },
      { value: '7d', label: t('gamification.pointsPage.history.periods.7d', 'Last 7 days') },
      { value: '30d', label: t('gamification.pointsPage.history.periods.30d', 'Last 30 days') },
      { value: '90d', label: t('gamification.pointsPage.history.periods.90d', 'Last 90 days') }
    ],
    [t]
  )

  const handleNextPage = () => setHistoryPage((prev) => Math.min(prev + 1, totalPages))
  const handlePreviousPage = () => setHistoryPage((prev) => Math.max(prev - 1, 1))

  const title = t('gamification.pointsPage.title', 'My Points')
  const subtitle = t('gamification.pointsPage.subtitle', 'Track how you earn and spend your rewards.')

  return (
    <DashboardLayout title={title} description={subtitle}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                <Clock className="mr-1 inline h-3.5 w-3.5" />
                {t('gamification.pointsPage.lastUpdated', {
                  defaultValue: 'Updated {{value}}',
                  value: formatDate(lastUpdated, locale)
                })}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">
                {t('gamification.pointsPage.refresh', 'Refresh')}
              </span>
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/40 bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-destructive">{t('gamification.pointsPage.errorTitle', 'Something went wrong')}</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(loading && !wallet ? Array.from({ length: 4 }) : summaryCards).map((card, index) => {
            if (!card) {
              return (
                <Card key={`placeholder-${index}`} className="h-full animate-pulse bg-muted/40">
                  <CardContent className="p-5">
                    <div className="h-4 w-1/3 rounded bg-muted" />
                    <div className="mt-4 h-8 w-2/3 rounded bg-muted" />
                    <div className="mt-6 h-3 w-1/2 rounded bg-muted" />
                  </CardContent>
                </Card>
              )
            }

            const Icon = card.icon
            return (
              <Card
                key={card.key}
                className="relative overflow-hidden border-none text-white shadow-lg"
              >
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-95', card.gradient)} />
                <CardContent className="relative flex h-full flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/80">{card.label}</p>
                      <p className="text-3xl font-semibold">{card.value}</p>
                    </div>
                    <div className="rounded-full bg-black/10 p-2">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-white/85">{card.helper}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{t('gamification.pointsPage.levelProgress.title', 'Level Progress')}</CardTitle>
                <CardDescription>
                  {t('gamification.pointsPage.levelProgress.description', 'Earn points to reach the next tier.')}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {t('gamification.pointsPage.levelProgress.badge', {
                  defaultValue: 'Level {{value}}',
                  value: formatNumber(wallet?.level, locale)
                })}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium text-foreground">
                  <span>
                    {t('gamification.pointsPage.levelProgress.current', {
                      defaultValue: 'XP: {{value}}',
                      value: formatNumber(wallet?.experience_points, locale)
                    })}
                  </span>
                  <span>
                    {t('gamification.pointsPage.levelProgress.remaining', {
                      defaultValue: '{{value}} XP to next level',
                      value: formatNumber(levelInfo.xpToNextLevel, locale)
                    })}
                  </span>
                </div>
                <Progress value={levelInfo.percent} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('gamification.pointsPage.levelProgress.currentLevel', 'Current level threshold')}</span>
                  <span>
                    {t('gamification.pointsPage.levelProgress.nextLevel', {
                      defaultValue: 'Next level at {{value}} XP',
                      value: formatNumber(levelInfo.xpForNextLevel, locale)
                    })}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('gamification.pointsPage.levelProgress.metrics.assignments', 'Assignments completed')}
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatNumber(wallet?.assignments_completed, locale)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('gamification.pointsPage.levelProgress.metrics.perfectScores', 'Perfect scores')}
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatNumber(wallet?.perfect_scores, locale)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('gamification.pointsPage.levelProgress.metrics.earlySubmissions', 'Early submissions')}
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatNumber(wallet?.early_submissions, locale)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('gamification.pointsPage.activity.title', 'Reward Activity')}</CardTitle>
              <CardDescription>{t('gamification.pointsPage.activity.description', 'Weekly and monthly performance')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t('gamification.pointsPage.activity.weeklyPoints', 'Points this week')}</span>
                  <span>{formatNumber(wallet?.weekly_points, locale)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  {t('gamification.pointsPage.activity.weeklyHint', 'Consistent progress boosts your streak.')}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t('gamification.pointsPage.activity.monthlyPoints', 'Points this month')}</span>
                  <span>{formatNumber(wallet?.monthly_points, locale)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-4 w-4 text-blue-500" />
                  {t('gamification.pointsPage.activity.monthlyHint', 'Aim for steady growth each month.')}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t('gamification.pointsPage.activity.lastActivity', 'Last activity')}</span>
                  <span>{formatDate(wallet?.last_activity, locale)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Medal className="h-4 w-4 text-purple-500" />
                  {t('gamification.pointsPage.activity.lastActivityHint', 'Keep earning to maintain your lead.')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('gamification.pointsPage.history.title', 'Points History')}</CardTitle>
            <CardDescription>{t('gamification.pointsPage.history.description', 'Review how you earned and spent points.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-wrap gap-3">
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('gamification.pointsPage.history.typePlaceholder', 'Type')} />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.period}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, period: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('gamification.pointsPage.history.periodPlaceholder', 'Period')} />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t('gamification.pointsPage.history.search', 'Search reason...')}
                  className="w-full lg:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('gamification.pointsPage.history.table.date', 'Date')}</TableHead>
                    <TableHead>{t('gamification.pointsPage.history.table.details', 'Details')}</TableHead>
                    <TableHead className="text-right">
                      {t('gamification.pointsPage.history.table.points', 'Points')}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('gamification.pointsPage.history.table.coins', 'Coins')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && !transactions.length && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && !filteredTransactions.length && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        {t('gamification.pointsPage.history.empty', 'No matching transactions yet. Complete assignments to start earning points!')}
                      </TableCell>
                    </TableRow>
                  )}

                  {currentTransactions.map((transaction) => {
                    const type = transaction.transaction_type || 'earned'
                    const TypeIcon = TRANSACTION_ICONS[type] || TrendingUp
                    const typeLabel = t(`gamification.pointsPage.history.types.${type}`, type)
                    const points = getSignedValue(transaction.points_earned, type)
                    const coins = getSignedValue(transaction.coins_earned, type)
                    const pointsClass = points >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    const coinsClass = coins >= 0 ? 'text-emerald-500' : 'text-rose-500'

                    const homeworkTitle = transaction.homework?.title
                    const exerciseTitle = transaction.exercise?.title

                    return (
                      <TableRow key={`${transaction.id}-${transaction.created_at}`}>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(transaction.created_at, locale)}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <TypeIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{transaction.reason || typeLabel}</p>
                                {(homeworkTitle || exerciseTitle) && (
                                  <p className="text-xs text-muted-foreground">
                                    {[homeworkTitle, exerciseTitle].filter(Boolean).join(' • ')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="w-fit text-xs uppercase tracking-wide">
                              {typeLabel}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className={cn('text-right text-sm font-semibold', pointsClass)}>
                          {points > 0 ? '+' : ''}
                          {formatNumber(Math.abs(points), locale)}
                        </TableCell>
                        <TableCell className={cn('text-right text-sm font-semibold', coinsClass)}>
                          {coins > 0 ? '+' : ''}
                          {formatNumber(Math.abs(coins), locale)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length > pageSize && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {t('gamification.pointsPage.history.showing', {
                    defaultValue: 'Showing {{current}} of {{total}} records',
                    current: filteredTransactions.length ? Math.min(historyPage * pageSize, filteredTransactions.length) : 0,
                    total: filteredTransactions.length
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={historyPage <= 1}>
                    <ArrowLeft className="h-4 w-4" />
                    {t('gamification.pointsPage.history.prev', 'Previous')}
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    {historyPage} / {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={historyPage >= totalPages}>
                    <ArrowRight className="h-4 w-4" />
                    {t('gamification.pointsPage.history.next', 'Next')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default StudentPointsPage
