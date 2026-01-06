---
publishDate: 2026-01-05
title: MyOSA LifeSaver – IoT-Based CPR Assistance Prototype
excerpt: A modular embedded systems prototype exploring sensing, motion control, and real-time feedback for CPR assistance system engineering.
image: cover_image.jpg
tags:
- iot
- embedded-systems
- biomedical
---
> A non-clinical, hardware-based CPR assistance prototype designed for learning and experimentation.

## Acknowledgements
This project was developed under the MYOSA initiative with guidance and support from mentors, faculty members, and peers who encouraged iterative design, testing, and responsible system development.

---

## Overview
MyOSA LifeSaver is a modular embedded systems prototype created to explore how sensing, actuation, and real-time feedback can work together in CPR assistance system engineering.

The project is intentionally designed as a learning and experimentation platform. Instead of focusing on clinical outcomes, it emphasizes transparency, predictability, and hands-on understanding of how embedded systems behave during controlled operation. Hardware, firmware, and mechanical design are combined in a structured and accessible way to support academic learning.

### Purpose
The purpose of this prototype is to help students and researchers understand the fundamental building blocks of CPR assistance systems. It allows users to observe motion cycles, sensor behavior, and system coordination through direct experimentation and live feedback.

### Non-Clinical Note
This project is strictly intended for educational, experimental, and demonstration purposes only and is **not** a medical or clinical device.

---

## Demo / Examples

### Images
<p align="center">
<img src="/cover_image.jpg" width="600"><br/>
<i>Project cover image</i>
</p>

<p align="center">
<img src="/workflow.png" width="800"><br/>
<i>System architecture and workflow overview</i>
</p>

<p align="center">
<img src="/design_1.jpg" width="800"><br/>
<i>Mechanical enclosure and compression mechanism</i>
</p>

<p align="center">
<img src="/design_2.jpg" width="600"><br/>
<i>Alternative mechanical design view</i>
</p>

---

### Videos
<video controls width="100%">
<source src="/demo_video.mp4" type="video/mp4">
</video>

---

## Features (Detailed)

### 1. Modular System Architecture
The system follows a modular design approach, allowing sensing, actuation, display, and connectivity components to function as independent yet coordinated units. This makes the prototype easier to understand, test, and extend for academic purposes.

### 2. Multi-Sensor Feedback
The prototype integrates motion, pressure, and proximity sensors to capture real-time system state. These inputs provide insight into orientation, interaction, and environmental response during operation.

### 3. Controlled Actuation Logic
A motor-driven mechanism performs repeatable motion cycles inspired by CPR compression patterns. The focus is on consistency and predictability rather than medical accuracy.

### 4. Real-Time On-Device Feedback
An OLED display provides live feedback directly on the device, allowing users to observe sensor readings and system status without external tools.

### 5. Cloud-Based Data Logging
Sensor values are periodically transmitted to a cloud database, enabling remote observation and analysis of system behavior over time.

---

## Usage Instructions
1. Power the system using a regulated power source  
2. Allow all sensors to initialize during startup  
3. Observe live system information on the OLED display  
4. Run demonstrations using the predefined motion cycle  
5. Stop the system manually after testing is complete  

Below is a representative firmware snippet illustrating the sensing, display update, and cloud logging logic used in the prototype.

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

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL"

Adafruit_SSD1306 display(128, 64, &Wire, -1);
Adafruit_MPU6050 motionSensor;
Adafruit_BMP085_Unified pressureSensor = Adafruit_BMP085_Unified(10085);
Adafruit_APDS9960 proximitySensor;

FirebaseData firebaseData;
FirebaseAuth firebaseAuth;
FirebaseConfig firebaseConfig;

unsigned long lastUpdate = 0;
const unsigned long updateInterval = 2000;

void setup() {
  Wire.begin();
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.setTextSize(1);
  display.setTextColor(WHITE);

  motionSensor.begin();
  pressureSensor.begin();
  proximitySensor.begin();
  proximitySensor.enableProximity(true);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  firebaseConfig.api_key = API_KEY;
  firebaseConfig.database_url = DATABASE_URL;
  Firebase.begin(&firebaseConfig, &firebaseAuth);
}

void loop() {
  if (millis() - lastUpdate >= updateInterval) {
    lastUpdate = millis();

    sensors_event_t accel, gyro, temp;
    motionSensor.getEvent(&accel, &gyro, &temp);

    sensors_event_t pressure;
    pressureSensor.getEvent(&pressure);

    uint8_t proximity = 0;
    proximitySensor.readProximity(proximity);

    display.clearDisplay();
    display.setCursor(0, 0);
    display.print("Ax: "); display.println(accel.acceleration.x);
    display.print("Ay: "); display.println(accel.acceleration.y);
    display.print("Az: "); display.println(accel.acceleration.z);
    display.print("P: "); display.println(pressure.pressure);
    display.print("Prox: "); display.println(proximity);
    display.display();

    Firebase.RTDB.setFloat(&firebaseData, "/sensors/ax", accel.acceleration.x);
    Firebase.RTDB.setFloat(&firebaseData, "/sensors/pressure", pressure.pressure);
    Firebase.RTDB.setInt(&firebaseData, "/sensors/proximity", proximity);
  }
}

---

## File Structure (Optional)

```
resqpulse/ File Structure (Optional)
├── resqpulse.md          # Project documentation (MYOSA submission)
├── cover_image.jpg       # Cover image for the project
├── workflow.png          # System architecture and workflow diagram
├── design_1.jpg          # Mechanical enclosure and compression mechanism
├── design_2.jpg          # Alternative mechanical design view
├── demo_video.mp4        # Local demonstration video
```

## License (Optional)

This project is released strictly for educational and academic use.
It is intended for learning, experimentation, and demonstration purposes only and must not be used for clinical or commercial deployment.

## Contribution Notes (Optional)

This project is designed as an academic learning prototype.
Contributions that improve documentation clarity, system understanding, or educational value are welcome.
All contributions should respect the non-clinical and experimental nature of the project.
