// ── Datos simulados de Kuota MVP ──────────────────────

export const eventos = [
  { id: 1,  ts: "2025-05-01 08:12", evento: "bot_opened",             propietario: "Carlos M.",   inquilino: "—",           unidades: 8,  cohorte: "MES0" },
  { id: 2,  ts: "2025-05-01 08:15", evento: "tenant_registered",      propietario: "Carlos M.",   inquilino: "Lucia R.",    unidades: 8,  cohorte: "MES0" },
  { id: 3,  ts: "2025-05-01 09:02", evento: "reminder_sent",          propietario: "Carlos M.",   inquilino: "Lucia R.",    unidades: 8,  cohorte: "MES0" },
  { id: 4,  ts: "2025-05-01 09:45", evento: "voucher_received",       propietario: "Carlos M.",   inquilino: "Lucia R.",    unidades: 8,  cohorte: "MES0" },
  { id: 5,  ts: "2025-05-01 09:46", evento: "payment_confirmed_auto", propietario: "Carlos M.",   inquilino: "Lucia R.",    unidades: 8,  cohorte: "MES0" },
  { id: 6,  ts: "2025-05-02 10:30", evento: "bot_opened",             propietario: "Rosa P.",     inquilino: "—",           unidades: 6,  cohorte: "MES0" },
  { id: 7,  ts: "2025-05-02 10:35", evento: "tenant_registered",      propietario: "Rosa P.",     inquilino: "Juan C.",     unidades: 6,  cohorte: "MES0" },
  { id: 8,  ts: "2025-05-02 11:00", evento: "reminder_sent",          propietario: "Rosa P.",     inquilino: "Juan C.",     unidades: 6,  cohorte: "MES0" },
  { id: 9,  ts: "2025-05-02 14:20", evento: "voucher_received",       propietario: "Rosa P.",     inquilino: "Juan C.",     unidades: 6,  cohorte: "MES0" },
  { id: 10, ts: "2025-05-02 14:21", evento: "voucher_fraud_detected", propietario: "Rosa P.",     inquilino: "Juan C.",     unidades: 6,  cohorte: "MES0" },
  { id: 11, ts: "2025-05-03 09:00", evento: "bot_opened",             propietario: "Luis T.",     inquilino: "—",           unidades: 12, cohorte: "MES0" },
  { id: 12, ts: "2025-05-03 09:10", evento: "tenant_registered",      propietario: "Luis T.",     inquilino: "Ana F.",      unidades: 12, cohorte: "MES0" },
  { id: 13, ts: "2025-05-03 09:11", evento: "reminder_sent",          propietario: "Luis T.",     inquilino: "Ana F.",      unidades: 12, cohorte: "MES0" },
  { id: 14, ts: "2025-05-03 16:00", evento: "voucher_received",       propietario: "Luis T.",     inquilino: "Ana F.",      unidades: 12, cohorte: "MES0" },
  { id: 15, ts: "2025-05-03 16:01", evento: "payment_confirmed_auto", propietario: "Luis T.",     inquilino: "Ana F.",      unidades: 12, cohorte: "MES0" },
  { id: 16, ts: "2025-05-05 08:00", evento: "bot_opened",             propietario: "María S.",    inquilino: "—",           unidades: 5,  cohorte: "MES0" },
  { id: 17, ts: "2025-05-05 08:05", evento: "tenant_registered",      propietario: "María S.",    inquilino: "Pedro L.",    unidades: 5,  cohorte: "MES0" },
  { id: 18, ts: "2025-05-05 08:30", evento: "payment_confirmed_auto", propietario: "María S.",    inquilino: "Pedro L.",    unidades: 5,  cohorte: "MES0" },
  { id: 19, ts: "2025-05-06 11:00", evento: "landlord_returns_D7",    propietario: "Carlos M.",   inquilino: "—",           unidades: 8,  cohorte: "MES0" },
  { id: 20, ts: "2025-05-08 09:00", evento: "bot_opened",             propietario: "Jorge V.",    inquilino: "—",           unidades: 7,  cohorte: "MES0" },
  { id: 21, ts: "2025-05-10 10:00", evento: "bot_opened",             propietario: "Elena Q.",    inquilino: "—",           unidades: 9,  cohorte: "MES1" },
  { id: 22, ts: "2025-05-10 10:05", evento: "tenant_registered",      propietario: "Elena Q.",    inquilino: "Sofia M.",    unidades: 9,  cohorte: "MES1" },
  { id: 23, ts: "2025-05-10 11:00", evento: "reminder_sent",          propietario: "Elena Q.",    inquilino: "Sofia M.",    unidades: 9,  cohorte: "MES1" },
  { id: 24, ts: "2025-05-10 15:30", evento: "voucher_received",       propietario: "Elena Q.",    inquilino: "Sofia M.",    unidades: 9,  cohorte: "MES1" },
  { id: 25, ts: "2025-05-10 15:31", evento: "payment_confirmed_auto", propietario: "Elena Q.",    inquilino: "Sofia M.",    unidades: 9,  cohorte: "MES1" },
  { id: 26, ts: "2025-05-12 08:00", evento: "bot_opened",             propietario: "Ricardo N.",  inquilino: "—",           unidades: 14, cohorte: "MES1" },
  { id: 27, ts: "2025-05-12 08:10", evento: "tenant_registered",      propietario: "Ricardo N.",  inquilino: "Diego A.",    unidades: 14, cohorte: "MES1" },
  { id: 28, ts: "2025-05-12 09:00", evento: "reminder_sent",          propietario: "Ricardo N.",  inquilino: "Diego A.",    unidades: 14, cohorte: "MES1" },
  { id: 29, ts: "2025-05-12 17:00", evento: "voucher_received",       propietario: "Ricardo N.",  inquilino: "Diego A.",    unidades: 14, cohorte: "MES1" },
  { id: 30, ts: "2025-05-12 17:01", evento: "payment_confirmed_auto", propietario: "Ricardo N.",  inquilino: "Diego A.",    unidades: 14, cohorte: "MES1" },
  { id: 31, ts: "2025-05-15 09:00", evento: "bot_opened",             propietario: "Valeria C.",  inquilino: "—",           unidades: 6,  cohorte: "MES2" },
  { id: 32, ts: "2025-05-15 09:05", evento: "tenant_registered",      propietario: "Valeria C.",  inquilino: "Marco T.",    unidades: 6,  cohorte: "MES2" },
  { id: 33, ts: "2025-05-15 10:00", evento: "reminder_sent",          propietario: "Valeria C.",  inquilino: "Marco T.",    unidades: 6,  cohorte: "MES2" },
  { id: 34, ts: "2025-05-15 16:00", evento: "voucher_received",       propietario: "Valeria C.",  inquilino: "Marco T.",    unidades: 6,  cohorte: "MES2" },
  { id: 35, ts: "2025-05-15 16:01", evento: "payment_confirmed_auto", propietario: "Valeria C.",  inquilino: "Marco T.",    unidades: 6,  cohorte: "MES2" },
];

