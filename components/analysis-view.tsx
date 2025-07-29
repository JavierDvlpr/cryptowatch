"use client"
import { useState, useMemo } from "react"
import { TrendingUp, TrendingDown, Activity, Target, Zap } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketCapChart } from "@/components/market-cap-chart"
import { CorrelationChart } from "@/components/correlation-chart"

interface AnalysisViewProps {
  topCryptos: any[]
}

export function AnalysisView({ topCryptos }: AnalysisViewProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState("market")

  // Análisis de mercado
  const marketAnalysis = useMemo(() => {
    if (!topCryptos.length) return null

    const totalMarketCap = topCryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0)
    const gainers = topCryptos.filter((crypto) => crypto.change24h > 0)
    const losers = topCryptos.filter((crypto) => crypto.change24h < 0)
    const avgChange = topCryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / topCryptos.length

    return {
      totalMarketCap,
      gainers: gainers.length,
      losers: losers.length,
      avgChange,
      topGainer: gainers.sort((a, b) => b.change24h - a.change24h)[0],
      topLoser: losers.sort((a, b) => a.change24h - b.change24h)[0],
    }
  }, [topCryptos])

  if (!marketAnalysis) {
    return <div>Cargando análisis...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market">Mercado</TabsTrigger>
          <TabsTrigger value="technical">Técnico</TabsTrigger>
          <TabsTrigger value="sentiment">Sentimiento</TabsTrigger>
          <TabsTrigger value="correlation">Correlación</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          {/* Resumen del mercado */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cambio Promedio</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketAnalysis.avgChange > 0 ? "+" : ""}
                  {marketAnalysis.avgChange.toFixed(2)}%
                </div>
                <Badge variant={marketAnalysis.avgChange > 0 ? "default" : "destructive"}>
                  {marketAnalysis.avgChange > 0 ? "Alcista" : "Bajista"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganadores</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{marketAnalysis.gainers}</div>
                <p className="text-xs text-muted-foreground">
                  {((marketAnalysis.gainers / topCryptos.length) * 100).toFixed(1)}% del mercado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Perdedores</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{marketAnalysis.losers}</div>
                <p className="text-xs text-muted-foreground">
                  {((marketAnalysis.losers / topCryptos.length) * 100).toFixed(1)}% del mercado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sentimiento</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketAnalysis.gainers > marketAnalysis.losers ? "Optimista" : "Pesimista"}
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(marketAnalysis.gainers / topCryptos.length) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Cap Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Market Cap</CardTitle>
              <CardDescription>Top 10 criptomonedas por capitalización</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketCapChart data={topCryptos} height={400} />
            </CardContent>
          </Card>

          {/* Mejores y Peores Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Mejores y Peores Performers</CardTitle>
              <CardDescription>Cambios más significativos en 24h</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketAnalysis.topGainer && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Mejor Performer</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{marketAnalysis.topGainer.name}</p>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    +{marketAnalysis.topGainer.change24h.toFixed(2)}%
                  </Badge>
                </div>
              )}

              {marketAnalysis.topLoser && (
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Peor Performer</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{marketAnalysis.topLoser.name}</p>
                  </div>
                  <Badge variant="destructive">{marketAnalysis.topLoser.change24h.toFixed(2)}%</Badge>
                </div>
              )}

              <div className="pt-4">
                <h4 className="font-medium mb-2">Análisis de Tendencias</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• El mercado muestra una tendencia {marketAnalysis.avgChange > 0 ? "alcista" : "bajista"}</p>
                  <p>
                    • {marketAnalysis.gainers} monedas en verde vs {marketAnalysis.losers} en rojo
                  </p>
                  <p>• Volatilidad promedio del mercado: {Math.abs(marketAnalysis.avgChange).toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Técnico</CardTitle>
              <CardDescription>Indicadores técnicos y señales de trading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {topCryptos.slice(0, 6).map((crypto, index) => {
                  const rsi = 30 + (crypto.change24h + 10) * 4 // RSI simulado
                  const signal = rsi > 70 ? "Sobrecomprado" : rsi < 30 ? "Sobrevendido" : "Neutral"
                  const signalColor = rsi > 70 ? "destructive" : rsi < 30 ? "default" : "secondary"

                  return (
                    <Card key={crypto.rank}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{crypto.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>RSI (14)</span>
                            <span className="font-mono">{rsi.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${rsi}%` }}
                            />
                          </div>
                          <Badge variant={signalColor} className="text-xs">
                            {signal}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Sentimiento</CardTitle>
              <CardDescription>Indicadores de sentimiento del mercado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Índice de Miedo y Codicia</span>
                      <span className="text-sm font-mono">65/100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: "65%" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Codicia (Bullish)</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Volumen de Trading</span>
                      <span className="text-sm font-mono">Alto</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: "78%" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Actividad institucional alta</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Volatilidad</span>
                      <span className="text-sm font-mono">Media</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: "45%" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Mercado relativamente estable</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Señales del Mercado</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Flujo de capital institucional positivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Tendencia alcista a corto plazo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Volatilidad dentro de rangos normales</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Correlación</CardTitle>
              <CardDescription>Relación entre volatilidad y volumen de trading</CardDescription>
            </CardHeader>
            <CardContent>
              <CorrelationChart data={topCryptos} height={400} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
