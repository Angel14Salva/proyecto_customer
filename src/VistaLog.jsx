import { useState } from "react";
import { useEventos, limpiarEventos } from "./tracking";
import { eventoLabels } from "./data";

export default function VistaLog() {
  const eventos = useEventos();
  const [filtro, setFiltro] = useState("todos");
  const tipos = ["todos", ...Object.keys(eventoLabels)];
  const lista = filtro === "todos" ? eventos : eventos.filter(e => e.tipo === filtro);

  function descargarCSV() {
    if (!eventos.length) return alert("No hay eventos para exportar");
    const cabeceras = ["id","ts","tipo","actor","propietario","inquilino","unidad","monto"];
    const filas = eventos.map(e => cabeceras.map(h => `"${(e[h] ?? "").toString().replace(/"/g,'""')}"`).join(","));
    const csv = cabeceras.join(",") + "\n" + filas.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `kuota_eventos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="seccion">
      <div className="seccion-header">
        <span className="tag">LOG</span>
        <h2>Eventos en Tiempo Real</h2>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="bot-btn-mini" onClick={descargarCSV}>Descargar CSV</button>
          <button className="bot-btn-mini ghost" onClick={() => { if (confirm("¿Borrar todo el log?")) limpiarEventos(); }}>
            Limpiar log
          </button>
        </div>
      </div>

      <p className="seccion-desc">
        Eventos disparados por las acciones del propietario e inquilino. Si está conectado a Google Sheets,
        cada evento se replica automáticamente en la hoja vía Apps Script Web App.
      </p>

      <div className="filtros">
        {tipos.map(t => (
          <button
            key={t}
            className={`filtro-btn ${filtro === t ? "activo" : ""}`}
            onClick={() => setFiltro(t)}
          >
            {t === "todos" ? `Todos (${eventos.length})` : `${eventoLabels[t]?.label} (${eventos.filter(e => e.tipo === t).length})`}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="bot-empty">
          Aún no se han disparado eventos. Abre el bot en la vista Propietario para empezar.
        </div>
      ) : (
        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Evento</th>
                <th>Actor</th>
                <th>Propietario</th>
                <th>Inquilino</th>
                <th>Unidad</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(e => {
                const meta = eventoLabels[e.tipo] || { label: e.tipo, color: "#888", icon: "•" };
                const rowClass = e.tipo === "payment_confirmed_auto" ? "row-aha" : e.tipo === "voucher_fraud_detected" ? "row-fraud" : "";
                return (
                  <tr key={e.id} className={rowClass}>
                    <td className="mono">{e.id}</td>
                    <td className="mono ts">{new Date(e.ts).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "medium" })}</td>
                    <td>
                      <span className="badge" style={{ background: meta.color + "22", color: meta.color, border: `1px solid ${meta.color}44` }}>
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td>{e.actor || "—"}</td>
                    <td>{e.propietario || "—"}</td>
                    <td>{e.inquilino || "—"}</td>
                    <td className="center">{e.unidad || "—"}</td>
                    <td className="center">{e.monto ? `S/ ${e.monto}` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
