import { useState } from 'react'; // Importa useState para controlar el texto del input

// Lista constante de ciudades para las opciones del desplegable
const PRESET_CITIES = [
  { value: "Madrid", label: "Madrid" },
  { value: "Las Rozas de Madrid", label: "Las Rozas" },
  { value: "Barcelona", label: "Barcelona" },
  { value: "Valencia", label: "Valencia" },
  { value: "Sevilla", label: "Sevilla" },
  { value: "Bilbao", label: "Bilbao" },
];

// Recibe la ciudad actual y la funcion del padre para cambiarla (lifting state up)
export default function CitySelector({ selectedCity, onSelectCity }) {
  // Estado local solo para lo que el usuario va escribiendo en la caja de texto
  const [customInput, setCustomInput] = useState("");

  // Maneja el envio del formulario cuando se pulsa Consultar o Enter
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el navegador recargue la pagina
    const trimmed = customInput.trim(); // Quita espacios sobrantes
    
    if (trimmed !== "") {
      onSelectCity(trimmed); // Avisa al componente padre (App) de la nueva ciudad escrita
      setCustomInput(""); // Vacia la caja de texto despues de buscar
    }
  };

  // Maneja cuando el usuario elige otra opcion en el menu desplegable <select>
  const handleSelectChange = (e) => {
    onSelectCity(e.target.value); // Avisa al componente padre de la opcion elegida
  };

  // Comprueba si la ciudad activa esta en la lista del select; si fue buscada a mano, deja Madrid en el select
  const selectValue = PRESET_CITIES.some((c) => c.value === selectedCity) ? selectedCity : "Madrid";

  return (
    <section className="city-selector-section">
      <form className="city-form" onSubmit={handleSubmit}>
        <label htmlFor="city-select" className="selector-label">Cambiar ubicación:</label>
        <div className="selector-controls">
          {/* Desplegable controlado por React */}
          <select id="city-select" value={selectValue} onChange={handleSelectChange}>
            {PRESET_CITIES.map((cityObj) => (
              <option key={cityObj.value} value={cityObj.value}>
                {cityObj.label}
              </option>
            ))}
          </select>

          {/* Input controlado por el estado local customInput */}
          <input
            type="text"
            id="city-input"
            placeholder="O escribe otra ciudad..."
            autoComplete="off"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />

          <button type="submit" id="search-btn">Consultar</button>
        </div>
      </form>
    </section>
  );
}