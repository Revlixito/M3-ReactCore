import { StrictMode } from 'react'; // Herramienta de React para detectar problemas en desarrollo
import { createRoot } from 'react-dom/client'; // Funcion para montar React en el navegador
import App from './App.jsx'; // Importa el componente principal
import './style.css'; // Importa los estilos CSS

// Busca el div#root en index.html y pinta dentro toda la aplicacion React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);