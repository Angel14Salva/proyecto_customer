import { useState } from "react";
import { crearEvento } from "./tracking";

const STORAGE_LANDLORD = "kuota_landlord_state";

export default function VistaInquilino() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  // Leer inquilinos registrados por el propietario
  const estado = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_LANDLORD) || "null"); }
    catch { return null; }
  })();
  const inquilinos = (estado?.inquilinos || []).filter(i =>
    i.estado === "pendiente" || i.estado === "recordatorio_enviado"
  );

  function enviarVoucher() {
    if (!seleccionado) return;
    setEnviando(true);
    setResultado(null);

    // 1. Evento voucher_received
    crearEvento("voucher_received", {
      actor: "inquilino",
      propietario: estado.nombrePropietario,
      inquilino: seleccionado.nombre,
      unidad: seleccionado.unidad,
      monto: seleccionado.monto,
    });

    // 2. Simular procesamiento del bot (1.5 seg) → 80% pago / 20% fraude
    setTimeout(() => {
      const esFraude = Math.random() < 0.2;
      if (esFraude) {
        crearEvento("voucher_fraud_detected", {
          actor: "bot",
          propietario: estado.nombrePropietario,
          inquilino: seleccionado.nombre,
          unidad: seleccionado.unidad,
          monto: seleccionado.monto,
        });
        setResultado({ tipo: "fraude" });
      } else {
        crearEvento("payment_confirmed_auto", {
          actor: "bot",
          propietario: estado.nombrePropietario,
          inquilino: seleccionado.nombre,
          unidad: seleccionado.unidad,
          monto: seleccionado.monto,
        });
        setResultado({ tipo: "exito" });
      }
      setEnviando(false);
    }, 1500);
  }

  function reset() {
    setSeleccionado(null);
    setResultado(null);
  }

  // ── Estado vacío ───────────────────────────────────
  if (!estado || inquilinos.length === 0) {
    return (
      <div className="bot-screen">
        <div className="bot-card">
          <div className="bot-logo inq">I</div>
          <h2 className="bot-title">Sin pagos pendientes</h2>
          <p className="bot-sub">
            No hay inquilinos con cobros pendientes en el sistema. Cambia a la vista
            <strong> Propietario</strong> y registra al menos un inquilino primero.
          </p>
        </div>
      </div>
    );
  }

  // ── Resultado ──────────────────────────────────────
  if (resultado) {
    if (resultado.tipo === "exito") {
      return (
        <div className="bot-screen">
          <div className="bot-card success">
            <div className="bot-result-icon">★</div>
            <h2 className="bot-title">¡Pago confirmado!</h2>
            <p className="bot-sub">
              Tu voucher fue validado correctamente. El propietario ya recibió la confirmación automática
              — no necesitas contactarlo.
            </p>
            <div className="bot-event-trigger aha">
              <strong>★ Momento Aha disparado</strong>
              <code>payment_confirmed_auto</code>
            </div>
            <button className="bot-btn primary" onClick={reset}>Volver al inicio</button>
          </div>
        </div>
      );
    }
    return (
      <div className="bot-screen">
        <div className="bot-card danger">
          <div className="bot-result-icon">⚠</div>
          <h2 className="bot-title">Voucher rechazado</h2>
          <p className="bot-sub">
            El sistema detectó inconsistencias en el comprobante. Hemos notificado al propietario.
            Por favor verifica tu transferencia.
          </p>
          <div className="bot-event-trigger fraud">
            <strong>⚠ Evento disparado</strong>
            <code>voucher_fraud_detected</code>
          </div>
          <button className="bot-btn primary" onClick={reset}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  // ── Detalle de pago ────────────────────────────────
  if (seleccionado) {
    return (
      <div className="bot-screen">
        <div className="bot-card wide">
          <h2 className="bot-title">Confirmar tu pago</h2>
          <p className="bot-sub">Sube tu voucher de Yape, Plin o transferencia bancaria.</p>
          <div className="bot-bill">
            <div className="bot-bill-row"><span>Inquilino:</span><strong>{seleccionado.nombre}</strong></div>
            <div className="bot-bill-row"><span>Unidad:</span><strong>{seleccionado.unidad}</strong></div>
            <div className="bot-bill-row"><span>Monto:</span><strong className="big">S/ {seleccionado.monto}</strong></div>
            <div className="bot-bill-row"><span>Vence:</span><strong>{seleccionado.vencimiento}</strong></div>
          </div>

          <label className="bot-upload">
            <input type="file" accept="image/*" disabled={enviando} />
            <div className="bot-upload-box">
              <span className="bot-upload-icon">📎</span>
              <span>Adjuntar voucher (Yape / Plin / Transferencia)</span>
              <span className="bot-upload-hint">El bot validará automáticamente con IA</span>
            </div>
          </label>

          <div className="bot-actions">
            <button className="bot-btn primary" onClick={enviarVoucher} disabled={enviando}>
              {enviando ? "Validando voucher..." : "Enviar voucher al bot"}
            </button>
            <button className="bot-btn ghost" onClick={() => setSeleccionado(null)} disabled={enviando}>
              Cancelar
            </button>
          </div>

          <div className="bot-event-hint">
            → Disparará <code>voucher_received</code> y luego <code>payment_confirmed_auto</code> o <code>voucher_fraud_detected</code>
          </div>
        </div>
      </div>
    );
  }

  // ── Lista de cobros pendientes ─────────────────────
  return (
    <div className="bot-app">
      <div className="bot-topbar inquilino">
        <div className="bot-topbar-left">
          <span className="bot-logo small inq">I</span>
          <div>
            <div className="bot-greet">Inquilino</div>
            <div className="bot-greet-sub">Selecciona tu alquiler para pagar</div>
          </div>
        </div>
      </div>

      <div className="bot-section">
        <h3 className="bot-h3">Pagos pendientes ({inquilinos.length})</h3>
        <div className="bot-inq-list">
          {inquilinos.map(i => (
            <div key={i.id} className="bot-inq-row clickable" onClick={() => setSeleccionado(i)}>
              <div className="bot-inq-info">
                <div className="bot-inq-nombre">{i.nombre}</div>
                <div className="bot-inq-sub">{i.unidad} · S/ {i.monto} · Vence {i.vencimiento}</div>
              </div>
              <div className="bot-inq-estado">
                {i.estado === "recordatorio_enviado" ?
                  <span className="tag-est blue">Recordatorio</span> :
                  <span className="tag-est gray">Pendiente</span>}
              </div>
              <div className="bot-inq-arrow">›</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
