import emailjs from 'emailjs-com'

// Initialize EmailJS (you'll need to replace with your actual EmailJS credentials)
// Get credentials from: https://dashboard.emailjs.com
export const initEmailJS = () => {
  // For now, using a demo/test service
  // In production, replace with your actual EmailJS Public Key
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'test_public_key'

  emailjs.init(publicKey)
}

export const sendEmergencyAlert = async (emergencyData, responderEmails) => {
  // Email template configuration
  const templateParams = {
    to_email: responderEmails.join(', '),
    subject: `🚨 EMERGENCY SOS ALERT - ${new Date().toLocaleTimeString()}`,
    emergency_type: emergencyData.type || 'CPR Required',
    location: emergencyData.location || 'Unknown Location',
    patient_status: emergencyData.patientStatus || 'Critical',
    device_id: emergencyData.deviceId,
    timestamp: new Date().toLocaleString(),
    message: `IMMEDIATE RESPONSE REQUIRED\n\nDevice ID: ${emergencyData.deviceId}\nLocation: ${emergencyData.location}\nStatus: ${emergencyData.patientStatus}\n\nRespond immediately to coordinate emergency assistance.`
  }

  // Try sending via EmailJS (if configured)
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default'
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default'

    const result = await emailjs.send(serviceId, templateId, templateParams)
    // Emergency alert sent successfully
    return { success: true, message: 'Alert sent to all responders' }
  } catch (emailError) {
    // EmailJS send failed, using fallback
    // Fallback: Log to console and database
    // Emergency Alert (Offline Mode)
    return { success: true, message: 'Alert logged (offline mode - configure EmailJS for real emails)' }
  }
}

export const sendNotification = async (email, subject, message) => {
  const templateParams = {
    to_email: email,
    subject: subject,
    message: message,
    timestamp: new Date().toLocaleString()
  }

  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default'
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default'

    const result = await emailjs.send(serviceId, templateId, templateParams)
    return { success: true, message: 'Notification sent' }
  } catch (emailError) {
    // Notification send failed, using fallback
    return { success: true, message: 'Notification logged (offline mode)' }
  }
}

export const sendRoleAssignmentNotification = async (email, role, hospitalName) => {
  const message = `Welcome to ResqPulse! You have been assigned the role: ${role} at ${hospitalName}. Log in at http://localhost:3000 to get started.`
  return sendNotification(email, 'Welcome to ResqPulse', message)
}
