import React from 'react';

const App = () => {
  // Function to turn on the Micro:bit LED
  const turnOn = async () => {
    await fetch('http://localhost:3000/microbit/on');
  };

  // Function to turn off the Micro:bit LED
  const turnOff = async () => {
    await fetch('http://localhost:3000/microbit/off');
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