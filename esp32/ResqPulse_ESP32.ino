#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// -------- WIFI --------
#define WIFI_SSID "Motorolla edge"
#define WIFI_PASSWORD "qwerqwer1"

// -------- FIREBASE --------
#define FIREBASE_HOST "myosa-finals-485aa-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "XeVHR5ETxFz5NnQjejiQ19ZljQn6escIEc53mj6Y"

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// -------- OLED --------
#define SDA_PIN 21
#define SCL_PIN 22
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// -------- MOTOR --------
#define MOTOR_ENA 25
#define MOTOR_IN1 26
#define MOTOR_IN2 27

unsigned long motorTimer = 0;
int motorState = 0;
String motorStatus = "STOP";

void setup() {

  Serial.begin(115200);

  Wire.begin(SDA_PIN, SCL_PIN);

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED Failed");
    while(true);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.println("Connecting WiFi...");
  display.display();

  pinMode(MOTOR_ENA, OUTPUT);
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  display.clearDisplay();
  display.setCursor(0,0);
  display.println("WiFi Connected");
  display.println(WiFi.localIP());
  display.display();
  delay(2000);

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  motorTimer = millis();
}

void loop() {

  unsigned long now = millis();

  // ===== MOTOR LOGIC =====
  if(motorState == 0) {
    digitalWrite(MOTOR_ENA, HIGH);
    digitalWrite(MOTOR_IN1, HIGH);
    digitalWrite(MOTOR_IN2, LOW);
    motorStatus = "CW";

    if(now - motorTimer >= 3000) {
      motorState = 1;
      motorTimer = now;
    }
  }

  else if(motorState == 1) {
    digitalWrite(MOTOR_ENA, LOW);
    digitalWrite(MOTOR_IN1, LOW);
    digitalWrite(MOTOR_IN2, LOW);
    motorStatus = "STOP";

    if(now - motorTimer >= 2000) {
      motorState = 2;
      motorTimer = now;
    }
  }

  else if(motorState == 2) {
    digitalWrite(MOTOR_ENA, HIGH);
    digitalWrite(MOTOR_IN1, LOW);
    digitalWrite(MOTOR_IN2, HIGH);
    motorStatus = "CCW";

    if(now - motorTimer >= 3000) {
      motorState = 3;
      motorTimer = now;
    }
  }

  else if(motorState == 3) {
    digitalWrite(MOTOR_ENA, LOW);
    digitalWrite(MOTOR_IN1, LOW);
    digitalWrite(MOTOR_IN2, LOW);
    motorStatus = "STOP";

    if(now - motorTimer >= 2000) {
      motorState = 0;
      motorTimer = now;
    }
  }

  // ===== SENSOR VALUES =====
  float temp = 28.5;
  float distance = 120.3;
  float accelX = 0.45;
  float pressure = 1012.4;
  float light = 350;

  // ===== FIREBASE UPDATE =====
  Firebase.setFloat(firebaseData, "/sensor/temp", temp);
  Firebase.setFloat(firebaseData, "/sensor/distance", distance);
  Firebase.setFloat(firebaseData, "/sensor/accelX", accelX);
  Firebase.setFloat(firebaseData, "/sensor/pressure", pressure);
  Firebase.setFloat(firebaseData, "/sensor/light", light);
  Firebase.setString(firebaseData, "/motor/status", motorStatus);

  // ===== OLED DISPLAY =====
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0,0);

  display.print("T:"); display.print(temp); display.print("C ");
  display.print("D:"); display.print(distance); display.println("cm");

  display.print("AX:"); display.println(accelX);
  display.print("P:"); display.print(pressure); display.println("hPa");
  display.print("L:"); display.println(light);

  display.print("M:"); display.println(motorStatus);

  display.display();

  delay(1000);
}