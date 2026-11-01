# Estación Meteorológica U-TAD (React 19 + Vite)

SPA desarrollada con React 19 y Vite que consulta en tiempo real las condiciones meteorológicas y el pronóstico a 24 horas usando la API de OpenWeatherMap. Incluye caché local temporal, manejo de concurrencia de red y conversión dinámica de unidades.

## 📁 Arquitectura y modularización del proyecto

En lugar de concentrar toda la lógica y la interfaz en un único archivo monolítico, el código se ha dividido en módulos pequeños con responsabilidad única, organizados por capas de responsabilidad:

```text
src/
├── api.js
├── logic.js
├── main.jsx
├── App.jsx
├── style.css
├── hooks/
│   └── useWeather.js
└── components/
    ├── StatusFeedback.jsx
    ├── CurrentWeather.jsx
    ├── WeatherMetrics.jsx
    ├── CitySelector.jsx
    └── ForecastList.jsx
```

### 1. Separación de lógica pura (`api.js` y `logic.js`)

* **`api.js`**: Aísla la infraestructura de red. Contiene `fetchWeatherData`, que lanza en paralelo (`Promise.all`) las consultas de tiempo actual y forecast, controlando errores de red y admitiendo un `AbortSignal` para cancelaciones.

* **`logic.js`**: Funciones puras independientes del framework. Gestiona la transformación de datos con métodos inmutables de array (`filter`, `map`, `reduce` para calcular tarjetas horarias y probabilidad máxima de lluvia), la conversión matemática entre Celsius y Fahrenheit (`formatTemp`), y la capa de persistencia con caducidad de 10 minutos en `localStorage`.

### 2. Extracción del estado y ciclo de vida (`src/hooks/useWeather.js`)

* **Custom Hook `useWeather`**: Separa los efectos secundarios y las llamadas asíncronas de la capa visual. Gestiona internamente `rawData`, `loading` y `error`. Además, implementa la función de limpieza (`cleanup`) con `AbortController` para evitar *race conditions* si el usuario cambia de ciudad antes de que finalice la petición previa.

### 3. Componentes de UI desglosados (`src/components/`)

* **`App.jsx`**: Actúa como orquestador. Mantiene únicamente el estado esencial (`city` y `unit`) y calcula el pronóstico derivado al vuelo sin duplicar estados con `useState`.

* **`StatusFeedback.jsx`**: Maneja el renderizado condicional de los estados de carga y mensajes de error sin ensuciar la vista de datos.

* **`CurrentWeather.jsx`**: Muestra el bloque principal (ciudad, temperatura actual y descripción) e integra el interruptor interactivo de cambio de unidades (°C / °F).

* **`WeatherMetrics.jsx`**: Renderiza la cuadrícula de métricas complementarias (humedad, velocidad del viento en km/h y probabilidad máxima de lluvia obtenida vía `reduce`).

* **`CitySelector.jsx`**: Formulario controlado que aúna selección rápida vía desplegable `<select>` y búsqueda libre mediante `<input>`, notificando los cambios al componente padre (*lifting state up*).

* **`ForecastList.jsx`**: Pinta el scroll horizontal con las tarjetas de las próximas 24 horas, empleando la marca de tiempo `dt` como clave (`key`) única y estable en lugar del índice del array.

## 🤖 Uso de IA

* **Herramientas utilizadas:** Claude / Gemini.

* **Qué partes se hicieron con IA:**

  * Estructuración inicial y desglose de los componentes en base a los criterios de evaluación de React 19.

  * Generación del CSS con efecto *glassmorphism* y estilos responsivos.

  * Boilerplate del custom hook con `AbortController` para cumplir la rúbrica de limpieza en `useEffect`.

* **Qué se escribió / ajustó a mano:**

  * Estructuración de las subcarpetas (`components/` y `hooks/`) y corrección de las rutas relativas en los `import`.

  * Conexión y paso de props entre `App.jsx`, `CurrentWeather.jsx` y `CitySelector.jsx`.

  * Verificación de la API Key propia y control de errores específicos de OpenWeather (código 404 para ciudades inexistentes).

* **Prompts reales utilizados:**

  1. *"Pásame este componente monolítico a componentes pequeños cumpliendo la rúbrica de React 19: sin duplicar estados derivados, usando filter/map/reduce en un archivo de lógica y sacando la petición a un custom hook."*

  2. *"Genera el CSS completo para una estación meteorológica estilo tarjeta glassmorphism oscura con animaciones de carga y adaptable a móvil."*

* **Cómo se verificó lo generado:**

  * Inspección en DevTools de la pestaña *Network* para confirmar que al teclear rápido o cambiar de ciudad se abortan las peticiones en vuelo (`canceled`).

  * Comprobación en `Application > Local Storage` de la clave generada y su expiración a los 10 minutos.

  * Pruebas en el navegador de la alternancia de unidades (°C / °F) para verificar que la conversión matemática se realiza en tiempo real sin desincronizar los valores.

## 🔬 Autopsia

### 1. Conversión de unidades calculada al vuelo vs. Petición a la API con `units=imperial`

* **Decisión tomada:** Obtener siempre los datos de OpenWeather en formato métrico (`units=metric`) y calcular la conversión a Fahrenheit matemáticamente en el cliente (`formatTemp`) como un valor derivado en cada renderizado.

* **Alternativa descartada:** Volver a disparar una petición de red a la API con `units=imperial` cada vez que el usuario pulsa el botón de cambiar unidad.

* **Motivo:** Hacer una nueva llamada de red para una simple conversión de unidades añade latencia innecesaria, consume cuota de la API y obliga a gestionar estados de carga adicionales para una operación aritmética trivial que el navegador resuelve instantáneamente.

### 2. Modularización en subdirectorios (`components/`, `hooks/`) vs. Estructura plana en `src/`

* **Decisión tomada:** Separar los componentes visuales en `src/components/` y la lógica asíncrona en `src/hooks/`, dejando en la raíz de `src/` solo los puntos de entrada y utilidades generales.

* **Alternativa descartada:** Mantener todos los archivos `.jsx` y `.js` juntos en la raíz de `src/`.

* **Motivo:** Aunque una estructura plana requiere rutas de importación ligeramente más cortas, mezclar vistas, lógica de negocio y hooks en el mismo nivel degrada la legibilidad y escalabilidad del proyecto. Agrupar por responsabilidades permite aislar fácilmente los componentes reutilizables de la lógica de red y facilita futuras ampliaciones sin saturar el directorio raíz.

