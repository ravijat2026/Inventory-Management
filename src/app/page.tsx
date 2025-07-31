"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, Package } from 'lucide-react'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  mobile: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  mobile?: string
  general?: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  // Check if user is already authenticated
  useEffect(() => {
    const checkExistingUser = () => {
      const userData = localStorage.getItem("user-data")
      const authToken = localStorage.getItem("auth-token")

      if (userData && authToken) {
        document.cookie = "session=authenticated; path=/; max-age=86400"
        router.push("/dashboard")
        return
      }
      setLoading(false)
    }

    checkExistingUser()
  }, [router])

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required"
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) return "Please enter a valid email"
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter"
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter"
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number"
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character"
    return undefined
  }

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required"
    if (name.trim().length < 2) return "Name must be at least 2 characters"
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Name can only contain letters and spaces"
    return undefined
  }

  const validateMobile = (mobile: string): string | undefined => {
    if (!mobile.trim()) return "Mobile number is required"
    if (!/^\d{10}$/.test(mobile.trim())) return "Mobile number must be exactly 10 digits"
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    const newErrors: FormErrors = {}
    newErrors.name = validateName(formData.name)
    newErrors.email = validateEmail(formData.email)
    newErrors.password = validatePassword(formData.password)
    newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword)
    newErrors.mobile = validateMobile(formData.mobile)

    if (Object.values(newErrors).some((error) => error !== undefined)) {
      setErrors(newErrors)
      setSubmitting(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        mobile: formData.mobile.trim(),
        registeredAt: new Date().toISOString(),
      }

      localStorage.setItem("user-data", JSON.stringify(userData))
      localStorage.setItem("user-password", formData.password)

      const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("auth-token", authToken)
      document.cookie = "session=authenticated; path=/; max-age=86400"

      router.push("/dashboard")
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-gray-300 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Inventory Pro</h1>
                <p className="text-xs text-gray-400">Smart Inventory Management</p>
              </div>
            </div>
            <div className="text-gray-300 font-medium text-lg">Welcome to Inventory Pro</div>
          </div>
        </div>
      </nav>

      {/* Form Section */}
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border border-gray-700 bg-gray-800">
            <CardHeader className="text-center bg-gray-800">
              <CardTitle className="text-3xl text-white">Get Started</CardTitle>
              <CardDescription className="text-gray-400 text-md">
                Fill in your details to access your inventory dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-gray-800">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className={`mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 ${
                      errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 ${
                      errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      className={`pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 ${
                        errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 ${
                        errors.confirmPassword ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Mobile field*/}
                <div>
                  <Label htmlFor="mobile" className="text-sm font-medium text-gray-300">
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
                        setFormData((prev) => ({ ...prev, mobile: value }))
                      }
                    }}
                    className={`mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400 ${
                      errors.mobile ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                    }`}
                    maxLength={10}
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {errors.general && (
                  <Alert className="border-red-600 bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">{errors.general}</AlertDescription>
                  </Alert>
                )}

               
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full cursor-pointer bg-gray-200 hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-600/30 border-t-gray-600 rounded-full animate-spin"></div>
                      Getting started...
                    </div>
                  ) : (
                    <>Get Started</>
                  )}
                </Button>
              </form>

              {/* password requirements */}
              <div className="mt-4 p-3 bg-gray-700 rounded-md border border-gray-600">
                <p className="text-md font-medium text-gray-200 mb-2">Password Requirements:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• One uppercase & lowercase letter</li>
                  <li>• One number and special character (@$!%*?&)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By continuing, you agree to create an account and access the inventory dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
