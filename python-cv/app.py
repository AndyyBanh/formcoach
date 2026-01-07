from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import base64
import os


app = FastAPI(title="Workout Form MicroService", version="1.0.0")

# Cors configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models parse requests and format responses
class WorkoutFrameRequest(BaseModel):
    exerciseId: str
    frameData: str
    sessionId: str

class WorkoutResponse(BaseModel):
    reps: int
    angle: float
    feedback: str

# Track reps per user {session: counter, stage}
session_counters = {}

# Initialize mediapipe
model_path = os.path.join('.', 'data', 'pose_landmarker_lite.task')
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    num_poses=1,
    min_pose_detection_confidence=0.5,
    min_pose_presence_confidence=0.5,
    min_tracking_confidence=0.5,
)

# Create pose landmarker
pose_landmarker = vision.PoseLandmarker.create_from_options(options)

def calculate_angle(a, b, c):
    """
    Calculate angle between joints
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


@app.post("/analyze", response_model=WorkoutResponse)
async def analyze_frame(request: WorkoutFrameRequest):
    """"
    Analyze workout from frames
    """
    try:
        session_id = request.sessionId

        # keep track of sessions reps and joint position
        if session_id not in session_counters:
            session_counters[session_id] = {'counter': 0, 'stage': ''}

        # Dcode base64 image
        frame_data = request.frameData
        if ',' in frame_data:
            frame_data = frame_data.split(',')[1]

        image_bytes = base64.b64decode(frame_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Could not read frame")
        # convert frame for mediapipe to process
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        detection_result = pose_landmarker.detect(mp_image)

        feedback = "Position yourself in frame"
        left_angle = 0.0

        if detection_result.pose_landmarks:
            landmarks = detection_result.pose_landmarks[0]

            if request.exerciseId == "bicep-curl":
                # don't need both arms as this is a form coach
                left_shoulder = landmarks[11]
                left_elbow = landmarks[13]
                left_wrist = landmarks[15]

                left_angle = calculate_angle(
                    [left_shoulder.x, left_shoulder.y],
                    [left_elbow.x, left_elbow.y],
                    [left_wrist.x, left_wrist.y],
                )

                # Curl counting logic
                counter = session_counters[session_id]['counter']
                stage = session_counters[session_id]['stage']

                if left_angle > 150:
                    stage = "down"
                    feedback = "Good extension! Remember slowly lower weight, maintaining tension."
                if left_angle < 30 and stage == "down":
                    stage = "up"
                    counter += 1
                    feedback = f"Rep {counter} counted! Great form!"
                    print(f"Session: Rep: {counter}")

                # Update users rep counter
                session_counters[session_id]['counter']  = counter
                session_counters[session_id]['stage'] = stage

        return WorkoutResponse(
            reps = session_counters[session_id]['counter'],
            angle = round(left_angle, 1),
            feedback = feedback,
        )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error: {e}")


if __name__ == "__main__":
    import uvicorn
    print("Starting app")
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True)
