const { SerialPort } = require('serialport');

// Replace 'COM4' with your actual port
const port = new SerialPort({ path: 'COM4', baudRate: 115200 });

port.on('data', (data) => {
  console.log('Received data from Micro:bit:', data.toString());
});

port.write('LED_ON\n', (err) => {
  if (err) {
    return console.log('Error on write:', err.message);
  }
  console.log('LED_ON command sent to Micro:bit');
});