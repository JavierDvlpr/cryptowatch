"use client"
import { useMemo, useState, useRef } from "react"
import type React from "react"

import { TrendingUp, TrendingDown } from "lucide-react"

interface ChartDataPoint {
  date: string
  price: number
  volume?: number
  timestamp: number
}

interface PriceChartProps {
  data: ChartDataPoint[]
  title?: string
  height?: number
  coinName?: string
}

export function PriceChart({ data, title = "Price Chart", height = 300, coinName = "" }: PriceChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const chartStats = useMemo(() => {
    if (!data.length) return null

    const prices = data.map((d) => d.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const change = ((lastPrice - firstPrice) / firstPrice) * 100

    return {
      minPrice,
      maxPrice,
      firstPrice,
      lastPrice,
      change,
      isPositive: change >= 0,
    }
  }, [data])

  const pathData = useMemo(() => {
    if (!data.length || !chartStats) return ""

    const { minPrice, maxPrice } = chartStats
    const priceRange = maxPrice - minPrice || 1
    const width = 100
    const chartHeight = 80

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width
      const y = chartHeight - ((point.price - minPrice) / priceRange) * chartHeight
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }, [data, chartStats])

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !data.length || !chartStats) return

    const rect = svgRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Calcular el punto más cercano
    const relativeX = (x / rect.width) * 100
    const dataIndex = Math.round((relativeX / 100) * (data.length - 1))
    const clampedIndex = Math.max(0, Math.min(dataIndex, data.length - 1))

    setHoveredPoint(data[clampedIndex])
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  if (!data.length || !chartStats) {
    return (
      <div className="w-full bg-muted/20 rounded-lg flex items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {chartStats.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${chartStats.isPositive ? "text-green-600" : "text-red-600"}`}>
            {chartStats.change > 0 ? "+" : ""}
            {chartStats.change.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="overflow-visible cursor-crosshair"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.1" />
            </pattern>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={chartStats.isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={chartStats.isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#grid)" />

          {/* Area under curve */}
          <path
            d={`${pathData} L 100,100 L 0,100 Z`}
            fill="url(#priceGradient)"
            className="transition-all duration-300"
          />

          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke={chartStats.isPositive ? "#10b981" : "#ef4444"}
            strokeWidth="0.5"
            className="transition-all duration-300"
          />

          {/* Hover indicator */}
          {hoveredPoint && (
            <>
              {/* Vertical line */}
              <line
                x1={(data.indexOf(hoveredPoint) / (data.length - 1)) * 100}
                y1="0"
                x2={(data.indexOf(hoveredPoint) / (data.length - 1)) * 100}
                y2="100"
                stroke="currentColor"
                strokeWidth="0.2"
                opacity="0.5"
                strokeDasharray="2,2"
              />
              {/* Hover point */}
              <circle
                cx={(data.indexOf(hoveredPoint) / (data.length - 1)) * 100}
                cy={
                  100 - ((hoveredPoint.price - chartStats.minPrice) / (chartStats.maxPrice - chartStats.minPrice)) * 100
                }
                r="1"
                fill={chartStats.isPositive ? "#10b981" : "#ef4444"}
                stroke="white"
                strokeWidth="0.3"
              />
            </>
          )}
        </svg>

        {/* Price labels */}
        <div className="absolute top-0 right-0 text-xs text-muted-foreground">
          ${chartStats.maxPrice.toLocaleString()}
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">
          ${chartStats.minPrice.toLocaleString()}
        </div>
        <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">{data[0]?.date}</div>
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 text-xs text-muted-foreground">
          {data[data.length - 1]?.date}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="fixed z-50 bg-background border border-border rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="text-sm font-medium">{coinName || "Precio"}</div>
          <div className="text-lg font-bold">${hoveredPoint.price.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{hoveredPoint.date}</div>
          {hoveredPoint.volume && (
            <div className="text-xs text-muted-foreground">Volumen: ${(hoveredPoint.volume / 1e9).toFixed(2)}B</div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p className="text-muted-foreground">Precio Actual</p>
          <p className="font-semibold">${chartStats.lastPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Cambio</p>
          <p className={`font-semibold ${chartStats.isPositive ? "text-green-600" : "text-red-600"}`}>
            {chartStats.change > 0 ? "+" : ""}
            {chartStats.change.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}
