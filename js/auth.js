// ============================================================
// MenteCheck — Auth Guard
// Importar en TODAS las páginas del admin (excepto index.html)
// ============================================================

import { initializeApp }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig }       from "./firebase-config.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Proteger la página: si no hay sesión → login
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // Inyectar nombre del admin en el topbar si existe
    const adminName = document.getElementById("adminName");
    if (adminName) adminName.textContent = user.email;
    // Disparar evento para que cada página sepa que el user está listo
    document.dispatchEvent(new CustomEvent("authReady", { detail: { user } }));
  }
});

// Logout — disponible globalmente
window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

export { auth, app };
