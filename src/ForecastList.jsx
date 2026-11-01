import { formatTemp } from '../logic.js'; // Importa el conversor de grados

// Recibe el array de tarjetas de horas y la unidad de temperatura seleccionada
export default function ForecastList({ cards, unit }) {
  return (
    <section className="forecast-section">
      <h3 className="forecast-title">Previsión del día (Próximas 24h)</h3>
      <div className="forecast-grid">
        {/* Renderiza la lista usando slot.dt (timestamp unico) como key estable, nunca el index */}
        {cards.map((slot) => (
          <article key={slot.dt} className="forecast-card">
            <span className="forecast-time">{slot.hour}</span>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${slot.icon}.png`}
              alt={slot.description}
              title={`${slot.description} - Lluvia: ${slot.rainProbability}%`}
            />
            {/* Calcula la temperatura en C o F al vuelo */}
            <span className="forecast-temp">
              {formatTemp(slot.tempCelsius, unit)}°{unit}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}