export const cohortes = [
  { id: "MES0", label: "COHORTE_MES0", desc: "Piloto Wizard of Oz", n: 8,  mes0: 100, mes1: 75,  mes2: null, mes3: null },
  { id: "MES1", label: "COHORTE_MES1", desc: "Post EXP-01 + Landing", n: 14, mes0: 100, mes1: 64,  mes2: null, mes3: null },
  { id: "MES2", label: "COHORTE_MES2", desc: "Escala + Referidos",    n: 22, mes0: 100, mes1: null, mes2: null, mes3: null },
];

export const metricas = [
  { label: "Propietarios activos", valor: "44", sub: "3 cohortes", color: "#8FA832" },
  { label: "Retención Mes 1 (MES0)", valor: "75%", sub: "6 de 8 · Meta ≥50%", color: "#8FA832" },
  { label: "Tasa Aha (72h)", valor: "75%", sub: "payment_confirmed_auto · Meta ≥60%", color: "#8FA832" },
  { label: "Churn Mes 1", valor: "25%", sub: "2 de 8 · Meta ≤30%", color: "#E87722" },
];

export const curvaData = [
  { semana: "Sem 0", MES0: 100, MES1: 100, MES2: 100 },
  { semana: "Sem 1", MES0: 87,  MES1: 86,  MES2: null },
  { semana: "Sem 2", MES0: 80,  MES1: 79,  MES2: null },
  { semana: "Sem 3", MES0: 75,  MES1: 71,  MES2: null },
  { semana: "Sem 4", MES0: 75,  MES1: 64,  MES2: null },
];

export const eventoLabels = {
  bot_opened:             { label: "Bot abierto",          color: "#2E4A7A" },
  tenant_registered:      { label: "Inquilino registrado", color: "#8FA832" },
  reminder_sent:          { label: "Recordatorio enviado", color: "#4A90D9" },
  voucher_received:       { label: "Voucher recibido",     color: "#8FA832" },
  payment_confirmed_auto: { label: "★ Pago confirmado (AHA)", color: "#E87722" },
  voucher_fraud_detected: { label: "⚠ Fraude detectado",  color: "#C0392B" },
  landlord_returns_D7:    { label: "Propietario regresa D7", color: "#6C3483" },
};
