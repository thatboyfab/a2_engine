"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"

interface WebSocketMessage {
  type: "mission_update" | "agent_status" | "subgoal_progress" | "system_alert" | "trace_event"
  payload: any
  timestamp: string
}

interface WebSocketContextType {
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
  subscribe: (type: string, callback: (data: any) => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return

    setConnectionStatus("connecting")

    // Simulate WebSocket connection for demo
    const mockConnect = () => {
      setIsConnected(true)
      setConnectionStatus("connected")
      console.log("A2 Control WebSocket connected (simulated)")
    }

    // Simulate connection after a short delay
    setTimeout(mockConnect, 1000)
  }, [socket])

  const sendMessage = useCallback(
    (message: any) => {
      if (isConnected) {
        console.log("Sending message:", message)
      }
    },
    [isConnected],
  )

  const subscribe = useCallback((type: string, callback: (data: any) => void) => {
    const subscribers = subscribersRef.current
    if (!subscribers.has(type)) {
      subscribers.set(type, new Set())
    }
    subscribers.get(type)!.add(callback)

    // Return unsubscribe function
    return () => {
      const typeSubscribers = subscribers.get(type)
      if (typeSubscribers) {
        typeSubscribers.delete(callback)
        if (typeSubscribers.size === 0) {
          subscribers.delete(type)
        }
      }
    }
  }, [])

  // Initial connection
  useEffect(() => {
    connect()
  }, [])

  // Simulate real-time data for demo purposes
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      // Simulate various types of real-time updates
      const types = [
        "mission_update",
        "agent_status",
        "subgoal_progress",
        "system_alert",
        "trace_event"
      ] as const;
      const type = types[Math.floor(Math.random() * types.length)];
      const payload = { info: `Simulated payload for ${type}` };
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date().toISOString()
      };
      setLastMessage(message);
      // Notify subscribers
      const subscribers = subscribersRef.current.get(type);
      if (subscribers) {
        subscribers.forEach(cb => cb(payload));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isConnected])

  return (
    <WebSocketContext.Provider
      value={{ isConnected, connectionStatus, lastMessage, sendMessage, subscribe }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return ctx;
}