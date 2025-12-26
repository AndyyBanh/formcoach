import os
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np

# Pose landmark model to draw landmarks
POSE_CONNECTIONS = [
    # Face
    (0, 1), (1, 2), (2, 3), (3, 7), (0, 4), (4, 5), (5, 6), (6, 8),
    (9, 10), # Mouth
    (11, 12), # Shoulders
    (11, 13), (13, 15), (15, 17), (15, 19), (15, 21), # Left arm
    (12, 14), (14, 16), (16, 18), (16, 20), (16, 22), # Right arm
    (23, 24), # Hips
    (23, 25), (25, 27), (27, 29), (27, 31), # Left leg
    (24, 26), (26, 28), (28, 30), (28, 32), # Right leg
]

WINDOW_WIDTH = 720
WINDOW_HEIGHT = 450

# import detection model can be found on mediapipe documentations
model_path = os.path.join('.', 'data', 'pose_landmarker_lite.task')

# Initialize Mediapipe pose detection by creating options objects
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    num_poses=1,
    min_pose_detection_confidence=0.5,
    min_pose_presence_confidence=0.5,
    min_tracking_confidence=0.5,
)

def draw_landmarks_on_image(frame, detection_result):
    """
    Draw detected landmarks on image.
    :param frame: Image frame to draw on
    :param detection_result:  Mediapipe detection result
    :return: Frame with landmarks drawn on image
    """
    # Check if no pose detected
    if not detection_result.pose_landmarks:
        return frame

    for pose_landmarks in detection_result.pose_landmarks:

        # Draw a dot on each joint
        for landmark in pose_landmarks:
            x = int(landmark.x * frame.shape[1])
            y = int(landmark.y * frame.shape[0])
            cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)

        # Connect each landmark
        for connection in POSE_CONNECTIONS:
            start_idx, end_idx = connection

            start = pose_landmarks[start_idx]
            end = pose_landmarks[end_idx]

            start_point = (int(start.x * frame.shape[1]), int(start.y * frame.shape[0]))
            end_point = (int(end.x * frame.shape[1]), int(end.y * frame.shape[0]))

            cv2.line(frame, start_point, end_point, (255, 255, 255), 2)


    return frame

def calculate_angle(a, b, c):
    """
    Calculate angle between joints
    :param a:
    :param b:
    :param c:
    :return:
    """
    a = np.array(a) # shoulder first
    b = np.array(b) # elbow mid
    c = np.array(c) # wrist end

    # index 1 is y and index 0 is x
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    # we only want the smaller angle no need for full 360
    if angle > 180.0:
        angle = 360 - angle

    return angle

# Create pose land marker object using option objects
with vision.PoseLandmarker.create_from_options(options) as pose:
    counter = 0
    stage = ""

    # load webcam
    webcam = cv2.VideoCapture(0)

    while webcam.isOpened():

        success, frame = webcam.read()
        if not success:
            break

        # flip cam so it's not inverted
        frame = cv2.flip(frame, 1)

        # convert to rgb since mediapipe reads RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # convert frame received from opencv to mediapipe image object
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        # Send live image data to perform pose land marking
        detection_result = pose.detect(mp_image)

        try:
            # extract landmarks
            landmarks = detection_result.pose_landmarks[0]

            # Get landmarks coordinates
            # note that shoulder side does not matter works for both sides
            left_shoulder = landmarks[11]
            left_elbow = landmarks[13]
            left_wrist = landmarks[15]

            # Break down into just arrays of x and y
            shoulder = [left_shoulder.x, left_shoulder.y]
            elbow = [left_elbow.x, left_elbow.y]
            wrist = [left_wrist.x, left_wrist.y]

            # Calculate angle
            angle = calculate_angle(shoulder, elbow, wrist)


            # Visualize angle
            elbow_pixel = (int(left_elbow.x * frame.shape[1]), int(left_elbow.y * frame.shape[0]))

            cv2.putText(frame, f"{int(angle)} degrees",
                        elbow_pixel,
                        cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3, cv2.LINE_AA)

            # Curl counter logic
            if angle > 150:
                stage = "down"
            if angle < 30 and stage == "down":
                stage = "up"
                counter +=1
                print(counter)
        except Exception as e:
            print(f"Exception: {e}")
            pass


        if detection_result.pose_landmarks:
            cv2.putText(frame, "Pose detected", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Display Rep Count
        cv2.putText(frame, 'REPS', (15, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, str(counter), (170, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Display stage
        cv2.putText(frame, 'STAGE', (15, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, stage, (170, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Process detection result
        annotated_frame = draw_landmarks_on_image(frame, detection_result)

        # Resize
        annotated_frame = cv2.resize(annotated_frame, (WINDOW_WIDTH, WINDOW_HEIGHT))

        # Display frame
        cv2.imshow("Pose detection", annotated_frame)



        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    webcam.release()
    cv2.destroyAllWindows()



