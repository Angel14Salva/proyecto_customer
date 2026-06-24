import { useEffect, useState } from "react";
import { crearEvento, useEventos } from "./tracking";

const STORAGE_LANDLORD = "kuota_landlord_state";

function leerEstado() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_LANDLORD) || "null");
    return s || { sesionAbierta: false, inquilinos: [], nombrePropietario: "" };
  } catch {
    return { sesionAbierta: false, inquilinos: [], nombrePropietario: "" };
  }
}

function guardarEstado(s) {
  localStorage.setItem(STORAGE_LANDLORD, JSON.stringify(s));
}

export default function VistaPropietario() {
  const [estado, setEstado] = useState(leerEstado());
  const [nombre, setNombre] = useState("");
  const [inqNombre, setInqNombre] = useState("");
  const [inqUnidad, setInqUnidad] = useState("");
  const [inqMonto, setInqMonto] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const eventos = useEventos();

  // Persistir estado
  useEffect(() => { guardarEstado(estado); }, [estado]);

  // ── Abrir bot ──────────────────────────────────────
  function abrirBot() {
    if (!nombre.trim()) return alert("Ingresa tu nombre");
    crearEvento("bot_opened", { actor: "propietario", propietario: nombre });
    setEstado({ ...estado, sesionAbierta: true, nombrePropietario: nombre });
  }

  // ── Cerrar bot ─────────────────────────────────────
  function cerrarBot() {
    setEstado({ ...estado, sesionAbierta: false });
  }

  // ── Simular regreso D7 ─────────────────────────────
  function simularRegresoD7() {
    crearEvento("landlord_returns_D7", {
      actor: "propietario",
      propietario: estado.nombrePropietario,
    });
    alert("Evento landlord_returns_D7 registrado");
  }

  // ── Registrar inquilino ────────────────────────────
  function registrarInquilino(e) {
    e.preventDefault();
    if (!inqNombre.trim() || !inqUnidad.trim() || !inqMonto || !vencimiento) {
      return alert("Completa todos los campos");
    }
    const inq = {
      id: Date.now(),
      nombre: inqNombre,
      unidad: inqUnidad,
      monto: parseFloat(inqMonto),
      vencimiento,
      estado: "pendiente", // pendiente | recordatorio_enviado | pagado | fraude
    };
    crearEvento("tenant_registered", {
      actor: "propietario",
      propietario: estado.nombrePropietario,
      inquilino: inq.nombre,
      unidad: inq.unidad,
      monto: inq.monto,
    });
    setEstado({ ...estado, inquilinos: [...estado.inquilinos, inq] });
    setInqNombre("");
    setInqUnidad("");
    setInqMonto("");
    setVencimiento("");
  }

  // ── Enviar recordatorio ────────────────────────────
  function enviarRecordatorio(inqId) {
    const inq = estado.inquilinos.find(i => i.id === inqId);
    if (!inq) return;
    crearEvento("reminder_sent", {
      actor: "bot",
      propietario: estado.nombrePropietario,
      inquilino: inq.nombre,
      unidad: inq.unidad,
      monto: inq.monto,
    });
    const inquilinos = estado.inquilinos.map(i =>
      i.id === inqId ? { ...i, estado: "recordatorio_enviado" } : i
    );
    setEstado({ ...estado, inquilinos });
  }

  // ── Eliminar inquilino ─────────────────────────────
  function eliminarInquilino(inqId) {
    if (!confirm("¿Eliminar este inquilino del sistema?")) return;
    setEstado({ ...estado, inquilinos: estado.inquilinos.filter(i => i.id !== inqId) });
  }

  // Sincronizar estado de inquilinos con eventos recientes (voucher_received / payment / fraud)
  useEffect(() => {
    if (!eventos.length) return;
    const cambios = {};
    eventos.forEach(ev => {
      if (!["payment_confirmed_auto","voucher_fraud_detected","voucher_received"].includes(ev.tipo)) return;
      if (ev.unidad && ev.tipo === "payment_confirmed_auto") cambios[ev.unidad] = "pagado";
      if (ev.unidad && ev.tipo === "voucher_fraud_detected") cambios[ev.unidad] = "fraude";
    });
    if (Object.keys(cambios).length) {
      setEstado(prev => ({
        ...prev,
        inquilinos: prev.inquilinos.map(i =>
          cambios[i.unidad] ? { ...i, estado: cambios[i.unidad] } : i
        )
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventos.length]);

  // ── UI: pantalla de login ──────────────────────────
  if (!estado.sesionAbierta) {
    return (
      <div className="bot-screen">
        <div className="bot-card">
          <div className="bot-logo">K</div>
          <h2 className="bot-title">Bienvenido a Kuota</h2>
          <p className="bot-sub">Inicia tu sesión como propietario para gestionar tus alquileres.</p>
          <input
            className="bot-input"
            type="text"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onKeyDown={e => e.key === "Enter" && abrirBot()}
          />
          <button className="bot-btn primary" onClick={abrirBot}>
            Abrir bot
          </button>
          <div className="bot-event-hint">→ Disparará el evento <code>bot_opened</code></div>
        </div>
      </div>
    );
  }

  // ── UI: dashboard de propietario ───────────────────
  const totalPendiente = estado.inquilinos.filter(i => i.estado === "pendiente" || i.estado === "recordatorio_enviado").length;
  const totalPagado    = estado.inquilinos.filter(i => i.estado === "pagado").length;
  const totalFraude    = estado.inquilinos.filter(i => i.estado === "fraude").length;
  const ingresosMes    = estado.inquilinos.filter(i => i.estado === "pagado").reduce((s, i) => s + i.monto, 0);

  return (
    <div className="bot-app">
      {/* Top bar */}
      <div className="bot-topbar">
        <div className="bot-topbar-left">
          <span className="bot-logo small">K</span>
          <div>
            <div className="bot-greet">Hola, {estado.nombrePropietario}</div>
            <div className="bot-greet-sub">Modo Propietario · {estado.inquilinos.length} inquilinos</div>
          </div>
        </div>
        <div className="bot-topbar-right">
          <button className="bot-btn-mini" onClick={simularRegresoD7}>Simular regreso D7</button>
          <button className="bot-btn-mini ghost" onClick={cerrarBot}>Cerrar</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="bot-kpis">
        <div className="bot-kpi"><div className="bot-kpi-n">{totalPendiente}</div><div className="bot-kpi-l">Por cobrar</div></div>
        <div className="bot-kpi green"><div className="bot-kpi-n">{totalPagado}</div><div className="bot-kpi-l">Pagados</div></div>
        <div className="bot-kpi red"><div className="bot-kpi-n">{totalFraude}</div><div className="bot-kpi-l">Fraudes</div></div>
        <div className="bot-kpi blue"><div className="bot-kpi-n">S/ {ingresosMes.toFixed(0)}</div><div className="bot-kpi-l">Cobrado este mes</div></div>
      </div>

      {/* Form registrar inquilino */}
      <div className="bot-section">
        <h3 className="bot-h3">Registrar nuevo inquilino</h3>
        <form className="bot-form" onSubmit={registrarInquilino}>
          <input className="bot-input mini" placeholder="Nombre del inquilino" value={inqNombre} onChange={e => setInqNombre(e.target.value)} />
          <input className="bot-input mini" placeholder="Unidad (ej. Dpto 301)" value={inqUnidad} onChange={e => setInqUnidad(e.target.value)} />
          <input className="bot-input mini" type="number" placeholder="Monto S/." value={inqMonto} onChange={e => setInqMonto(e.target.value)} />
          <input className="bot-input mini" type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} />
          <button className="bot-btn primary" type="submit">+ Registrar</button>
        </form>
        <div className="bot-event-hint">→ Disparará <code>tenant_registered</code></div>
      </div>

      {/* Lista de inquilinos */}
      <div className="bot-section">
        <h3 className="bot-h3">Mis inquilinos</h3>
        {estado.inquilinos.length === 0 ? (
          <div className="bot-empty">Aún no has registrado inquilinos. Usa el formulario de arriba.</div>
        ) : (
          <div className="bot-inq-list">
            {estado.inquilinos.map(i => (
              <div key={i.id} className={`bot-inq-row estado-${i.estado}`}>
                <div className="bot-inq-info">
                  <div className="bot-inq-nombre">{i.nombre}</div>
                  <div className="bot-inq-sub">{i.unidad} · S/ {i.monto} · Vence {i.vencimiento}</div>
                </div>
                <div className="bot-inq-estado">
                  {i.estado === "pendiente" && <span className="tag-est gray">Pendiente</span>}
                  {i.estado === "recordatorio_enviado" && <span className="tag-est blue">Recordado</span>}
                  {i.estado === "pagado" && <span className="tag-est green">★ Pagado (AHA)</span>}
                  {i.estado === "fraude" && <span className="tag-est red">⚠ Fraude</span>}
                </div>
                <div className="bot-inq-acciones">
                  {(i.estado === "pendiente") && (
                    <button className="bot-btn-mini blue" onClick={() => enviarRecordatorio(i.id)}>Enviar recordatorio</button>
                  )}
                  <button className="bot-btn-mini ghost" onClick={() => eliminarInquilino(i.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bot-note">
        <strong>Flujo siguiente:</strong> cambia a la vista <em>Inquilino</em> en el toggle superior para enviar un voucher
        y disparar el Momento Aha (<code>payment_confirmed_auto</code>).
      </div>
    </div>
  );
}
