import React, { useContext } from 'react'
import { Heart, Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { LanguageContext } from '../../contexts/LanguageContext'
import { APP_CONFIG } from '../../utils/constants'
import { cn } from '../../lib/utils'

const Footer = ({
  className,
  variant = 'default', // default, compact, minimal
  showSocial = true,
  showContact = true,
  showLinks = true,
  schoolInfo = null,
}) => {
  const { language } = useContext(LanguageContext)
  const currentYear = new Date().getFullYear()

  // Default school info if not provided
  const defaultSchoolInfo = {
    name: 'Madrasti School',
    phone: '+212 5XX XX XX XX',
    email: 'info@madrasti.ma',
    address: 'Casablanca, Morocco',
    website: 'https://madrasti.ma'
  }

  const school = schoolInfo || defaultSchoolInfo

  const footerLinks = {
    about: {
      title: { ar: 'حول النظام', en: 'About System', fr: 'À propos' },
      links: [
        {
          label: { ar: 'عن مدرستي', en: 'About Madrasti', fr: 'À propos de Madrasti' },
          href: '/about',
        },
        {
          label: { ar: 'الميزات', en: 'Features', fr: 'Fonctionnalités' },
          href: '/features',
        },
        {
          label: { ar: 'الأسعار', en: 'Pricing', fr: 'Tarifs' },
          href: '/pricing',
        },
        {
          label: { ar: 'المساعدة', en: 'Help Center', fr: 'Centre d\'aide' },
          href: '/help',
        },
      ]
    },
    legal: {
      title: { ar: 'القانونية', en: 'Legal', fr: 'Légal' },
      links: [
        {
          label: { ar: 'سياسة الخصوصية', en: 'Privacy Policy', fr: 'Politique de confidentialité' },
          href: '/privacy',
        },
        {
          label: { ar: 'شروط الخدمة', en: 'Terms of Service', fr: 'Conditions d\'utilisation' },
          href: '/terms',
        },
        {
          label: { ar: 'سياسة الكوكيز', en: 'Cookie Policy', fr: 'Politique des cookies' },
          href: '/cookies',
        },
      ]
    },
    support: {
      title: { ar: 'الدعم', en: 'Support', fr: 'Support' },
      links: [
        {
          label: { ar: 'اتصل بنا', en: 'Contact Us', fr: 'Nous contacter' },
          href: '/contact',
        },
        {
          label: { ar: 'الوثائق', en: 'Documentation', fr: 'Documentation' },
          href: '/docs',
        },
        {
          label: { ar: 'أسئلة شائعة', en: 'FAQ', fr: 'FAQ' },
          href: '/faq',
        },
        {
          label: { ar: 'حالة النظام', en: 'System Status', fr: 'État du système' },
          href: '/status',
        },
      ]
    }
  }

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'YouTube', href: '#', icon: '📺' },
  ]

  if (variant === 'minimal') {
    return (
      <footer className={cn(
        'bg-background border-t py-4',
        className
      )}>
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              <span>© {currentYear} {APP_CONFIG.NAME}</span>
              <span>•</span>
              <span>
                {language === 'ar' ? 'صنع بـ' :
                  language === 'fr' ? 'Fait avec' :
                    'Made with'}
              </span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>
                {language === 'ar' ? 'بواسطة' :
                  language === 'fr' ? 'par' :
                    'by'} {APP_CONFIG.AUTHOR}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              v{APP_CONFIG.VERSION}
            </div>
          </div>
        </div>
      </footer>
    )
  }

  if (variant === 'compact') {
    return (
      <footer className={cn(
        'bg-background border-t py-6',
        className
      )}>
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* School Info */}
            <div>
              <h3 className="font-semibold text-sm mb-3">
                {school.name}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {showContact && (
                  <>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Phone className="h-3 w-3" />
                      <span>{school.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Mail className="h-3 w-3" />
                      <span>{school.email}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Links */}
            {showLinks && (
              <div>
                <h3 className="font-semibold text-sm mb-3">
                  {language === 'ar' ? 'روابط مهمة' :
                    language === 'fr' ? 'Liens utiles' :
                      'Quick Links'}
                </h3>
                <div className="space-y-2">
                  {footerLinks.support.links.slice(0, 3).map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label[language] || link.label.en}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Copyright */}
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground">
                © {currentYear} {APP_CONFIG.NAME}
              </div>
              <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-muted-foreground">
                <span>
                  {language === 'ar' ? 'صنع بـ' :
                    language === 'fr' ? 'Fait avec' :
                      'Made with'}
                </span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>
                  {language === 'ar' ? 'بواسطة' :
                    language === 'fr' ? 'par' :
                      'by'} {APP_CONFIG.AUTHOR}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Default full footer
  return (
    <footer className={cn(
      'bg-background border-t',
      className
    )}>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {APP_CONFIG.NAME.charAt(0)}
                </span>
              </div>
              <h3 className="font-bold text-lg">{school.name}</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              {language === 'ar'
                ? 'نظام شامل لإدارة المدارس يوفر أحدث التقنيات لتحسين العملية التعليمية.'
                : language === 'fr'
                  ? 'Système complet de gestion scolaire offrant les dernières technologies pour améliorer le processus éducatif.'
                  : 'Comprehensive school management system providing cutting-edge technology to enhance the educational process.'
              }
            </p>

            {showContact && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{school.address}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href={`tel:${school.phone}`} className="hover:text-foreground transition-colors">
                    {school.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${school.email}`} className="hover:text-foreground transition-colors">
                    {school.email}
                  </a>
                </div>
                {school.website && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors flex items-center"
                    >
                      {school.website.replace('https://', '')}
                      <ExternalLink className="h-3 w-3 ml-1 rtl:ml-0 rtl:mr-1" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Links */}
          {showLinks && Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-sm mb-4">
                {section.title[language] || section.title.en}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label[language] || link.label.en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-muted-foreground">
              <span>© {currentYear} {APP_CONFIG.NAME}.</span>
              <span>
                {language === 'ar' ? 'جميع الحقوق محفوظة' :
                  language === 'fr' ? 'Tous droits réservés' :
                    'All rights reserved'}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              v{APP_CONFIG.VERSION}
            </Badge>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-muted-foreground">
              <span>
                {language === 'ar' ? 'صنع بـ' :
                  language === 'fr' ? 'Fait avec' :
                    'Made with'}
              </span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>
                {language === 'ar' ? 'بواسطة' :
                  language === 'fr' ? 'par' :
                    'by'} {APP_CONFIG.AUTHOR}
              </span>
            </div>

            {showSocial && socialLinks.length > 0 && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                    >
                      <span className="text-sm">{social.icon}</span>
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer