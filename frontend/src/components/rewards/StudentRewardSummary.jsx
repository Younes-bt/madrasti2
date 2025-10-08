
import React, { useEffect, useMemo, useState } from 'react'
import { Loader2, Zap, Coins as CoinsIcon, Crown, TrendingUp, Gift, Shield, Award, Clock } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { cn } from '../../lib/utils'
import { useLanguage } from '../../hooks/useLanguage'
import { rewardsService } from '../../services'

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
  } catch {
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

const StudentRewardSummary = ({
  studentId,
  className,
  title,
  description,
  historyLimit = 5
}) => {
  const { t, currentLanguage } = useLanguage()
  const locale = useMemo(() => getLocale(currentLanguage), [currentLanguage])

  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadData = async () => {
    if (!studentId) {
      setWallet(null)
      setTransactions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [walletResponse, transactionsResponse] = await Promise.all([
        rewardsService.getWalletByStudent(studentId),
        rewardsService.getTransactionsByStudent(studentId, { page_size: 100 })
      ])

      setWallet(walletResponse)
      setTransactions(transactionsResponse.results ?? [])
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  const levelInfo = useMemo(
    () => calculateLevelProgress(wallet?.level, wallet?.experience_points),
    [wallet]
  )

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
        accent: 'bg-blue-500/10 text-blue-600'
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
        accent: 'bg-amber-500/10 text-amber-600'
      },
      {
        key: 'level',
        icon: Crown,
        label: t('gamification.pointsPage.summary.level', 'Level'),
        value: formatNumber(wallet.level, locale),
        helper: wallet.current_level_name || t('gamification.pointsPage.summary.levelFallback', 'Unlocked tier'),
        accent: 'bg-purple-500/10 text-purple-600'
      }
    ]
  }, [wallet, locale, t])

  const topTransactions = useMemo(() => {
    if (!transactions?.length) return []
    return transactions.slice(0, historyLimit)
  }, [transactions, historyLimit])

  const typeLabel = (type) => t(`gamification.pointsPage.history.types.${type}`, type)

  const titleLabel = title ?? t('teacherStudentView.rewardsTitle', 'Rewards & Points')
  const descriptionLabel = description ?? t('teacherStudentView.rewardsDescription', 'Overview of the student\'s rewards and recent activity.')

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{titleLabel}</CardTitle>
          <CardDescription>{descriptionLabel}</CardDescription>
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">{t('gamification.pointsPage.refresh', 'Refresh')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {loading && !wallet && !transactions.length ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t('common.loading', 'Loading...')}</span>
          </div>
        ) : null}

        {!loading && !wallet && !error ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t('teacherStudentView.rewardsEmpty', 'No reward data recorded for this student yet.')}
          </div>
        ) : null}

        {wallet && (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              {summaryCards.map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.key} className={cn('rounded-xl border p-4 shadow-sm transition-colors hover:bg-muted/40', card.accent)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                        <p className="text-2xl font-semibold text-foreground">{card.value}</p>
                      </div>
                      <div className="rounded-full bg-white/70 p-2 text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground/90">{card.helper}</p>
                  </div>
                )
              })}
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center justify-between text-sm font-medium text-foreground">
                <span>
                  {t('gamification.pointsPage.levelProgress.current', {
                    defaultValue: 'XP: {{value}}',
                    value: formatNumber(wallet.experience_points, locale)
                  })}
                </span>
                <span>
                  {t('gamification.pointsPage.levelProgress.remaining', {
                    defaultValue: '{{value}} XP to next level',
                    value: formatNumber(levelInfo.xpToNextLevel, locale)
                  })}
                </span>
              </div>
              <Progress value={levelInfo.percent} className="mt-3 h-2" />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t('gamification.pointsPage.levelProgress.currentLevel', 'Current level threshold')}</span>
                <Badge variant="secondary" className="text-xs">
                  {t('gamification.pointsPage.levelProgress.badge', {
                    defaultValue: 'Level {{value}}',
                    value: formatNumber(wallet.level, locale)
                  })}
                </Badge>
              </div>
            </div>
          </>
        )}

        {wallet && (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">
                {t('gamification.pointsPage.activity.weeklyPoints', 'Points this week')}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatNumber(wallet.weekly_points, locale)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">
                {t('gamification.pointsPage.activity.monthlyPoints', 'Points this month')}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatNumber(wallet.monthly_points, locale)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">
                {t('gamification.pointsPage.summary.streak', 'Current Streak')}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {t('gamification.pointsPage.summary.streakValue', {
                  defaultValue: '{{value}} days',
                  value: formatNumber(wallet.current_streak, locale)
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('gamification.pointsPage.summary.longestStreak', {
                  defaultValue: 'Best: {{value}} days',
                  value: formatNumber(wallet.longest_streak, locale)
                })}
              </p>
            </div>
          </div>
        )}

        {wallet && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                {t('gamification.pointsPage.history.title', 'Points History')}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t('gamification.pointsPage.history.description', 'Review how you earned and spent points.')}
              </p>
            </div>

            {!topTransactions.length ? (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                {t('gamification.pointsPage.history.empty', 'No matching transactions yet. Complete assignments to start earning points!')}
              </div>
            ) : (
              <div className="space-y-2">
                {topTransactions.map((transaction) => {
                  const type = transaction.transaction_type || 'earned'
                  const TypeIcon = TRANSACTION_ICONS[type] || TrendingUp
                  const points = getSignedValue(transaction.points_earned, type)
                  const coins = getSignedValue(transaction.coins_earned, type)
                  const pointsClass = points >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  const coinsClass = coins >= 0 ? 'text-emerald-600' : 'text-rose-600'

                  return (
                    <div key={`${transaction.id}-${transaction.created_at}`} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {transaction.reason || typeLabel(type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.created_at, locale)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end gap-4 text-right text-sm font-semibold">
                        <span className={pointsClass}>
                          {points > 0 ? '+' : ''}
                          {formatNumber(Math.abs(points), locale)}
                          <span className="ml-1 text-xs text-muted-foreground">{t('gamification.pointsPage.history.table.points', 'Points')}</span>
                        </span>
                        <span className={coinsClass}>
                          {coins > 0 ? '+' : ''}
                          {formatNumber(Math.abs(coins), locale)}
                          <span className="ml-1 text-xs text-muted-foreground">{t('gamification.pointsPage.history.table.coins', 'Coins')}</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StudentRewardSummary
