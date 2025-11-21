import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Edit, MapPin, Phone, PhoneCall, Mail, Globe, Calendar, Building2, Sparkles, Facebook, Instagram, Twitter, Linkedin, Youtube, Share2, MessageCircle, Hash } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminPageLayout } from '../../components/admin/layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
// Removed Progress-based KPI cards from this page
import api from '../../services/api'

const AnimatedCounter = ({ from = 0, to, duration = 2, className = "" }) => {
  const ref = useRef()
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    if (isInView && to !== undefined) {
      animate(motionValue, to, { duration: duration })
    }
  }, [motionValue, isInView, to, duration])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  )
}

// Tailwind dynamic class mapping to avoid purge issues
const gradientMap = {
  blue: 'from-blue-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  emerald: 'from-emerald-500 to-emerald-600',
  indigo: 'from-indigo-500 to-blue-600'
}

const slugify = (value = '') => {
  return (value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .slice(0, 60)) || 'school_details'
}

const GlowingCard = ({ children, className = "", glowColor = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`relative group ${className}`}
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientMap[glowColor] || gradientMap.blue} rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
    <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-soft h-full">
      {children}
    </div>
  </motion.div>
)

// StatCard and KPI sections were removed from this page per request

const SchoolDetailsPage = () => {
  const { t, currentLanguage, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [schoolConfig, setSchoolConfig] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  // KPIs removed from this page; no stats state needed

  // Fetch school configuration data
  const fetchSchoolConfig = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try different endpoints to get school configuration
      let configResponse;
      try {
        // First try: list endpoint (should return array with single school)
        configResponse = await api.get('/schools/config/')
        const data = configResponse.data

        // Handle different possible response structures
        let schoolData;
        if (data.results && Array.isArray(data.results)) {
          // DRF paginated response
          schoolData = data.results[0]
        } else if (Array.isArray(data)) {
          // Direct array response
          schoolData = data[0]
        } else {
          // Direct object response
          schoolData = data
        }

        console.log('✅ School config processed:', schoolData)
        setSchoolConfig(schoolData)
      } catch (listError) {
        // Second try: detail endpoint with ID 1
        try {
          configResponse = await api.get('/schools/config/1/')
          setSchoolConfig(configResponse.data)
        } catch (detailError) {
          console.error('Both config endpoints failed:', { listError, detailError })
          throw new Error('Unable to fetch school configuration')
        }
      }

      // KPIs/statistics are shown on the dashboard, not here

    } catch (err) {
      console.error('Error fetching school config:', err)
      setError(err.response?.data?.error || err.message || 'Failed to load school details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchoolConfig()
  }, [])

  const handleRefresh = () => {
    fetchSchoolConfig()
  }

  const handleEdit = () => {
    navigate('/admin/school-management/school-details/edit')
  }


  const handleExport = async () => {
    if (!schoolConfig || isExporting) return

    setIsExporting(true)

    const escapeHtml = (value = '') => {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    const normalizeUrl = (url) => {
      if (!url) return ''
      return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/+/, '')}`
    }

    const notSetLabel = escapeHtml(t('misc.notSet', 'Not Set'))

    const renderDetailRow = ({ label, value, href, htmlContent }) => {
      const safeLabel = escapeHtml(label)
      const safeHref = href ? escapeHtml(href) : ''
      const hasHtmlContent =
        typeof htmlContent === 'string' && htmlContent.replace(/<[^>]*>/g, '').trim().length > 0
      const valueDefined = value !== undefined && value !== null
      const hasValue = valueDefined && `${value}`.trim().length > 0
      let content = ''
      let rowHasValue = false

      if (hasHtmlContent) {
        content = htmlContent
        rowHasValue = true
      } else if (hasValue) {
        const safeValue = escapeHtml(value)
        content = href ? `<a href="${safeHref}" target="_blank" rel="noreferrer">${safeValue}</a>` : safeValue
        rowHasValue = true
      }

      if (!rowHasValue) {
        content = notSetLabel
      }

      return `
        <div class="detail-row${rowHasValue ? '' : ' is-empty'}">
          <span class="detail-label">${safeLabel}</span>
          <span class="detail-value">${content}</span>
        </div>
      `
    }

    let container

    try {
      const safeLang = escapeHtml(currentLanguage || 'en')
      const safeSchoolName = escapeHtml(schoolConfig.name || t('misc.notSet', 'Not Set'))
      const arabicName = schoolConfig.name_arabic ? escapeHtml(schoolConfig.name_arabic) : ''
      const headerLocationRaw = [schoolConfig.city, schoolConfig.region].filter(Boolean).join(', ')
      const headerLocation = headerLocationRaw ? escapeHtml(headerLocationRaw) : notSetLabel
      const createdDate = escapeHtml(formatDate(schoolConfig.created_at))
      const updatedDate = escapeHtml(formatDate(schoolConfig.updated_at))
      const academicYearValue = escapeHtml(
        schoolConfig.current_academic_year?.year || t('misc.notSet', 'Not Set')
      )
      const capacityDisplay = schoolConfig.student_capacity
        ? `${Number(schoolConfig.student_capacity).toLocaleString()} ${t(
          'school.details.students',
          'Students'
        )}`
        : t('misc.notSet', 'Not Set')
      const capacityValue = escapeHtml(capacityDisplay)

      const contactDetails = [
        { label: t('school.details.phone', 'Phone Number'), value: schoolConfig.phone },
        { label: t('school.details.fixPhone', 'Fixed Phone'), value: schoolConfig.fix_phone },
        { label: t('school.details.whatsapp', 'WhatsApp'), value: schoolConfig.whatsapp_num },
        {
          label: t('school.details.email', 'Email Address'),
          value: schoolConfig.email,
          href: schoolConfig.email ? `mailto:${schoolConfig.email}` : undefined
        },
        {
          label: t('school.details.website', 'Website'),
          value: schoolConfig.website,
          href: schoolConfig.website ? normalizeUrl(schoolConfig.website) : undefined
        }
      ]

      const contactDetailsMarkup = contactDetails.map(renderDetailRow).join('')

      const locationTokens = [
        schoolConfig.city,
        schoolConfig.region,
        schoolConfig.postal_code
      ].filter(Boolean)
      const locationHtml = locationTokens.length
        ? locationTokens.map((token) => `<span class="chip">${escapeHtml(token)}</span>`).join('')
        : ''

      const codeBadges = []
      if (schoolConfig.school_code) {
        codeBadges.push(
          `<span class="chip chip-blue">${escapeHtml(
            t('school.details.schoolCode', 'School Code')
          )}: ${escapeHtml(schoolConfig.school_code)}</span>`
        )
      }
      if (schoolConfig.pattent) {
        codeBadges.push(
          `<span class="chip chip-emerald">${escapeHtml(
            t('school.details.pattent', 'Pattent')
          )}: ${escapeHtml(schoolConfig.pattent)}</span>`
        )
      }
      if (schoolConfig.rc_code) {
        codeBadges.push(
          `<span class="chip chip-purple">${escapeHtml(
            t('school.details.rcCode', 'RC Code')
          )}: ${escapeHtml(schoolConfig.rc_code)}</span>`
        )
      }
      const codesHtml =
        codeBadges.length > 0
          ? codeBadges.join('')
          : `<span class="chip chip-empty">${notSetLabel}</span>`

      const socialItems = [
        { icon: '📘', label: t('school.details.social.facebook', 'Facebook'), value: schoolConfig.facebook_url },
        { icon: '📷', label: t('school.details.social.instagram', 'Instagram'), value: schoolConfig.instagram_url },
        { icon: '🐦', label: t('school.details.social.twitter', 'Twitter / X'), value: schoolConfig.twitter_url },
        { icon: '💼', label: t('school.details.social.linkedin', 'LinkedIn'), value: schoolConfig.linkedin_url },
        { icon: '🎥', label: t('school.details.social.youtube', 'YouTube'), value: schoolConfig.youtube_url }
      ]

      const socialLinksHtml =
        socialItems
          .filter((item) => Boolean(item.value))
          .map((item) => {
            const safeUrl = escapeHtml(normalizeUrl(item.value))
            const safeLabel = escapeHtml(item.label)
            return `<a class="chip chip-interactive" href="${safeUrl}" target="_blank" rel="noreferrer">${item.icon} ${safeLabel}</a>`
          })
          .join('') || `<span class="chip chip-empty">${notSetLabel}</span>`

      const directorNameRaw = schoolConfig.director_details?.full_name
      const directorName = directorNameRaw ? escapeHtml(directorNameRaw) : ''
      const directorEmail = schoolConfig.director_details?.email
        ? escapeHtml(schoolConfig.director_details.email)
        : ''
      const directorHtml = directorName
        ? `${directorName}${directorEmail ? `<span class="detail-sub">${directorEmail}</span>` : ''}`
        : ''

      const administrationMarkup = [
        renderDetailRow({ label: t('school.details.director', 'School Director'), htmlContent: directorHtml }),
        renderDetailRow({
          label: t('school.details.capacity', 'Student Capacity'),
          value: capacityDisplay
        }),
        renderDetailRow({ label: t('school.details.created', 'Created'), value: formatDate(schoolConfig.created_at) }),
        renderDetailRow({
          label: t('common.lastUpdated', 'Last Updated'),
          value: formatDate(schoolConfig.updated_at)
        })
      ].join('')

      const summaryCardsHtml = [
        { label: t('school.details.created', 'Created'), value: createdDate },
        { label: t('common.lastUpdated', 'Last Updated'), value: updatedDate },
        {
          label: t('school.details.currentAcademicYear', 'Current Academic Year'),
          value: academicYearValue
        },
        { label: t('school.details.capacity', 'Student Capacity'), value: capacityValue }
      ]
        .map(
          (card) => `
          <div class="summary-card">
            <div class="summary-value">${card.value}</div>
            <div class="summary-label">${escapeHtml(card.label)}</div>
          </div>
        `
        )
        .join('')

      const generatedOn = escapeHtml(new Date().toLocaleString())
      const reportId = 'school-report-export'
      const styles = `
        #${reportId} {
          width: 794px;
          margin: 0 auto;
          background: #eef2ff;
          color: #0f172a;
          font-family: ${isRTL ? "'Tajawal', 'Segoe UI', sans-serif" : "'Inter', 'Segoe UI', sans-serif"};
        }
        #${reportId} *, #${reportId} *::before, #${reportId} *::after {
          box-sizing: border-box;
        }
        #${reportId}.rtl { direction: rtl; }
        #${reportId}.ltr { direction: ltr; }
        #${reportId} .page {
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
        }
        #${reportId} .header {
          display: flex;
          gap: 24px;
          padding: 32px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
        }
        #${reportId} .logo {
          width: 96px;
          height: 96px;
          border-radius: 24px;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.32);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.12);
        }
        #${reportId} .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        #${reportId} .placeholder-logo {
          font-size: 36px;
        }
        #${reportId} .title-block h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 700;
        }
        #${reportId} .title-block .arabic-name {
          margin: 6px 0 0;
          font-size: 20px;
          opacity: 0.9;
        }
        #${reportId} .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }
        #${reportId} .meta-chip {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        #${reportId} .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 16px;
          padding: 28px 32px 12px;
          background: linear-gradient(180deg, #eef2ff 0%, #ffffff 70%);
        }
        #${reportId} .summary-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid #e5e7f1;
          box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
        }
        #${reportId} .summary-value {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        #${reportId} .summary-label {
          margin-top: 6px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
        }
        #${reportId} .section {
          padding: 28px 32px;
          border-top: 1px solid #eef1f8;
        }
        #${reportId} .section:first-of-type { border-top: none; }
        #${reportId} .section-title {
          margin: 0 0 18px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #1f2a56;
          text-transform: uppercase;
        }
        #${reportId} .detail-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }
        #${reportId} .detail-row {
          background: #f8fafc;
          border-radius: 14px;
          padding: 14px 16px;
          border: 1px solid transparent;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        #${reportId} .detail-row.is-empty {
          opacity: 0.7;
          border-color: #d7dce5;
          border-style: dashed;
        }
        #${reportId} .detail-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          font-weight: 600;
        }
        #${reportId} .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }
        #${reportId} .detail-value a {
          color: #2563eb;
          text-decoration: none;
        }
        #${reportId} .detail-value a:hover {
          text-decoration: underline;
        }
        #${reportId} .detail-sub {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
        }
        #${reportId} .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        #${reportId} .chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 999px;
          background: #eef2ff;
          color: #3730a3;
          font-weight: 600;
          font-size: 13px;
          margin: 4px 8px 0 0;
        }
        #${reportId} .chip-blue {
          background: #dbeafe;
          color: #1d4ed8;
        }
        #${reportId} .chip-emerald {
          background: #d1fae5;
          color: #047857;
        }
        #${reportId} .chip-purple {
          background: #ede9fe;
          color: #6b21a8;
        }
        #${reportId} .chip-interactive {
          background: #ffffff;
          border: 1px solid #dbeafe;
          color: #1d4ed8;
        }
        #${reportId} .chip-interactive:hover {
          background: #eff6ff;
        }
        #${reportId} .chip-empty {
          background: #f1f5f9;
          color: #94a3b8;
          border: 1px dashed #cbd5f5;
        }
        #${reportId} .footer {
          padding: 24px 32px 32px;
          background: #f4f6fb;
          text-align: center;
          color: #475569;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
        }
        #${reportId} .footer strong {
          display: block;
          margin-top: 6px;
          color: #1f2937;
        }
      `

      const reportHtml = `
        <style>${styles}</style>
        <div id="${reportId}" class="${isRTL ? 'rtl' : 'ltr'}" lang="${safeLang}" dir="${isRTL ? 'rtl' : 'ltr'}">
          <div class="page">
            <div class="header">
              <div class="logo">
                ${schoolConfig.logo_url
          ? `<img src="${escapeHtml(schoolConfig.logo_url)}" alt="${safeSchoolName}" crossorigin="anonymous" />`
          : '<span class="placeholder-logo">🏫</span>'
        }
              </div>
              <div class="title-block">
                <h1>${safeSchoolName}</h1>
                ${arabicName ? `<p class="arabic-name">${arabicName}</p>` : ''}
                <div class="meta">
                  <span class="meta-chip">📍 ${headerLocation}</span>
                  <span class="meta-chip">🗓️ ${escapeHtml(t('school.details.created', 'Created'))}: ${createdDate}</span>
                </div>
              </div>
            </div>
            <section class="summary-grid">
              ${summaryCardsHtml}
            </section>
            <section class="section">
              <h2 class="section-title">📞 ${escapeHtml(t('school.details.contact', 'Contact Information'))}</h2>
              <div class="detail-list">
                ${contactDetailsMarkup}
              </div>
            </section>
            <section class="section">
              <h2 class="section-title">📍 ${escapeHtml(t('school.details.location', 'Location Information'))}</h2>
              <div class="detail-list">
                ${renderDetailRow({ label: t('school.details.address', 'Address'), value: schoolConfig.address })}
                ${renderDetailRow({
          label: t('school.details.cityRegion', 'City & Region'),
          htmlContent: locationHtml
        })}
              </div>
            </section>
            <section class="section">
              <h2 class="section-title">🔢 ${escapeHtml(t('school.details.codes', 'Institution Codes'))}</h2>
              <div class="chip-group">
                ${codesHtml}
              </div>
            </section>
            <section class="section">
              <h2 class="section-title">👥 ${escapeHtml(t('school.details.administration', 'Administration'))}</h2>
              <div class="detail-list">
                ${administrationMarkup}
              </div>
            </section>
            <section class="section">
              <h2 class="section-title">🌐 ${escapeHtml(t('school.details.social.label', 'Social Media'))}</h2>
              <div class="chip-group">
                ${socialLinksHtml}
              </div>
            </section>
            <footer class="footer">
              <div>${escapeHtml(t('school.details.exportFooter', 'School Details Report'))}</div>
              <strong>Madrasti 2.0 · ${escapeHtml(t('school.details.managementSystem', 'School Management System'))}</strong>
              <div>${escapeHtml(t('school.details.generatedOn', 'Generated on'))} ${generatedOn}</div>
            </footer>
          </div>
        </div>
      `

      container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.pointerEvents = 'none'
      container.style.opacity = '0'
      container.style.top = '-10000px'
      container.style.left = '-10000px'
      container.style.width = '794px'
      container.innerHTML = reportHtml
      document.body.appendChild(container)

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const reportElement = container.querySelector(`#${reportId}`)
      if (!reportElement) {
        throw new Error('Failed to generate export layout')
      }

      const images = Array.from(reportElement.querySelectorAll('img'))
      await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve()
              } else {
                img.onload = () => resolve()
                img.onerror = () => resolve()
              }
            })
        )
      )

      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const widthRatio = pdfWidth / canvas.width
      const heightRatio = pdfHeight / canvas.height
      const ratio = Math.min(widthRatio, heightRatio)
      const renderWidth = canvas.width * ratio
      const renderHeight = canvas.height * ratio
      const marginX = (pdfWidth - renderWidth) / 2
      const marginY = (pdfHeight - renderHeight) / 2

      pdf.addImage(imgData, 'PNG', marginX, marginY, renderWidth, renderHeight)
      const fileName = `school-details-${slugify(schoolConfig.name || 'school')}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Error generating school details PDF:', error)
      window.alert(t('admin.exportError', 'Failed to export school details. Please try again.'))
    } finally {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      setIsExporting(false)
    }
  }


  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return t('misc.notSet', 'Not Set')
    return new Date(dateString).toLocaleDateString()
  }

  // Example actions for the page header
  const pageActions = [
    <Button key="export" variant="outline" size="sm" onClick={handleExport} disabled={!schoolConfig || isExporting}>
      <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
      {isExporting ? t('common.downloading', 'Downloading...') : t('admin.export', 'Export')}
    </Button>,
    <Button key="edit" size="sm" onClick={handleEdit}>
      <Edit className="h-4 w-4 mr-2" />
      {t('common.edit', 'Edit')}
    </Button>
  ]

  const socialLinks = [
    {
      key: 'facebook',
      label: t('school.details.social.facebook', 'Facebook'),
      url: schoolConfig?.facebook_url,
      icon: Facebook,
      className: 'border-blue-200 text-blue-600 hover:bg-blue-50'
    },
    {
      key: 'instagram',
      label: t('school.details.social.instagram', 'Instagram'),
      url: schoolConfig?.instagram_url,
      icon: Instagram,
      className: 'border-pink-200 text-pink-600 hover:bg-pink-50'
    },
    {
      key: 'twitter',
      label: t('school.details.social.twitter', 'Twitter / X'),
      url: schoolConfig?.twitter_url,
      icon: Twitter,
      className: 'border-sky-200 text-sky-600 hover:bg-sky-50'
    },
    {
      key: 'linkedin',
      label: t('school.details.social.linkedin', 'LinkedIn'),
      url: schoolConfig?.linkedin_url,
      icon: Linkedin,
      className: 'border-blue-200 text-blue-700 hover:bg-blue-50'
    },
    {
      key: 'youtube',
      label: t('school.details.social.youtube', 'YouTube'),
      url: schoolConfig?.youtube_url,
      icon: Youtube,
      className: 'border-red-200 text-red-600 hover:bg-red-50'
    }
  ].filter((link) => Boolean(link.url))

  return (
    <AdminPageLayout
      title={t('adminSidebar.schoolManagement.schoolDetails')}
      subtitle={t('school.details.subtitle', "Manage your school's basic information and settings")}
      showBackButton={true}
      showRefreshButton={true}
      onRefresh={handleRefresh}
      actions={pageActions}
      loading={loading}
      error={error}
    >
      {schoolConfig && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero Section with School Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-purple-700 p-6 md:p-8 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-4 flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="flex items-center gap-3 md:gap-4"
                >
                  <Building2 className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{schoolConfig.name}</h1>
                    {schoolConfig.name_arabic && (
                      <p className="text-sm md:text-lg opacity-90 truncate" dir="rtl">
                        {schoolConfig.name_arabic}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs md:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{schoolConfig.city}, {schoolConfig.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span>{t('school.details.created', 'Created')} {formatDate(schoolConfig.created_at)}</span>
                  </div>
                </motion.div>
              </div>
              {schoolConfig.logo_url && (
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="relative flex-shrink-0"
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
                  <img
                    src={schoolConfig.logo_url}
                    alt={schoolConfig.name}
                    className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full border-2 md:border-4 border-white/50 object-cover shadow-lg"
                  />
                </motion.div>
              )}
            </div>
            <div className="absolute top-0 right-0 opacity-10">
              <Sparkles className="h-24 w-24 md:h-32 md:w-32" />
            </div>
          </motion.div>

          {/* KPI cards removed; they will live on the dashboard */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* School Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 space-y-4 lg:space-y-6"
            >
              <GlowingCard glowColor="blue">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="h-5 w-5" />
                    {t('school.details.info', 'School Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="group">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                          {t('school.details.phone', 'Phone Number')}
                        </label>
                        <motion.p
                          className="font-semibold text-lg group-hover:text-blue-600 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                        >
                          {schoolConfig.phone}
                        </motion.p>
                      </div>

                      {schoolConfig.fix_phone && (
                        <div className="group">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <PhoneCall className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                            {t('school.details.fixPhone', 'Fixed Phone')}
                          </label>
                          <motion.p
                            className="font-semibold text-lg group-hover:text-blue-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            {schoolConfig.fix_phone}
                          </motion.p>
                        </div>
                      )}

                      {schoolConfig.whatsapp_num && (
                        <div className="group">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 group-hover:text-green-500 transition-colors" />
                            {t('school.details.whatsapp', 'WhatsApp')}
                          </label>
                          <motion.p
                            className="font-semibold text-lg group-hover:text-green-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            {schoolConfig.whatsapp_num}
                          </motion.p>
                        </div>
                      )}

                      <div className="group">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4 group-hover:text-green-500 transition-colors" />
                          {t('school.details.email', 'Email Address')}
                        </label>
                        <motion.p
                          className="font-semibold text-lg group-hover:text-green-600 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                        >
                          {schoolConfig.email}
                        </motion.p>
                      </div>

                      {schoolConfig.website && (
                        <div className="group">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Globe className="h-4 w-4 group-hover:text-purple-500 transition-colors" />
                            {t('school.details.website', 'Website')}
                          </label>
                          <motion.a
                            href={schoolConfig.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-lg text-purple-600 hover:text-purple-700 hover:underline transition-all cursor-pointer block"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {schoolConfig.website}
                          </motion.a>
                        </div>
                      )}

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-indigo-500" />
                          {t('school.details.social.label', 'Social Media')}
                        </label>
                        {socialLinks.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {socialLinks.map(({ key, icon: Icon, label, url, className }) => (
                              <motion.a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors bg-white/80 backdrop-blur-sm shadow-sm ${className}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                              </motion.a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t('school.details.social.empty', 'No social media profiles added yet. Click Edit to add links.')}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="group">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4 group-hover:text-red-500 transition-colors" />
                          {t('school.details.address', 'Address')}
                        </label>
                        <motion.p
                          className="font-semibold text-lg group-hover:text-red-600 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          {schoolConfig.address}
                        </motion.p>
                        <motion.div
                          className="flex flex-wrap gap-2 mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          >
                            {schoolConfig.city}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                          >
                            {schoolConfig.region}
                          </Badge>
                          {schoolConfig.postal_code && (
                            <Badge
                              variant="outline"
                              className="border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors"
                            >
                              {schoolConfig.postal_code}
                            </Badge>
                          )}
                        </motion.div>
                      </div>

                      {schoolConfig.student_capacity && (
                        <div className="group">
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('school.details.capacity', 'Student Capacity')}
                          </label>
                          <motion.p
                            className="font-semibold text-lg group-hover:text-indigo-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            <AnimatedCounter to={schoolConfig.student_capacity} /> {t('school.details.students', 'Students')}
                          </motion.p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Administration */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}
                    className="pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('school.details.director', 'School Director')}
                        </label>
                        <p className="text-sm text-gray-800">
                          {schoolConfig.director_details?.full_name || t('misc.notSet', 'Not Set')}
                        </p>
                        {schoolConfig.director_details?.email && (
                          <p className="text-xs text-gray-500">{schoolConfig.director_details.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('common.lastUpdated', 'Last Updated')}
                        </label>
                        <p className="text-sm text-gray-600">{formatDate(schoolConfig.updated_at)}</p>
                      </div>
                      {(schoolConfig.school_code || schoolConfig.pattent || schoolConfig.rc_code) && (
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Hash className="h-4 w-4 text-indigo-500" />
                            {t('school.details.codes', 'Institution Codes')}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {schoolConfig.school_code && (
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {t('school.details.schoolCode', 'School Code')}: {schoolConfig.school_code}
                              </Badge>
                            )}
                            {schoolConfig.pattent && (
                              <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                                {t('school.details.pattent', 'Pattent')}: {schoolConfig.pattent}
                              </Badge>
                            )}
                            {schoolConfig.rc_code && (
                              <Badge variant="outline" className="border-purple-200 text-purple-700">
                                {t('school.details.rcCode', 'RC Code')}: {schoolConfig.rc_code}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </CardContent>
              </GlowingCard>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4 lg:space-y-6"
            >
              {/* Academic Year */}
              <GlowingCard glowColor="indigo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t('school.details.academicYear', 'Academic Year')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-center p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="text-3xl font-bold text-indigo-600 mb-2"
                      animate={{
                        textShadow: [
                          "0 0 0px #6366f1",
                          "0 0 20px #6366f1",
                          "0 0 0px #6366f1"
                        ]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    >
                      {schoolConfig.current_academic_year?.year || t('misc.notSet', 'Not Set')}
                    </motion.div>
                    <div className="text-sm text-indigo-700">{t('school.details.currentAcademicYear', 'Current Academic Year')}</div>
                  </motion.div>
                </CardContent>
              </GlowingCard>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AdminPageLayout>
  )
}

export default SchoolDetailsPage
