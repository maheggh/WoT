import React from 'react';

const App = () => {
  // Function to turn on the Micro:bit LED
  const turnOn = async () => {
    try {
      const response = await fetch('http://localhost:5000/microbit/on');
      const result = await response.text();
      console.log("Turn On Response:", result);
    } catch (error) {
      console.error("Error turning on LED:", error);
    }
  };

  // Function to turn off the Micro:bit LED
  const turnOff = async () => {
    try {
      const response = await fetch('http://localhost:5000/microbit/off');
      const result = await response.text();
      console.log("Turn Off Response:", result);
    } catch (error) {
      console.error("Error turning off LED:", error);
    }
  };

  return (
    <div>
      <h1>Micro:bit Controller</h1>
      <button onClick={turnOn}>Turn On LED</button>
      <button onClick={turnOff}>Turn Off LED</button>
    </div>
  );
};

export default App;
