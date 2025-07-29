"use client"
import { useMemo } from "react"
import { Activity } from "lucide-react"

interface ChartDataPoint {
  date: string
  price: number
  volume?: number
}

interface VolumeChartProps {
  data: ChartDataPoint[]
  title?: string
  height?: number
}

export function VolumeChart({ data, title = "Volume Chart", height = 300 }: VolumeChartProps) {
  const volumeStats = useMemo(() => {
    if (!data.length) return null

    const volumes = data.map((d) => d.volume || 0)
    const maxVolume = Math.max(...volumes)
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length

    return {
      maxVolume,
      avgVolume,
      volumes,
    }
  }, [data])

  const formatVolume = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`
    } else {
      return `$${(value / 1e3).toFixed(1)}K`
    }
  }

  if (!data.length || !volumeStats) {
    return (
      <div className="w-full bg-muted/20 rounded-lg flex items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-muted-foreground">No hay datos de volumen disponibles</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-600">Promedio: {formatVolume(volumeStats.avgVolume)}</span>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="volumeGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#volumeGrid)" />

          {/* Volume bars */}
          {data.map((point, index) => {
            const x = (index / data.length) * 100
            const barWidth = (100 / data.length) * 0.8
            const volume = point.volume || 0
            const barHeight = (volume / volumeStats.maxVolume) * 100

            return (
              <rect
                key={index}
                x={x}
                y={100 - barHeight}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
                opacity="0.7"
                className="hover:opacity-100 transition-opacity"
              />
            )
          })}

          {/* Average line */}
          <line
            x1="0"
            y1={100 - (volumeStats.avgVolume / volumeStats.maxVolume) * 100}
            x2="100"
            y2={100 - (volumeStats.avgVolume / volumeStats.maxVolume) * 100}
            stroke="#10b981"
            strokeWidth="0.3"
            strokeDasharray="2,2"
            opacity="0.8"
          />
        </svg>

        {/* Volume labels */}
        <div className="absolute top-0 right-0 text-xs text-muted-foreground">
          {formatVolume(volumeStats.maxVolume)}
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">$0</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p className="text-muted-foreground">Volumen Máximo</p>
          <p className="font-semibold">{formatVolume(volumeStats.maxVolume)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Volumen Promedio</p>
          <p className="font-semibold text-blue-600">{formatVolume(volumeStats.avgVolume)}</p>
        </div>
      </div>
    </div>
  )
}
