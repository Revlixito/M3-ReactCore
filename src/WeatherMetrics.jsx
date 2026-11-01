// Recibe por props la humedad, la velocidad del viento en m/s y la probabilidad maxima de lluvia
export default function WeatherMetrics({ humidity, windSpeedMs, maxRainProbability }) {
  // Valor derivado: convierte el viento de m/s a km/h al vuelo durante el renderizado
  const windKmh = Math.round(windSpeedMs * 3.6);

  // Creamos un array con las 3 metricas para renderizarlas de forma limpia sin repetir HTML
  const metrics = [
    { id: "humidity", label: "Humedad", value: `${humidity}%` },
    { id: "wind", label: "Viento", value: `${windKmh} km/h` },
    { id: "rain", label: "Prob. Lluvia", value: `${maxRainProbability}%` },
  ];

  return (
    <div className="weather-metrics">
      {/* Recorre las 3 metricas usando su id como key estable */}
      {metrics.map((item) => (
        <article key={item.id} className="metric-item">
          <span className="metric-label">{item.label}</span>
          <span className="metric-value">{item.value}</span>
        </article>
      ))}
    </div>
  );
}