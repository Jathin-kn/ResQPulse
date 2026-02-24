import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Default map icon
const defaultIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZWY0NDQ0IiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LTggczMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// Emergency icon (red)
const emergencyIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI2VmNDQ0NCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIiBzdHlsZT0idGV4dC1hbmNob3I6IG1pZGRsZTsiIj4hPC90ZXh0Pjwvc3ZnPg==',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

// Hospital icon (blue)
const hospitalIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IiMzYjgyZjYiIHJ4PSIyIi8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMyAxMXYtMmgtMnYyaC0ydjJoMnYyaDAuOXYtMmgydi0yaC0yeiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// Ambulance icon (orange)
const ambulanceIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB4PSI0IiB5PSI3IiB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIGZpbGw9IiNmNTlFMGIiIHJ4PSIyIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const MapComponent = ({
  center = [28.7041, 77.1025], // Default: New Delhi
  zoom = 13,
  emergencies = [],
  hospitals = [],
  ambulances = [],
  responders = []
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg"
    >
      {/* OpenStreetMap Tiles - 100% FREE */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Emergency Markers */}
      {emergencies.map((emergency) => (
        <Marker
          key={`emergency-${emergency.id}`}
          position={[emergency.latitude || 28.7041, emergency.longitude || 77.1025]}
          icon={emergencyIcon}
        >
          <Popup>
            <div className="bg-white text-slate-900 p-2 rounded">
              <h4 className="font-bold text-red-600">🚨 EMERGENCY</h4>
              <p className="text-sm">Device: {emergency.device_id}</p>
              <p className="text-sm">Status: {emergency.status}</p>
              <p className="text-xs text-slate-500">
                {new Date(emergency.created_at).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Hospital Markers */}
      {hospitals.map((hospital) => (
        <Marker
          key={`hospital-${hospital.id}`}
          position={[hospital.latitude || hospital.lat || 28.7041, hospital.longitude || hospital.lng || 77.1025]}
          icon={hospitalIcon}
        >
          <Popup>
            <div className="bg-white text-slate-900 p-2 rounded">
              <h4 className="font-bold text-blue-600">🏥 {hospital.name}</h4>
              <p className="text-sm">{hospital.address}</p>
              <p className="text-sm">Beds: {hospital.available_beds || 'N/A'}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Ambulance Markers */}
      {ambulances.map((ambulance) => (
        <Marker
          key={`ambulance-${ambulance.id}`}
          position={[ambulance.latitude || ambulance.lat || 28.7041, ambulance.longitude || ambulance.lng || 77.1025]}
          icon={ambulanceIcon}
        >
          <Popup>
            <div className="bg-white text-slate-900 p-2 rounded">
              <h4 className="font-bold text-yellow-600">🚑 {ambulance.name}</h4>
              <p className="text-sm">Status: {ambulance.status}</p>
              <p className="text-sm">Driver: {ambulance.driver_name}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Responder Markers */}
      {responders.map((responder) => (
        <Marker
          key={`responder-${responder.id}`}
          position={[responder.latitude || responder.lat || 28.7041, responder.longitude || responder.lng || 77.1025]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="bg-white text-slate-900 p-2 rounded">
              <h4 className="font-bold text-green-600">👤 {responder.name}</h4>
              <p className="text-sm">Status: {responder.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent
