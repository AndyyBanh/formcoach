'use client';
import React, { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { usePathname } from 'next/navigation';

// If a sent frame gets no response within this window, assume it was lost so backpressure
// doesn't deadlock and stop sending forever.
const STALE_MS = 2000;

interface WorkoutDataResponse {
    reps: number;
    angle: number;
    feedback: string;
}

export interface WebSocketContextType {
    isConnected: boolean;
    sendFrame: (exceriseId: string, frameData: string) => void;
    workoutData: WorkoutDataResponse | null;
    hasPendingFrame: () => boolean;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [workoutData, setWorkoutData] = useState<WorkoutDataResponse | null>(null);
    const sentTimestamps = useRef<number[]>([]);
    const pathname = usePathname();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isWorkoutPage = pathname?.startsWith('/workout');

        if (!token || !isWorkoutPage) {
            console.log('Websocket not connecting user is not logged in AND not on workout page');
            return;
        }

        const client  = new Client({
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
                sentTimestamps.current = [];

                client.subscribe('/topic/workout', (message: IMessage) => {
                    const receivedAt = performance.now();
                    const response = JSON.parse(message.body);
                    const sentAt = sentTimestamps.current.shift();
                    if (sentAt !== undefined) {
                        const rttMs = receivedAt - sentAt;
                        console.log(`[latency] response @ ${receivedAt.toFixed(1)}ms | RTT=${rttMs.toFixed(1)}ms | inflight=${sentTimestamps.current.length}`, response);
                    } else {
                        console.log('[latency] response with no matching sent frame', response);
                    }
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

        client.activate();
        setClient(client);

        return () => {
            client.deactivate();
        };
    }, [pathname]);


    // Backpressure check: true while a frame is still awaiting a response. Evicts stale sends
    // first so a lost response can never permanently block sending.
    const hasPendingFrame = useCallback(() => {
        const now = performance.now();
        while (sentTimestamps.current.length && now - sentTimestamps.current[0] > STALE_MS) {
            sentTimestamps.current.shift();
        }
        return sentTimestamps.current.length > 0;
    }, []);

    const sendFrame = useCallback((exerciseId: string, frameData: string) => {
        if (client?.connected) {
            const sentAt = performance.now();
            sentTimestamps.current.push(sentAt);
            console.log(`[latency] frame sent @ ${sentAt.toFixed(1)}ms | inflight=${sentTimestamps.current.length}`);

            client.publish({
                destination: '/app/workout',
                body: JSON.stringify({
                    exerciseId,
                    frameData,
                })
            });
        } else {
            console.log('Websocket not connected');
        }
    }, [client]);

  return (
    <WebSocketContext.Provider value={{ isConnected, sendFrame, workoutData, hasPendingFrame }}>
        {children}
    </WebSocketContext.Provider>
  )
}
