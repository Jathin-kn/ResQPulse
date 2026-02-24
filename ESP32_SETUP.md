# ESP32 Setup Guide - ResqPulse IoT System

## Overview

This guide provides complete instructions for setting up the ESP32 microcontroller with all I2C sensors for the ResqPulse CPR monitoring system.

## Hardware Requirements

### ESP32 Development Board
- **ESP32-WROOM-32** or **ESP32-S3** (recommended)
- Micro-USB cable for programming
- 5V power supply (USB or external)

### I2C Sensors
1. **MPU6050** - Accelerometer/Gyroscope (CPR motion detection)
2. **APDS9960** - Proximity/Gesture sensor (hands-free control)
3. **BMP180** - Pressure/Altitude sensor (environmental monitoring)
4. **SI7021** - Temperature/Humidity sensor
5. **SSD1306** - 0.96" OLED Display (128x64)

### Additional Components
- Breadboard or PCB for connections
- Jumper wires (male-to-male, male-to-female)
- 4.7KΩ pull-up resistors (for I2C bus, if not included on modules)

## Circuit Diagram

```
ESP32 Pinout Connections:
========================

ESP32 GPIO Pins:
- GPIO 21 (SDA) → All sensors SDA pins
- GPIO 22 (SCL) → All sensors SCL pins
- GPIO 13 (SERVO) → Servo motor signal pin
- 3.3V → VCC pins of all sensors
- GND → GND pins of all sensors

Sensor Connections:
==================

MPU6050 (Accelerometer/Gyroscope)
- VCC → 3.3V
- GND → GND
- SDA → GPIO 21
- SCL → GPIO 22
- INT → Not connected (optional)

APDS9960 (Gesture/Proximity)
- VCC → 3.3V
- GND → GND
- SDA → GPIO 21
- SCL → GPIO 22
- INT → GPIO 23 (optional, for interrupts)

BMP180 (Pressure/Altitude)
- VCC → 3.3V
- GND → GND
- SDA → GPIO 21
- SCL → GPIO 22

SI7021 (Temperature/Humidity)
- VCC → 3.3V
- GND → GND
- SDA → GPIO 21
- SCL → GPIO 22

SSD1306 OLED Display (0.96" 128x64)
- VCC → 3.3V
- GND → GND
- SDA → GPIO 21
- SCL → GPIO 22

Servo Motor (CPR Feedback)
- Signal → GPIO 13
- VCC → 5V (or 3.3V depending on servo)
- GND → GND
- **Note**: Use a standard servo motor (0-180°) or continuous rotation servo for 720° movement

## Arduino IDE Setup

### 1. Install Arduino IDE
1. Download Arduino IDE 2.0+ from [arduino.cc](https://www.arduino.cc/en/software)
2. Install and open the Arduino IDE

### 2. Add ESP32 Board Support
1. Go to **File → Preferences**
2. Add this URL to "Additional Boards Manager URLs":
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
3. Go to **Tools → Board → Boards Manager**
4. Search for "ESP32" and install "esp32 by Espressif Systems"

### 3. Select ESP32 Board
1. Go to **Tools → Board → ESP32 Arduino**
2. Select your ESP32 board:
   - **ESP32 Dev Module** (for ESP32-WROOM-32)
   - **ESP32-S3 Dev Module** (for ESP32-S3)

### 4. Configure Board Settings
```
Board: ESP32 Dev Module
Upload Speed: 921600
CPU Frequency: 240MHz (WiFi/BT)
Flash Frequency: 80MHz
Flash Mode: QIO
Flash Size: 4MB (32Mb)
Partition Scheme: Default 4MB with spiffs (1.2MB APP/1.5MB SPIFFS)
Core Debug Level: None
PSRAM: Disabled
```

## Required Libraries Installation

### Install via Arduino IDE Library Manager
Go to **Tools → Manage Libraries** and install these libraries:

1. **FirebaseESP32** by Mobizt
   - Version: Latest
   - Enables ESP32 to communicate with Firebase

2. **Adafruit MPU6050** by Adafruit
   - Enables accelerometer/gyroscope readings

3. **Adafruit APDS9960** by Adafruit
   - Enables gesture and proximity detection

4. **Adafruit BMP085** by Adafruit
   - Enables pressure and altitude readings (works with BMP180)

5. **Adafruit Si7021** by Adafruit
   - Enables temperature and humidity readings

6. **Adafruit SSD1306** by Adafruit
   - Enables OLED display control

7. **Adafruit GFX Library** by Adafruit
   - Graphics library for OLED display

8. **ESP32Servo** by Madhepha
   - Enables servo motor control for CPR feedback

9. **ArduinoJson** by Benoit Blanchon
   - JSON parsing for Firebase communication

### Manual Library Installation (if needed)
Some libraries may need manual installation:

1. Download the library ZIP files from GitHub
2. Go to **Sketch → Include Library → Add .ZIP Library**
3. Select the downloaded ZIP files

## Firmware Configuration

### 1. Open the Firmware
1. Open `firmware/ResqPulse_ESP32.ino` in Arduino IDE
2. The firmware is already configured for all sensors

### 2. Update Configuration
Edit the `config.h` file (create if it doesn't exist):

```cpp
// WiFi Configuration
#define WIFI_SSID "Your_WiFi_Name"
#define WIFI_PASSWORD "Your_WiFi_Password"

// Firebase Configuration
#define FIREBASE_HOST "your-project-id.firebaseio.com"
#define FIREBASE_AUTH "your-database-secret"

// Device Configuration
#define DEVICE_ID "esp32_001"  // Unique ID for this device

// I2C Configuration
#define SDA_PIN 21
#define SCL_PIN 22

