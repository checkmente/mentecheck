// ============================================================
// MenteCheck — Configuración Global
// Todas las landings importan este archivo.
// El número de WhatsApp y otros datos se leen desde
// Firebase (config/general) que gestionas desde el panel.
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCkMpLl3CgxLfrU9YRFN9ON0UkCN1fqwSo",
  authDomain:        "mentecheck-6f19f.firebaseapp.com",
  projectId:         "mentecheck-6f19f",
  storageBucket:     "mentecheck-6f19f.firebasestorage.app",
  messagingSenderId: "954208277838",
  appId:             "1:954208277838:web:80a5093ff550676671ba1f"
};

// Inicializar Firebase solo si no está ya inicializado
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);

// Config por defecto (fallback si Firebase falla o no tiene datos aún)
const DEFAULTS = {
  whatsapp:      "5500000000",   // ← número temporal hasta configurar en el panel
  negocio_nombre: "MenteCheck",
  link_agenda:   "#",
  whatsapp_inicial:      "Hola {nombre} 👋\n\nRecibimos tu resultado del Test de {test}.\nTu nivel es: *{nivel}*.\n\n¿Te gustaría hablar con un psicólogo esta semana? Podemos ayudarte sin compromiso 💙\n\n— Equipo MenteCheck",
  whatsapp_seguimiento1: "Hola {nombre}, te escribimos de MenteCheck 🧠\n\nHace unos días completaste nuestro Test de {test}.\n\n¿Sigues interesado/a? Tenemos disponibilidad esta semana 📅",
  whatsapp_seguimiento2: "Hola {nombre}, último mensaje de nuestra parte 😊\n\nSi en algún momento decides retomar tu proceso, aquí estaremos. ¡Cuídate mucho! 💙 — Equipo MenteCheck"
};

// Cargar config desde Firebase
async function cargarConfig() {
  try {
    const snap = await getDoc(doc(db, "config", "general"));
    if (snap.exists()) {
      const data = snap.data();
      return {
        whatsapp:      data.negocio_whatsapp || DEFAULTS.whatsapp,
        negocio_nombre: data.negocio_nombre  || DEFAULTS.negocio_nombre,
        link_agenda:   data.link_agenda      || DEFAULTS.link_agenda,
        whatsapp_inicial:      data.whatsapp_inicial      || DEFAULTS.whatsapp_inicial,
        whatsapp_seguimiento1: data.whatsapp_seguimiento1 || DEFAULTS.whatsapp_seguimiento1,
        whatsapp_seguimiento2: data.whatsapp_seguimiento2 || DEFAULTS.whatsapp_seguimiento2,
      };
    }
  } catch(e) {
    console.warn("MenteCheck config: usando valores por defecto.", e.message);
  }
  return DEFAULTS;
}

// Helpers que usan las landings
export function buildWaLink(numero, texto) {
  // Limpia cualquier formato: +52, espacios, guiones
  let num = numero.replace(/\D/g, "");
  // Si ya trae el 52 adelante y tiene más de 10 dígitos, quitarlo
  if (num.startsWith("52") && num.length > 10) num = num.slice(2);
  return `https://wa.me/52${num}?text=${encodeURIComponent(texto)}`;
}

export function interpolar(template, vars) {
  return template
    .replace(/{nombre}/g, vars.nombre || "")
    .replace(/{test}/g,   vars.test   || "")
    .replace(/{nivel}/g,  vars.nivel  || "");
}

// Exportar config cargada (Promise)
export const mcConfig = cargarConfig();

// Exportar Firebase para que las landings no lo reinicialicen
export { app, db };
