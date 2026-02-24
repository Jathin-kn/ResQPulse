# ResqPulse ESP32 Circuit Diagram

## Basic Setup

```
ESP32 DevKit V1
+----------------+
|                |
|   EN       GND |---+
|   VP       GND |   |
|   VN       35  |<--+-- Proximity Sensor Signal
|   34       32  |   |
|   35       33  |   |
|   32       25  |   |
|   33       26  |   |
|   25       27  |   |
|   26       14  |   |
|   27       12  |   |
|   14       GND |   |
|   12       GND |   |
|   13       CMD |   |
|   9        3V3 |---+---+
|   10       5V  |   |   |
|   11       GND |   |   |
|   8        23  |   |   |
|   7        22  |<--+---+-- MPU6050 SCL
|   6        21  |<--+---+-- MPU6050 SDA
|   5        RST |   |
|   18       3V3 |---+---+
|   17       GND |   |   |
|   16       2   |<--+---+-- LED (with 220Ω resistor)
|   4        0   |   |
|   2        4   |   |
|   15       16  |   |
|   8        17  |   |
|   7        5   |   |
|   6        18  |   |
|   5        19  |   |
|   4        3V3 |---+---+
|   3        GND |   |   |
|   1        21  |   |   |
|   0        20  |   |   |
+----------------+   |   |
                      |   |
                      +---+
                          |
                          +-- Pressure Sensor Signal (GPIO 34)
```

## Component Connections

### MPU6050 Accelerometer/Gyroscope
```
MPU6050     ESP32
VCC    -->  3.3V
GND    -->  GND
SDA    -->  GPIO 21
SCL    -->  GPIO 22
```

### Pressure Sensor (FSR)
```
Force Sensitive Resistor
Signal --> ESP32 GPIO 34
VCC    --> ESP32 3.3V
GND    --> ESP32 GND
```

### Proximity Sensor (IR)
```
IR Proximity Sensor
Signal --> ESP32 GPIO 35
VCC    --> ESP32 3.3V
GND    --> ESP32 GND
```

### Status LED
```
LED
Anode  --> ESP32 GPIO 2 (with 220Ω resistor)
Cathode--> ESP32 GND
```

## Power Supply

- **ESP32**: Powered via USB (5V) or external 3.3V
- **Sensors**: All sensors use 3.3V from ESP32
- **Current Draw**: ~150mA total (ESP32 + sensors)

## Sensor Specifications

### MPU6050
- **Range**: ±8g acceleration, ±500°/s gyro
- **Interface**: I2C (0x68 address)
- **Sample Rate**: Up to 1kHz

### Pressure Sensor
- **Type**: Force Sensitive Resistor (FSR)
- **Range**: 0-10kg force
- **Output**: Analog voltage (0-3.3V)

### Proximity Sensor
- **Type**: IR proximity sensor
- **Range**: 2-30cm
- **Output**: Analog voltage (0-3.3V)

## Testing Connections

1. **Power**: ESP32 should power on and show blue LED
2. **MPU6050**: I2C scan should find device at 0x68
3. **Analog Sensors**: Readings should change when sensors are activated
4. **LED**: Should blink during compressions

## Troubleshooting

- **No sensor data**: Check wiring and power
- **I2C errors**: Verify SDA/SCL connections and pull-up resistors
- **WiFi issues**: Check credentials and signal strength
- **Backend connection**: Verify IP address and firewall settings