import serial
import time

# Set the correct port where the Micro:bit is connected
microbit_port = 'COM3'  # Update to your actual COM port
ser = serial.Serial(microbit_port, 115200)

time.sleep(2)  # Wait for Micro:bit to initialize

ser.write(b'LED_OFF\n')  # Send the 'LED_OFF' command via serial
ser.close()