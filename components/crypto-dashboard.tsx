"use client"
import { useState } from "react"
import { BarChart3, Bitcoin, FileText, Home, Moon, Settings, Sun, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

import { DashboardView } from "@/components/dashboard-view"
import { AnalysisView } from "@/components/analysis-view"
import { ReportsView } from "@/components/reports-view"
import { SettingsView } from "@/components/settings-view"
import { useCryptoData } from "@/hooks/use-crypto-data"

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: Home },
  { id: "analysis", name: "Análisis", icon: BarChart3 },
  { id: "reports", name: "Reportes", icon: FileText },
  { id: "settings", name: "Ajustes", icon: Settings },
]

export function CryptoDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const { theme, setTheme } = useTheme()

  const {
    metrics,
    chartData,
    topCryptos,
    globalData,
    loading,
    error,
    lastUpdate,
    currentCoin,
    refreshData,
    fetchChartData,
    stopAutoRefresh,
    startAutoRefresh,
  } = useCryptoData(autoRefresh ? 30000 : 0)

  const handleRefreshToggle = () => {
    if (autoRefresh) {
      stopAutoRefresh()
      setAutoRefresh(false)
    } else {
      startAutoRefresh()
      setAutoRefresh(true)
    }
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            metrics={metrics}
            chartData={chartData}
            topCryptos={topCryptos}
            globalData={globalData}
            loading={loading}
            fetchChartData={fetchChartData}
            currentCoin={currentCoin}
          />
        )
      case "analysis":
        return <AnalysisView topCryptos={topCryptos} />
      case "reports":
        return <ReportsView topCryptos={topCryptos} globalData={globalData} />
      case "settings":
        return (
          <SettingsView autoRefresh={autoRefresh} onAutoRefreshChange={handleRefreshToggle} lastUpdate={lastUpdate} />
        )
      default:
        return (
          <DashboardView
            metrics={metrics}
            chartData={chartData}
            topCryptos={topCryptos}
            globalData={globalData}
            loading={loading}
            fetchChartData={fetchChartData}
            currentCoin={currentCoin}
          />
        )
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-8 w-8 text-orange-500 dark:text-orange-400" />
              <div>
                <h1 className="text-xl font-bold">CryptoWatch</h1>
                <p className="text-sm text-muted-foreground">Dashboard Pro</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navegación</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeView === item.id}
                        className="transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <button onClick={() => setActiveView(item.id)} className="flex w-full items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold capitalize">{activeView}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Monitorea el mercado de criptomonedas en tiempo real</span>
                  {lastUpdate && (
                    <>
                      <span>•</span>
                      <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={autoRefresh ? "default" : "secondary"} className="flex items-center gap-1">
                  {autoRefresh ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {autoRefresh ? "En vivo" : "Pausado"}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => refreshData(true)}
                  className="transition-colors hover:bg-accent"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Actualizar datos</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="transition-colors hover:bg-accent"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Error:</strong> {error}. Reintentando automáticamente...
                </p>
              </div>
            )}
            {renderView()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
