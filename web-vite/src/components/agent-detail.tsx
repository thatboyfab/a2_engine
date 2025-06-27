// Port your agent detail here from /web/components/agent-detail.tsx

"use client"

import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Cpu, Zap, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "terminated" | "error"
  currentTask: string
  capabilities: string[]
  performance: {
    tasksCompleted: number
    successRate: number
    avgLatency: number
    retries: number
  }
  learningPath: {
    step: string
    status: "completed" | "active" | "pending"
    timestamp?: string
  }[]
  config: {
    maxDepth: number
    budget: number
    timeout: number
  }
  logs: {
    timestamp: string
    level: "info" | "warn" | "error"
    message: string
  }[]
}

const mockAgent: Agent = {
  id: "AGT-001",
  name: "Financial Analyzer Alpha",
  role: "Data Analysis Specialist",
  status: "active",
  currentTask: "Processing Q4 revenue categorization",
  capabilities: ["Data Analysis", "Pattern Recognition", "Report Generation", "Recursive Delegation"],
  performance: {
    tasksCompleted: 47,
    successRate: 94.7,
    avgLatency: 2.3,
    retries: 3,
  },
  learningPath: [
    { step: "Initialize core capabilities", status: "completed", timestamp: "2024-01-15T10:30:00Z" },
    { step: "Load financial analysis patterns", status: "completed", timestamp: "2024-01-15T10:32:00Z" },
    { step: "Analyze Q4 revenue streams", status: "active" },
    { step: "Generate expense categorization", status: "pending" },
  ],
  config: {
    maxDepth: 3,
    budget: 10.0,
    timeout: 60,
  },
  logs: [
    { timestamp: "2024-01-15T10:35:00Z", level: "info", message: "Agent initialized." },
    { timestamp: "2024-01-15T10:36:00Z", level: "info", message: "Started Q4 revenue analysis." },
    { timestamp: "2024-01-15T10:37:00Z", level: "warn", message: "Data anomaly detected." },
    { timestamp: "2024-01-15T10:38:00Z", level: "error", message: "Failed to fetch external data." },
  ],
}

export function AgentDetail() {
  const [agent, setAgent] = useState<Agent>(mockAgent)

  // ...component logic and rendering...
  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Role: {agent.role}</div>
        <div>Status: {agent.status}</div>
        <div>Current Task: {agent.currentTask}</div>
        {/* Add more UI as needed */}
      </CardContent>
    </Card>
  )
}
