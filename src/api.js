const API_KEY = "916e05b9e8dad442b357cfcdd538e5a4"; // Tu clave de OpenWeather
const BASE_URL = "https://api.openweathermap.org/data/2.5"; // URL base de la version 2.5

// Recibe la ciudad y opcionalmente un signal para cancelar la peticion si el componente se desmonta
export async function fetchWeatherData(city, signal) {
  // Construye las dos URLs codificando el nombre de la ciudad por si lleva espacios
  const currentWeatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${API_KEY}`;
  const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${API_KEY}`;

  // Lanza las dos peticiones a la vez y les pasa el signal de aborto
  const [currentResponse, forecastResponse] = await Promise.all([
    fetch(currentWeatherUrl, { signal }),
    fetch(forecastUrl, { signal }),
  ]);

  // Si falla la respuesta del clima actual, lanza error
  if (!currentResponse.ok) {
    if (currentResponse.status === 404) {
      throw new Error(`La ciudad "${city}" no existe.`);
    }
    throw new Error(`Error del servidor (${currentResponse.status}).`);
  }

  // Si falla la respuesta del pronostico, lanza error
  if (!forecastResponse.ok) {
    throw new Error(`Error al obtener el pronóstico (${forecastResponse.status}).`);
  }

  // Convierte ambas respuestas a JSON
  const currentData = await currentResponse.json();
  const forecastData = await forecastResponse.json();

  // Devuelve un objeto con los dos resultados crudos
  return { current: currentData, forecast: forecastData };
}