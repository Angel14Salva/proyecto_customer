// ════════════════════════════════════════════════════════════════
// Kuota — Receptor de Eventos para Google Sheets
// ════════════════════════════════════════════════════════════════
//
// CÓMO USAR:
// 1. Abre Google Sheets (sheets.new) y crea una hoja nueva
// 2. Cambia el nombre de la pestaña a "eventos"
// 3. Menú: Extensiones → Apps Script
// 4. Borra todo el código por defecto y pega este archivo completo
// 5. Guarda (Ctrl+S)
// 6. Clic en "Implementar" → "Nueva implementación"
//    - Tipo: Aplicación web
//    - Ejecutar como: yo mismo
//    - Quién tiene acceso: Cualquier persona
// 7. Copia la URL que te da (termina en /exec)
// 8. Pégala en Render como variable de entorno VITE_APPS_SCRIPT_URL
// 9. Vuelve a desplegar el sitio en Render
//
// LA HOJA debe tener estas columnas en la primera fila:
// id | ts | tipo | actor | propietario | inquilino | unidad | monto
// (el script las crea automáticamente la primera vez)

const SHEET_NAME = "eventos";
const COLUMNAS = ["id", "ts", "tipo", "actor", "propietario", "inquilino", "unidad", "monto"];

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let hoja = ss.getSheetByName(SHEET_NAME);

    // Crear la hoja si no existe
    if (!hoja) {
      hoja = ss.insertSheet(SHEET_NAME);
      hoja.appendRow(COLUMNAS);
      hoja.getRange(1, 1, 1, COLUMNAS.length)
          .setFontWeight("bold")
          .setBackground("#1B2A4A")
          .setFontColor("#FFFFFF");
      hoja.setFrozenRows(1);
    }

    // Si está vacía, escribir encabezados
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(COLUMNAS);
      hoja.getRange(1, 1, 1, COLUMNAS.length)
          .setFontWeight("bold")
          .setBackground("#1B2A4A")
          .setFontColor("#FFFFFF");
      hoja.setFrozenRows(1);
    }

    // Convertir el evento en fila siguiendo el orden de columnas
    const fila = COLUMNAS.map(col => datos[col] !== undefined ? datos[col] : "");
    hoja.appendRow(fila);

    // Color de fondo según tipo de evento
    const ultimaFila = hoja.getLastRow();
    const rango = hoja.getRange(ultimaFila, 1, 1, COLUMNAS.length);
    if (datos.tipo === "payment_confirmed_auto") {
      rango.setBackground("#FFF3DC"); // naranja claro (AHA)
    } else if (datos.tipo === "voucher_fraud_detected") {
      rango.setBackground("#FDE9E9"); // rojo claro
    } else if (datos.tipo === "tenant_registered") {
      rango.setBackground("#F0F7DC"); // verde claro
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, fila: ultimaFila }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite probar GET en el navegador
function doGet() {
  return ContentService
    .createTextOutput("Kuota Event Receiver — POST a este endpoint con un JSON de evento.")
    .setMimeType(ContentService.MimeType.TEXT);
}
