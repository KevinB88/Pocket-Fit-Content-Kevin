# This file takes snapshots by control of the user. Pressing 'S' to take a snapshot

from flask import Flask, Response, render_template
import cv2
import time
import datetime
import os
import json
from werkzeug.utils import secure_filename

save_directory_path = "/Users/kbedoya88/Desktop/PROJECTS24/Ivy_Hacks_2024/Pocket-Fit/image_data_save"
json_directory_path = "/Users/kbedoya88/Desktop/PROJECTS24/Ivy_Hacks_2024/Pocket-Fit/Backend/json"

if not os.path.exists(save_directory_path):
    os.makedirs(save_directory_path)

app = Flask(__name__, static_url_path='/static')

# Initialize video capture from the default webcam
cap = cv2.VideoCapture(1)

current_frame = None


def add_image_to_json(filename):
    json_file_path = os.path.join(json_directory_path, 'image_dictionary.json')
    if not os.path.exists(json_file_path):
        with open(json_file_path, 'w') as file:
            json.dump({"images": []}, file)

    with open(json_file_path, 'r') as file:
        data = json.load(file)

    data["images"].append({"filename": filename, "attributes": []})

    with open(json_file_path, 'w') as file:
        json.dump(data, file)


@app.route('/take_snapshot', methods=['POST'])
def take_snapshot():
    if 'snapshot' in request.files:
        file = request.files['snapshot']
        if file.filename != '':
            filename = secure_filename(file.filename)
            save_path = os.path.join(save_directory_path, filename)
            file.save(save_path)
            add_image_to_json(filename)
            return jsonify({"message": "Snapshot uploaded and JSON updated successfully!"}), 200

    global current_frame
    if current_frame is not None:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f'snapshot_{timestamp}.png'
        full_path = os.path.join(save_directory_path, filename)
        cv2.imwrite(full_path, current_frame)
        add_image_to_json(filename)
        return jsonify({"message": "Snapshot taken from video feed and JSON updated successfully!"}), 200

    return jsonify({"error": "No snapshot received or video frame captured"}), 500



@app.route('/album')
def album():
    image_directory = '/Users/kbedoya88/Desktop/PROJECTS24/Ivy_Hacks_2024/Pocket-Fit/image_data_save'
    images = [img for img in os.listdir(image_directory) if img.endswith((".png", ".jpg", "jpeg"))]
    return render_template('album.html', images=images)


@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('/Users/kbedoya88/Desktop/PROJECTS24/Ivy_Hacks_2024/Pocket-Fit/image_data_save', filename)


@app.route('/get-images', methods=['GET'])
def get_images():
    image_directory = '/Users/kbedoya88/Desktop/PROJECTS24/Ivy_Hacks_2024/Pocket-Fit/image_data_save'
    images = [img for img in os.listdir(image_directory) if img.endswith((".png", ".jpg", "jpeg"))]
    return jsonify(images)


# @app.route('/take_snapshot', methods=['POST'])
# def take_snapshot():
#     global current_frame
#     if current_frame is not None:
#         timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#         filename = f'snapshot_{timestamp}.png'
#         save_directory = save_directory_path
#         full_path = os.path.join(save_directory, filename)
#         cv2.imwrite(full_path, current_frame)
#         return 'Snapshot taken', 200
#     return 'No frame captured', 500


def generate_frames():
    global current_frame
    while True:
        # Capture frame-by-frame
        success, frame = cap.read()
        if not success:
            break
        else:
            current_frame = frame

            # Reduce frame size for faster processing
            frame = cv2.resize(frame, (640, 480))  # Adjust dimensions as needed

            # Optionally, apply any quick, necessary image processing here

            # Introduce a delay to lower the frame rate
            time.sleep(0.05)  # Adjust delay to control frame rate

            # Encode the frame in JPEG format
            (flag, encodedImage) = cv2.imencode(".jpg", frame)
            if not flag:
                continue

            # Yield each frame as a byte stream, using multipart/x-mixed-replace for MJPEG
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
                   bytearray(encodedImage) + b'\r\n')


@app.route('/video_feed')
def video_feed():
    # Return the response generated along with the specific media
    # type (mime type)
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)

'''
    Additional steps to take:
    Allow the user to take a snapshot of an image on screen
    with the press of a button.
    
    Store the images to a directory for the moment being.
    
    The overall purpose:
    The user will take a snapshot and then the
    AI model will determine the article of clothing 
    present within the provided image.
    
    the image is loaded from the provided directory. 
    And the output is made onto the same screen. 
    

'''