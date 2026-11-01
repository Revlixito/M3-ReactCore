// Recibe por props el booleano loading y el texto error
export default function StatusFeedback({ loading, error }) {
  // Si no esta cargando y tampoco hay error, no renderiza nada en el DOM
  if (!loading && !error) return null;

  return (
    <section id="feedback-zone" aria-live="polite">
      {/* Renderizado condicional limpio: solo muestra este div si loading es true */}
      {loading && (
        <div id="loading-spinner" className="status-message" role="status">
          <p>Consultando datos meteorológicos</p>
        </div>
      )}

      {/* Renderizado condicional limpio: solo muestra la caja roja si existe un error */}
      {error && (
        <div id="error-box" className="status-message error" role="alert">
          <p>{error}</p>
        </div>
      )}
    </section>
  );
}