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
