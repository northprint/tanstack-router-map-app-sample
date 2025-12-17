import { useEffect, useState } from 'react'

type CoordinateOverlayProps = {
  lat: number
  lng: number
}

function useRandomizeDigits(value: number, decimals: number = 6) {
  const targetStr = value.toFixed(decimals)
  const [displayStr, setDisplayStr] = useState(targetStr)

  useEffect(() => {
    const chars = targetStr.split('')
    let settled = new Array(chars.length).fill(false)
    
    const animate = (frame: number) => {
      if (frame > 15) {
        setDisplayStr(targetStr)
        return
      }

      // 各桁をランダムに、徐々に確定させる
      const newChars = chars.map((char, i) => {
        if (char === '.' || char === '-' || settled[i]) {
          return char
        }
        // フレームが進むほど確定しやすくなる
        if (Math.random() < frame / 20) {
          settled[i] = true
          return char
        }
        return Math.floor(Math.random() * 10).toString()
      })

      setDisplayStr(newChars.join(''))
      setTimeout(() => animate(frame + 1), 40)
    }

    settled = new Array(chars.length).fill(false)
    animate(0)
  }, [value, decimals, targetStr])

  return displayStr
}

export function CoordinateOverlay({ lat, lng }: CoordinateOverlayProps) {
  const displayLat = useRandomizeDigits(lat)
  const displayLng = useRandomizeDigits(lng)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        pointerEvents: 'none',
        zIndex: 1000,
        fontFamily: 'monospace',
        fontSize: '128px',
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.3)',
        lineHeight: 1.2,
        userSelect: 'none',
      }}
    >
      <div>{displayLat}°</div>
      <div>{displayLng}°</div>
    </div>
  )
}