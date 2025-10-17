import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { AdminPageLayout } from '../../components/admin/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { useLanguage } from '../../hooks/useLanguage'
import { apiMethods } from '../../services/api'
import { Building2, Globe, Mail, MapPin, Phone, PhoneCall, MessageCircle, Share2, UploadCloud, Hash, UserCircle } from 'lucide-react'

const defaultFormState = {
  name: '',
  name_arabic: '',
  name_french: '',
  phone: '',
  fix_phone: '',
  whatsapp_num: '',
  email: '',
  website: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  linkedin_url: '',
  youtube_url: '',
  address: '',
  city: '',
  region: '',
  postal_code: '',
  school_code: '',
  pattent: '',
  rc_code: '',
  director: '',
}

const UpdateSchoolDetailsPage = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(defaultFormState)
  const [logoPreview, setLogoPreview] = useState('')
  const [originalLogoUrl, setOriginalLogoUrl] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [schoolId, setSchoolId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const [directorOptions, setDirectorOptions] = useState([])
  const [directorLoading, setDirectorLoading] = useState(false)

  useEffect(() => {
    fetchSchoolConfig()
    fetchDirectorOptions()
  }, [])

  const fetchSchoolConfig = async () => {
    setInitialLoading(true)
    setError(null)

    try {
      let response = await apiMethods.get('schools/config/')
      let schoolConfig

      if (response?.results && Array.isArray(response.results)) {
        schoolConfig = response.results[0]
      } else if (Array.isArray(response)) {
        schoolConfig = response[0]
      } else {
        schoolConfig = response
      }

      if (!schoolConfig) {
        throw new Error(t('school.details.errors.missingConfig', 'School configuration not found'))
      }

      if (!schoolConfig.id) {
        try {
          schoolConfig = await apiMethods.get('schools/config/1/')
        } catch (fallbackError) {
          console.error('Fallback config fetch failed', fallbackError)
        }
      }

      populateForm(schoolConfig)
    } catch (fetchError) {
      console.error('Failed to load school configuration:', fetchError)
      setError(fetchError?.message || t('school.details.errors.fetchFailed', 'Unable to load school configuration'))
      toast.error(t('school.details.errors.fetchFailed', 'Unable to load school configuration'))
    } finally {
      setInitialLoading(false)
    }
  }

  const fetchDirectorOptions = async () => {
    setDirectorLoading(true)
    try {
      const response = await apiMethods.get('schools/config/available-directors/')
      const options = (response || []).map((item) => ({
        value: String(item.id),
        label: item.full_name || item.email,
        email: item.email,
      }))
      setDirectorOptions(options)
    } catch (fetchError) {
      console.error('Failed to load director options:', fetchError)
      toast.error(t('school.details.errors.directorsFailed', 'Unable to load directors list'))
    } finally {
      setDirectorLoading(false)
    }
  }

  const populateForm = (data) => {
    if (!data) return

    setSchoolId(data.id || 1)
    setFormData({
      name: data.name || '',
      name_arabic: data.name_arabic || '',
      name_french: data.name_french || '',
      phone: data.phone || '',
      fix_phone: data.fix_phone || '',
      whatsapp_num: data.whatsapp_num || '',
      email: data.email || '',
      website: data.website || '',
      facebook_url: data.facebook_url || '',
      instagram_url: data.instagram_url || '',
      twitter_url: data.twitter_url || '',
      linkedin_url: data.linkedin_url || '',
      youtube_url: data.youtube_url || '',
      address: data.address || '',
      city: data.city || '',
      region: data.region || '',
      postal_code: data.postal_code || '',
      school_code: data.school_code || '',
      pattent: data.pattent || '',
      rc_code: data.rc_code || '',
      director: data.director ? String(data.director) : '',
    })
    const logoUrl = data.logo_url || ''
    setOriginalLogoUrl(logoUrl)
    setLogoPreview(logoUrl)
    setLogoFile(null)
    setErrors({})
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: null }))
  }
}

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    const validationErrors = {}

    if (!formData.name.trim()) {
      validationErrors.name = t('validation.required', { field: t('school.details.name', 'School Name') })
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = t('validation.required', { field: t('school.details.phone', 'Phone Number') })
    }

    if (!formData.email.trim()) {
      validationErrors.email = t('validation.required', { field: t('school.details.email', 'Email Address') })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = t('validation.invalidEmail', 'Please enter a valid email address')
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const buildPayload = () => {
    if (logoFile) {
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'director') {
          payload.append(key, value ? value : '')
        } else {
          payload.append(key, value ?? '')
        }
      })
      payload.append('logo', logoFile)
      return { data: payload, isFormData: true }
    }

    const jsonPayload = {
      ...formData,
      director: formData.director ? Number(formData.director) : null,
    }

    return { data: jsonPayload, isFormData: false }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error(t('validation.pleaseFixErrors', 'Please correct the highlighted errors'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: payload, isFormData } = buildPayload()
      const endpoint = schoolId ? `schools/config/${schoolId}/` : 'schools/config/1/'

      const config = isFormData
        ? {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 90000, // Allow bigger uploads to complete
          }
        : {}

      await apiMethods.patch(endpoint, payload, config)

      toast.success(t('school.details.updateSuccess', 'School details updated successfully'))
      navigate('/admin/school-management/school-details')
    } catch (submitError) {
      console.error('Failed to update school configuration:', submitError)
      const serverErrors = submitError?.response?.data

      if (serverErrors && typeof serverErrors === 'object') {
        const formattedErrors = {}
        Object.entries(serverErrors).forEach(([field, messages]) => {
          formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages
        })
        setErrors((prev) => ({ ...prev, ...formattedErrors }))
      }

      toast.error(
        submitError?.response?.data?.detail ||
          submitError?.response?.data?.error ||
          t('school.details.updateFailed', 'Failed to update school details')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/school-management/school-details')
  }

  return (
    <AdminPageLayout
      title={t('school.details.editTitle', 'Update School Details')}
      subtitle={t('school.details.editSubtitle', 'Modify the school profile, contacts, and social presence')}
      showBackButton
      backButtonPath="/admin/school-management/school-details"
      loading={initialLoading}
      error={error}
    >
      {!initialLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {t('school.details.generalInformation', 'General Information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('school.details.name', 'School Name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('school.details.namePlaceholder', 'Enter school name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name_arabic">{t('school.details.nameArabic', 'Name (Arabic)')}</Label>
                  <Input
                    id="name_arabic"
                    name="name_arabic"
                    value={formData.name_arabic}
                    onChange={handleInputChange}
                    placeholder={t('school.details.nameArabicPlaceholder', 'Enter Arabic name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name_french">{t('school.details.nameFrench', 'Name (French)')}</Label>
                  <Input
                    id="name_french"
                    name="name_french"
                    value={formData.name_french}
                    onChange={handleInputChange}
                    placeholder={t('school.details.nameFrenchPlaceholder', 'Enter French name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">{t('school.details.logo', 'Logo')}</Label>
                  {logoPreview && (
                    <div className="flex items-center gap-4">
                      <img
                        src={logoPreview}
                        alt={formData.name || t('school.details.logo', 'Logo')}
                        className="h-16 w-16 rounded-lg border object-cover shadow-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setLogoPreview(originalLogoUrl)
                          setLogoFile(null)
                        }}
                      >
                        {t('school.details.resetLogo', 'Reset Logo')}
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <UploadCloud className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('school.details.logoHelp', 'Upload a square image (PNG/JPG) for best results.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  {t('school.details.contactInformation', 'Contact Information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t('school.details.phone', 'Phone Number')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 600-000000"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fix_phone" className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4" />
                    {t('school.details.fixPhone', 'Fixed Phone')}
                  </Label>
                  <Input
                    id="fix_phone"
                    name="fix_phone"
                    value={formData.fix_phone}
                    onChange={handleInputChange}
                    placeholder="+212 520-000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('school.details.email', 'Email Address')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@madrasti.ma"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp_num" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {t('school.details.whatsapp', 'WhatsApp')}
                  </Label>
                  <Input
                    id="whatsapp_num"
                    name="whatsapp_num"
                    value={formData.whatsapp_num}
                    onChange={handleInputChange}
                    placeholder="+212 600-000000"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">{t('school.details.website', 'Website')}</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.madrasti.ma"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  {t('school.details.administration', 'Administration')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="director" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    {t('school.details.director', 'School Director')}
                  </Label>
                  <Select
                    value={formData.director}
                    onValueChange={(value) => handleSelectChange('director', value)}
                    disabled={directorLoading || directorOptions.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          directorLoading
                            ? t('common.loading', 'Loading...')
                            : t('school.details.directorPlaceholder', 'Select director')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {directorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                          {option.email ? ` (${option.email})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_code" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {t('school.details.schoolCode', 'School Code')}
                  </Label>
                  <Input
                    id="school_code"
                    name="school_code"
                    value={formData.school_code}
                    onChange={handleInputChange}
                    placeholder="SC-0001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pattent" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {t('school.details.pattent', 'Pattent')}
                  </Label>
                  <Input
                    id="pattent"
                    name="pattent"
                    value={formData.pattent}
                    onChange={handleInputChange}
                    placeholder="Pat-123456"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rc_code" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {t('school.details.rcCode', 'RC Code')}
                  </Label>
                  <Input
                    id="rc_code"
                    name="rc_code"
                    value={formData.rc_code}
                    onChange={handleInputChange}
                    placeholder="RC-654321"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  {t('school.details.social', 'Social Media')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">{t('school.details.social.facebook', 'Facebook')}</Label>
                  <Input
                    id="facebook_url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/your-school"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url">{t('school.details.social.instagram', 'Instagram')}</Label>
                  <Input
                    id="instagram_url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/your-school"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url">{t('school.details.social.twitter', 'Twitter / X')}</Label>
                  <Input
                    id="twitter_url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/your-school"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">{t('school.details.social.linkedin', 'LinkedIn')}</Label>
                  <Input
                    id="linkedin_url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/company/your-school"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="youtube_url">{t('school.details.social.youtube', 'YouTube')}</Label>
                  <Input
                    id="youtube_url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/@your-school"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('school.details.address', 'Address')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">{t('school.details.address', 'Address')}</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('school.details.addressPlaceholder', 'Enter full address')}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t('school.details.city', 'City')}</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder={t('school.details.cityPlaceholder', 'Enter city')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">{t('school.details.region', 'Region')}</Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder={t('school.details.regionPlaceholder', 'Enter region')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">{t('school.details.postalCode', 'Postal Code')}</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="10000"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                {t('action.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t('action.saving', 'Saving...') : t('action.saveChanges', 'Save Changes')}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AdminPageLayout>
  )
}

export default UpdateSchoolDetailsPage
