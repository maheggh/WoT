import cv2
import requests
from ultralytics import YOLO
import time

# Load the YOLOv8 nano model
model = YOLO("yolov8n.pt")

# Initialize the camera (try index 0 first)
cap = cv2.VideoCapture(0)  # 0 is usually the default camera

# Define the backend URL
backend_url_on = 'http://localhost:5000/microbit/on'
backend_url_off = 'http://localhost:5000/microbit/off'

led_on = False  # To track the LED status
previous_position = None  # To track the previous position of the detected object
last_request_time = 0  # Time of the last request sent
request_interval = 5  # Wait at least 5 seconds between requests

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Run YOLOv8 inference on the frame
    results = model(frame)

    person_detected = False
    current_position = None

    for result in results:
        boxes = result.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            class_id = box.cls[0].item()
            conf = box.conf[0].item()

            # Calculate the central horizontal point
            central_x = (x1 + x2) / 2
            central_y = (y1 + y2) / 2
            current_position = (central_x, central_y)

            # Check if the detected object is a person
            if model.names[class_id] == "person":
                person_detected = True

    # Motion Detection Logic: Compare current and previous positions
    current_time = time.time()
    if person_detected:
        if previous_position is not None and current_position is not None:
            # Calculate movement between frames
            movement_x = abs(current_position[0] - previous_position[0])
            movement_y = abs(current_position[1] - previous_position[1])

            # If movement in x or y direction is greater than a threshold, trigger light
            if movement_x > 20 or movement_y > 20:  # Adjust threshold as needed
                if not led_on and (current_time - last_request_time > request_interval):
                    # Turn on the LED
                    try:
                        response = requests.get(backend_url_on, timeout=2)
                        if response.status_code == 200:
                            print("LED turned ON")
                            led_on = True
                            last_request_time = current_time
                    except requests.RequestException as e:
                        print(f"Error communicating with backend: {e}")
            elif led_on and (current_time - last_request_time > request_interval):
                # No significant movement, turn off the light
                try:
                    response = requests.get(backend_url_off, timeout=2)
                    if response.status_code == 200:
                        print("LED turned OFF")
                        led_on = False
                        last_request_time = current_time
                except requests.RequestException as e:
                    print(f"Error communicating with backend: {e}")

        # Update previous position for the next frame comparison
        previous_position = current_position

    # If no person is detected, turn off the light
    elif led_on and (current_time - last_request_time > request_interval):
        try:
            response = requests.get(backend_url_off, timeout=2)
            if response.status_code == 200:
                print("LED turned OFF (no person detected)")
                led_on = False
                last_request_time = current_time
        except requests.RequestException as e:
            print(f"Error communicating with backend: {e}")

    # Optionally, save the processed frame to disk
    #cv2.imwrite(f'output_frame_{time.time()}.jpg', results[0].plot())

# Release the capture
cap.release()
