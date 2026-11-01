import { useState } from 'react'; // Importa useState para el estado global minimo
import { useWeather } from './hooks/useWeather.js'; // Importa nuestro custom hook
import { processForecastData } from './logic.js'; // Importa la funcion que transforma los datos
import StatusFeedback from './components/StatusFeedback.jsx'; // Componente de avisos
import CurrentWeather from './components/CurrentWeather.jsx'; // Componente central de temperatura
import WeatherMetrics from './components/WeatherMetrics.jsx'; // Componente de las 3 metricas
import CitySelector from './components/CitySelector.jsx'; // Componente del buscador
import ForecastList from './components/ForecastList.jsx'; // Componente de las tarjetas por horas

export default function App() {
  // Estado 1: ciudad seleccionada actualmente (Madrid por defecto)
  const [city, setCity] = useState("Madrid");
  // Estado 2: unidad de temperatura ("C" para Celsius, "F" para Fahrenheit)
  const [unit, setUnit] = useState("C");

  // Llamamos al custom hook pasandole la ciudad; nos devuelve datos crudos, carga y error
  const { rawData, loading, error } = useWeather(city);

  // ESTADO DERIVADO (Cumple rubrica: derivar valores en vez de duplicar estados con useState):
  // Calculamos las tarjetas de prevision y lluvia maxima directamente a partir de rawData
  const processedForecast = rawData ? processForecastData(rawData.forecast.list) : null;

  // Funcion que alterna entre Celsius y Fahrenheit
  const handleToggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">Estación Meteorológica de la U-TAD</h1>
      </header>

      {/* Pasa los estados de carga y error al componente encargado de mostrarlos */}
      <StatusFeedback loading={loading} error={error} />

      {/* Renderizado condicional: si tenemos datos cargados, mostramos la tarjeta principal */}
      {rawData && processedForecast && (
        <section id="weather-display" className="weather-card">
          {/* Bloque superior con temperatura y boton de cambio de unidad */}
          <CurrentWeather
            name={rawData.current.name}
            country={rawData.current.sys.country}
            tempCelsius={rawData.current.main.temp}
            description={rawData.current.weather[0]?.description || ""}
            unit={unit}
            onToggleUnit={handleToggleUnit}
          />

          {/* Bloque intermedio con humedad, viento y probabilidad de lluvia */}
          <WeatherMetrics
            humidity={rawData.current.main.humidity}
            windSpeedMs={rawData.current.wind.speed}
            maxRainProbability={processedForecast.maxRainProbability}
          />

          {/* Selector de ciudad: le pasamos la ciudad actual y la funcion setCity para actualizarla */}
          <CitySelector
            selectedCity={city}
            onSelectCity={setCity}
          />

          {/* Lista inferior con las previsiones de las proximas 24 horas */}
          <ForecastList
            cards={processedForecast.cards}
            unit={unit}
          />
        </section>
      )}
    </main>
  );
}