'use client';
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { usePathname } from 'next/navigation';

// Define interfaces to represent objects of data expected
interface WorkoutDataResponse {
    reps: number;
    angle: number;
    feedback: string;
}

// Define WebSocket context
export interface WebSocketContextType {
    isConnected: boolean; // info gained
    sendFrame: (exceriseId: string, frameData: string) => void; // send to server
    workoutData: WorkoutDataResponse | null; // recieve from server
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

/**
 * STOMPjs handles messages/communication with message broker over WebSocket using STOMP protocol
 * Sockjs handles fallback (secondary plan if websocket is unavailable)
 * Function WebSocketProvider opens and manages websocket putting data into WebSocketContext
 * Which .Provider allows all child components to access that data
 */
export function WebSocketProvider({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [workoutData, setWorkoutData] = useState<WorkoutDataResponse | null>(null); 
    const pathname = usePathname();
    useEffect(() => {
        // Only connect when user is logged in AND on workout pages
        const token = localStorage.getItem('token');
        const isWorkoutPage = pathname?.startsWith('/workout');
        
        if (!token || !isWorkoutPage) {
            console.log('Websocket not connecting user is not logged in AND not on workout page');
            return;
        }

        // Create client object
        const client  = new Client({
            // Get SockJS object that opens connection to server websocket path (entrypoint/handshake)
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (str) => console.log('STOMP:', str),
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            
            onConnect: () => {
                console.log('Connected to broker');
                setIsConnected(true);

                // Subscribe to message broker path where client listens for responses from server
                client.subscribe('/topic/workout', (message: IMessage) => {
                    const response = JSON.parse(message.body);
                    console.log('Response: ', response);
                    setWorkoutData(response);
                })
            },

            onStompError: (frame) => {
                console.error('Broker reported an error:', frame.body);
                setIsConnected(false);
            },

            onWebSocketClose: (event) => {
                console.log('Websocket closed. Code:', event.code);
                setIsConnected(false);
            }
        });

        client.activate(); // connects to broker
        setClient(client);

        return () => {
            client.deactivate();
        };
    }, [pathname]);


    // Function to send data to DTO in server
    const sendFrame = (exerciseId: string, frameData: string) => {
        // send messsage to STOMP broker
        if (client?.connected) {
            const userId = 'anonymous';
            client.publish({
                destination: '/app/workout',
                body: JSON.stringify({
                    exerciseId,
                    frameData,
                    userId
                })
            });
        } else {
            console.log('Websocket not connected');
        }
    }

  return (
    <WebSocketContext.Provider value={{ isConnected, sendFrame, workoutData }}>
        {children}
    </WebSocketContext.Provider>
  )
}


