import { createFileRoute } from '@tanstack/react-router'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { CrosshairIcon } from '../components/CrosshairIcon'
import { CoordinateOverlay } from '../components/CoordinateOverlayProps'

// クエリパラメータの定義（バリデーションとデフォルト値）
const mapSearchSchema = z.object({
  lat: z.number().catch(35.6812), // 東京駅
  lng: z.number().catch(139.7671),
  zoom: z.number().catch(12),
  bearing: z.number().catch(0),
  pitch: z.number().catch(0), 
})

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => mapSearchSchema.parse(search),
  component: MapComponent,
})

function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  
  // URLから状態を取得 (型安全なところがポイント)
  const { lat, lng, zoom, bearing, pitch } = Route.useSearch()
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [lng, lat],
      zoom: zoom,
      bearing: bearing,
      pitch: pitch
    })

    const map = mapInstance.current

    // 地図が動いたらURLを更新
    map.on('moveend', () => {
      const center = map.getCenter()
      const newZoom = map.getZoom()
      const newBearing = map.getBearing()
      const newPitch = map.getPitch()

      navigate({
        search: (prev: { lat: number; lng: number; zoom: number }) => ({
          ...prev,
          lat: parseFloat(center.lat.toFixed(6)),
          lng: parseFloat(center.lng.toFixed(6)),
          zoom: parseFloat(newZoom.toFixed(2)),
          bearing: parseFloat(newBearing.toFixed(2)),
          pitch: parseFloat(newPitch.toFixed(2)),
        }),
        replace: true, // 戻るボタンの履歴を汚さないようにする
      })
    })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <CrosshairIcon />
      <CoordinateOverlay lat={lat} lng={lng} />
    </div>
  )
}