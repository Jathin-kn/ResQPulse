// Mobile responsiveness utilities and testing

export const responsiveness = {
  // Breakpoints matching Tailwind CSS
  breakpoints: {
    mobile: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Device types for testing
  devices: {
    iphone12: { width: 390, height: 844, dpr: 2, name: 'iPhone 12' },
    iphone13: { width: 390, height: 844, dpr: 2, name: 'iPhone 13' },
    iphone14: { width: 390, height: 844, dpr: 2, name: 'iPhone 14' },
    iphone14pro: { width: 393, height: 852, dpr: 3, name: 'iPhone 14 Pro' },
    pixel5: { width: 393, height: 851, dpr: 2, name: 'Pixel 5' },
    pixel6: { width: 412, height: 915, dpr: 2, name: 'Pixel 6' },
    samsungs21: { width: 360, height: 800, dpr: 2, name: 'Samsung S21' },
    ipad: { width: 768, height: 1024, dpr: 2, name: 'iPad' },
    ipadpro: { width: 1024, height: 1366, dpr: 2, name: 'iPad Pro' },
  },

  // Touch target size validator (minimum 44x44px)
  validateTouchTargets: () => {
    const buttons = document.querySelectorAll('button, a[role="button"], input[type="checkbox"], input[type="radio"]')
    const issues = []

    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect()
      if (rect.width < 44 || rect.height < 44) {
        issues.push({
          element: button,
          actual: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
          required: '44x44',
        })
      }
    })

    return issues
  },

  // Viewport meta tag checker
  validateViewportMeta: () => {
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) {
      return { status: 'missing', message: 'Viewport meta tag not found' }
    }

    const content = viewportMeta.getAttribute('content')
    const required = ['width=device-width', 'initial-scale=1']
    const has = required.every((attr) => content.includes(attr))

    return {
      status: has ? 'valid' : 'invalid',
      content: content,
      message: has ? 'Viewport meta tag properly configured' : 'Viewport meta tag missing required attributes',
    }
  },

  // Text zoom test
  validateTextZoom: () => {
    const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6')
    const issues = []

    textElements.forEach((element) => {
      const fontSize = window.getComputedStyle(element).fontSize
      const fsValue = parseFloat(fontSize)

      // Minimum recommended font size
      if (fsValue < 12) {
        issues.push({
          element: element,
          fontSize: fontSize,
          recommendation: '≥12px',
        })
      }
    })

    return issues
  },

  // Orientation change handling
  testOrientationChange: (callback) => {
    const handleOrientationChange = () => {
      const orientation = window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
      callback({ orientation, width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  },

  // Horizontal scroll detection
  detectHorizontalScroll: () => {
    const windowWidth = window.innerWidth
    const documentWidth = document.documentElement.scrollWidth

    if (documentWidth > windowWidth) {
      return {
        detected: true,
        excess: documentWidth - windowWidth,
      }
    }

    return { detected: false, excess: 0 }
  },

  // Check if text can be resized
  validateTextResizing: () => {
    const initialHeight = document.body.offsetHeight
    document.body.style.fontSize = '200%'
    const resizedHeight = document.body.offsetHeight
    document.body.style.fontSize = ''

    return {
      canResize: resizedHeight > initialHeight,
      heightChange: resizedHeight - initialHeight,
    }
  },

  // Test for mobile-friendly images
  validateResponsiveImages: () => {
    const images = document.querySelectorAll('img')
    const issues = []

    images.forEach((img) => {
      const rect = img.getBoundingClientRect()
      const isTooLarge = rect.width > window.innerWidth

      if (isTooLarge) {
        issues.push({
          src: img.src,
          displayWidth: Math.round(rect.width),
          viewportWidth: window.innerWidth,
        })
      }

      // Check for responsive attributes
      if (!img.srcset && !img.getAttribute('data-src')) {
        // May need responsive images
      }
    })

    return issues
  },

  // CSS media query test
  testMediaQueries: (breakpointName) => {
    const breakpoint = responsiveness.breakpoints[breakpointName]
    if (!breakpoint) {
      return { error: `Unknown breakpoint: ${breakpointName}` }
    }

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)
    return {
      breakpoint: breakpointName,
      width: breakpoint,
      active: mediaQuery.matches,
    }
  },

  // Performance on mobile
  getMobileMetrics: () => {
    if (!performance.getEntriesByType) {
      return { available: false }
    }

    const navigation = performance.getEntriesByType('navigation')[0]
    return {
      available: true,
      fcp: navigation.domInteractive - navigation.fetchStart, // First Contentful Paint estimate
      tti: navigation.domComplete - navigation.fetchStart, // Time to Interactive estimate
      resourceCount: performance.getEntriesByType('resource').length,
    }
  },
}

export default responsiveness
