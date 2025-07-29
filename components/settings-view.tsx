"use client"
import { useState } from "react"
import { Bell, RefreshCwIcon as Refresh, Palette, Shield, Database, Zap } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface SettingsViewProps {
  autoRefresh: boolean
  onAutoRefreshChange: () => void
  lastUpdate: Date | null
}

export function SettingsView({ autoRefresh, onAutoRefreshChange, lastUpdate }: SettingsViewProps) {
  const [notifications, setNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState([30])
  const [currency, setCurrency] = useState("USD")
  const [theme, setTheme] = useState("system")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-muted-foreground">Personaliza tu experiencia en el dashboard</p>
      </div>

      {/* Configuración de Actualización */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Refresh className="h-5 w-5" />
            Actualización de Datos
          </CardTitle>
          <CardDescription>Configura cómo y cuándo se actualizan los datos del mercado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-refresh">Actualización Automática</Label>
              <p className="text-sm text-muted-foreground">Actualiza los datos automáticamente en tiempo real</p>
            </div>
            <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={onAutoRefreshChange} />
          </div>

          <div className="space-y-2">
            <Label>Intervalo de Actualización</Label>
            <Select
              value={refreshInterval[0].toString()}
              onValueChange={(value) => setRefreshInterval([Number.parseInt(value)])}
            >
              <SelectTrigger className={!autoRefresh ? "opacity-50" : ""}>
                <SelectValue placeholder="Selecciona intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 segundos</SelectItem>
                <SelectItem value="30">30 segundos</SelectItem>
                <SelectItem value="60">1 minuto</SelectItem>
                <SelectItem value="120">2 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {lastUpdate && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Última actualización: {lastUpdate.toLocaleTimeString()}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuración de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>Configura las alertas y notificaciones del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notificaciones del Sistema</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones sobre actualizaciones y errores</p>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="price-alerts">Alertas de Precio</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones cuando los precios cambien significativamente
              </p>
            </div>
            <Switch id="price-alerts" checked={priceAlerts} onCheckedChange={setPriceAlerts} />
          </div>

          {priceAlerts && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="btc-alert">Alerta Bitcoin (%)</Label>
                  <Input id="btc-alert" type="number" placeholder="5" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eth-alert">Alerta Ethereum (%)</Label>
                  <Input id="eth-alert" type="number" placeholder="5" className="w-full" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuración de Visualización */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Visualización
          </CardTitle>
          <CardDescription>Personaliza la apariencia y el formato de los datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda Base</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                  <SelectItem value="JPY">JPY - Yen Japonés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuración de API
          </CardTitle>
          <CardDescription>Configuración avanzada de conexión con CoinGecko API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Estado de la API</Label>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Conectado
                </Badge>
                <span className="text-sm text-muted-foreground">CoinGecko v3</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rate Limit</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">47/50 por minuto</Badge>
                <span className="text-sm text-muted-foreground">Disponible</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Endpoints Configurados</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Precios simples</span>
                <Badge variant="outline">Activo</Badge>
              </div>
              <div className="flex justify-between">
                <span>Datos históricos</span>
                <Badge variant="outline">Activo</Badge>
              </div>
              <div className="flex justify-between">
                <span>Top criptomonedas</span>
                <Badge variant="outline">Activo</Badge>
              </div>
              <div className="flex justify-between">
                <span>Datos globales</span>
                <Badge variant="outline">Activo</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad y Privacidad
          </CardTitle>
          <CardDescription>Configuración de seguridad y manejo de datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Caché Local</Label>
                <p className="text-sm text-muted-foreground">Almacenar datos temporalmente para mejor rendimiento</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Análisis de Uso</Label>
                <p className="text-sm text-muted-foreground">Ayudar a mejorar la aplicación con datos anónimos</p>
              </div>
              <Switch />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Button variant="outline" className="w-full bg-transparent">
              Limpiar Caché Local
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Exportar Configuración
            </Button>
            <Button variant="destructive" className="w-full">
              Restablecer Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
