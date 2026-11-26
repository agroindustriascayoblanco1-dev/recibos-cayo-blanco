(() => {
  const SUPABASE_URL = "https://brvzmmvhbhntnuwatuli.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wNR0GBMwaxaMbR3kt-hd_g_VvkJDhlT";
  const mount = document.getElementById("platanito-mount");
  if (!mount || mount.dataset.initialized === "1") return;
  mount.dataset.initialized = "1";

  const style = document.createElement("style");
  style.textContent = [
    "#platanito-app{display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:#f7fbf9;border:0;border-radius:0;box-shadow:none}",
    "body.platanito-fullscreen{overflow:hidden;background:#f7fbf9}",
    "body.platanito-fullscreen .topbar,body.platanito-fullscreen #dock,body.platanito-fullscreen footer{display:none!important}",
    "body.platanito-fullscreen main.container{width:100%;max-width:none;margin:0;padding:0}",
    "body.platanito-fullscreen #pantallaPlatanito{display:flex;flex-direction:column;width:100%;height:100svh;height:100dvh;min-height:0;overflow:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);background:#f7fbf9}",
    "body.platanito-fullscreen #platanito-mount{display:flex;flex:1;min-height:0;width:100%}",
    ".platanito-head{min-height:68px;padding:12px 16px;flex:0 0 auto}",
    ".platanito-back{width:38px;height:38px;display:grid;place-items:center;flex:0 0 38px;border:1px solid #ffffff35;border-radius:12px;background:#ffffff18;color:#fff;font-size:22px}",
    ".platanito-head-copy{flex:1;min-width:0}",
    ".platanito-logout{flex:0 0 auto;border:1px solid #ffffff55;border-radius:999px;padding:8px 13px;background:#ffffff18;color:#fff;font-size:12px;font-weight:700;touch-action:manipulation}",
    ".platanito-logout:active{background:#ffffff35}",
    ".platanito-body{padding:18px clamp(14px,4vw,28px)}",
    ".platanito-welcome{max-width:780px;margin:12px auto 18px;padding:18px;border-radius:18px;line-height:1.65;font-size:14px}",
    ".platanito-msg{max-width:min(82%,760px);padding:13px 16px;font-size:14px;line-height:1.6}",
    ".platanito-compose{padding:12px max(14px,env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));gap:10px}",
    "#platanito-question{min-height:52px;max-height:140px;border-radius:16px;padding:14px 16px}",
    "#platanito-send{width:52px;height:52px;flex-basis:52px;border-radius:16px;font-size:21px}",
    "@media(max-width:640px){.platanito-head{min-height:64px;padding:10px 13px}.platanito-body{padding:12px}.platanito-msg{max-width:88%;font-size:14px}.platanito-compose{padding-top:10px;padding-bottom:calc(10px + env(safe-area-inset-bottom))}}",
    ".platanito-head{display:flex;align-items:center;gap:12px;padding:15px 18px;color:#fff;background:linear-gradient(120deg,#062a3a,#0e7c72)}",
    ".platanito-avatar{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:14px;background:#ffffff20;font-size:23px}",
    ".platanito-head strong{display:block;font-size:15px}.platanito-head small{display:block;margin-top:3px;color:#c8e8df;font-size:11px}",
    ".platanito-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;background:#f5faf8;-webkit-overflow-scrolling:touch}",
    ".platanito-welcome{padding:15px;margin-bottom:12px;border-radius:16px 16px 16px 5px;background:#fff;color:#244b48;font-size:13px;line-height:1.6;box-shadow:0 3px 12px #0b4b3510}",
    ".platanito-quick{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}",
    ".platanito-quick button{padding:8px 11px;border:1px solid #cfe9dc;border-radius:999px;background:#effaf4;color:#17624d;font-size:12px;font-weight:700;touch-action:manipulation}",
    ".platanito-quick button:active{background:#d9f3e6;transform:scale(.98)}",
    ".platanito-msg{font-size:14px;line-height:1.6}",
    ".platanito-msg{max-width:90%;padding:11px 13px;margin:9px 0;border-radius:15px;font-size:13px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}",
    ".platanito-msg.user{margin-left:auto;background:#dff5eb;color:#164b3d;border-bottom-right-radius:4px}.platanito-msg.bot{margin-right:auto;background:#fff;color:#244b48;border-bottom-left-radius:4px;box-shadow:0 2px 9px #0b4b350c}",
    ".platanito-msg.error{color:#9d3030;border:1px solid #f0d4d4}",
    ".platanito-compose{display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #e4eeea;background:#fff}",
    ".platanito-status{display:none;flex:0 0 100%;font-size:11px;line-height:1.25;color:#648078;padding:0 2px}.platanito-status.visible{display:block}",
    "#platanito-question{display:block;flex:1 1 0%;width:0;min-width:0;min-height:46px;max-height:110px;resize:vertical;padding:12px;border:1px solid #d7e6df;border-radius:13px;font-size:16px!important;line-height:1.35;outline:none;touch-action:pan-y;pointer-events:auto;-webkit-user-select:text;user-select:text;box-sizing:border-box;background:#fff;color:#173d38}",
    "#platanito-question:focus{border-color:#19a979;box-shadow:0 0 0 3px #19a97918}#platanito-send{width:46px;height:46px;flex:0 0 46px;border:0;border-radius:13px;background:#0b956b;color:#fff;font-size:18px}#platanito-send:disabled{opacity:.5}",
    "@media(max-width:640px){#platanito-app{height:100%;min-height:0;border-radius:0}.platanito-body{padding:12px}.platanito-compose{padding-bottom:calc(10px + env(safe-area-inset-bottom))}}"
  ].join("\n");
  document.head.appendChild(style);

  mount.innerHTML = '<section id="platanito-app" aria-label="Asistente PLATANITO"><div class="platanito-head"><button type="button" class="platanito-back" id="platanito-back" aria-label="Volver al portal">‹</button><div class="platanito-avatar">🍌</div><div class="platanito-head-copy"><strong>PLATANITO</strong><small>Asistente del Reglamento Interno</small></div><button type="button" class="platanito-logout" id="platanito-logout">Salir</button></div><div class="platanito-body" id="platanito-messages" aria-live="polite"><div class="platanito-welcome">¡Hola! Soy PLATANITO 🍌<br>Te ayudo a consultar tus permisos, horarios, vacaciones y otras normas de trabajo. Respondo con palabras sencillas e indico el artículo y la página cuando encuentro la información.<br><br><strong>Prueba una consulta:</strong><div class="platanito-quick"><button type="button" data-question="¿Cuáles permisos son con goce de sueldo?">Permisos con sueldo</button><button type="button" data-question="¿Qué pasa si llego tarde?">Llegadas tarde</button><button type="button" data-question="¿Cuántos días de vacaciones me corresponden?">Vacaciones</button><button type="button" data-question="¿Cuántos días me dan si fallece un familiar?">Fallecimiento familiar</button></div><br>También puedes escribir tu pregunta como hablas normalmente; no necesitas usar palabras legales.</div></div><form class="platanito-compose" id="platanito-form"><div class="platanito-status" id="platanito-status" role="status" aria-live="polite">Un momento, estoy preparando tu respuesta…</div><textarea id="platanito-question" rows="1" maxlength="500" placeholder="Escribe tu pregunta aquí…" aria-label="Escribe tu pregunta" required></textarea><button id="platanito-send" type="submit" aria-label="Enviar pregunta">➤</button></form></section>';

  const body = mount.querySelector("#platanito-messages");
  const form = mount.querySelector("#platanito-form");
  const input = mount.querySelector("#platanito-question");
  const send = mount.querySelector("#platanito-send");
  const status = mount.querySelector("#platanito-status");
  mount.querySelector("#platanito-back")?.addEventListener("click", () => window.show?.("pantallaPortal"));
  mount.querySelector("#platanito-logout")?.addEventListener("click", () => { if (typeof window.logout === "function") window.logout(); });

  mount.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.question || "";
      input.focus({ preventScroll: true });
    });
  });
  const conversationHistory = [];
  let requestInProgress = false;

  function addMessage(text, kind = "bot") {
    const el = document.createElement("div");
    el.className = "platanito-msg " + kind;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (requestInProgress) return;
    const question = input.value.trim();
    const employee = window.empleadoActual;
    const code = String(employee?.codigo || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!code || !/^[A-Z0-9]{6,16}$/.test(code)) {
      addMessage("Primero debes ingresar al portal con tu código de colaborador.", "error");
      return;
    }
    if (question.length < 3) { input.focus(); return; }

    requestInProgress = true;
    addMessage(question, "user");
    const loading = addMessage("Consultando el Reglamento Interno…");
    conversationHistory.push({ role: "user", content: question });
    input.value = "";
    status.classList.add("visible");
    send.disabled = true;
    send.textContent = "…";

    try {
      const response = await fetch(SUPABASE_URL + "/functions/v1/platanito-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ question, employee_code: code, conversation_history: conversationHistory.slice(-8) }),
        signal: AbortSignal.timeout(18000)
      });
      const data = await response.json().catch(() => ({}));
      loading.remove();
      if (!response.ok || !data.ok) throw new Error(data.error || "No fue posible consultar el Reglamento.");
      const reply = data.message || "Consulta completada.";
      addMessage(reply);
      conversationHistory.push({ role: "assistant", content: reply });
      if (conversationHistory.length > 10) conversationHistory.splice(0, conversationHistory.length - 10);
    } catch (error) {
      loading.remove();
      const message = error?.name === "TimeoutError" || error?.name === "AbortError"
        ? "La consulta tardó demasiado. Ya puedes escribir e intentarlo nuevamente."
        : (error?.message || "No fue posible conectar con PLATANITO. Inténtalo nuevamente.");
      addMessage(message, "error");
    } finally {
      requestInProgress = false;
      status.classList.remove("visible");
      send.disabled = false;
      send.textContent = "➤";
      input.focus({ preventScroll: true });
    }
  });

  document.getElementById("cerrarSesion")?.addEventListener("click", () => {
    conversationHistory.length = 0;
    body.innerHTML = '<div class="platanito-welcome">La conversación se reiniciará cuando vuelvas a ingresar.</div>';
    input.value = "";
  });
})();