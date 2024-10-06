const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');  // Import SerialPort

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Replace 'COM3' with your actual Micro:bit port
const microbitPortPath = 'COM3';  // Ensure this is the correct port
const microbitPort = new SerialPort({ path: microbitPortPath, baudRate: 115200 });

// Handle raw data directly from the Micro:bit
microbitPort.on('data', (data) => {
  console.log('Raw data received from Micro:bit:', data.toString());
});

// Endpoint to turn on Micro:bit LED
app.get('/microbit/on', (req, res) => {
  microbitPort.write('LED_ON\n', (err) => {
    if (err) {
      console.error('Error sending command:', err.message);
      return res.status(500).send('Error sending command');
    }
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
    res.send('Micro:bit LED turned OFF');
  });
});

app.listen(port, () => {
  console.log(`Micro:bit backend running on http://localhost:${port}`);
});
