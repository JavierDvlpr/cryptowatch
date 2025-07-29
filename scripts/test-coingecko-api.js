// Script para probar la conexión con CoinGecko API v3

async function testCoinGeckoAPI() {
  console.log("🚀 Probando conexión con CoinGecko API v3...\n")

  try {
    // Test 1: Obtener precios básicos
    console.log("📊 Test 1: Precios básicos de Bitcoin y Ethereum")
    const pricesResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true",
    )
    const pricesData = await pricesResponse.json()
    console.log("✅ Precios obtenidos:", JSON.stringify(pricesData, null, 2))

    // Test 2: Obtener datos históricos
    console.log("\n📈 Test 2: Datos históricos de Bitcoin (7 días)")
    const chartResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7",
    )
    const chartData = await chartResponse.json()
    console.log(`✅ Datos históricos obtenidos: ${chartData.prices.length} puntos de precio`)

    // Test 3: Top 10 criptomonedas
    console.log("\n🏆 Test 3: Top 10 criptomonedas por capitalización")
    const topResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1",
    )
    const topData = await topResponse.json()
    console.log("✅ Top 10 obtenido:")
    topData.forEach((coin, index) => {
      console.log(`${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) - $${coin.current_price}`)
    })

    // Test 4: Información global del mercado
    console.log("\n🌍 Test 4: Información global del mercado")
    const globalResponse = await fetch("https://api.coingecko.com/api/v3/global")
    const globalData = await globalResponse.json()
    console.log("✅ Datos globales obtenidos:")
    console.log(`- Criptomonedas activas: ${globalData.data.active_cryptocurrencies}`)
    console.log(`- Capitalización total: $${(globalData.data.total_market_cap.usd / 1e12).toFixed(2)}T`)
    console.log(`- Dominancia de Bitcoin: ${globalData.data.market_cap_percentage.btc.toFixed(1)}%`)

    console.log("\n🎉 ¡Todas las pruebas de API completadas exitosamente!")
  } catch (error) {
    console.error("❌ Error al conectar con CoinGecko API:", error.message)

    if (error.message.includes("fetch")) {
      console.log("\n💡 Sugerencias:")
      console.log("- Verifica tu conexión a internet")
      console.log("- Asegúrate de que no hay restricciones de CORS")
      console.log("- La API de CoinGecko puede tener límites de rate limiting")
    }
  }
}

// Ejecutar las pruebas
testCoinGeckoAPI()
