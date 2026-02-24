from fastapi import FastAPI, APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
import json
from firebase_admin import db as firebase_db
from firebase_admin_config import initialize_firebase, verify_firebase_token

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize Firebase
initialize_firebase()

# MongoDB connection (optional)
try:
    mongo_url = os.environ.get('MONGO_URL')
    if mongo_url:
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ.get('DB_NAME', 'resqpulse')]
except Exception as e:
    print(f"MongoDB connection warning: {e}")
    db = None

app = FastAPI(title="ResqPulse API", version="1.0.0")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= MODELS =============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    uid: str
    email: str
    name: Optional[str] = None
    role: str = "responder"
    organization: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CPRData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    timestamp: int
    compression_rate: float
    compression_depth: float
    acceleration_x: float
    acceleration_y: float
    acceleration_z: float
    quality_score: float

class EnvironmentData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    timestamp: int
    temperature: float
    humidity: float
    pressure: float
    altitude: float

class GestureData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    timestamp: int
    proximity: int
    gesture: int
    sos_triggered: bool

class DeviceStatus(BaseModel):
    model_config = ConfigDict(extra="ignore")
    timestamp: int
    device_id: str
    wifi_connected: bool
    battery_level: int
    last_update: int

class SensorData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    compression_rate: float
    compression_depth: float
    pressure: float
    acceleration_x: float
    acceleration_y: float
    acceleration_z: float
    proximity: float
    quality_score: float
    # New sensor fields
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    altitude: Optional[float] = None
    gesture: Optional[int] = None
    sos_triggered: Optional[bool] = None

class SensorDataCreate(BaseModel):
    device_id: str
    compression_rate: float
    compression_depth: float
    pressure: float
    acceleration_x: float
    acceleration_y: float
    acceleration_z: float
    proximity: float
    quality_score: float
    # New sensor fields
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    altitude: Optional[float] = None
    gesture: Optional[int] = None
    sos_triggered: Optional[bool] = None

