import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_TOKEN, COUNTRY_CENTERS, COUNTRY_ZOOM } from './data.js'

mapboxgl.accessToken = MAPBOX_TOKEN

export default function MapPicker({ country, onAreaSelect }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const drawBoxRef = useRef(null)
  const startRef = useRef(null)
  const drawingRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: COUNTRY_CENTERS[country],
      zoom: COUNTRY_ZOOM[country],
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    const canvas = map.getCanvasContainer()

    function onMouseDown(e) {
      if (!e.originalEvent.shiftKey) return
      e.preventDefault()
      drawingRef.current = true
      startRef.current = e.point
      map.dragPan.disable()
      canvas.style.cursor = 'crosshair'
    }

    function onMouseMove(e) {
      if (!drawingRef.current) return
      updateBox(startRef.current, e.point, canvas)
    }

    function onMouseUp(e) {
      if (!drawingRef.current) return
      drawingRef.current = false
      map.dragPan.enable()
      canvas.style.cursor = ''
      const s = startRef.current
      const sw = map.unproject([Math.min(s.x, e.point.x), Math.max(s.y, e.point.y)])
      const ne = map.unproject([Math.max(s.x, e.point.x), Math.min(s.y, e.point.y)])
      onAreaSelect({
        bbox: [[sw.lng, sw.lat], [ne.lng, ne.lat]],
        label: `SW ${sw.lat.toFixed(4)},${sw.lng.toFixed(4)} → NE ${ne.lat.toFixed(4)},${ne.lng.toFixed(4)}`
      })
    }

    function updateBox(s, e, canvas) {
      if (!drawBoxRef.current) {
        const box = document.createElement('div')
        box.style.cssText = 'position:absolute;background:rgba(224,32,32,0.15);border:1.5px solid #e02020;pointer-events:none'
        canvas.appendChild(box)
        drawBoxRef.current = box
      }
      const left = Math.min(s.x, e.x)
      const top = Math.min(s.y, e.y)
      const width = Math.abs(s.x - e.x)
      const height = Math.abs(s.y - e.y)
      drawBoxRef.current.style.cssText = `position:absolute;background:rgba(224,32,32,0.15);border:1.5px solid #e02020;pointer-events:none;left:${left}px;top:${top}px;width:${width}px;height:${height}px`
    }

    map.on('mousedown', onMouseDown)
    map.on('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      map.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.flyTo({
      center: COUNTRY_CENTERS[country],
      zoom: COUNTRY_ZOOM[country],
      duration: 800,
    })
    if (drawBoxRef.current) {
      drawBoxRef.current.remove()
      drawBoxRef.current = null
    }
    onAreaSelect(null)
  }, [country])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: 320, borderRadius: 4, border: '1px solid #1a1a2e' }} />
      <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace', marginTop: 6 }}>
        Hold <kbd style={{ background: '#1a1a2e', padding: '1px 5px', borderRadius: 3, color: '#888' }}>Shift</kbd> + drag to draw a selection area
      </div>
    </div>
  )
}
