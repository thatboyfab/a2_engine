import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Activity, Clock, CheckCircle, AlertTriangle, Zap, Brain, Target } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useWebSocket } from "@/lib/websocket-context"
import { SystemHealthMonitor } from "@/components/system-health-monitor"
import { ActivityFeed } from "@/components/activity-feed"

interface Mission {
  id: string
  name: string
  description: string
  status: "active" | "queued" | "completed" | "failed"
  priority: "low" | "medium" | "high" | "critical"
  progress: number
  subgoals: number
  agents: number
  createdAt: string
  traceId: string
}

const mockMissions: Mission[] = [
  {
    id: "MG-001",
    name: "Fiscal Analysis Q4",
    description: "Comprehensive financial analysis and forecasting for Q4 performance",
    status: "active",
    priority: "high",
    progress: 67,
    subgoals: 12,
    agents: 8,
    createdAt: "2024-01-15T10:30:00Z",
    traceId: "trace-001-fiscal",
  },
  {
    id: "MG-002",
    name: "Market Research Initiative",
    description: "Deep market analysis for emerging AI technologies",
    status: "active",
    priority: "medium",
    progress: 34,
    subgoals: 8,
    agents: 5,
    createdAt: "2024-01-15T14:20:00Z",
    traceId: "trace-002-market",
  },
  {
    id: "MG-003",
    name: "Compliance Audit",
    description: "Automated compliance checking across all systems",
    status: "completed",
    priority: "critical",
    progress: 100,
    subgoals: 15,
    agents: 12,
    createdAt: "2024-01-14T09:15:00Z",
    traceId: "trace-003-compliance",
  },
]

export function MissionDashboard() {
  const [missions, setMissions] = useState<Mission[]>(mockMissions)
  const [isNewMissionOpen, setIsNewMissionOpen] = useState(false)
  const [newMission, setNewMission] = useState({
    name: "",
    description: "",
    priority: "medium" as const,
    timeRange: "24h",
  })

  const { subscribe } = useWebSocket()
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }

    unsubscribeRef.current = subscribe("mission_update", (data) => {
      setMissions((prev) =>
        prev.map((mission) =>
          mission.id === data.missionId ? { ...mission, progress: data.progress, status: data.status } : mission,
        ),
      )
    })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [subscribe])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mission Dashboard</h1>
        <Button onClick={() => setIsNewMissionOpen(true)} variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          New Mission
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {missions.map((mission) => (
          <Card key={mission.id} className="flex flex-col">
            <CardContent className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{mission.name}</h2>
                <Badge variant={getStatusVariant(mission.status)}>{mission.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{mission.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs font-medium uppercase text-muted-foreground">Priority:</span>
                  <Badge variant={getPriorityVariant(mission.priority)}>{mission.priority}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{mission.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isNewMissionOpen} onOpenChange={setIsNewMissionOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            New Mission
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Mission</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="mission-name">Mission Name</Label>
              <Input
                id="mission-name"
                value={newMission.name}
                onChange={(e) => setNewMission({ ...newMission, name: e.target.value })}
                placeholder="Enter mission name"
              />
            </div>
            <div>
              <Label htmlFor="mission-description">Description</Label>
              <Textarea
                id="mission-description"
                value={newMission.description}
                onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                placeholder="Enter mission description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="mission-priority">Priority</Label>
              <Select
                id="mission-priority"
                value={newMission.priority}
                onValueChange={(value) => setNewMission({ ...newMission, priority: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mission-time-range">Time Range</Label>
              <Select
                id="mission-time-range"
                value={newMission.timeRange}
                onValueChange={(value) => setNewMission({ ...newMission, timeRange: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last 1 Hour</SelectItem>
                  <SelectItem value="12h">Last 12 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNewMissionOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Handle mission creation
                setIsNewMissionOpen(false)
              }}
            >
              Create Mission
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "green"
    case "queued":
      return "yellow"
    case "completed":
      return "blue"
    case "failed":
      return "red"
    default:
      return "gray"
  }
}

function getPriorityVariant(priority: string) {
  switch (priority) {
    case "low":
      return "gray"
    case "medium":
      return "blue"
    case "high":
      return "orange"
    case "critical":
      return "red"
    default:
      return "gray"
  }
}
