# CryptoWatch Dashboard Pro

Un dashboard profesional para monitoreo de criptomonedas en tiempo real, construido con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Características

- **Datos en tiempo real** - Integración completa con CoinGecko API v3
- **Gráficos interactivos** - Visualización de precios y volúmenes
- **Modo oscuro/claro** - Tema adaptable
- **Responsive design** - Optimizado para todos los dispositivos
- **Análisis técnico** - Indicadores y métricas avanzadas
- **Reportes exportables** - Generación de reportes en JSON
- **Actualización automática** - Datos actualizados cada 30 segundos

## 📊 Secciones

1. **Dashboard** - Vista principal con métricas y gráficos
2. **Análisis** - Análisis técnico y de sentimiento del mercado
3. **Reportes** - Generación y descarga de reportes detallados
4. **Configuración** - Personalización del dashboard

## 🛠️ Instalación

### Desarrollo Local

\`\`\`bash
# Clonar el repositorio
git clone <tu-repositorio>
cd crypto-dashboard

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
\`\`\`

### Despliegue en Producción

#### Vercel (Recomendado)
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
\`\`\`

#### Netlify
\`\`\`bash
# Construir para producción
npm run build

# Subir la carpeta 'out' a Netlify
\`\`\`

## 🔧 Configuración

### Variables de Entorno (Opcional)

Crea un archivo `.env.local`:

\`\`\`env
# Opcional: CoinGecko Pro API Key para mayor rate limit
COINGECKO_API_KEY=tu_api_key_aqui
\`\`\`

### API Routes

El dashboard incluye rutas API proxy para evitar problemas de CORS:

- `/api/crypto` - Proxy para todas las llamadas a CoinGecko API

## 📱 Uso

1. **Dashboard Principal**: Visualiza métricas en tiempo real de las principales criptomonedas
2. **Cambiar rangos de tiempo**: Usa las pestañas 24H, 7D, 30D para diferentes períodos
3. **Análisis**: Explora indicadores técnicos y análisis de mercado
4. **Reportes**: Genera y descarga reportes personalizados
5. **Configuración**: Personaliza intervalos de actualización y preferencias

## 🎨 Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Iconos
- **CoinGecko API v3** - Datos de criptomonedas

## 📈 Características Técnicas

- **SSR/SSG** - Renderizado del lado del servidor
- **API Routes** - Endpoints serverless
- **Responsive Design** - Mobile-first approach
- **Error Handling** - Manejo robusto de errores
- **Performance** - Optimizado para velocidad
- **SEO** - Optimizado para motores de búsqueda

## 🔄 Actualizaciones

El dashboard se actualiza automáticamente cada 30 segundos con:
- Precios actuales
- Cambios porcentuales
- Volúmenes de trading
- Capitalización de mercado
- Datos globales del mercado

## 📞 Soporte

Para reportar bugs o solicitar características:
1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye pasos para reproducir el error

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

---

**Desarrollado con ❤️ para la comunidad crypto**
