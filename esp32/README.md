# ResqPulse ESP32 Sensor Integration

This directory contains the ESP32 firmware for connecting CPR monitoring sensors to the ResqPulse system.

## 🛠️ Hardware Requirements

### ESP32 Board
- ESP32 DevKit V1 or similar
- Micro-USB cable for programming

### Sensors
- **MPU6050** (Accelerometer/Gyroscope) - I2C connection
- **Pressure Sensor** (Force Sensitive Resistor) - Analog pin 34
- **Proximity Sensor** (IR or Ultrasonic) - Analog pin 35
- **LED** - Digital pin 2 (for feedback)

### Connections
```
ESP32    |    MPU6050
---------|-----------
3.3V     ->    VCC
GND      ->    GND
GPIO 21  ->    SDA
GPIO 22  ->    SCL

ESP32    |    Pressure Sensor
---------|------------------
3.3V     ->    VCC
GND      ->    GND
GPIO 34  ->    Signal

ESP32    |    Proximity Sensor
---------|-------------------
3.3V     ->    VCC
GND      ->    GND
GPIO 35  ->    Signal

ESP32    |    LED
---------|------
GPIO 2   ->    Anode (with resistor)
GND      ->    Cathode
```

## 📋 Software Setup

### Arduino IDE Setup (Recommended)

1. **Install Arduino IDE** and ESP32 board support:
   - Go to File → Preferences → Additional Boards Manager URLs
   - Add: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Tools → Board → Boards Manager → Search "ESP32" → Install

2. **Install Required Libraries**:
   - **FirebaseESP32** by mobizt: Sketch → Include Library → Manage Libraries → Search "FirebaseESP32"
   - **Adafruit MPU6050** by Adafruit
   - **Adafruit Unified Sensor** by Adafruit
   - **ArduinoJson** by Benoit Blanchon

3. **Update Configuration**:
   - Open `config.h`
   - Update `WIFI_SSID` and `WIFI_PASSWORD` with your WiFi credentials
   - The Firebase configuration is already set for the new project

4. **Upload Code**:
   - Open `ResqPulse_ESP32.ino` in Arduino IDE
   - Select your ESP32 board (Tools → Board → ESP32 Dev Module)
   - Select the correct COM port (Tools → Port)
   - Click Upload button

5. **Monitor Output**:
   - Tools → Serial Monitor
   - Set baud rate to 115200

## ⚙️ Configuration

### WiFi Configuration

Update these in `config.h`:
```cpp
#define WIFI_SSID "Your_WiFi_Name"
#define WIFI_PASSWORD "Your_WiFi_Password"
```

### Firebase Configuration

The Firebase configuration is already set in `config.h` for the new ResqPulse project:
- **Host**: `resqpulse-demo-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Auth**: API key for the project

No changes needed unless you want to use a different Firebase project.

## 📊 Sensor Data

The ESP32 sends the following data to the backend:

- **compression_rate**: Compressions per minute
- **compression_depth**: Estimated compression depth (cm)
- **pressure**: Raw pressure sensor reading
- **acceleration_x/y/z**: 3-axis acceleration data
- **proximity**: Proximity sensor reading (0-1)
- **quality_score**: CPR quality score (0-1)

## 🔄 Real-time Monitoring

Once connected, the ESP32 will:
1. ✅ Connect to WiFi
2. ✅ Initialize sensors
3. ✅ Detect CPR compressions
4. ✅ Calculate quality metrics
5. ✅ Send data to backend every 100ms
6. ✅ Provide visual feedback via LED

## 🐛 Troubleshooting

### ESP32 Not Connecting to WiFi
- Check WiFi credentials in `config.h`
- Ensure ESP32 is in range of WiFi router
- Try different WiFi channels (2.4GHz only)

### Firebase Connection Issues
- Verify Firebase configuration in `config.h`
- Check that Firebase Authentication is enabled in the console
- Ensure Realtime Database is created and rules are deployed
- Check Serial Monitor for Firebase error messages

### Sensor Issues
- Verify MPU6050 connections (SDA to GPIO 21, SCL to GPIO 22)
- Check pressure sensor on GPIO 34
- Check proximity sensor on GPIO 35
- Verify LED connection on GPIO 2

### Sensor Not Working
- Check wiring connections
- Verify sensor power (3.3V, not 5V)
- Test sensors individually
- Check serial output for error messages

### Data Not Appearing in Frontend
- Check Firebase Realtime Database
- Verify device ID matches frontend expectations
- Check browser console for errors

## 📱 Testing

1. **Upload code** to ESP32
2. **Open Serial Monitor** (115200 baud)
3. **Check WiFi connection** messages
4. **Perform test compressions** on pressure sensor
5. **Verify data transmission** in serial output
6. **Check backend** receives data
7. **View in frontend** dashboard

## 🔧 Advanced Configuration

### CPR Algorithm Tuning

Adjust these parameters in `config.h`:
```cpp
#define MIN_COMPRESSION_DEPTH 4.0      // Minimum depth in cm
#define MAX_COMPRESSION_DEPTH 6.0      // Maximum depth in cm
#define IDEAL_COMPRESSION_RATE_MIN 100 // Min rate per minute
#define IDEAL_COMPRESSION_RATE_MAX 120 // Max rate per minute
#define COMPRESSION_THRESHOLD 0.5      // Pressure threshold
#define ACCELERATION_THRESHOLD -8.0    // Acceleration threshold
```

### Data Transmission

Modify send frequency:
```cpp
#define SEND_INTERVAL 100  // Milliseconds between transmissions
```

## 📚 Additional Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp32/)
- [PlatformIO Documentation](https://docs.platformio.org/)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Adafruit MPU6050 Library](https://github.com/adafruit/Adafruit_MPU6050)

## 🤝 Contributing

1. Test your changes thoroughly
2. Update documentation
3. Follow coding standards
4. Test with real sensors before committing

---

**ResqPulse ESP32 Integration v1.0.0**