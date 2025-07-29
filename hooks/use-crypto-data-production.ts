"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Bitcoin, Activity, DollarSign, CreditCard } from "lucide-react"
import { mockGlobalData, mockMetrics, mockTopCryptos, formatVolume, generateMockChartData } from "./mockData"

interface GlobalData {
  totalMarketCap: number
  totalVolume: number
  marketCapChange24h: number
  activeCryptocurrencies: number
  btcDominance: number
}

interface MetricsData {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  volume: string
  marketCap: string
  icon: any
}

interface ChartPoint {
  date: string
  price: number
  volume: number
}

interface CryptoData {
  rank: number
  name: string
  symbol: string
  price: number
  change24h: number
  volume: number
  marketCap: number
  image: string
}

export function useCryptoDataProduction(refreshInterval = 30000) {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null)
  const [metrics, setMetrics] = useState<MetricsData[]>([])
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [topCryptos, setTopCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false)
  const intervalRef = useRef<number | null>(null)

  const fetchFromAPI = async (endpoint: string, params = "") => {
    try {
      // Usar nuestro proxy API en lugar de llamar directamente a CoinGecko
      const response = await fetch(`/api/crypto?endpoint=${endpoint}&params=${encodeURIComponent(params)}`)

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
      setIsUsingMockData(false)
    } catch (err) {
      console.warn("Using mock global data due to API error:", err)
      setGlobalData(mockGlobalData)
      setIsUsingMockData(true)
    }
  }, [])

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await fetchFromAPI(
        "simple/price",
        "ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true",
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
          title: "Binance Coin",
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
      setIsUsingMockData(false)
    } catch (err) {
      console.warn("Using mock metrics due to API error:", err)
      setMetrics(mockMetrics)
      setIsUsingMockData(true)
    }
  }, [])

  const fetchChartData = useCallback(async (coinId = "bitcoin", days = 7) => {
    try {
      const data = await fetchFromAPI(`coins/${coinId}/market_chart`, `vs_currency=usd&days=${days}`)

      const chartPoints = data.prices.map(([timestamp, price]: [number, number], index: number) => ({
        date: new Date(timestamp).toISOString().split("T")[0],
        price: Math.round(price),
        volume: data.total_volumes[index] ? Math.round(data.total_volumes[index][1]) : 0,
      }))

      setChartData(chartPoints)
      setIsUsingMockData(false)
    } catch (err) {
      console.warn("Using mock chart data due to API error:", err)
      const mockData = generateMockChartData(days)
      setChartData(mockData)
      setIsUsingMockData(true)
    }
  }, [])

  const fetchTopCryptos = useCallback(async () => {
    try {
      const data = await fetchFromAPI(
        "coins/markets",
        "vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h",
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
      }))

      setTopCryptos(cryptosData)
      setIsUsingMockData(false)
    } catch (err) {
      console.warn("Using mock crypto data due to API error:", err)
      setTopCryptos(mockTopCryptos)
      setIsUsingMockData(true)
    }
  }, [])

  const refreshData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await fetchGlobalData()
      await fetchMetrics()
      await fetchChartData()
      await fetchTopCryptos()
    } catch (err) {
      setError("Failed to fetch data")
    } finally {
      setLoading(false)
      setLastUpdate(new Date())
    }
  }, [fetchGlobalData, fetchMetrics, fetchChartData, fetchTopCryptos])

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startAutoRefresh = useCallback(() => {
    stopAutoRefresh()
    intervalRef.current = setInterval(refreshData, refreshInterval)
  }, [refreshData, stopAutoRefresh])

  useEffect(() => {
    refreshData()
    startAutoRefresh()
    return stopAutoRefresh
  }, [refreshData, startAutoRefresh, stopAutoRefresh])

  return {
    metrics,
    chartData,
    topCryptos,
    globalData,
    loading,
    error,
    lastUpdate,
    isUsingMockData,
    refreshData,
    fetchChartData,
    stopAutoRefresh,
    startAutoRefresh,
  }
}
