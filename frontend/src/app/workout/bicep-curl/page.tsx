"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import React, { useEffect, useRef, useState } from 'react'

const page = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // element that displays webcam
  const canvasRef = useRef<HTMLCanvasElement>(null); // hidden canvas to capture and encode frames
  const streamRef = useRef<MediaStream | null>(null); // active webcam Mediasteam (gives ability to stop cleanly)
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { isConnected, sendFrame, workoutData } = useWebSocket();
  const intervalRef = useRef<number | null>(null); // ID for frame capture interval timer


  const startWebcam = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsActive(true);

          videoRef.current?.addEventListener('canplay', () => {
            console.log('Video ready to play');
          }, {once: true})
      }

    } catch(error) {
      console.error('Error connecting to webcam');
      setError('Unable to connect to webcam.');
    }
  };

  const stopWebcam = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    streamRef.current = null;
    setIsActive(false);
  };

  // send frames only if camera is active and websocket is connected
  useEffect(() => {
    if (!isActive || !isActive || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    intervalRef.current = window.setInterval(() => {
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight ===0) {
        return;
      }

      // match canvas size to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // convert to Base64
      const frameData = canvas.toDataURL('image/jpeg', 0.5);
      if (frameData && frameData.includes(',')) {
        sendFrame('bicep-curl', frameData);
      }    

    }, 100); // 10 FPS captures and sends frames every 100ms

    return () => {
      if (intervalRef.current !== null){
        clearInterval(intervalRef.current);
      }
    }    
  }, [isActive, isConnected, sendFrame]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className='min-h-screen flex flex-col items-center p-6 pt-24'>
      <div className='w-full max-w-4xl text-center'>
        <h1 className='text-4xl font-bold'>Bicep Curl</h1>
        <p className='text-md'>Position yourself in front of Camera to begin</p>
      </div>

      <div className='flex mt-4 space-x-5'>
        <Card className='p-5'>
          <div className='flex flex-col justify-center items-center'>
            <CardTitle>Reps</CardTitle>
            <CardContent>
              <p>{workoutData?.reps? workoutData.reps : 0}</p>
            </CardContent>
          </div>
        </Card>
        <Card className='p-5'>
          <div className='flex flex-col justify-center items-center'>
            <CardTitle>Feedback</CardTitle>
            <CardContent>
              <p>{workoutData?.feedback? workoutData.feedback : 'No current feedback'}</p>
            </CardContent>
          </div>
        </Card>
         <Card className='p-5'>
          <div className='flex flex-col justify-center items-center'>
            <CardTitle>Bicep Angle</CardTitle>
            <CardContent>
              <p>{workoutData?.angle? workoutData.angle : 'No current angle'}</p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* webcam */}
      <div className='w-full bg-white border rounded-2xl shadow-2xl mt-3 p-6'>
        <div className='relative z-10 aspect-video bg-slate-900 rounded-lg overflow-hidden mx-auto max-h-[580px]'>
          {!isActive && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center'>
                <Camera  className='text-white mb-4' size='67'/>
                <p className='text-white text-lg'>Camera Inactive</p>
              </div>
            </div>

          )}
          <video 
            ref={videoRef} 
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${!isActive ? `hidden` : ``}`}
          />

          <canvas ref={canvasRef} className='hidden' />
        </div>

        {error && (
          <div className='mt-4 bg-red-100 border border-red-400 rounded-lg text-white'>
            {error}
          </div>
        )} 


       <div className='mt-6 flex justify-center'>
        {!isActive ? (
          <Button onClick={startWebcam}>
            Start Sharing Screen
          </Button>
        ) : (
          <Button onClick={stopWebcam}>
            Stop Sharing Screen
          </Button>
        )}
       </div>

        <div className='mt-2 flex items-center'>
          <div className={`w-3 h-3 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            <span className='text-sm'>
              {isConnected ? 'Connected to server' : 'Disconnected' } 
            </span>
          </div>
        </div>
      </div>


      <Card className='w-full p-4 mt-6'>
        <CardTitle className='text-2xl'>
          Instructions
        </CardTitle>
        <CardDescription>
          <ul className='space-y-2 text-lg'>
            <li>
              • This model is intended to help users correct their bicep curl form. <span className='font-bold'>Please use your left arm.</span>
            </li>
            <li>
              • Position yourself so full body is visible
            </li>
            <li>
              • Stand few feet away from camera
            </li>
            <li>
              • Ensure lighting is good for best results
            </li>
            <li>
              • Click "Start Sharing Screen" to begin tracking
            </li>
          </ul>

        </CardDescription>
      </Card>
    
    </div>
  )
}

export default page