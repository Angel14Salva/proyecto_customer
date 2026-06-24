import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { eventos, cohortes, metricas, curvaData, eventoLabels } from "./data";
import "./App.css";

// ── Helpers ───────────────────────────────────────────
const VERDE   = "#8FA832";
const NARANJA = "#E87722";
const AZUL    = "#1B2A4A";

function Badge({ tipo }) {
  const meta = eventoLabels[tipo] || { label: tipo, color: "#888" };
  return (
    <span className="badge" style={{ background: meta.color + "22", color: meta.color, border: `1px solid ${meta.color}44` }}>
      {meta.label}
    </span>
  );
}

function KPI({ label, valor, sub, color }) {
  return (
    <div className="kpi-card">
      <div className="kpi-valor" style={{ color }}>{valor}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

// ── Componentes de sección ────────────────────────────
function SeccionAha() {
  return (
    <div className="seccion">
      <div className="seccion-header">
        <span className="tag">01</span>
        <h2>Momento Aha — Nodo de Activación</h2>
      </div>
      <div className="aha-flow">
        {["Bot abierto","Inquilino registrado","Recordatorio enviado","Voucher recibido"].map((s, i) => (
          <div key={i} className="aha-step">
            <div className="aha-box neutral">{s}</div>
            <div className="aha-arrow">→</div>
          </div>
        ))}
        <div className="aha-step">
          <div className="aha-box aha">
            <span>★</span> payment_confirmed_auto
            <div className="aha-sub">NODO AHA</div>
          </div>
          <div className="aha-arrow">→</div>
        </div>
        <div className="aha-box retencion">Retención Potencial</div>
      </div>
      <div className="aha-desc">
        El propietario recibe la confirmación de pago sin haber contactado manualmente al inquilino.
        Esta es la acción conductual exacta que predice retención — no el registro, no el voucher recibido.
      </div>
    </div>
  );
}

function SeccionKPIs() {
  return (
    <div className="seccion">
      <div className="seccion-header">
        <span className="tag">02</span>
        <h2>Métricas Accionables — Cero Vanidad</h2>
      </div>
      <div className="kpi-grid">
        {metricas.map((m, i) => <KPI key={i} {...m} />)}
      </div>
    </div>
  );
}

function SeccionTracking() {
  const [filtro, setFiltro] = useState("todos");
  const tipos = ["todos", ...Object.keys(eventoLabels)];
  const lista = filtro === "todos" ? eventos : eventos.filter(e => e.evento === filtro);

  return (
    <div className="seccion">
      <div className="seccion-header">
        <span className="tag">03</span>
        <h2>Log de Eventos — Google Sheets MVP</h2>
      </div>
      <div className="filtros">
        {tipos.map(t => (
          <button
            key={t}
            className={`filtro-btn ${filtro === t ? "activo" : ""}`}
            onClick={() => setFiltro(t)}
          >
            {t === "todos" ? "Todos" : eventoLabels[t]?.label || t}
          </button>
        ))}
      </div>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Timestamp</th>
              <th>Evento</th>
              <th>Propietario</th>
              <th>Inquilino</th>
              <th>Unidades</th>
              <th>Cohorte</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(e => (
              <tr key={e.id} className={e.evento === "payment_confirmed_auto" ? "row-aha" : e.evento === "voucher_fraud_detected" ? "row-fraud" : ""}>
                <td className="mono">{e.id}</td>
                <td className="mono ts">{e.ts}</td>
                <td><Badge tipo={e.evento} /></td>
                <td>{e.propietario}</td>
                <td>{e.inquilino}</td>
                <td className="center">{e.unidades}</td>
                <td><span className="cohorte-tag">{e.cohorte}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SeccionCohortes() {
  const cols = ["Mes 0\n(Registro)", "Mes 1\n(Retención)", "Mes 2", "Mes 3"];

  function CeldaValor({ val, esDiagonal, esFuturo, n }) {
    if (esFuturo) return <td className="celda futuro"><span>—</span></td>;
    if (esDiagonal) return (
      <td className="celda diagonal">
        <div className="diag-pct">{val}%</div>
        {n && <div className="diag-n">{n} prop.</div>}
      </td>
    );
    return (
      <td className="celda disponible">
        <div className="diag-pct">{val}%</div>
        {n && <div className="diag-n">{n} prop.</div>}
      </td>
    );
  }

  // Diagonal: MES0→mes1, MES1→mes1, MES2→mes0
  return (
    <div className="seccion">
      <div className="seccion-header">
        <span className="tag">04</span>
        <h2>Primer Triángulo — Análisis de Cohortes</h2>
      </div>
      <p className="seccion-desc">
        Filas = cohortes por mes de registro. Columnas = meses transcurridos.
        <span className="legend-diag"> ★ Naranja = diagonal actual (medir ahora)</span>
        <span className="legend-fut"> ■ Gris = datos futuros</span>
      </p>
      <div className="tabla-wrap">
        <table className="tabla cohorte-tabla">
          <thead>
            <tr>
              <th>Cohorte</th>
              {cols.map(c => <th key={c}>{c.split("\n")[0]}<br/><span className="th-sub">{c.split("\n")[1]||""}</span></th>)}
            </tr>
          </thead>
          <tbody>
            {cohortes.map(c => (
              <tr key={c.id}>
                <td className="cohorte-id-cell">
                  <div className="cid">{c.label}</div>
                  <div className="cdesc">{c.desc} · N={c.n}</div>
                </td>
                {/* MES0: mes0=disponible, mes1=diag si MES0/MES1, futuro si MES2 */}
                {c.id === "MES0" && <>
                  <CeldaValor val={100} n={c.n} />
                  <CeldaValor val={75} n={6} esDiagonal />
                  <CeldaValor esFuturo />
                  <CeldaValor esFuturo />
                </>}
                {c.id === "MES1" && <>
                  <CeldaValor val={100} n={c.n} />
                  <CeldaValor val={64} n={9} esDiagonal />
                  <CeldaValor esFuturo />
                  <CeldaValor esFuturo />
                </>}
                {c.id === "MES2" && <>
                  <CeldaValor val={100} n={c.n} esDiagonal />
                  <CeldaValor esFuturo />
                  <CeldaValor esFuturo />
                  <CeldaValor esFuturo />
                </>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SeccionCurva() {
  return (
    <div className="seccion">
      <div className="seccion-header">
        <span className="tag">05</span>
        <h2>Curva de Supervivencia — Retención por Cohorte</h2>
      </div>
      <p className="seccion-desc">
        El objetivo es lograr la asíntota horizontal. Si la curva se aplana, tienes Product-Market Fit.
        Si toca cero, el producto muere.
      </p>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={curvaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="semana" tick={{ fontSize: 12, fill: "#666" }} />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12, fill: "#666" }} />
            <Tooltip formatter={(v) => v != null ? `${v}%` : "N/D"} />
            <Legend />
            <Line type="monotone" dataKey="MES0" stroke={NARANJA} strokeWidth={3} dot={{ r: 5 }} name="COHORTE_MES0" connectNulls={false} />
            <Line type="monotone" dataKey="MES1" stroke={VERDE} strokeWidth={3} dot={{ r: 5 }} name="COHORTE_MES1" connectNulls={false} strokeDasharray="6 3" />
            <Line type="monotone" dataKey="MES2" stroke="#2E4A7A" strokeWidth={2} dot={{ r: 4 }} name="COHORTE_MES2" connectNulls={false} strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="pmf-note">
        <span className="pmf-badge">★ Señal de PMF detectada</span>
        La COHORTE_MES0 se aplana en ~75% a partir de la Semana 3 — aplanamiento horizontal confirmado.
      </div>
    </div>
  );
}

// ── App principal ─────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "tracking",  label: "Log de Eventos" },
    { id: "cohortes",  label: "Cohortes" },
    { id: "curva",     label: "Curva de Supervivencia" },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-k">K</span>uota
            <span className="brand-tag">MVP Tracking · Semana 10</span>
          </div>
          <nav className="nav">
            {tabs.map(t => (
              <button key={t.id} className={`nav-btn ${tab === t.id ? "activo" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {tab === "dashboard" && (
          <>
            <div className="hero">
              <div className="hero-eyebrow">ISIA-113 · Customer Development · Semana 10</div>
              <h1 className="hero-title">Growth Analytics<br /><span className="hero-accent">& Lean Tracking</span></h1>
              <p className="hero-sub">De la Vanidad a la Verdad Empírica. Infraestructura de datos para el MVP de Kuota.</p>
            </div>
            <SeccionAha />
            <SeccionKPIs />
          </>
        )}
        {tab === "tracking"  && <SeccionTracking />}
        {tab === "cohortes"  && <SeccionCohortes />}
        {tab === "curva"     && <SeccionCurva />}
      </main>

      <footer className="footer">
        Kuota · SaaS PropTech · Equipo: Alonzo Pérez, Solar Beltrán, Yon Alva, Angel · UPAO Trujillo
      </footer>
    </div>
  );
}
