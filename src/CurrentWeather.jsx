import { formatTemp } from '../logic.js'; // Importa la funcion para calcular Celsius o Fahrenheit

// Recibe por props el nombre, pais, temperatura, descripcion, unidad actual y funcion para cambiar unidad
export default function CurrentWeather({ name, country, tempCelsius, description, unit, onToggleUnit }) {
  // Valor derivado: calcula la temperatura segun la unidad (°C o °F) sin crear otro estado innecesario
  const displayedTemp = formatTemp(tempCelsius, unit);

  return (
    <div className="current-core">
      {/* Muestra el nombre de la ciudad y las siglas del pais */}
      <h2 className="city-name">{name}, {country}</h2>
      
      <div className="temp-wrapper">
        {/* Muestra el numero de temperatura ya convertido */}
        <span className="main-temperature">{displayedTemp}</span>
        {/* Muestra el simbolo C o F segun el estado actual */}
        <span className="temp-unit">°{unit}</span>
      </div>

      {/* Muestra la descripcion del cielo */}
      <p className="weather-desc">{description}</p>

      {/* Boton interactivo (Originalidad de la rubrica) para alternar entre Celsius y Fahrenheit */}
      <button type="button" className="unit-toggle-btn" onClick={onToggleUnit}>
        Cambiar a °{unit === "C" ? "F" : "C"}
      </button>
    </div>
  );
}