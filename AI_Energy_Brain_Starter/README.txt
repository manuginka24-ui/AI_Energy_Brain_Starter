AI ENERGY BRAIN STARTER
Requirements: Node.js 20+, MongoDB, VS Code. Python 3.10+ optional.
1) Start MongoDB.
2) backend: copy .env.example to .env, set IOT_API_KEY, run npm install, npm run dev.
3) frontend: run npm install, npm run dev; open http://localhost:5173.
4) IoT endpoint: POST http://localhost:5000/api/readings/iot with x-api-key header.
5) Formula: kWh = watts * hoursPerDay * days / 1000.
For ESP32, configure Wi-Fi, API_URL (computer LAN IP), API_KEY and use the supplied sketch.
Mains wiring is hazardous. Use a correctly rated enclosed isolated meter and qualified electrician.
