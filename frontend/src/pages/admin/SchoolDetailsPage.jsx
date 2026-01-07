import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download, Edit, MapPin, Phone, PhoneCall, Mail, Globe,
  Calendar, Building2, Sparkles, Facebook, Instagram,
  Twitter, Linkedin, Youtube, Share2, MessageCircle, Hash,
  User, Users, ShieldCheck, GraduationCap
} from 'lucide-react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminPageLayout } from '../../components/admin/layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import api from '../../services/api'

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

const InfoRow = ({ icon: Icon, label, value, href, isRTL, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <div className="flex items-center gap-2 text-gray-500">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
    </div>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base font-medium text-indigo-600 hover:text-indigo-700 hover:underline break-all"
      >
        {value}
      </a>
    ) : (
      <p className={`text-base font-medium text-gray-900 border-b border-transparent ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {value || '---'}
      </p>
    )}
  </div>
)

const SchoolDetailsPage = () => {
  const { t, currentLanguage, isRTL } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [schoolConfig, setSchoolConfig] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

  const fetchSchoolConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/schools/config/')
      const data = response.data
      const schoolData = data.results ? data.results[0] : (Array.isArray(data) ? data[0] : data)
      setSchoolConfig(schoolData)
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

  const handleRefresh = () => fetchSchoolConfig()
  const handleEdit = () => navigate('/admin/school-management/school-details/edit')

  const handleExport = async () => {
    if (!schoolConfig || isExporting) return
    setIsExporting(true)

    const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]))

    try {
      const reportId = 'school-report-export'
      const container = document.createElement('div')
      // A4 dimensions in pixels at 96 DPI: 794 x 1123
      container.style.cssText = 'position:fixed;opacity:0;top:-10000px;width:794px;'

      const arabicName = schoolConfig.name_arabic ? `<div style="font-size:20px; color: #4338ca; margin-top:4px; font-family: sans-serif;">${escapeHtml(schoolConfig.name_arabic)}</div>` : ''

      container.innerHTML = `
        <div id="${reportId}" style="width:794px; background: white; color: #1f2937; padding: 40px; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; ${isRTL ? 'direction:rtl;' : 'direction:ltr;'}">
          <!-- Header Bar -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="flex: 1;">
              <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0; line-height: 1.2;">${escapeHtml(schoolConfig.name)}</h1>
              ${arabicName}
              <div style="margin-top: 12px; color: #6b7280; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                <span style="color: #4f46e5;">📍</span> ${escapeHtml(schoolConfig.city)}, ${escapeHtml(schoolConfig.region)}
              </div>
            </div>
            <div style="width: 100px; height: 100px; overflow: hidden; border-radius: 12px; background: #f9fafb; border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: center;">
              ${schoolConfig.logo_url
          ? `<img src="${escapeHtml(schoolConfig.logo_url)}" style="width: 100%; height: 100%; object-fit: contain;" crossorigin="anonymous" />`
          : '<span style="font-size: 40px;">🏫</span>'
        }
            </div>
          </div>

          <!-- Official Document Identification -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700;">Document Title</div>
              <div style="font-size: 16px; font-weight: 700; color: #334155;">Official School Record</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700;">Reference Date</div>
              <div style="font-size: 16px; font-weight: 700; color: #334155;">${new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-MA' : 'fr-FR')}</div>
            </div>
          </div>

          <!-- Main Info Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
            <!-- Column 1: Institutional -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
              <div>
                <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #4f46e5; border-bottom: 1px solid #e0e7ff; padding-bottom: 6px; margin-bottom: 12px; font-weight: 700;">Institutional Details</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Director</span> <span style="font-weight: 600; font-size: 13px;">${escapeHtml(schoolConfig.director_details?.full_name || '---')}</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Academic Year</span> <span style="font-weight: 600; font-size: 13px;">${escapeHtml(schoolConfig.current_academic_year_details?.year || '---')}</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Capacity</span> <span style="font-weight: 600; font-size: 13px;">${schoolConfig.student_capacity || 0} Students</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Established at</span> <span style="font-weight: 600; font-size: 13px;">${new Date(schoolConfig.created_at).toLocaleDateString()}</span></div>
                </div>
              </div>

              <div>
                <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #4f46e5; border-bottom: 1px solid #e0e7ff; padding-bottom: 6px; margin-bottom: 12px; font-weight: 700;">Legal Identification</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">School Code</span> <span style="font-family: monospace; font-weight: 700; font-size: 13px; color: #0f172a;">${escapeHtml(schoolConfig.school_code || '---')}</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Pattent Number</span> <span style="font-family: monospace; font-weight: 700; font-size: 13px; color: #0f172a;">${escapeHtml(schoolConfig.pattent || '---')}</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">RC Code</span> <span style="font-family: monospace; font-weight: 700; font-size: 13px; color: #0f172a;">${escapeHtml(schoolConfig.rc_code || '---')}</span></div>
                </div>
              </div>
            </div>

            <!-- Column 2: Contact -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
              <div>
                <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #4f46e5; border-bottom: 1px solid #e0e7ff; padding-bottom: 6px; margin-bottom: 12px; font-weight: 700;">Communication</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Primary Phone</span> <span style="font-weight: 600; font-size: 13px;">${escapeHtml(schoolConfig.phone || '---')}</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Fixed Line</span> <span style="font-weight: 600; font-size: 13px;">${escapeHtml(schoolConfig.fix_phone || '---')}</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">WhatsApp</span> <span style="font-weight: 600; font-size: 13px;">${escapeHtml(schoolConfig.whatsapp_num || '---')}</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Email</span> <span style="font-weight: 600; font-size: 13px; color: #4f46e5;">${escapeHtml(schoolConfig.email || '---')}</span></div>
                </div>
              </div>

              <div>
                <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #4f46e5; border-bottom: 1px solid #e0e7ff; padding-bottom: 6px; margin-bottom: 12px; font-weight: 700;">Location & Digital</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div style="margin-bottom: 4px;">
                    <div style="color: #64748b; font-size: 11px; margin-bottom: 2px;">Postal Address</div>
                    <div style="font-weight: 500; font-size: 13px; line-height: 1.4;">${escapeHtml(schoolConfig.address || '---')}</div>
                  </div>
                  <div>
                    <div style="color: #64748b; font-size: 11px; margin-bottom: 2px;">Official Website</div>
                    <div style="font-weight: 600; font-size: 13px; color: #4f46e5;">${escapeHtml(schoolConfig.website || '---')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Information -->
          <div style="margin-top:auto; padding-top: 40px; border-top: 1px solid #f3f4f6; text-align: center;">
            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 16px; opacity: 0.6;">
              <span style="font-size: 13px; color: #1f2937; font-weight: 600;">MADRASTI 2.0</span>
              <span style="color: #d1d5db;">|</span>
              <span style="font-size: 11px; color: #6b7280; font-weight: 500;">Smart School Management System</span>
            </div>
            <p style="font-size: 10px; color: #9ca3af; margin: 0;">This document is an electronically generated summary of institution record. No physical signature is required unless requested for official validation.</p>
          </div>
        </div>
      `

      document.body.appendChild(container)
      const reportElement = container.querySelector(`#${reportId}`)

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`school-details-${slugify(schoolConfig.name)}.pdf`)

      document.body.removeChild(container)
    } catch (err) {
      console.error('Export error:', err)
      alert(t('admin.exportError', 'Failed to export PDF'))
    } finally {
      setIsExporting(false)
    }
  }

  const socialLinks = [
    { key: 'facebook', label: 'Facebook', url: schoolConfig?.facebook_url, icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'instagram', label: 'Instagram', url: schoolConfig?.instagram_url, icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { key: 'twitter', label: 'Twitter', url: schoolConfig?.twitter_url, icon: Twitter, color: 'text-sky-600', bg: 'bg-sky-50' },
    { key: 'linkedin', label: 'LinkedIn', url: schoolConfig?.linkedin_url, icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
    { key: 'youtube', label: 'YouTube', url: schoolConfig?.youtube_url, icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' }
  ].filter(l => l.url)

  if (loading) return (
    <AdminPageLayout title={t('adminSidebar.schoolManagement.schoolDetails')} loading={true} />
  )

  return (
    <AdminPageLayout
      title={t('adminSidebar.schoolManagement.schoolDetails')}
      subtitle={t('school.details.subtitle')}
      showBackButton={true}
      showRefreshButton={true}
      onRefresh={handleRefresh}
      error={error}
      actions={[
        <Button key="export" variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
          <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
          {isExporting ? t('common.downloading') : t('admin.export')}
        </Button>,
        <Button key="edit" size="sm" onClick={handleEdit} className="bg-indigo-600 hover:bg-indigo-700">
          <Edit className="h-4 w-4 mr-2" />
          {t('common.edit')}
        </Button>
      ]}
    >
      {schoolConfig && (
        <div className="space-y-12">
          {/* Enhanced Header Section */}
          <div className="relative group">
            {/* Banner */}
            <div className="h-40 md:h-56 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"></div>
              </div>
              <div className="absolute top-4 right-6 opacity-10">
                <Building2 className="w-32 h-32 md:w-48 md:h-48 text-white" />
              </div>
            </div>

            {/* Profile Info Overlay */}
            <div className="px-6 md:px-12 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative shrink-0"
              >
                <div className="p-1 rounded-[2rem] bg-white shadow-2xl ring-8 ring-white/50 overflow-hidden w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                  {schoolConfig.logo_url ? (
                    <img src={schoolConfig.logo_url} className="w-full h-full object-cover" alt="School Logo" />
                  ) : (
                    <Building2 className="w-16 h-16 text-gray-300" />
                  )}
                </div>
                {schoolConfig.logo_url && (
                  <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-full border-4 border-white shadow-lg">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>

              <div className="flex-1 pb-4 text-center md:text-start">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    {schoolConfig.name}
                  </h1>
                  <Badge variant="secondary" className="w-fit self-center md:self-auto bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    {t('admin.systemAdministrator', 'Verified Institution')}
                  </Badge>
                </div>
                {schoolConfig.name_arabic && (
                  <p className="text-xl md:text-2xl text-gray-500 font-medium font-arabic mb-4" dir="rtl">
                    {schoolConfig.name_arabic}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    {schoolConfig.city && `${schoolConfig.city}, `}{schoolConfig.region}
                  </div>
                  <Separator orientation="vertical" className="h-3 bg-gray-300 hidden md:block" />
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    {t('school.details.created', 'Established')} {new Date(schoolConfig.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column: Details Cards */}
            <div className="md:col-span-8 space-y-6 lg:space-y-8">
              {/* Contact Information */}
              <Card className="rounded-[1.5rem] border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-gray-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                      <Phone className="h-5 w-5" />
                    </div>
                    {t('school.details.contact', 'Contact & Discovery')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <InfoRow icon={Phone} label={t('school.details.phone')} value={schoolConfig.phone} />
                    <InfoRow icon={PhoneCall} label={t('school.details.fixPhone')} value={schoolConfig.fix_phone} />
                    <InfoRow icon={MessageCircle} label={t('school.details.whatsapp')} value={schoolConfig.whatsapp_num} />
                    <InfoRow icon={Mail} label={t('school.details.email')} value={schoolConfig.email} />
                    <InfoRow
                      icon={Globe}
                      label={t('school.details.website')}
                      value={schoolConfig.website}
                      href={schoolConfig.website ? (/^https?:\/\//i.test(schoolConfig.website) ? schoolConfig.website : `https://${schoolConfig.website}`) : null}
                    />
                    <InfoRow icon={MapPin} label={t('school.details.address')} value={schoolConfig.address} />
                  </div>
                </CardContent>
              </Card>

              {/* Institution Codes */}
              <Card className="rounded-[1.5rem] border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-gray-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                      <Hash className="h-5 w-5" />
                    </div>
                    {t('school.details.codes', 'Legal & Compliance')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('school.details.schoolCode')}</p>
                      <p className="text-lg font-bold text-slate-900">{schoolConfig.school_code || '---'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('school.details.rcCode')}</p>
                      <p className="text-lg font-bold text-slate-900">{schoolConfig.rc_code || '---'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('school.details.pattent')}</p>
                      <p className="text-lg font-bold text-slate-900">{schoolConfig.pattent || '---'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Support Cards */}
            <div className="md:col-span-4 space-y-6 lg:space-y-8">
              {/* Status & Academic */}
              <Card className="rounded-[1.5rem] border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('school.details.academicYear')}</h3>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-100 relative overflow-hidden text-center">
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-500/10 rounded-full blur-xl"></div>
                      <p className="text-4xl font-black text-indigo-600 mb-1">{schoolConfig.current_academic_year_details?.year}</p>
                      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">{t('school.details.currentAcademicYear')}</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('school.details.capacity')}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">{t('school.details.maxStudents', 'Maximum Enrollment')}</span>
                      <span className="text-xl font-bold text-gray-900">{schoolConfig.student_capacity}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[70%]"></div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                        <User className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900">{t('school.details.director')}</h3>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                      <p className="font-bold text-gray-900">{schoolConfig.director_details?.full_name}</p>
                      <p className="text-xs text-orange-600 font-medium">{schoolConfig.director_details?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Channels */}
              <Card className="rounded-[1.5rem] border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 py-4">
                  <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    {t('school.details.social.label')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {socialLinks.length > 0 ? socialLinks.map(({ key, icon: Icon, label, url, color, bg }) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-xl hover:${bg} transition-all group`}
                      >
                        <div className={`p-2 rounded-lg ${bg} ${color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                      </a>
                    )) : (
                      <div className="py-6 text-center">
                        <p className="text-xs font-medium text-gray-400 italic">{t('school.details.social.empty')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  )
}

export default SchoolDetailsPage
