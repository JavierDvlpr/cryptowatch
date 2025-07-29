"use client"
import { useState } from "react"
import { Download, FileText, TrendingUp, Calendar, DollarSign } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ReportsViewProps {
  topCryptos: any[]
  globalData: any
}

export function ReportsView({ topCryptos, globalData }: ReportsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("daily")

  const generateReport = (type: string) => {
    // Simular generación de reporte
    const reportData = {
      date: new Date().toLocaleDateString(),
      type,
      cryptos: topCryptos.slice(0, 10),
      summary: {
        totalMarketCap: globalData?.totalMarketCap || 0,
        avgChange: topCryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / topCryptos.length,
        topPerformer: topCryptos.sort((a, b) => b.change24h - a.change24h)[0],
        worstPerformer: topCryptos.sort((a, b) => a.change24h - b.change24h)[0],
      },
    }

    // En una aplicación real, aquí generarías un PDF o CSV
    console.log("Generando reporte:", reportData)

    // Simular descarga
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `crypto-report-${type}-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reportes</h2>
          <p className="text-muted-foreground">Genera y descarga reportes detallados del mercado</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => generateReport("summary")} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Resumen Ejecutivo
          </Button>
          <Button variant="outline" onClick={() => generateReport("detailed")} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reporte Detallado
          </Button>
        </div>
      </div>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <TabsList>
          <TabsTrigger value="daily">Diario</TabsTrigger>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensual</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          {/* Resumen del día */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Cap Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalData ? formatVolume(globalData.totalMarketCap) : "N/A"}</div>
                <p className="text-xs text-muted-foreground">
                  {globalData && globalData.marketCapChange24h > 0 ? "+" : ""}
                  {globalData?.marketCapChange24h.toFixed(2)}% vs ayer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volumen 24h</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalData ? formatVolume(globalData.totalVolume) : "N/A"}</div>
                <p className="text-xs text-muted-foreground">Actividad de trading</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dominancia BTC</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalData ? `${globalData.btcDominance.toFixed(1)}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Participación de Bitcoin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Criptos Activas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalData ? globalData.activeCryptocurrencies.toLocaleString() : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Monedas listadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Diaria - Top 20</CardTitle>
              <CardDescription>Rendimiento de las principales criptomonedas en las últimas 24 horas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Criptomoneda</TableHead>
                    <TableHead>Precio Actual</TableHead>
                    <TableHead>Cambio 24h</TableHead>
                    <TableHead>Volumen</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCryptos.slice(0, 20).map((crypto) => (
                    <TableRow key={crypto.rank}>
                      <TableCell className="font-medium">#{crypto.rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {crypto.image && (
                            <img
                              src={crypto.image || "/placeholder.svg"}
                              alt={crypto.name}
                              className="h-6 w-6 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{formatCurrency(crypto.price)}</TableCell>
                      <TableCell>
                        <Badge variant={crypto.change24h >= 0 ? "default" : "destructive"}>
                          {crypto.change24h >= 0 ? "+" : ""}
                          {crypto.change24h.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{formatVolume(crypto.volume)}</TableCell>
                      <TableCell className="font-mono">{formatVolume(crypto.marketCap)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {crypto.change24h > 5
                            ? "Fuerte Alza"
                            : crypto.change24h > 0
                              ? "Alza"
                              : crypto.change24h > -5
                                ? "Baja"
                                : "Fuerte Baja"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Análisis de tendencias */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Tendencias</CardTitle>
              <CardDescription>Insights y patrones identificados en el mercado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Tendencias Alcistas</h4>
                  <div className="space-y-2">
                    {topCryptos
                      .filter((crypto) => crypto.change24h > 0)
                      .slice(0, 5)
                      .map((crypto) => (
                        <div
                          key={crypto.rank}
                          className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded"
                        >
                          <span className="text-sm font-medium">{crypto.name}</span>
                          <Badge variant="default">+{crypto.change24h.toFixed(2)}%</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Tendencias Bajistas</h4>
                  <div className="space-y-2">
                    {topCryptos
                      .filter((crypto) => crypto.change24h < 0)
                      .slice(0, 5)
                      .map((crypto) => (
                        <div
                          key={crypto.rank}
                          className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded"
                        >
                          <span className="text-sm font-medium">{crypto.name}</span>
                          <Badge variant="destructive">{crypto.change24h.toFixed(2)}%</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Resumen del Análisis</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    • {topCryptos.filter((crypto) => crypto.change24h > 0).length} criptomonedas en territorio positivo
                  </p>
                  <p>
                    • {topCryptos.filter((crypto) => crypto.change24h < 0).length} criptomonedas en territorio negativo
                  </p>
                  <p>
                    • Volatilidad promedio del mercado:{" "}
                    {Math.abs(
                      topCryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / topCryptos.length,
                    ).toFixed(2)}
                    %
                  </p>
                  <p>
                    • Recomendación:{" "}
                    {topCryptos.filter((crypto) => crypto.change24h > 0).length >
                    topCryptos.filter((crypto) => crypto.change24h < 0).length
                      ? "Mantener posiciones alcistas"
                      : "Precaución en el mercado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte Semanal</CardTitle>
              <CardDescription>Análisis de tendencias de los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Reporte Semanal</h3>
                <p className="text-muted-foreground mb-4">
                  El reporte semanal incluye análisis de tendencias, patrones de volumen y correlaciones del mercado.
                </p>
                <Button onClick={() => generateReport("weekly")}>
                  <Download className="h-4 w-4 mr-2" />
                  Generar Reporte Semanal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte Mensual</CardTitle>
              <CardDescription>Análisis completo del rendimiento mensual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Reporte Mensual</h3>
                <p className="text-muted-foreground mb-4">
                  Reporte completo con análisis técnico, fundamental y de sentimiento del mercado.
                </p>
                <Button onClick={() => generateReport("monthly")}>
                  <Download className="h-4 w-4 mr-2" />
                  Generar Reporte Mensual
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
