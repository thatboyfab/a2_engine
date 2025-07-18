import { MissionDashboard } from './components/mission-dashboard'
import { WebSocketProvider } from './lib/websocket-context'
import './App.css'


function App() {
  return (
    <WebSocketProvider>
      <MissionDashboard />
    </WebSocketProvider>
  )
}

export default App
