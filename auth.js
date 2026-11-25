import { createClient } from "https://esm.sh/@supabase/supabase-js@2.102.0";

const SUPABASE_URL = "https://brvzmmvhbhntnuwatuli.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wNR0GBMwaxaMbR3kt-hd_g_VvkJDhlT";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "cayo-blanco-employee-session"
  }
});
window.portalSupabase = supabase;

const $auth = (id) => document.getElementById(id);
const employeeEmail = (code) => code.toLowerCase() + "@empleados.cayoblanco.hn";

async function loadEmployeeProfile() {
  const { data, error } = await supabase.functions.invoke("employee-profile", { body: {} });
  if (error || !data?.employee) throw new Error("No se pudo validar el perfil del colaborador.");
  const e = data.employee;
  window.empleadoActual = {
    codigo: e.code,
    nombre: e.name,
    departamento: e.department || "",
    puesto: e.jobTitle || ""
  };
  $auth("nombreEmpleado").textContent = e.name || "Colaborador";
  $auth("codigoEmpleado").textContent = e.code || "—";
  if (typeof cargarAvatar === "function") cargarAvatar();
  if (typeof cargarCarnet === "function") cargarCarnet();
  if (typeof show === "function") show("pantallaPortal");
  document.body.classList.add("logged");
  return e;
}

window.acceder = async function () {
  const code = String($auth("codigo")?.value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const password = String($auth("contrasena")?.value || "");
  const button = $auth("buscar");
  if (!/^[A-Z0-9]{6,16}$/.test(code)) {
    if (typeof msg === "function") msg("Escribe un código de empleado válido.", true);
    return;
  }
  if (!password) {
    if (typeof msg === "function") msg("Escribe tu contraseña.", true);
    return;
  }
  button.disabled = true;
  button.textContent = "Verificando...";
  if (typeof msg === "function") msg("Verificando tus credenciales...");
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: employeeEmail(code),
      password
    });
    if (error) throw error;
    await loadEmployeeProfile();
    $auth("contrasena").value = "";
    if (typeof msg === "function") msg("");
  } catch (_error) {
    await supabase.auth.signOut();
    if (typeof msg === "function") msg("Código o contraseña incorrectos, o cuenta aún no activada. Si es tu primer ingreso, solicita una invitación a Recursos Humanos.", true);
  } finally {
    button.disabled = false;
    button.textContent = "Ingresar";
  }
};

window.logout = async function () {
  try { await supabase.auth.signOut(); } catch (_error) {}
  window.empleadoActual = null;
  window.pdfActual = null;
  window.paginaEncontrada = null;
  $auth("codigo").value = "";
  $auth("contrasena").value = "";
  if (typeof closeSheet === "function") closeSheet();
  document.body.classList.remove("logged");
  if (typeof show === "function") show("pantallaAcceso");
  if (typeof msg === "function") msg("");
};

async function activateAccount() {
  const code = String($auth("codigo")?.value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const inviteToken = String($auth("tokenInvitacion")?.value || "").trim();
  const password = String($auth("nuevaContrasena")?.value || "");
  const status = $auth("mensajeActivacion");
  const button = $auth("activarCuentaBtn");
  if (!/^[A-Z0-9]{6,16}$/.test(code) || inviteToken.length < 24 || password.length < 12) {
    status.textContent = "Verifica tu código, invitación y contraseña (mínimo 12 caracteres).";
    status.className = "message error";
    return;
  }
  button.disabled = true;
  button.textContent = "Activando...";
  status.textContent = "Validando tu invitación...";
  status.className = "message";
  try {
    const { data, error } = await supabase.functions.invoke("employee-enroll", {
      body: { employeeCode: code, inviteToken, password }
    });
    if (error || !data?.ok) throw new Error(data?.error || error?.message || "No se pudo activar la cuenta.");
    $auth("contrasena").value = password;
    $auth("tokenInvitacion").value = "";
    $auth("nuevaContrasena").value = "";
    $auth("activacionCuenta").hidden = true;
    status.textContent = "Cuenta activada. Iniciando sesión...";
    status.className = "message";
    await window.acceder();
  } catch (error) {
    status.textContent = error?.message || "No se pudo activar la cuenta. Contacta a Recursos Humanos.";
    status.className = "message error";
  } finally {
    button.disabled = false;
    button.textContent = "Activar cuenta";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  $auth("toggleActivacion")?.addEventListener("click", () => {
    const box = $auth("activacionCuenta");
    box.hidden = !box.hidden;
    if (!box.hidden) $auth("tokenInvitacion")?.focus();
  });
  $auth("activarCuentaBtn")?.addEventListener("click", activateAccount);
  $auth("contrasena")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") window.acceder();
  });
  $auth("nuevaContrasena")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") activateAccount();
  });

  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    try {
      await loadEmployeeProfile();
    } catch (_error) {
      await supabase.auth.signOut();
    }
  }
});
