import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import LoadingSpinner from '../shared/LoadingSpinner'

const LoginForm = ({ onSuccess = () => {} }) => {
  const { t } = useLanguage()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: formData.email,
        role: 'ADMIN',
        school_info: {
          name: 'Test School',
          logo: null,
        },
      }
      
      const mockToken = 'mock-jwt-token'
      
      const success = await login(mockUser, mockToken)
      if (success) {
        onSuccess()
      } else {
        setError(t('auth.loginError'))
      }
    } catch (err) {
      setError(err.message || t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('auth.login')}</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="text-sm font-medium">
              {t('auth.email')}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="text-sm font-medium">
              {t('auth.password')}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              t('auth.login')
            )}
          </Button>

          <div className="text-center">
            <Button variant="link" size="sm">
              {t('auth.forgotPassword')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default LoginForm