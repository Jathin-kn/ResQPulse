// ESP32 Configuration for ResqPulse IoT Kit
// Update these values for your setup

#ifndef CONFIG_H
#define CONFIG_H

// ========== WIFI CONFIGURATION ==========
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// ========== FIREBASE CONFIGURATION ==========
#define FIREBASE_HOST "resqpulse-demo-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyCYLMOUzlHP2K1jb9gJZ3YaFn9_I6wRcwA"

// ========== DEVICE CONFIGURATION ==========
#define DEVICE_ID "esp32-cpr-001"

// ========== I2C CONFIGURATION ==========
#define SDA_PIN 21
#define SCL_PIN 22

// ========== MYOSA IoT KIT SENSORS ==========
// All sensors connected via I2C bus:
// MPU6050: Accelerometer/Gyroscope for CPR detection
// APDS9960: Gesture/Proximity sensor for SOS trigger
// BMP180: Barometric pressure/altitude sensor
// SI7021: Temperature/Humidity sensor
// SSD1306: OLED display (128x64)

// ========== SERVO MOTOR CONFIGURATION ==========
#define SERVO_PIN 13                    // GPIO pin for servo motor
#define MOTOR_SPEED_DELAY 15            // Delay between motor steps (ms)
#define DEGREES_PER_STEP 1              // Degrees to move per step
#define STEPS_PER_ROTATION 360          // Steps for one full rotation
#define TOTAL_ROTATIONS 2               // Number of rotations (720 degrees = 2 rotations)

// ========== TIMING CONFIGURATION ==========
#define SEND_INTERVAL 100        // Send data every 100ms
#define STATUS_PRINT_INTERVAL 1000  // Print status every 1 second

// ========== CPR PARAMETERS ==========
#define MIN_COMPRESSION_DEPTH 4.0
#define MAX_COMPRESSION_DEPTH 6.0
#define IDEAL_COMPRESSION_RATE_MIN 100
#define IDEAL_COMPRESSION_RATE_MAX 120
#define COMPRESSION_THRESHOLD -8.0  // Acceleration threshold for compression detection

// ========== SOS GESTURE PARAMETERS ==========
#define SOS_GESTURE_UP APDS9960_UP
#define SOS_GESTURE_DOWN APDS9960_DOWN

#endif