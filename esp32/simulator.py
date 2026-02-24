#!/usr/bin/env python3
"""
ResqPulse ESP32 Sensor Data Simulator
Simulates ESP32 sensor data for testing the backend
"""

import requests
import json
import time
import random
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000/api"
DEVICE_ID = "esp32-cpr-simulator"

def generate_sensor_data():
    """Generate realistic CPR sensor data"""
    # Simulate compression cycle
    compression_active = random.random() < 0.3  # 30% chance of compression

    if compression_active:
        # Realistic CPR values
        compression_rate = random.uniform(90, 130)  # 100-120 ideal
        compression_depth = random.uniform(3.5, 7.0)  # 5-6 cm ideal
        pressure = random.uniform(0.8, 2.0)
        accel_x = random.uniform(-2, 2)
        accel_y = random.uniform(-2, 2)
        accel_z = random.uniform(-12, -6)  # Downward acceleration during compression
        proximity = random.uniform(0.1, 0.9)
    else:
        # Resting state
        compression_rate = 0
        compression_depth = 0
        pressure = random.uniform(0, 0.3)
        accel_x = random.uniform(-1, 1)
        accel_y = random.uniform(-1, 1)
        accel_z = random.uniform(-2, 2)
        proximity = random.uniform(0.8, 1.0)

    # Calculate quality score
    quality_score = calculate_quality_score(compression_rate, compression_depth, pressure)

    return {
        "device_id": DEVICE_ID,
        "compression_rate": round(compression_rate, 1),
        "compression_depth": round(compression_depth, 1),
        "pressure": round(pressure, 2),
        "acceleration_x": round(accel_x, 2),
        "acceleration_y": round(accel_y, 2),
        "acceleration_z": round(accel_z, 2),
        "proximity": round(proximity, 2),
        "quality_score": round(quality_score, 2)
    }

def calculate_quality_score(rate, depth, pressure):
    """Calculate CPR quality score (0-1)"""
    rate_score = 0
    depth_score = 0
    pressure_score = 0

    # Rate scoring (100-120 ideal)
    if 100 <= rate <= 120:
        rate_score = 1.0
    elif 80 <= rate <= 140:
        rate_score = 0.7
    elif rate > 0:
        rate_score = 0.3

    # Depth scoring (5-6 cm ideal)
    if 5.0 <= depth <= 6.0:
        depth_score = 1.0
    elif 4.0 <= depth <= 7.0:
        depth_score = 0.7
    elif depth > 0:
        depth_score = 0.3

    # Pressure consistency
    pressure_score = min(1.0, pressure / 2.0)

    return (rate_score + depth_score + pressure_score) / 3.0

def send_sensor_data(data):
    """Send sensor data to backend"""
    try:
        url = f"{BACKEND_URL}/iot/sensor-data"
        headers = {'Content-Type': 'application/json'}

        response = requests.post(url, json=data, headers=headers, timeout=5)

        if response.status_code == 200:
            print(f"✅ Data sent successfully: {data}")
            return True
        else:
            print(f"❌ Failed to send data: {response.status_code} - {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False

def main():
    print("🚀 ResqPulse ESP32 Sensor Data Simulator")
    print("=" * 50)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Device ID: {DEVICE_ID}")
    print("Sending sensor data every 100ms...")
    print("Press Ctrl+C to stop")
    print()

    try:
        while True:
            sensor_data = generate_sensor_data()
            send_sensor_data(sensor_data)
            time.sleep(0.1)  # 100ms delay

    except KeyboardInterrupt:
        print("\n🛑 Simulator stopped by user")

if __name__ == "__main__":
    main()