class Device(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_name: str
    status: str = "active"
    battery_level: int = 100
    signal_strength: int = 100
    last_sync: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    location: Optional[str] = None

class DeviceCreate(BaseModel):
    device_name: str
    location: Optional[str] = None

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    start_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    total_compressions: int = 0
    average_rate: float = 0.0
    average_depth: float = 0.0
    quality_score: float = 0.0
    location: Optional[str] = None
    status: str = "active"

class SessionCreate(BaseModel):
    device_id: str
    location: Optional[str] = None

class EmergencySignal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    location: str
    status: str = "active"
    responders_alerted: int = 0

# ============= ENDPOINTS =============

@api_router.get("/")
async def root():
    return {
        "message": "ResqPulse API v1.0.0",
        "status": "online",
        "database": "Firebase Realtime Database"
    }

@api_router.post("/auth/login")
async def login(email: str, password: str):
    try:
        # Firebase authentication handled by client
        return {"status": "success", "message": "Use Firebase Authentication"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/auth/user")
async def get_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        uid = verify_firebase_token(authorization)
        return {"uid": uid, "authenticated": True}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============= IOT/SENSOR ENDPOINTS =============

@api_router.post("/devices/{device_id}/sensor-data")
async def create_device_sensor_data(device_id: str, data: dict):
    """Create sensor data for a specific device with structured paths"""
    try:
        timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
        
        # CPR Data
        if "cpr" in data:
            cpr_data = {
                "compression_rate": data["cpr"].get("compression_rate", 0),
                "compression_depth": data["cpr"].get("compression_depth", 0),
                "quality_score": data["cpr"].get("quality_score", 0),
                "timestamp": timestamp
            }
            ref = firebase_db.reference(f"devices/{device_id}/cpr")
            ref.set(cpr_data)
        
        # Environment Data
        if "environment" in data:
            env_data = {
                "temperature": data["environment"].get("temperature", 0),
                "humidity": data["environment"].get("humidity", 0),
                "pressure": data["environment"].get("pressure", 0),
                "altitude": data["environment"].get("altitude", 0),
                "timestamp": timestamp
            }
            ref = firebase_db.reference(f"devices/{device_id}/environment")
            ref.set(env_data)
        
        # Gesture Data
        if "gesture" in data:
            gesture_data = {
                "gesture_type": data["gesture"].get("gesture_type", "none"),
                "proximity": data["gesture"].get("proximity", 0),
                "timestamp": timestamp
            }
            ref = firebase_db.reference(f"devices/{device_id}/gesture")
            ref.set(gesture_data)
        
        # Status Data
        if "status" in data:
            status_data = {
                "battery_level": data["status"].get("battery_level", 100),
                "wifi_signal": data["status"].get("wifi_signal", 0),
                "sos_triggered": data["status"].get("sos_triggered", False),
                "last_update": timestamp
            }
            ref = firebase_db.reference(f"devices/{device_id}/status")
            ref.set(status_data)
        
        return {"status": "success", "device_id": device_id, "timestamp": timestamp}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/{device_id}/sensor-data")
async def get_device_sensor_data(device_id: str):
    """Get all sensor data for a specific device"""
    try:
        ref = firebase_db.reference(f"devices/{device_id}")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/{device_id}/cpr")
async def get_device_cpr_data(device_id: str):
    """Get CPR data for a specific device"""
    try:
        ref = firebase_db.reference(f"devices/{device_id}/cpr")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/{device_id}/environment")
async def get_device_environment_data(device_id: str):
    """Get environment data for a specific device"""
    try:
        ref = firebase_db.reference(f"devices/{device_id}/environment")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/{device_id}/gesture")
async def get_device_gesture_data(device_id: str):
    """Get gesture data for a specific device"""
    try:
        ref = firebase_db.reference(f"devices/{device_id}/gesture")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/{device_id}/status")
async def get_device_status_data(device_id: str):
    """Get status data for a specific device"""
    try:
        ref = firebase_db.reference(f"devices/{device_id}/status")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/all/sensor-data")
async def get_all_devices_sensor_data():
    """Get sensor data for all devices"""
    try:
        ref = firebase_db.reference("devices")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Legacy endpoints (for backward compatibility)
@api_router.post("/iot/sensor-data", response_model=SensorData)
async def create_sensor_data(data: SensorDataCreate):
    try:
        sensor_data = SensorData(
            device_id=data.device_id,
            compression_rate=data.compression_rate,
            compression_depth=data.compression_depth,
            pressure=data.pressure,
            acceleration_x=data.acceleration_x,
            acceleration_y=data.acceleration_y,
            acceleration_z=data.acceleration_z,
            proximity=data.proximity,
            quality_score=data.quality_score,
            temperature=data.temperature,
            humidity=data.humidity,
            altitude=data.altitude,
            gesture=data.gesture,
            sos_triggered=data.sos_triggered
        )
        
        # Save to Firebase (legacy path)
        ref = firebase_db.reference(f"sensor_data/{sensor_data.id}")
        ref.set(sensor_data.model_dump())
        
        return sensor_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/iot/latest")
async def get_latest_sensor_data(device_id: str):
    try:
        ref = firebase_db.reference("sensor_data")
        data = ref.order_by_child("device_id").equal_to(device_id).limit_to_last(1).get()
        if data.val():
            return {"status": "success", "data": data.val()}
        return {"status": "not_found"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/iot/stream")
async def stream_sensor_data(device_id: str):
    async def event_generator():
        try:
            ref = firebase_db.reference(f"sensor_data")
            
            async def on_value(msg):
                data = msg["data"]
                if data:
                    yield f"data: {json.dumps(data)}\n\n"
            
            # Stream data
            while True:
                data = ref.order_by_child("device_id").equal_to(device_id).limit_to_last(5).get()
                if data.val():
                    yield f"data: {json.dumps(data.val())}\n\n"
                await asyncio.sleep(2)
        except Exception as e:
            logger.error(f"Stream error: {e}")
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ============= DEVICE ENDPOINTS =============

@api_router.post("/devices", response_model=Device)
async def create_device(device: DeviceCreate):
    try:
        new_device = Device(device_name=device.device_name, location=device.location)
        ref = firebase_db.reference(f"devices/{new_device.id}")
        ref.set({
            "id": new_device.id,
            "device_name": new_device.device_name,
            "status": new_device.status,
            "battery_level": new_device.battery_level,
            "signal_strength": new_device.signal_strength,
            "last_sync": new_device.last_sync.isoformat(),
            "location": new_device.location
        })
        return new_device
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices", response_model=List[Device])
async def get_devices():
    try:
        ref = firebase_db.reference("devices")
        data = ref.get()
        if data.val():
            return list(data.val().values())
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/{device_id}")
async def get_device(device_id: str):
    try:
        ref = firebase_db.reference(f"devices/{device_id}")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.put("/devices/{device_id}")
async def update_device(device_id: str, device: DeviceCreate):
    try:
        ref = firebase_db.reference(f"devices/{device_id}")
        ref.update(device.model_dump(exclude_unset=True))
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/devices/health/overview")
async def get_devices_health():
    try:
        ref = firebase_db.reference("devices")
        data = ref.get()
        devices = list(data.val().values()) if data.val() else []
        
        return {
            "total_devices": len(devices),
            "active_devices": sum(1 for d in devices if d.get("status") == "active"),
            "battery_average": sum(d.get("battery_level", 100) for d in devices) / len(devices) if devices else 0,
            "signal_average": sum(d.get("signal_strength", 100) for d in devices) / len(devices) if devices else 0
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============= SESSION ENDPOINTS =============

@api_router.post("/sessions", response_model=Session)
async def create_session(session: SessionCreate):
    try:
        new_session = Session(device_id=session.device_id, location=session.location)
        ref = firebase_db.reference(f"sessions/{new_session.id}")
        ref.set(new_session.model_dump())
        return new_session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/sessions", response_model=List[Session])
async def get_sessions(limit: int = 100):
    try:
        ref = firebase_db.reference("sessions")
        data = ref.limit_to_last(limit).get()
        if data.val():
            return list(data.val().values())
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    try:
        ref = firebase_db.reference(f"sessions/{session_id}")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.put("/sessions/{session_id}")
async def update_session(session_id: str, session: SessionCreate):
    try:
        ref = firebase_db.reference(f"sessions/{session_id}")
        ref.update(session.model_dump(exclude_unset=True))
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/sessions/analytics/overview")
async def get_analytics():
    try:
        ref = firebase_db.reference("sessions")
        data = ref.get()
        sessions = list(data.val().values()) if data.val() else []
        
        return {
            "total_sessions": len(sessions),
            "active_sessions": sum(1 for s in sessions if s.get("status") == "active"),
            "average_compressions": sum(s.get("total_compressions", 0) for s in sessions) / len(sessions) if sessions else 0,
            "average_quality": sum(s.get("quality_score", 0) for s in sessions) / len(sessions) if sessions else 0
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============= EMERGENCY ENDPOINTS =============

@api_router.post("/emergency/signal", response_model=EmergencySignal)
async def create_emergency(emergency: dict):
    try:
        new_emergency = EmergencySignal(
            device_id=emergency.get("device_id", ""),
            location=emergency.get("location", ""),
            status=emergency.get("status", "active")
        )
        ref = firebase_db.reference(f"emergencies/{new_emergency.id}")
        ref.set(new_emergency.model_dump())
        return new_emergency
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/emergency/active")
async def get_active_emergencies():
    try:
        ref = firebase_db.reference("emergencies")
        data = ref.order_by_child("status").equal_to("active").get()
        if data.val():
            return list(data.val().values())
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.put("/emergency/{emergency_id}")
async def update_emergency(emergency_id: str, emergency: dict):
    try:
        ref = firebase_db.reference(f"emergencies/{emergency_id}")
        ref.update(emergency)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============= SETTINGS ENDPOINTS =============

@api_router.get("/settings")
async def get_settings(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        uid = verify_firebase_token(authorization)
        ref = firebase_db.reference(f"users/{uid}")
        data = ref.get()
        return data.val() if data.val() else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.put("/settings")
async def update_settings(settings: dict, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        uid = verify_firebase_token(authorization)
        ref = firebase_db.reference(f"users/{uid}")
        ref.update(settings)
        return {"status": "success", "message": "Settings updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Include router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
