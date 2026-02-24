// Input validation utilities for form data

export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email) ? null : 'Invalid email address'
  },

  password: (password) => {
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  },

  firstName: (name) => {
    if (!name || name.trim().length < 2) return 'First name must be at least 2 characters'
    if (name.length > 50) return 'First name must be less than 50 characters'
    return null
  },

  lastName: (name) => {
    if (!name || name.trim().length < 2) return 'Last name must be at least 2 characters'
    if (name.length > 50) return 'Last name must be less than 50 characters'
    return null
  },

  location: (location) => {
    if (!location || location.trim().length < 3) return 'Location must be at least 3 characters'
    return null
  },

  phone: (phone) => {
    const regex = /^[\d\s\-+()]+$/
    if (!phone || !regex.test(phone)) return 'Invalid phone number'
    return null
  },

  organization: (org) => {
    if (!org || org.trim().length < 2) return 'Organization must be at least 2 characters'
    return null
  },

  latitude: (lat) => {
    const num = parseFloat(lat)
    if (isNaN(num) || num < -90 || num > 90) return 'Latitude must be between -90 and 90'
    return null
  },

  longitude: (lng) => {
    const num = parseFloat(lng)
    if (isNaN(num) || num < -180 || num > 180) return 'Longitude must be between -180 and 180'
    return null
  },

  compressionRate: (rate) => {
    const num = parseFloat(rate)
    if (isNaN(num) || num < 0 || num > 200) return 'Compression rate must be between 0 and 200 bpm'
    return null
  },

  compressionDepth: (depth) => {
    const num = parseFloat(depth)
    if (isNaN(num) || num < 0 || num > 10) return 'Compression depth must be between 0 and 10 cm'
    return null
  },

  qualityScore: (score) => {
    const num = parseFloat(score)
    if (isNaN(num) || num < 0 || num > 100) return 'Quality score must be between 0 and 100'
    return null
  }
}

// Sanitize inputs
export const sanitize = {
  text: (text) => {
    if (!text) return ''
    return text.trim().replace(/[<>]/g, '')
  },

  location: (location) => {
    if (!location) return ''
    return location.trim().replace(/[<>]/g, '')
  },

  email: (email) => {
    return email.toLowerCase().trim()
  },

  phone: (phone) => {
    return phone.replace(/\s+/g, '')
  }
}

// Validate entire form
export const validateForm = (data, rules) => {
  const errors = {}
  
  for (const [key, validator] of Object.entries(rules)) {
    if (data[key] !== undefined) {
      const error = validator(data[key])
      if (error) {
        errors[key] = error
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
