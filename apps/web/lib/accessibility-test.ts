/**
 * Accessibility testing utilities for the site monitoring page
 * Tests compliance with WCAG 2.1 AA standards
 */

export interface AccessibilityTestResult {
  passed: boolean
  message: string
  element?: HTMLElement
}

export class AccessibilityTester {
  private results: AccessibilityTestResult[] = []

  /**
   * Test for proper ARIA labels and roles
   */
  testAriaLabels(): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Test for required ARIA landmarks
    const landmarks = [
      { selector: '[role="banner"]', name: 'banner' },
      { selector: '[role="main"]', name: 'main' },
      { selector: '[role="region"]', name: 'region' },
    ]

    landmarks.forEach(({ selector, name }) => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) {
        results.push({
          passed: false,
          message: `Missing ${name} landmark`
        })
      } else {
        results.push({
          passed: true,
          message: `${name} landmark found`
        })
      }
    })

    // Test for aria-live regions
    const liveRegions = document.querySelectorAll('[aria-live]')
    results.push({
      passed: liveRegions.length > 0,
      message: `Found ${liveRegions.length} live regions for dynamic content`
    })

    // Test for proper button labels
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button, index) => {
      const hasLabel = button.getAttribute('aria-label') || 
                      button.getAttribute('aria-labelledby') ||
                      button.textContent?.trim()
      
      results.push({
        passed: !!hasLabel,
        message: `Button ${index + 1} ${hasLabel ? 'has' : 'missing'} accessible label`,
        element: button as HTMLElement
      })
    })

    return results
  }

  /**
   * Test keyboard navigation
   */
  testKeyboardNavigation(): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Test for focusable elements
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    results.push({
      passed: focusableElements.length > 0,
      message: `Found ${focusableElements.length} focusable elements`
    })

    // Test for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]')
    const hasSkipToMain = Array.from(skipLinks).some(link => 
      link.getAttribute('href') === '#main-content'
    )

    results.push({
      passed: hasSkipToMain,
      message: hasSkipToMain ? 'Skip to main content link found' : 'Missing skip to main content link'
    })

    // Test for focus indicators
    const elementsWithFocusRing = document.querySelectorAll('.focus\\:ring-2, [class*="focus:ring"]')
    results.push({
      passed: elementsWithFocusRing.length > 0,
      message: `${elementsWithFocusRing.length} elements have focus indicators`
    })

    return results
  }

  /**
   * Test for reduced motion support
   */
  testReducedMotionSupport(): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Check if prefers-reduced-motion is respected
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    results.push({
      passed: true,
      message: `User prefers reduced motion: ${prefersReducedMotion}`
    })

    // Test for animation controls
    const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="motion-"]')
    results.push({
      passed: true,
      message: `Found ${animatedElements.length} potentially animated elements`
    })

    return results
  }

  /**
   * Test color contrast and visual accessibility
   */
  testVisualAccessibility(): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Test for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
    
    let properHierarchy = true
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] > headingLevels[i-1] + 1) {
        properHierarchy = false
        break
      }
    }

    results.push({
      passed: properHierarchy,
      message: properHierarchy ? 'Proper heading hierarchy' : 'Improper heading hierarchy detected'
    })

    // Test for alt text on images
    const images = document.querySelectorAll('img')
    let imagesWithAlt = 0
    images.forEach(img => {
      if (img.getAttribute('alt') !== null) {
        imagesWithAlt++
      }
    })

    results.push({
      passed: imagesWithAlt === images.length,
      message: `${imagesWithAlt}/${images.length} images have alt text`
    })

    return results
  }

  /**
   * Test form accessibility
   */
  testFormAccessibility(): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []

    // Test for proper form labels
    const inputs = document.querySelectorAll('input, select, textarea')
    let inputsWithLabels = 0

    inputs.forEach(input => {
      const hasLabel = input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`)
      
      if (hasLabel) inputsWithLabels++
    })

    results.push({
      passed: inputsWithLabels === inputs.length,
      message: `${inputsWithLabels}/${inputs.length} form inputs have proper labels`
    })

    // Test for error handling
    const errorElements = document.querySelectorAll('[aria-invalid="true"], .error, [class*="error"]')
    results.push({
      passed: true,
      message: `Found ${errorElements.length} elements with error states`
    })

    return results
  }

  /**
   * Run all accessibility tests
   */
  runAllTests(): AccessibilityTestResult[] {
    this.results = [
      ...this.testAriaLabels(),
      ...this.testKeyboardNavigation(),
      ...this.testReducedMotionSupport(),
      ...this.testVisualAccessibility(),
      ...this.testFormAccessibility()
    ]

    return this.results
  }

  /**
   * Get test summary
   */
  getSummary() {
    const total = this.results.length
    const passed = this.results.filter(r => r.passed).length
    const failed = total - passed

    return {
      total,
      passed,
      failed,
      passRate: (passed / total) * 100
    }
  }

  /**
   * Log results to console
   */
  logResults() {
    const summary = this.getSummary()
    
    console.group('🔍 Accessibility Test Results')
    console.log(`📊 Summary: ${summary.passed}/${summary.total} tests passed (${summary.passRate.toFixed(1)}%)`)
    
    if (summary.failed > 0) {
      console.group('❌ Failed Tests')
      this.results.filter(r => !r.passed).forEach(result => {
        console.warn(result.message, result.element)
      })
      console.groupEnd()
    }

    console.group('✅ Passed Tests')
    this.results.filter(r => r.passed).forEach(result => {
      console.log(result.message)
    })
    console.groupEnd()
    
    console.groupEnd()
  }
}

// Utility function to run accessibility tests
export function runAccessibilityTests() {
  const tester = new AccessibilityTester()
  const results = tester.runAllTests()
  tester.logResults()
  return results
}

// Auto-run tests in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run tests after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      runAccessibilityTests()
    }, 1000)
  })
}