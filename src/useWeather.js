import { useState, useEffect } from 'react'; // Importa los hooks nativos de React
import { fetchWeatherData } from '../api.js'; // Importa la llamada a la API
import { getCachedWeather, setCachedWeather } from '../logic.js'; // Importa las funciones de cache

// Custom hook que recibe la ciudad activa y gestiona estados y efectos de red
export function useWeather(city) {
  const [rawData, setRawData] = useState(null); // Guarda los datos crudos devueltos por la API
  const [loading, setLoading] = useState(true); // Guarda si la peticion esta cargando (true/false)
  const [error, setError] = useState(null); // Guarda el mensaje de error si algo falla

  // useEffect que se ejecuta cada vez que cambia la prop "city"
useEffect(() => {
    if (!city) return; // Si la ciudad esta vacia no hace nada

    // AbortController sirve para cancelar la peticion HTTP si el usuario cambia de ciudad muy rapido (cleanup)
    const controller = new AbortController();

    async function loadData() {
      setLoading(true); // Activa el mensaje de carga
      setError(null); // Limpia errores anteriores

    try {
        const cached = getCachedWeather(city); // Primero mira si esta en localStorage

        if (cached) {
          setRawData(cached); // Si esta en cache, actualiza el estado directamente
        } else {
          // Si no esta en cache, pide los datos a la API pasandole la señal de cancelacion
        const freshData = await fetchWeatherData(city, controller.signal);
          setCachedWeather(city, freshData); // Lo guarda en localStorage
          setRawData(freshData); // Guarda los datos en el estado de React
        }
    } catch (err) {
        // Si el error fue porque se cancelo la peticion en el cleanup, lo ignoramos
        if (err.name === 'AbortError') return;
        setError(err.message || 'Error al conectar con el servidor'); // Guarda el error para mostrarlo
    } finally {
        // Si la peticion no fue abortada, quita el estado de carga
        if (!controller.signal.aborted) {
        setLoading(false);
        }
    }
    }

    loadData(); // Ejecuta la funcion asincrona

    // Funcion de cleanup exigida en la rubrica: cancela la peticion en vuelo si city vuelve a cambiar
    return () => {
    controller.abort();
    };
  }, [city]); // Dependencia correcta: solo se vuelve a ejecutar cuando cambia "city"

  // Devuelve los tres estados para que App.jsx los use
return { rawData, loading, error };
}