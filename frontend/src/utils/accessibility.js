// Accessibility utilities for WCAG 2.1 AA compliance

export const a11y = {
  // ARIA labels and descriptions
  labels: {
    dashboard: 'Main monitoring dashboard',
    emergencySOS: 'Emergency SOS trigger button - triggers immediate emergency response',
    deviceStatus: 'Device connection and battery status indicator',
    liveMonitoring: 'Real-time vital signs monitoring',
    analytics: 'Historical data and analytics view',
    settings: 'User settings and preferences',
    adminDashboard: 'Administration dashboard for system management',
    logout: 'Log out of the application',
  },

  // Keyboard navigation helpers
  keyboardShortcuts: {
    trigger_sos: 'Alt + E - Trigger emergency SOS',
    open_menu: 'Alt + M - Open navigation menu',
    help: '? - Open help dialog',
    logout: 'Alt + L - Log out',
    search: 'Ctrl + K - Open search',
  },

  // Color contrast checker
  contrastRatio: {
    AA: 4.5, // Minimum for normal text
    AAA: 7, // Enhanced
    LARGE_AA: 3, // Large text
    LARGE_AAA: 4.5,
  },

  // ARIA live region priorities
  liveRegions: {
    POLITE: 'polite',
    ASSERTIVE: 'assertive',
  },

  // Focus management
  manageFocus: (element) => {
    if (element) {
      setTimeout(() => element.focus(), 0)
    }
  },

  // Announce to screen readers
  announce: (message, priority = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only' // Screen reader only
    announcement.textContent = message

    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  },

  // Skip to main content
  getSkipLink: () => ({
    href: '#main-content',
    text: 'Skip to main content',
    className: 'sr-only focus:not-sr-only',
  }),

  // Focus trap for modals
  createFocusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    return () => element.removeEventListener('keydown', handleKeyDown)
  },

  // Test color contrast
  testContrast: (foreground, background) => {
    const fgLum = getLuminance(foreground)
    const bgLum = getLuminance(background)
    const contrast =
      Math.max(fgLum, bgLum) + 0.05 / (Math.min(fgLum, bgLum) + 0.05)
    return {
      ratio: contrast.toFixed(2),
      isAA: contrast >= 4.5,
      isAAA: contrast >= 7,
    }
  },

  // Proper heading hierarchy
  validateHeadings: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const levels = Array.from(headings).map((h) => parseInt(h.tagName[1]))

    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        // Heading hierarchy issue detected
      }
    }
  },

  // Alt text for images
  validateAltText: () => {
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.alt || img.alt.trim() === '') {
        // Image missing alt text
      }
    })
  },
}

// Helper function to calculate luminance
function getLuminance(color) {
  const rgb = color.match(/\d+/g)
  if (!rgb || rgb.length < 3) return 0

  const [r, g, b] = rgb.map((x) => {
    const s = parseInt(x) / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export default a11y
