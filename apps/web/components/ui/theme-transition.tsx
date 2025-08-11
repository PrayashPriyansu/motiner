"use client"

import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeTransitionProps {
  children: React.ReactNode
  className?: string
}

export function ThemeTransition({ children, className }: ThemeTransitionProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hook for theme-aware animations
export function useThemeTransition() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'dark'
  const isDark = currentTheme === 'dark'

  const getThemeColors = () => ({
    primary: isDark ? '#60a5fa' : '#3b82f6',
    success: isDark ? '#34d399' : '#10b981',
    warning: isDark ? '#fbbf24' : '#f59e0b',
    error: isDark ? '#f87171' : '#ef4444',
    muted: isDark ? '#374151' : '#e5e7eb',
    text: isDark ? '#d1d5db' : '#374151',
    background: isDark ? '#0f172a' : '#ffffff',
    card: isDark ? '#1e293b' : '#f8fafc',
  })

  const themeVariants = {
    light: {
      backgroundColor: '#ffffff',
      color: '#374151',
      transition: { duration: 0.3 }
    },
    dark: {
      backgroundColor: '#0f172a',
      color: '#d1d5db',
      transition: { duration: 0.3 }
    }
  }

  return {
    theme: currentTheme,
    isDark,
    mounted,
    colors: getThemeColors(),
    variants: themeVariants
  }
}