// ── Catálogo de eventos del tracking de Kuota ──────────
export const eventoLabels = {
  bot_opened:             { label: "Bot abierto",            color: "#2E4A7A", icon: "▶" },
  tenant_registered:      { label: "Inquilino registrado",   color: "#8FA832", icon: "+" },
  reminder_sent:          { label: "Recordatorio enviado",   color: "#4A90D9", icon: "→" },
  voucher_received:       { label: "Voucher recibido",       color: "#8FA832", icon: "↓" },
  payment_confirmed_auto: { label: "Pago confirmado (AHA)",  color: "#E87722", icon: "★" },
  voucher_fraud_detected: { label: "Fraude detectado",       color: "#C0392B", icon: "⚠" },
  landlord_returns_D7:    { label: "Propietario regresa D7", color: "#6C3483", icon: "↺" },
};

// ── URL del Apps Script (configurar después del deploy) ──
export const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL || "";
