const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Use the confirmed COM4 port for your Micro:bit
const microbitPortPath = 'COM4';
const microbitPort = new SerialPort({ path: microbitPortPath, baudRate: 115200 });

// Log raw serial data from Micro:bit
microbitPort.on('data', (data) => {
  console.log('Received data from Micro:bit:', data.toString());
});

// Endpoint to turn on Micro:bit LED
app.get('/microbit/on', (req, res) => {
  microbitPort.write('LED_ON\n', (err) => {
    if (err) {
      console.error('Error sending command:', err.message);
      return res.status(500).send('Error sending command');
    }
    console.log('LED_ON command sent to Micro:bit');
    res.send('Micro:bit LED turned ON');
  });
});

// Endpoint to turn off Micro:bit LED
app.get('/microbit/off', (req, res) => {
  microbitPort.write('LED_OFF\n', (err) => {
    if (err) {
      console.error('Error sending command:', err.message);
      return res.status(500).send('Error sending command');
    }
    console.log('LED_OFF command sent to Micro:bit');
    res.send('Micro:bit LED turned OFF');
  });
});

app.listen(port, () => {
  console.log(`Micro:bit backend running on http://localhost:${port}`);
});
