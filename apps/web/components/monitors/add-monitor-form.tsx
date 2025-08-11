"use client"

import { useForm } from '@tanstack/react-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { NewMonitor } from 'web/lib/types'

interface AddMonitorFormProps {
  onSubmit: (monitor: NewMonitor) => void
  onCancel: () => void
}

export function AddMonitorForm({ onSubmit, onCancel }: AddMonitorFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      url: '',
      checkInterval: 5, // Default to 5 minutes
      slug: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Validate the form data
        if (!value.name.trim()) {
          throw new Error('Monitor name is required')
        }
        if (!value.url.trim()) {
          throw new Error('URL is required')
        }
        
        // Additional validation
        if (value.checkInterval < 1 || value.checkInterval > 60) {
          throw new Error('Check interval must be between 1 and 60 minutes')
        }
        
        // Call the onSubmit callback with the form data
        await onSubmit(value)
      } catch (error) {
        // Re-throw to be handled by form error state
        throw error instanceof Error ? error : new Error('Failed to add monitor')
      }
    },
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* Monitor Name Field */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) {
                  return 'Monitor name is required'
                }
                if (value.length < 3) {
                  return 'Monitor name must be at least 3 characters'
                }
                if (value.length > 50) {
                  return 'Monitor name must be less than 50 characters'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Monitor Name *
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g., Main Website, API Gateway"
                  className={field.state.meta.errors.length > 0 ? 'border-red-500' : ''}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  aria-invalid={field.state.meta.errors.length > 0}
                  required
                />
                {field.state.meta.errors.length > 0 && (
                  <p 
                    id={`${field.name}-error`}
                    className="text-sm text-red-600 dark:text-red-400"
                    role="alert"
                    aria-live="polite"
                  >
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* URL Field */}
          <form.Field
            name="url"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) {
                  return 'URL is required'
                }
                
                // Basic URL validation
                try {
                  new URL(value)
                } catch {
                  return 'Please enter a valid URL (e.g., https://example.com)'
                }
                
                // Check if URL starts with http or https
                if (!value.startsWith('http://') && !value.startsWith('https://')) {
                  return 'URL must start with http:// or https://'
                }
                
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  URL *
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="https://example.com"
                  type="url"
                  className={field.state.meta.errors.length > 0 ? 'border-red-500' : ''}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  aria-invalid={field.state.meta.errors.length > 0}
                  required
                />
                {field.state.meta.errors.length > 0 && (
                  <p 
                    id={`${field.name}-error`}
                    className="text-sm text-red-600 dark:text-red-400"
                    role="alert"
                    aria-live="polite"
                  >
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
            <form.Field
            name="slug"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) {
                  return 'Slug is required'
                }
                if (value.length < 3) {
                  return 'Slug must be at least 3 characters'
                }
                if (value.length > 50) {
                  return 'Slug must be less than 50 characters'
                }
                // Check for invalid characters
                if (!/^[a-z0-9-]+$/.test(value)) {
                  return 'Slug can only contain lowercase letters, numbers, and hyphens'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Slug *
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g., main-website, api-gateway"
                  type="text"
                  className={field.state.meta.errors.length > 0 ? 'border-red-500' : ''}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  aria-invalid={field.state.meta.errors.length > 0}
                  required
                />
                {field.state.meta.errors.length > 0 && (
                  <p 
                    id={`${field.name}-error`}
                    className="text-sm text-red-600 dark:text-red-400"
                    role="alert"
                    aria-live="polite"
                  >
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Check Interval Field */}
          <form.Field
            name="checkInterval"
            validators={{
              onChange: ({ value }) => {
                if (value < 1) {
                  return 'Check interval must be at least 1 minute'
                }
                if (value > 60) {
                  return 'Check interval must be less than 60 minutes'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2 flex items-center gap-5">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Check Interval (minutes)
                </label>
                <Select
                  value={field.state.value.toString()}
                  onValueChange={(value) => field.handleChange(parseInt(value))}
                >
                  <SelectTrigger 
                    aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                    aria-invalid={field.state.meta.errors.length > 0}
                  >
                    <SelectValue placeholder="Select check interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p 
                    id={`${field.name}-error`}
                    className="text-sm text-red-600 dark:text-red-400"
                    role="alert"
                    aria-live="polite"
                  >
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Adding Monitor...' : 'Add Monitor'}
                </Button>
              )}
            </form.Subscribe>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {/* Form-level errors */}
          <form.Subscribe
            selector={(state) => state.errors}
          >
            {(errors) =>
              errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors[0]}
                  </p>
                </div>
              )
            }
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}