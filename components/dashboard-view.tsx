"use client"
import { useState, useRef } from "react"
import { Bitcoin, TrendingUp, TrendingDown, Globe, Activity, DollarSign, CreditCard } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PriceChart } from "@/components/price-chart"
import { VolumeChart } from "@/components/volume-chart"

interface DashboardViewProps {
  metrics: any[]
  chartData: any[]
  topCryptos: any[]
  globalData: any
  loading: boolean
  fetchChartData: (coinId: string, days: number) => void
  currentCoin: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatVolume(value: number) {
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

export function DashboardView({
  metrics,
  chartData,
  topCryptos,
  globalData,
  loading,
  fetchChartData,
  currentCoin,
}: DashboardViewProps) {
  const [activeTimeRange, setActiveTimeRange] = useState("7d")
  const chartRef = useRef<HTMLDivElement>(null)

  const handleTimeRangeChange = (range: string) => {
    setActiveTimeRange(range)
    const days = range === "24h" ? 1 : range === "7d" ? 7 : 30
    fetchChartData(currentCoin, days)
  }

  const handleCoinSelect = (coinId: string, coinName: string) => {
    const days = activeTimeRange === "24h" ? 1 : activeTimeRange === "7d" ? 7 : 30
    fetchChartData(coinId, days)

    // Scroll suave hacia el gráfico
    setTimeout(() => {
      chartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Combinar métricas con datos globales
  const allMetrics = [
    ...metrics.map((metric) => ({
      ...metric,
      icon:
        metric.title === "Bitcoin"
          ? Bitcoin
          : metric.title === "Ethereum"
            ? Activity
            : metric.title === "BNB"
              ? CreditCard
              : metric.title === "Solana"
                ? DollarSign
                : Activity,
    })),
    ...(globalData
      ? [
          {
            title: "Market Cap Total",
            value: formatVolume(globalData.totalMarketCap),
            change: `${globalData.marketCapChange24h > 0 ? "+" : ""}${globalData.marketCapChange24h.toFixed(1)}%`,
            changeType: globalData.marketCapChange24h > 0 ? "positive" : "negative",
            icon: Globe,
            volume: "Global",
          },
          {
            title: "Dominancia BTC",
            value: `${globalData.btcDominance.toFixed(1)}%`,
            change: "Dominancia",
            changeType: "positive",
            icon: Bitcoin,
            volume: "Market Share",
          },
        ]
      : []),
  ]

  // Encontrar el nombre de la moneda actual
  const currentCoinData = topCryptos.find((crypto) => crypto.id === currentCoin)
  const currentCoinName = currentCoinData?.name || currentCoin

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {allMetrics.map((metric, index) => (
          <Card
            key={index}
            className="transition-all hover:shadow-md hover:scale-[1.02] animate-in fade-in-50 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  variant={metric.changeType === "positive" ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {metric.changeType === "positive" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </Badge>
                <span className="text-muted-foreground">{metric.volume}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div ref={chartRef} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gráfico de Precios</CardTitle>
                <CardDescription>Precio histórico de {currentCoinName}</CardDescription>
              </div>
              <Tabs value={activeTimeRange} onValueChange={handleTimeRangeChange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="24h">24H</TabsTrigger>
                  <TabsTrigger value="7d">7D</TabsTrigger>
                  <TabsTrigger value="30d">30D</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <PriceChart
              data={chartData}
              title={`Precio de ${currentCoinName}`}
              height={300}
              coinName={currentCoinName}
            />
          </CardContent>
        </Card>

        {/* Volume Chart */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Volumen de Trading</CardTitle>
            <CardDescription>Volumen de {currentCoinName}</CardDescription>
          </CardHeader>
          <CardContent>
            <VolumeChart data={chartData} title="Volumen de Trading" height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Top Cryptocurrencies Table */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Top 20 Criptomonedas</CardTitle>
          <CardDescription>Clasificadas por capitalización de mercado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>24h %</TableHead>
                  <TableHead>Volumen</TableHead>
                  <TableHead>Cap. Mercado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCryptos.map((crypto) => (
                  <TableRow key={crypto.rank} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">{crypto.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {crypto.image ? (
                          <img
                            src={crypto.image || "/placeholder.svg"}
                            alt={crypto.name}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                            {crypto.symbol.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{formatCurrency(crypto.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={crypto.change24h >= 0 ? "default" : "destructive"}
                        className="flex w-fit items-center gap-1"
                      >
                        {crypto.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {crypto.change24h.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{formatVolume(crypto.volume)}</TableCell>
                    <TableCell className="font-mono">{formatVolume(crypto.marketCap)}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleCoinSelect(crypto.id, crypto.name)}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                      >
                        Ver gráfico
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
