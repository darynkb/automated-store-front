#!/usr/bin/env node

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

const localIP = getLocalIP();
console.log('\n🌐 Local Network Access:');
console.log(`   Local:    http://localhost:3000`);
console.log(`   Network:  http://${localIP}:3000`);
console.log(`   Mobile:   http://${localIP}:3000/mobile`);
console.log('\n📱 To test on mobile:');
console.log(`   1. Make sure your mobile device is on the same WiFi network`);
console.log(`   2. Open http://${localIP}:3000/mobile on your mobile browser`);
console.log(`   3. Allow camera permissions when prompted\n`);