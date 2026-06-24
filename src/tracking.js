import { APPS_SCRIPT_URL } from "./data";

// ── Almacén local de eventos (fallback + cache) ──
const STORAGE_KEY = "kuota_eventos";

function leerEventos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function guardarEventos(eventos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
}

// ── Crear evento ──────────────────────────────────────
export function crearEvento(tipo, payload = {}) {
  const evento = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    ts: new Date().toISOString(),
    tipo,
    ...payload,
  };

  // Guardar local
  const lista = leerEventos();
  lista.unshift(evento);
  guardarEventos(lista.slice(0, 200)); // máx 200

  // Enviar a Google Sheets (no bloquea la UI)
  if (APPS_SCRIPT_URL) {
    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(evento),
    }).catch(() => {});
  }

  // Disparar evento custom para que la UI escuche
  window.dispatchEvent(new CustomEvent("kuota:event", { detail: evento }));

  return evento;
}

export function listarEventos() {
  return leerEventos();
}

export function limpiarEventos() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("kuota:event"));
}

// ── Hook para suscribirse a cambios ───────────────────
import { useEffect, useState } from "react";

export function useEventos() {
  const [eventos, setEventos] = useState(leerEventos());

  useEffect(() => {
    const handler = () => setEventos(leerEventos());
    window.addEventListener("kuota:event", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kuota:event", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return eventos;
}
