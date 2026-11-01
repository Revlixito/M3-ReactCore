const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutos en milisegundos

// Funcion que convierte grados Celsius a Fahrenheit si el usuario cambia el interruptor
export function formatTemp(celsius, unit) {
  if (unit === "F") {
    return Math.round((celsius * 9) / 5 + 32); // Formula para pasar a Fahrenheit redondeando
  }
  return Math.round(celsius); // Si es Celsius solo redondea el numero
}

// Transforma la lista cruda de la API usando filter, map y reduce
export function processForecastData(rawForecastList = []) {
  // filter: se queda solo con los primeros 8 tramos (proximas 24 horas)
  const next24Hours = rawForecastList.filter((_, index) => index < 8);

  // map: limpia cada tramo para dejar solo los datos que necesitan los componentes
  const formattedCards = next24Hours.map((slot) => {
    const dateObj = new Date(slot.dt * 1000); // Pasa el timestamp de segundos a milisegundos
    const hour = dateObj.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      dt: slot.dt, // Guardamos el timestamp unico para usarlo como key estable en React
      hour: hour, // Hora formateada ej: "15:00"
      tempCelsius: slot.main.temp, // Temperatura base en Celsius sin redondear aun
      description: slot.weather[0]?.description || "Sin descripción", // Texto del clima
      icon: slot.weather[0]?.icon || "01d", // Codigo del icono
      rainProbability: Math.round((slot.pop || 0) * 100), // Pasa de 0-1 a porcentaje 0-100
    };
  });

  // reduce: recorre los 8 tramos y saca el porcentaje de lluvia mas alto del dia
  const maxRainProbability = formattedCards.reduce((highest, currentSlot) => {
    return currentSlot.rainProbability > highest ? currentSlot.rainProbability : highest;
  }, 0);

  // Devuelve las tarjetas limpias y el maximo de lluvia
  return {
    cards: formattedCards,
    maxRainProbability: maxRainProbability,
  };
}

// Lee la cache de localStorage si existe y no ha caducado
export function getCachedWeather(city) {
  const cacheKey = `weather_${city.trim().toLowerCase()}`; // Crea la clave en minusculas
  const rawData = localStorage.getItem(cacheKey); // Busca en localStorage

  if (!rawData) return null; // Si no hay nada, sale y devuelve null

    try {
    const parsed = JSON.parse(rawData); // Pasa el texto guardado a objeto JS
    const isExpired = Date.now() - parsed.timestamp > CACHE_EXPIRATION_MS; // Mira si pasaron 10 min

    if (isExpired) {
      localStorage.removeItem(cacheKey); // Si caduco, lo borra
        return null;
    }
    return parsed.data; // Si vale, devuelve los datos guardados
    } catch {
    localStorage.removeItem(cacheKey); // Si el JSON estaba corrupto, lo borra
    return null;
}
}

// Guarda los datos nuevos en localStorage con la hora actual
export function setCachedWeather(city, data) {
const cacheKey = `weather_${city.trim().toLowerCase()}`;
const record = {
    timestamp: Date.now(), // Momento exacto en milisegundos
    data: data, // Datos de la API
};
  localStorage.setItem(cacheKey, JSON.stringify(record)); // Pasa el objeto a texto y lo guarda
}