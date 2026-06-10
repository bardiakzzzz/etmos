import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { TUNNELS, SEV_COLORS, SEV_LABELS } from '../data'

export default function MapView({ onSelectTunnel, selectedTunnel }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    if (mapInstanceRef.current) return
    const map = L.map(mapRef.current, { center: [42.5, 12.5], zoom: 6 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)
    mapInstanceRef.current = map

    TUNNELS.forEach(t => {
      const color = SEV_COLORS[t.cda]
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.15s;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      const marker = L.marker([t.lat, t.lng], { icon })
        .addTo(map)
        .bindTooltip(`<b>${t.name}</b><br/>${t.road} · CDA: ${SEV_LABELS[t.cda]}`, { direction: 'top', offset: [0, -8] })
        .on('click', () => onSelectTunnel(t))
      markersRef.current[t.id] = marker
    })

    return () => { map.remove(); mapInstanceRef.current = null }
  }, [])

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = selectedTunnel && selectedTunnel.id === Number(id)
      const el = marker.getElement()
      if (el) {
        const dot = el.querySelector('div')
        if (dot) {
          dot.style.transform = isSelected ? 'scale(1.8)' : 'scale(1)'
          dot.style.border = isSelected ? '2.5px solid #1d4ed8' : '2.5px solid white'
        }
      }
    })
  }, [selectedTunnel])

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
