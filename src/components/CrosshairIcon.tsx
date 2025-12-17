type CrosshairIconProps = {
  size?: number
  color?: string
  strokeWidth?: number
}

export function CrosshairIcon({ 
  size = 40, 
  color = '#333', 
  strokeWidth = 2 
}: CrosshairIconProps) {
  const center = size / 2
  const padding = size * 0.125

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <line x1={center} y1={padding} x2={center} y2={size - padding} stroke={color} strokeWidth={strokeWidth} />
        <line x1={padding} y1={center} x2={size - padding} y2={center} stroke={color} strokeWidth={strokeWidth} />
      </svg>
    </div>
  )
}