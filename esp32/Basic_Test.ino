// Basic ESP32 OLED Test - Display "Hi Jathin"
// Simple test code to verify your ESP32 and OLED setup

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>

// ========== OLED CONFIGURATION ==========
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SDA_PIN 21
#define SCL_PIN 22

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// ========== LED PIN ==========
#define LED_PIN 2

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("ESP32 OLED Test Starting...");

  // Initialize LED pin
  pinMode(LED_PIN, OUTPUT);

  // Initialize I2C
  Wire.begin(SDA_PIN, SCL_PIN);
  Serial.println("I2C initialized on pins SDA=21, SCL=22");

  // Initialize OLED display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // Clear the display buffer
  display.clearDisplay();

  // Set text properties
  display.setTextSize(2);      // Large text
  display.setTextColor(SSD1306_WHITE);

  // Display "Hi Jathin" in the center
  display.setCursor(20, 20);   // Position text
  display.println("Hi Jathin!");

  // Add some decorative elements
  display.setTextSize(1);
  display.setCursor(30, 45);
  display.println("Setup Test OK");

  // Show the display buffer on the screen
  display.display();

  Serial.println("Display initialized successfully!");
  Serial.println("You should see 'Hi Jathin!' on the OLED screen");

  // Blink LED to confirm setup
  for(int i = 0; i < 5; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}

void loop() {
  // Simple animation - make the LED blink
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);

  // Update display with system info
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(20, 10);
  display.println("Hi Jathin!");

  display.setTextSize(1);
  display.setCursor(10, 35);
  display.printf("Uptime: %lu sec", millis() / 1000);

  display.setCursor(10, 50);
  display.println("ESP32 Ready!");

  display.display();

  Serial.printf("Running for %lu seconds...\n", millis() / 1000);
}