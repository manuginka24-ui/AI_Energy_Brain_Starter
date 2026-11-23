/*
ESP32 + PZEM004Tv30 sample.
Use a correctly rated enclosed isolated meter. Mains installation MUST be done by a qualified electrician.
Install ESP32 board support and PZEM004Tv30 library in Arduino IDE.
Verify UART pins and module variant against your hardware documentation.
*/
#include <WiFi.h>
#include <HTTPClient.h>
#include <PZEM004Tv30.h>
const char* WIFI_NAME="YOUR_WIFI";
const char* WIFI_PASSWORD="YOUR_PASSWORD";
const char* API_URL="http://192.168.1.10:5000/api/readings/iot"; // computer LAN IP
const char* API_KEY="replace-with-your-long-random-secret";
HardwareSerial meterSerial(2);
PZEM004Tv30 pzem(meterSerial,16,17);
unsigned long lastSend=0;
void setup(){Serial.begin(115200);WiFi.begin(WIFI_NAME,WIFI_PASSWORD);while(WiFi.status()!=WL_CONNECTED){delay(500);Serial.print(".");}Serial.println(WiFi.localIP());}
void loop(){if(millis()-lastSend<60000)return;lastSend=millis();
 float v=pzem.voltage(),a=pzem.current(),w=pzem.power(),kwh=pzem.energy();
 if(isnan(v)||isnan(a)||isnan(w)||isnan(kwh)){Serial.println("Meter read failed");return;}
 if(WiFi.status()==WL_CONNECTED){HTTPClient http;http.begin(API_URL);http.addHeader("Content-Type","application/json");http.addHeader("x-api-key",API_KEY);
 String body="{\"deviceId\":\"esp32-01\",\"voltage\":"+String(v,2)+",\"current\":"+String(a,3)+",\"power\":"+String(w,2)+",\"energyKwh\":"+String(kwh,3)+"}";
 Serial.println(http.POST(body));Serial.println(http.getString());http.end();}}
