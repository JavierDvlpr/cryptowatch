"use client"
import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

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

interface MarketCapChartProps {
  data: TopCrypto[]
  height?: number
}

const COLORS = [
  "#f7931a", // Bitcoin Orange
  "#627eea", // Ethereum Blue
  "#f3ba2f", // BNB Yellow
  "#9945ff", // Solana Purple
  "#23292f", // XRP Black
  "#2775ca", // USDC Blue
  "#0033ad", // Cardano Blue
  "#c2a633", // Dogecoin Gold
  "#e84142", // Avalanche Red
  "#375bd2", // Chainlink Blue
]

export function MarketCapChart({ data, height = 400 }: MarketCapChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    // Tomar top 10 y calcular "Others"
    const top9 = data.slice(0, 9)
    const others = data.slice(9)
    const othersMarketCap = others.reduce((sum, crypto) => sum + crypto.marketCap, 0)

    const processedData = top9.map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol,
      value: crypto.marketCap,
      percentage: ((crypto.marketCap / data.reduce((sum, c) => sum + c.marketCap, 0)) * 100).toFixed(1),
    }))

    if (othersMarketCap > 0) {
      processedData.push({
        name: "Others",
        symbol: "OTHER",
        value: othersMarketCap,
        percentage: ((othersMarketCap / data.reduce((sum, c) => sum + c.marketCap, 0)) * 100).toFixed(1),
      })
    }

    return processedData
  }, [data])

  const formatValue = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`
    }
    return `$${value.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.symbol}</p>
          <p className="text-lg font-bold">{formatValue(data.value)}</p>
          <p className="text-sm text-muted-foreground">{data.percentage}% del mercado</p>
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="w-full bg-muted/20 rounded-lg flex items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
