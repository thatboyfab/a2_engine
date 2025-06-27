```tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, GitBranch, Brain, AlertTriangle, CheckCircle, Zap } from "lucide-react"
import { useWebSocket } from "@/lib/websocket-context"

interface ActivityEvent {
  id: string
  type: "mission" | "agent" | "subgoal" | "system" | "trace"
  action: string
  description: string
  timestamp: string
  severity?: "low" | "medium" | "high"
  entityId?: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const { subscribe } = useWebSocket()
  const unsubscribersRef = useRef<(() => void)[]>([])

  useEffect(() => {
    // Clear previous subscriptions
    unsubscribersRef.current.forEach((unsub) => unsub())
    unsubscribersRef.current = []

    const unsubscribeMission = subscribe("mission_update", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "mission",
        action: data.status === "completed" ? "completed" : "updated",
        description: `Mission ${data.missionId} ${data.status === "completed" ? "completed successfully" : `progress updated to ${data.progress}%`}`,
        timestamp: new Date().toISOString(),
        entityId: data.missionId,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    const unsubscribeAgent = subscribe("agent_status", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "agent",
        action: data.status,
        description: `Agent ${data.agentId} status changed to ${data.status}`,
        timestamp: new Date().toISOString(),
        severity: data.status === "error" ? "high" : "low",
        entityId: data.agentId,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    const unsubscribeSubgoal = subscribe("subgoal_progress", (data) => {
      const activity: ActivityEvent = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: "subgoal",
        action: "progress",
        description: `Subgoal ${data.subgoalId} progress updated to ${data.progress}%`,
        timestamp: new Date().toISOString(),
        entityId: data.subgoalId,
      }
      setActivities((prev) => [activity, ...prev.slice(0, 49)])
    })

    unsubscribersRef.current.push(unsubscribeMission, unsubscribeAgent, unsubscribeSubgoal)
    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub())
      unsubscribersRef.current = []
    }
  }, [subscribe])

  const getIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "mission":
        return <Target className="w-4 h-4 text-blue-500" />
      case "agent":
        return <Brain className="w-4 h-4 text-green-500" />
      case "subgoal":
        return <GitBranch className="w-4 h-4 text-purple-500" />
      case "system":
        return <Zap className="w-4 h-4 text-yellow-500" />
      case "trace":
        return <Activity className="w-4 h-4 text-gray-500" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-96 p-4">
          <ul className="space-y-2">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-center space-x-2">
                {getIcon(activity.type)}
                <span className="text-xs text-gray-500">{activity.timestamp}</span>
                <span className="font-medium">{activity.description}</span>
                {activity.severity && (
                  <Badge variant={activity.severity === "high" ? "destructive" : "default"}>
                    {activity.severity}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
```