// Sensor I2C Addresses
#define MPU6050_ADDR 0x68
#define APDS9960_ADDR 0x39
#define BMP180_ADDR 0x77
#define SI7021_ADDR 0x40
#define SSD1306_ADDR 0x3C
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to **Project Settings → Service Accounts**
4. Generate a new private key (download JSON file)
5. Copy the database URL and secret to `config.h`

## Upload Firmware

### 1. Connect ESP32
1. Connect ESP32 to computer via USB
2. Select the correct COM port: **Tools → Port**

### 2. Upload Code
1. Click the **Upload** button (right arrow) in Arduino IDE
2. Wait for compilation and upload to complete
3. Monitor serial output: **Tools → Serial Monitor**

### 3. Verify Upload
- Serial monitor should show:
  ```
  Connecting to WiFi...
  WiFi connected
  IP address: 192.168.1.xxx
  Firebase connected
  Sensors initialized
  System ready
  ```

## Testing the System

### 1. Hardware Testing
1. **OLED Display**: Should show "ResqPulse Ready" on startup
2. **MPU6050**: Move the sensor, check accelerometer values in serial
3. **APDS9960**: Wave hand over sensor, check proximity values
4. **BMP180**: Check pressure and altitude readings
5. **SI7021**: Check temperature and humidity values

### 2. Firebase Testing
1. Open Firebase Console → Realtime Database
2. Check if data appears under `/devices/esp32_001/`
3. Verify all sensor data paths are created:
   - `/cpr` - CPR metrics
   - `/environment` - Temperature, humidity, pressure, altitude
   - `/gesture` - Gesture type and proximity
   - `/status` - Battery, WiFi signal, SOS status

### 3. React Dashboard Testing
1. Start the React frontend: `npm run dev`
2. Login and go to Live Monitoring page
3. Verify real-time data updates from ESP32

## Troubleshooting

### Common Issues

#### 1. ESP32 Not Connecting to WiFi
- Check WiFi credentials in `config.h`
- Verify WiFi network supports 2.4GHz (ESP32 doesn't support 5GHz)
- Check serial monitor for connection errors

#### 2. Firebase Connection Failed
- Verify Firebase project configuration
- Check database URL and authentication key
- Ensure Realtime Database is enabled in Firebase Console
- Check Firebase security rules allow writes

#### 3. Sensors Not Detected
- Verify I2C connections (SDA to GPIO 21, SCL to GPIO 22)
- Check sensor power connections (3.3V and GND)
- Use I2C scanner sketch to verify addresses
- Check for I2C address conflicts

#### 4. OLED Display Not Working
- Verify SSD1306 address (usually 0x3C or 0x3D)
- Check display connections and power
- Try different I2C pins if conflicts exist

#### 5. Compilation Errors
- Ensure all required libraries are installed
- Check Arduino IDE board settings
- Verify ESP32 board version compatibility

### I2C Scanner Sketch
If sensors aren't detected, use this sketch to scan I2C bus:

```cpp
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Serial.println("I2C Scanner");
}

void loop() {
  byte error, address;
  int nDevices = 0;

  Serial.println("Scanning...");

  for(address = 1; address < 127; address++ ) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("I2C device found at address 0x");
      if (address < 16) Serial.print("0");
      Serial.print(address, HEX);
      Serial.println(" !");
      nDevices++;
    }
  }

  if (nDevices == 0)
    Serial.println("No I2C devices found");
  else
    Serial.println("done");

  delay(5000);
}
```

## Power Management

### Battery Operation
- ESP32 typical current draw: 80-100mA (active), 10-20mA (light sleep)
- Use 3.7V LiPo battery with charging circuit
- Implement deep sleep mode for power saving
- Monitor battery voltage on ADC pin

### Power Optimization
```cpp
// Enable light sleep between readings
esp_sleep_enable_timer_wakeup(1000000); // 1 second
esp_light_sleep_start();

// Or deep sleep
esp_deep_sleep(1000000); // 1 second
```

## Advanced Configuration

### Sensor Calibration
- **MPU6050**: Calibrate accelerometer for accurate CPR depth measurement
- **BMP180**: Calibrate pressure sensor for altitude accuracy
- **APDS9960**: Adjust proximity thresholds for gesture detection

### Data Transmission Optimization
- Adjust transmission interval based on use case (100ms for real-time, 1s for monitoring)
- Implement data compression for bandwidth-limited connections
- Use Firebase batch writes for multiple sensor updates

### Error Handling
- Implement watchdog timer to prevent hangs
- Add sensor health checks and automatic recovery
- Log errors to serial and Firebase for debugging

## Security Considerations

### WiFi Security
- Use WPA2 or WPA3 encryption
- Avoid public WiFi networks
- Implement secure credential storage

### Firebase Security
- Use Firebase Authentication tokens
- Implement proper database security rules
- Encrypt sensitive data before transmission

### Device Security
- Use unique device IDs
- Implement firmware update mechanism
- Monitor for unauthorized access attempts

## Next Steps

1. **Complete Hardware Assembly**: Connect all sensors according to the circuit diagram
2. **Upload Firmware**: Program ESP32 with the ResqPulse firmware
3. **Test System**: Verify all sensors are working and data flows to Firebase
4. **Frontend Integration**: Connect React dashboard to view real-time data
5. **Deployment**: Move to production environment with proper security

## Support

For technical issues:
- Check serial monitor output for error messages
- Verify all connections match the circuit diagram
- Test individual sensors with example sketches
- Review Firebase console for data transmission errors

---

**Last Updated**: February 5, 2026
**Hardware Version**: ESP32-WROOM-32
**Firmware Version**: 1.0.0</content>
<parameter name="filePath">c:\Users\kumar\OneDrive\Desktop\New folder\tru\ESP32_SETUP.md