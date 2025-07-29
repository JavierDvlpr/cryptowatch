"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Bitcoin, Activity, DollarSign, CreditCard } from "lucide-react"

interface CryptoMetric {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: any
  volume: string
  marketCap?: string
}

interface ChartDataPoint {
  date: string
  price: number
  volume?: number
  timestamp: number
}

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

interface GlobalData {
  totalMarketCap: number
  totalVolume: number
  marketCapChange24h: number
  activeCryptocurrencies: number
  btcDominance: number
}

export function useCryptoData(refreshInterval = 30000) {
  const [metrics, setMetrics] = useState<CryptoMetric[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [topCryptos, setTopCryptos] = useState<TopCrypto[]>([])
  const [globalData, setGlobalData] = useState<GlobalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [currentCoin, setCurrentCoin] = useState("bitcoin")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  const fetchFromAPI = async (endpoint: string) => {
    try {
      // Intentar usar la API route primero (para producción)
      let response = await fetch(`/api/crypto?endpoint=${encodeURIComponent(endpoint)}`)

      if (!response.ok) {
        // Si falla, intentar llamada directa (para desarrollo)
        response = await fetch(`https://api.coingecko.com/api/v3/${endpoint}`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "CryptoWatch-Dashboard/1.0",
          },
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API fetch error:", error)
      throw error
    }
  }

  const fetchGlobalData = useCallback(async () => {
    try {
      const data = await fetchFromAPI("global")
      const global = data.data

      setGlobalData({
        totalMarketCap: global.total_market_cap.usd,
        totalVolume: global.total_volume.usd,
        marketCapChange24h: global.market_cap_change_percentage_24h_usd,
        activeCryptocurrencies: global.active_cryptocurrencies,
        btcDominance: global.market_cap_percentage.btc,
      })
    } catch (err) {
      console.error("Error fetching global data:", err)
    }
  }, [])

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await fetchFromAPI(
        "simple/price?ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true",
      )

      const metricsData = [
        {
          title: "Bitcoin",
          value: `$${data.bitcoin.usd.toLocaleString()}`,
          change: `${data.bitcoin.usd_24h_change > 0 ? "+" : ""}${data.bitcoin.usd_24h_change.toFixed(1)}%`,
          changeType: data.bitcoin.usd_24h_change > 0 ? ("positive" as const) : ("negative" as const),
          volume: formatVolume(data.bitcoin.usd_24h_vol),
          marketCap: formatVolume(data.bitcoin.usd_market_cap),
          icon: Bitcoin,
        },
        {
          title: "Ethereum",
          value: `$${data.ethereum.usd.toLocaleString()}`,
          change: `${data.ethereum.usd_24h_change > 0 ? "+" : ""}${data.ethereum.usd_24h_change.toFixed(1)}%`,
          changeType: data.ethereum.usd_24h_change > 0 ? ("positive" as const) : ("negative" as const),
          volume: formatVolume(data.ethereum.usd_24h_vol),
          marketCap: formatVolume(data.ethereum.usd_market_cap),
          icon: Activity,
        },
        {
          title: "BNB",
          value: `$${data.binancecoin.usd.toLocaleString()}`,
          change: `${data.binancecoin.usd_24h_change > 0 ? "+" : ""}${data.binancecoin.usd_24h_change.toFixed(1)}%`,
          changeType: data.binancecoin.usd_24h_change > 0 ? ("positive" as const) : ("negative" as const),
          volume: formatVolume(data.binancecoin.usd_24h_vol),
          marketCap: formatVolume(data.binancecoin.usd_market_cap),
          icon: CreditCard,
        },
        {
          title: "Solana",
          value: `$${data.solana.usd.toLocaleString()}`,
          change: `${data.solana.usd_24h_change > 0 ? "+" : ""}${data.solana.usd_24h_change.toFixed(1)}%`,
          changeType: data.solana.usd_24h_change > 0 ? ("positive" as const) : ("negative" as const),
          volume: formatVolume(data.solana.usd_24h_vol),
          marketCap: formatVolume(data.solana.usd_market_cap),
          icon: DollarSign,
        },
      ]

      setMetrics(metricsData)
    } catch (err) {
      console.error("Error fetching metrics:", err)
    }
  }, [])

  const fetchChartData = useCallback(async (coinId = "bitcoin", days = 7) => {
    try {
      setCurrentCoin(coinId)
      const data = await fetchFromAPI(`coins/${coinId}/market_chart?vs_currency=usd&days=${days}`)

      const chartPoints = data.prices.map(([timestamp, price]: [number, number], index: number) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: Number(price.toFixed(2)),
        volume: data.total_volumes[index] ? Math.round(data.total_volumes[index][1]) : 0,
        timestamp,
      }))

      setChartData(chartPoints)
      setError(null)
    } catch (err) {
      console.error("Error fetching chart data:", err)
      setError("Error al cargar datos del gráfico")
    }
  }, [])

  const fetchTopCryptos = useCallback(async () => {
    try {
      const data = await fetchFromAPI(
        "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h",
      )

      const cryptosData = data.map((coin: any, index: number) => ({
        rank: index + 1,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        volume: coin.total_volume,
        marketCap: coin.market_cap,
        image: coin.image,
        id: coin.id,
      }))

      setTopCryptos(cryptosData)
    } catch (err) {
      console.error("Error fetching top cryptos:", err)
    }
  }, [])

  const refreshData = useCallback(
    async (showNotification = false) => {
      if (showNotification) {
        console.log("Actualizando datos...")
      }

      setError(null)

      try {
        await Promise.all([fetchMetrics(), fetchChartData(currentCoin), fetchTopCryptos(), fetchGlobalData()])
        setLastUpdate(new Date())

        if (showNotification) {
          console.log("Datos actualizados correctamente")
        }
      } catch (err) {
        console.error("Error refreshing data:", err)
        if (showNotification) {
          console.log("Error al actualizar datos")
        }
      }

      setLoading(false)
    },
    [fetchMetrics, fetchChartData, fetchTopCryptos, fetchGlobalData, currentCoin],
  )

  useEffect(() => {
    refreshData()

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        refreshData()
      }, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshData, refreshInterval])

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startAutoRefresh = useCallback(() => {
    if (!intervalRef.current && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        refreshData()
      }, refreshInterval)
    }
  }, [refreshData, refreshInterval])

  return {
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
  }
}
