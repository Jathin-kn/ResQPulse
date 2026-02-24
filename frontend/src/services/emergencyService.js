import { getDatabase, ref, set, push, query, orderByChild, limitToLast, get, update } from 'firebase/database'
import { sendEmergencyAlert } from './emailService'

const database = getDatabase()

export const triggerEmergencySOS = async (emergencyData, responderEmails = []) => {
  // Create emergency record
  const emergenciesRef = ref(database, 'emergencies')
  const newEmergency = await push(emergenciesRef, {
    device_id: emergencyData.deviceId || `admin-trigger-${Date.now()}`,
    status: 'active',
    type: emergencyData.type || 'CPR Required',
    location: emergencyData.location || 'Unknown Location',
    latitude: emergencyData.latitude || 28.7041,
    longitude: emergencyData.longitude || 77.1025,
    patient_status: emergencyData.patientStatus || 'Critical',
    description: emergencyData.description || 'Emergency SOS triggered by admin',
    triggered_by: emergencyData.triggeredBy || 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    responders_notified: responderEmails.length,
    responses: {}
  })

  // Emergency created
  // Send email alerts to responders
  if (responderEmails.length > 0) {
    try {
      await sendEmergencyAlert(
        {
          deviceId: emergencyData.deviceId || `admin-trigger-${Date.now()}`,
          location: emergencyData.location || 'Unknown Location',
          patientStatus: emergencyData.patientStatus || 'Critical',
          type: emergencyData.type || 'CPR Required'
        },
        responderEmails
      )
      // Alerts sent to responders
    } catch (emailError) {
      // Email alert failed, but emergency is recorded
    }
  }

  return {
    success: true,
    emergencyId: newEmergency.key,
    message: `Emergency triggered! ${responderEmails.length} responders notified.`
  }
}

export const closeEmergency = async (emergencyId, resolution) => {
  const emergencyRef = ref(database, `emergencies/${emergencyId}`)
  await set(emergencyRef, {
    status: 'resolved',
    resolution: resolution,
    resolved_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { merge: true })

  return {
    success: true,
    message: 'Emergency closed successfully'
  }
}

export const getAllResponderEmails = async () => {
  try {
    const usersRef = ref(database, 'users')
    const snapshot = await get(usersRef)
    
    if (snapshot.exists()) {
      const users = snapshot.val()
      const responderEmails = Object.values(users)
        .filter(user => ['ambulance', 'responder'].includes(user.role))
        .map(user => user.email)
        .filter(email => email) // Filter out empty emails
      
      return responderEmails
    }
    return []
  } catch (error) {
    // Error fetching responder emails - silently handle
    return []
  }
}

export const logEmergencyResponse = async (emergencyId, responderId, response) => {
  const responseRef = ref(database, `emergencies/${emergencyId}/responses/${responderId}`)
  await set(responseRef, {
    responder_id: responderId,
    response: response,
    timestamp: new Date().toISOString()
  })

  return { success: true }
}

// Clear/Mark SOS as resolved
export const clearEmergencySOS = async (emergencyId, clearedBy = 'admin') => {
  const emergencyRef = ref(database, `emergencies/${emergencyId}`)
  await update(emergencyRef, {
    status: 'cleared',
    cleared_by: clearedBy,
    cleared_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  return {
    success: true,
    message: 'Emergency SOS cleared successfully'
  }
}

// Update emergency status (active, in-progress, cleared, cancelled)
export const updateEmergencyStatus = async (emergencyId, newStatus, updatedBy = 'admin') => {
  const validStatuses = ['active', 'in-progress', 'cleared', 'cancelled']

  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
  }

  const emergencyRef = ref(database, `emergencies/${emergencyId}`)
  await update(emergencyRef, {
    status: newStatus,
    updated_by: updatedBy,
    updated_at: new Date().toISOString()
  })

  return {
    success: true,
    message: `Emergency status updated to ${newStatus}`
  }
}

// Get emergency details including current status
export const getEmergencyDetails = async (emergencyId) => {
  const emergencyRef = ref(database, `emergencies/${emergencyId}`)
  const snapshot = await get(emergencyRef)

  if (snapshot.exists()) {
    return snapshot.val()
  }

  return null
}

// Confirm emergency signal - responder acknowledges they've seen it
export const confirmEmergencySignal = async (emergencyId, responderUid, responderEmail) => {
  const confirmationRef = ref(database, `emergencies/${emergencyId}/confirmations/${responderUid}`)
  
  await set(confirmationRef, {
    responder_uid: responderUid,
    responder_email: responderEmail,
    confirmed_at: new Date().toISOString(),
    status: 'acknowledged'
  })

  // Also update the emergency's last activity timestamp
  const emergencyRef = ref(database, `emergencies/${emergencyId}`)
  await update(emergencyRef, {
    updated_at: new Date().toISOString()
  })

  return {
    success: true,
    message: 'Emergency signal confirmed successfully'
  }
}
