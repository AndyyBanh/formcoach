"use client";
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const page = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // displays video
  const streamRef = useRef<MediaStream | null>(null); // manage connection
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);

  const startWebcam = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsActive(true);
      }

    } catch(error) {
      console.error('Error connecting to webcam');
      setError('Unable to connect to webcam.');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    streamRef.current = null;
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className='min-h-screen flex flex-col items-center p-6'>
      <div className='w-full max-w-4xl text-center'>
        <h1 className='text-4xl font-bold'>Bicep Curl</h1>
        <p className='text-md'>Position yourself in front of camer to begin</p>
      </div>
      

      {/* webcam */}
      <div className='w-full bg-white border rounded-2xl shadow-2xl mt-7 p-6'>
        <div className='relative aspect-video bg-slate-900 rounded-lg overflow-hidden '>
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
      </div>

      <Card className='w-full p-4 mt-6'>
        <CardTitle className='text-2xl'>
          Instructions
        </CardTitle>
        <CardDescription>
          <ul className='space-y-2 text-lg'>
            <li>
              • Position yourself so full body is visible
            </li>
            <li>
              • Stand 6-7 feet away from camera
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