import { useContext } from "react";
import { WebSocketContext, WebSocketContextType } from "@/context/WebSocketContext";

/**
 * Custom hook providing access to WebSocket context
 * @returns WebSocketContextType with current context values
 */
export function useWebSocket(): WebSocketContextType {
    const context = useContext(WebSocketContext);
    
    if (context === undefined) {
        throw new Error('useWebSocket hook must be used with WebSocketProvider');
    }

    return context;
}