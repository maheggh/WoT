import serial
import time

# Set the correct port where the Micro:bit is connected (check Device Manager)
microbit_port = 'COM3'  # Update to your actual COM port
ser = serial.Serial(microbit_port, 115200)

time.sleep(2)  # Wait for Micro:bit to initialize

ser.write(b'LED_ON\n')  # Send the 'LED_ON' command via serial
ser.close()