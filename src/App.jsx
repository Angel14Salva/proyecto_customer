import { useState } from "react";
import VistaPropietario from "./VistaPropietario";
import VistaInquilino from "./VistaInquilino";
import VistaLog from "./VistaLog";
import { APPS_SCRIPT_URL } from "./data";
import "./App.css";

export default function App() {
  const [vista, setVista] = useState("propietario");

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-k">K</span>uota
            <span className="brand-tag">MVP · Bot de Cobros</span>
          </div>

          <div className="toggle">
            <button className={`toggle-btn ${vista === "propietario" ? "activo" : ""}`} onClick={() => setVista("propietario")}>
              <span className="toggle-icon">🏠</span> Propietario
            </button>
            <button className={`toggle-btn ${vista === "inquilino" ? "activo" : ""}`} onClick={() => setVista("inquilino")}>
              <span className="toggle-icon">👤</span> Inquilino
            </button>
            <button className={`toggle-btn log-btn ${vista === "log" ? "activo" : ""}`} onClick={() => setVista("log")}>
              <span className="toggle-icon">📊</span> Log
            </button>
          </div>
        </div>

        {!APPS_SCRIPT_URL && (
          <div className="banner-warn">
            <strong>⚙ Modo local:</strong> Los eventos se guardan en este navegador. Para enviar a Google Sheets,
            configura la variable de entorno <code>VITE_APPS_SCRIPT_URL</code> en Render con tu Apps Script Web App.
          </div>
        )}
      </header>

      <main className="main">
        {vista === "propietario" && <VistaPropietario />}
        {vista === "inquilino"   && <VistaInquilino />}
        {vista === "log"         && <VistaLog />}
      </main>

      <footer className="footer">
        Kuota · SaaS PropTech · Equipo Angel · UPAO Trujillo · Semana 10 — Growth Analytics & Lean Tracking
      </footer>
    </div>
  );
}
