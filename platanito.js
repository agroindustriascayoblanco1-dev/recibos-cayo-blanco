(() => {
  const SUPABASE_URL = "https://brvzmmvhbhntnuwatuli.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wNR0GBMwaxaMbR3kt-hd_g_VvkJDhlT";
  const mount = document.getElementById("platanito-mount");
  if (!mount || mount.dataset.initialized === "1") return;
  mount.dataset.initialized = "1";

  const style = document.createElement("style");
  style.textContent = [
    "#platanito-app{display:flex;flex-direction:column;height:min(690px,calc(100dvh - 250px));min-height:430px;overflow:hidden;background:#fff;border:1px solid #dce9e5;border-radius:24px;box-shadow:0 12px 34px rgba(6,42,58,.09)}",
    ".platanito-head{display:flex;align-items:center;gap:12px;padding:15px 18px;color:#fff;background:linear-gradient(120deg,#062a3a,#0e7c72)}",
    ".platanito-avatar{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:14px;background:#ffffff20;font-size:23px}",
    ".platanito-head strong{display:block;font-size:15px}.platanito-head small{display:block;margin-top:3px;color:#c8e8df;font-size:11px}",
    ".platanito-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;background:#f5faf8;-webkit-overflow-scrolling:touch}",
    ".platanito-welcome{padding:13px 14px;margin-bottom:12px;border-radius:16px 16px 16px 5px;background:#fff;color:#244b48;font-size:13px;line-height:1.55;box-shadow:0 3px 12px #0b4b3510}",
    ".platanito-msg{max-width:90%;padding:11px 13px;margin:9px 0;border-radius:15px;font-size:13px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}",
    ".platanito-msg.user{margin-left:auto;background:#dff5eb;color:#164b3d;border-bottom-right-radius:4px}.platanito-msg.bot{margin-right:auto;background:#fff;color:#244b48;border-bottom-left-radius:4px;box-shadow:0 2px 9px #0b4b350c}",
    ".platanito-msg.error{color:#9d3030;border:1px solid #f0d4d4}",
    ".platanito-compose{display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #e4eeea;background:#fff}",
    ".platanito-status{display:none;flex:0 0 100%;font-size:11px;line-height:1.25;color:#648078;padding:0 2px}.platanito-status.visible{display:block}",
    "#platanito-question{display:block;flex:1 1 0%;width:0;min-width:0;min-height:46px;max-height:110px;resize:vertical;padding:12px;border:1px solid #d7e6df;border-radius:13px;font-size:16px!important;line-height:1.35;outline:none;touch-action:pan-y;pointer-events:auto;-webkit-user-select:text;user-select:text;box-sizing:border-box;background:#fff;color:#173d38}",
    "#platanito-question:focus{border-color:#19a979;box-shadow:0 0 0 3px #19a97918}#platanito-send{width:46px;height:46px;flex:0 0 46px;border:0;border-radius:13px;background:#0b956b;color:#fff;font-size:18px}#platanito-send:disabled{opacity:.5}",
    "@media(max-width:640px){#platanito-app{height:calc(100dvh - 255px);min-height:390px;border-radius:20px}.platanito-body{padding:12px}.platanito-compose{padding-bottom:calc(12px + env(safe-area-inset-bottom))}}"
  ].join("\n");
  document.head.appendChild(style);

  mount.innerHTML = '<section id="platanito-app" aria-label="Asistente PLATANITO"><div class="platanito-head"><div class="platanito-avatar">🍌</div><div><strong>PLATANITO</strong><small>Asistente del Reglamento Interno</small></div></div><div class="platanito-body" id="platanito-messages" aria-live="polite"><div class="platanito-welcome">¡Hola! Soy PLATANITO 🍌<br>Te ayudo a entender el Reglamento Interno de Agroindustrias Cayo Blanco con respuestas sencillas y directas.<br><br><strong>Por ejemplo:</strong><br>“¿Cuántos días me dan si fallece mi mamá?”<br>“¿Qué hago si no puedo llegar al trabajo?”<br><br>Escribe como hablas normalmente. No necesitas usar palabras legales.</div></div><form class="platanito-compose" id="platanito-form"><div class="platanito-status" id="platanito-status" role="status" aria-live="polite">Un momento, estoy preparando tu respuesta…</div><textarea id="platanito-question" rows="1" maxlength="500" placeholder="Escribe tu pregunta aquí…" aria-label="Escribe tu pregunta" required></textarea><button id="platanito-send" type="submit" aria-label="Enviar pregunta">➤</button></form></section>';

  const body = mount.querySelector("#platanito-messages");
  const form = mount.querySelector("#platanito-form");
  const input = mount.querySelector("#platanito-question");
  const send = mount.querySelector("#platanito-send");
  const status = mount.querySelector("#platanito-status");
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