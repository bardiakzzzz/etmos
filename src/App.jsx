import { useState, useCallback } from 'react'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import DetailView from './components/DetailView'
import ScheduleView from './components/ScheduleView'
import AgentView from './components/AgentView'

export default function App() {
  const [view, setView] = useState('map')
  const [selectedTunnel, setSelectedTunnel] = useState(null)

  const handleSelectTunnel = useCallback((t) => setSelectedTunnel(t), [])
  const handleOpenDetail   = useCallback(() => setView('detail'), [])
  const handleNav = useCallback((v) => {
    setView(v)
    if (v === 'map') setSelectedTunnel(null)
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar view={view} onNav={handleNav} selectedTunnel={selectedTunnel} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {view === 'map' && (
          <>
            <Sidebar
              selectedTunnel={selectedTunnel}
              onSelectTunnel={handleSelectTunnel}
              onOpenDetail={handleOpenDetail}
            />
            <MapView
              selectedTunnel={selectedTunnel}
              onSelectTunnel={handleSelectTunnel}
            />
          </>
        )}

        {view === 'detail' && selectedTunnel && (
          <DetailView tunnel={selectedTunnel} onBack={() => handleNav('map')} />
        )}

        {view === 'schedule' && <ScheduleView />}
        {view === 'agent'    && <AgentView />}

      </div>
    </div>
  )
}
