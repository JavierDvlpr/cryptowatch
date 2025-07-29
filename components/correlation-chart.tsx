"use client"
import { useMemo } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopCrypto {
  rank: number
  name: string
  symbol: string
  price: number
  change24h: number
  volume: number
  marketCap: number
  image?: string
  id: string
}

interface CorrelationChartProps {
  data: TopCrypto[]
  height?: number
}

export function CorrelationChart({ data, height = 400 }: CorrelationChartProps) {
  const scatterData = useMemo(() => {
    if (!data.length) return []

    return data.map((crypto) => ({
      x: Math.abs(crypto.change24h), // Volatilidad (valor absoluto del cambio)
      y: crypto.volume / 1e9, // Volumen en billones
      name: crypto.name,
      symbol: crypto.symbol,
      marketCap: crypto.marketCap,
      change24h: crypto.change24h,
    }))
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.symbol}</p>
          <p className="text-sm">Volatilidad: {data.x.toFixed(2)}%</p>
          <p className="text-sm">Volumen: ${data.y.toFixed(2)}B</p>
          <p className="text-sm">
            Cambio 24h: {data.change24h > 0 ? "+" : ""}
            {data.change24h.toFixed(2)}%
          </p>
        </div>
      )
    }
    return null
  }

  if (!scatterData.length) {
    return (
      <div className="w-full bg-muted/20 rounded-lg flex items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            type="number"
            dataKey="x"
            name="Volatilidad"
            unit="%"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Volumen"
            unit="B"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) => `$${value.toFixed(1)}B`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Criptomonedas" data={scatterData} fill="#3b82f6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
