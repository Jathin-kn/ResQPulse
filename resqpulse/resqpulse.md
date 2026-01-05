---
publishDate: 2026-01-05
title: MyOSA LifeSaver – IoT-Based CPR Assistance Prototype
excerpt: A modular embedded systems prototype exploring sensing, motion control, and real-time feedback for CPR assistance system engineering.
image: cover_image.jpeg
tags:
- iot
- embedded-systems
- biomedical
---
> A non-clinical, hardware-based CPR assistance prototype designed for learning and experimentation.
---

## Acknowledgements
This project was developed under the MYOSA initiative with guidance and support from mentors, faculty members, and peers who encouraged iterative design, testing, and responsible system development.

---

## Overview
MyOSA LifeSaver is a modular embedded systems prototype built to explore how sensing, motion control, and real-time feedback can work together in CPR assistance system engineering.

The project is designed as a learning and experimentation platform, bringing together hardware, firmware, and mechanical design in a clear and responsible way. Rather than focusing on clinical outcome[...]

### Purpose
This prototype was created to help students and researchers understand the fundamental building blocks of CPR assistance systems. It enables observation and experimentation with motion cycles, sensor [...]

### Non-Clinical Note
This project is strictly intended for educational, experimental, and demonstration purposes only and is **not** a medical or clinical device.

---

## Demo / Examples

### Images


<p align="center">
  ![Cover Image](./cover_image.jpeg)<br/>
  <i>Cover Image</i>
</p>


<p align="center">
  ![System architecture and workflow overview](./workflow.png)<br/>
  <i>System architecture and workflow overview</i>
</p>


<p align="center">
  ![Design 2](./design_2.jpg)<br/>
  <i>Design 2</i>
</p>


<p align="center">
  ![Mechanical enclosure and compression mechanism](./design_1.jpg)<br/>
  <i>Mechanical enclosure and compression mechanism</i>
</p>

---

### Videos

<video controls width="100%">
  <source src="demo_video.mp4" type="video/mp4">
</video>

---

## Features (Detailed)

### 1. Modular System Architecture
The system follows a modular design approach, allowing individual components such as sensing, actuation, and display to be understood, modified, and extended independently.

### 2. Sensor-Based Monitoring
Multiple sensors monitor orientation, pressure, and interaction parameters, enabling real-time observation of system behavior during operation.

### 3. Controlled Motor-Driven Motion
A motor-driven actuation mechanism performs repeatable motion cycles inspired by CPR compression patterns, intended purely for demonstration and experimentation.

### 4. On-Device Feedback Display
An OLED display provides live system information, allowing users to directly observe sensor readings, system status, and operational feedback.

### 5. Learning-Focused Design
The prototype prioritizes clarity, safety, and predictability, making it suitable for classroom demonstrations, workshops, and research exploration.

---

## Usage Instructions
1. Power the system using a regulated power source  
2. Allow all sensors to initialize during startup  
3. Observe live system information on the OLED display  
4. Run demonstrations using the predefined motor cycle  
5. Stop the system manually after testing is complete  


```cpp
#include <WiFi.h>
#include <Wire.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_BMP085_U.h>
#include <Adafruit_APDS9960.h>
#include <Adafruit_Sensor.h>

#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "OnePLus7T"
#define WIFI_PASSWORD "qwerqwer1"

#define API_KEY "1:840571953540:web:e2a80df279a040033dfdd1"
#define DATABASE_URL "https://myosa-e94bd-default-rtdb.asia-southeast1.firebasedatabase.app/"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
Adafruit_MPU6050 mpu;
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);
Adafruit_APDS9960 apds;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastSend = 0;
const unsigned long interval = 2000;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("MYOSA Starting");
  display.display();

  mpu.begin();
  bmp.begin();
  apds.begin();
  apds.enableProximity(true);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (millis() - lastSend > interval) {
    lastSend = millis();

    sensors_event_t a, g, t;
    mpu.getEvent(&a, &g, &t);

    sensors_event_t pressureEvent;
    bmp.getEvent(&pressureEvent);

    uint8_t proximity = 0;
    apds.readProximity(proximity);

    display.clearDisplay();
    display.setCursor(0, 0);
    display.print("Ax: "); display.println(a.acceleration.x);
    display.print("Ay: "); display.println(a.acceleration.y);
    display.print("Az: "); display.println(a.acceleration.z);
    display.print("P: "); display.println(pressureEvent.pressure);
    display.print("Prox: "); display.println(proximity);
    display.display();

    Firebase.RTDB.setFloat(&fbdo, "/sensors/accel/x", a.acceleration.x);
    Firebase.RTDB.setFloat(&fbdo, "/sensors/accel/y", a.acceleration.y);
    Firebase.RTDB.setFloat(&fbdo, "/sensors/accel/z", a.acceleration.z);
    Firebase.RTDB.setFloat(&fbdo, "/sensors/pressure", pressureEvent.pressure);
    Firebase.RTDB.setInt(&fbdo, "/sensors/proximity", proximity);
  }
}
```

---

## Tech Stack
- **Controller:** ESP32 (MYOSA custom motherboard)
- **Sensors:** MPU6050, BMP180, APDS9960
- **Display:** SSD1306 OLED
- **Actuation:** DC motor with motor driver
- **Firmware:** Embedded C (Arduino framework)

---

## Requirements / Installation
```bash
Arduino IDE
ESP32 board support package
MPU6050 library
BMP180 library
APDS9960 library
SSD1306 OLED library
```

## File Structure
resqpulse/
├── resqpulse.md          # Project documentation (MYOSA submission)
├── cover_image.jpeg      # Cover image for the project
├── workflow.png          # System architecture and workflow diagram
├── design_1.jpg          # Mechanical enclosure and compression mechanism
├── design_2.jpg          # Alternative mechanical design view
├── demo_video.mp4        # Local demonstration video

## License
This project is released strictly for educational and academic use.  
It is intended for learning, experimentation, and demonstration purposes only and must not be used for clinical or commercial deployment.

## Contribution Notes
This project is designed as an academic learning prototype.  
Contributions that improve documentation clarity, system understanding, or educational value are welcome.  
All contributions should respect the non-clinical and experimental nature of the project.
