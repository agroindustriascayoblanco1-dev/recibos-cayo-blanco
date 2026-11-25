(() => {
  if (document.getElementById("platanito-fab")) return;

  const SUPABASE_URL = "https://brvzmmvhbhntnuwatuli.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wNR0GBMwaxaMbR3kt-hd_g_VvkJDhlT";

  const style = document.createElement("style");
  style.textContent = `
    #platanito-fab{position:fixed;right:24px;bottom:92px;z-index:900;width:62px;height:62px;border:0;border-radius:50%;background:linear-gradient(145deg,#19bd83,#087e62);color:#fff;box-shadow:0 12px 30px #063d3150;display:none;align-items:center;justify-content:center;font-size:28px;cursor:pointer}
    #platanito-fab.visible{display:flex}
    #platanito-fab:after{content:"";position:absolute;inset:-5px;border:2px solid #19bd8355;border-radius:50%;animation:platanitoPulse 2s infinite}
    @keyframes platanitoPulse{50%{transform:scale(1.12);opacity:.35}}
    #platanito-backdrop{position:fixed;inset:0;z-index:899;background:rgba(5,24,29,.38);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease;pointer-events:none}
    #platanito-backdrop.open{opacity:1;visibility:visible}
    #platanito-panel{position:fixed;right:24px;bottom:166px;z-index:901;width:min(390px,calc(100vw - 28px));height:min(560px,calc(100dvh - 190px));display:none;flex-direction:column;overflow:hidden;background:#fff;border:1px solid #dce9e5;border-radius:24px;box-shadow:0 22px 70px #062a3a35}
    #platanito-panel.open{display:flex}
    .platanito-head{display:flex;align-items:center;gap:12px;padding:16px 18px;color:#fff;background:linear-gradient(120deg,#062a3a,#0e7c72)}
    .platanito-avatar{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:14px;background:#ffffff20;font-size:23px}
    .platanito-head strong{display:block;font-size:15px}.platanito-head small{display:block;margin-top:3px;color:#c8e8df;font-size:11px}
    .platanito-close{margin-left:auto;width:34px;height:34px;border:0;border-radius:50%;background:#ffffff20;color:#fff;font-size:21px}
    .platanito-body{flex:1;overflow:auto;padding:16px;background:#f5faf8}
    .platanito-welcome{padding:13px 14px;margin-bottom:12px;border-radius:16px 16px 16px 5px;background:#fff;color:#244b48;font-size:13px;line-height:1.55;box-shadow:0 3px 12px #0b4b3510}
    .platanito-msg{max-width:90%;padding:11px 13px;margin:9px 0;border-radius:15px;font-size:13px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}
    .platanito-msg.user{margin-left:auto;background:#dff5eb;color:#164b3d;border-bottom-right-radius:4px}
    .platanito-msg.bot{margin-right:auto;background:#fff;color:#244b48;border-bottom-left-radius:4px;box-shadow:0 2px 9px #0b4b350c}
    .platanito-msg.error{color:#9d3030;border:1px solid #f0d4d4}
    .platanito-compose{display:flex;gap:8px;padding:12px;border-top:1px solid #e4eeea;background:#fff}
    #platanito-question{flex:1;min-width:0;resize:none;max-height:90px;padding:11px 12px;border:1px solid #d7e6df;border-radius:13px;font-size:20px!important;font-family:Arial,sans-serif;line-height:1.45;-webkit-text-size-adjust:100%;text-size-adjust:100%;outline:none;touch-action:manipulation}
    #platanito-question:focus{border-color:#19a979;box-shadow:0 0 0 3px #19a97918}
    #platanito-send{width:42px;height:42px;flex:0 0 42px;border:0;border-radius:13px;background:#0b956b;color:#fff;font-size:18px}
    #platanito-send:disabled{opacity:.5}
    @media(max-width:600px){#platanito-fab{right:16px;bottom:88px;width:56px;height:56px}#platanito-panel{right:10px;bottom:154px;width:calc(100vw - 20px);height:min(590px,calc(100dvh - 175px));border-radius:21px}}
  `;
  document.head.appendChild(style);

  const fab = document.createElement("button");
  fab.id = "platanito-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "Abrir PLATANITO");
  fab.title = "Consultar a PLATANITO";
  fab.textContent = "🍌";

  const backdrop = document.createElement("div");
  backdrop.id = "platanito-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const panel = document.createElement("section");
  panel.id = "platanito-panel";
  panel.setAttribute("aria-label", "Chat PLATANITO");
  panel.innerHTML = '<div class="platanito-head"><div class="platanito-avatar">🍌</div><div><strong>PLATANITO</strong><small>Asistente del Reglamento Interno</small></div><button class="platanito-close" type="button" aria-label="Cerrar">×</button></div><div class="platanito-body" id="platanito-messages"><div class="platanito-welcome">¡Hola! Soy PLATANITO. 🍌<br>Hazme tu pregunta sobre el Reglamento Interno y te daré una respuesta clara y directa. Solo mostraré mi respuesta, sin desplegar el texto completo de los artículos.</div></div><form class="platanito-compose" id="platanito-form"><textarea id="platanito-question" rows="1" maxlength="500" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta" required></textarea><button id="platanito-send" type="submit" aria-label="Enviar pregunta">➤</button></form>';
  document.body.append(fab, backdrop, panel);

  const body = panel.querySelector("#platanito-messages");
  const form = panel.querySelector("#platanito-form");
  const input = panel.querySelector("#platanito-question");
  const send = panel.querySelector("#platanito-send");
  // Historial temporal de esta conversación; se reinicia al recargar o cerrar sesión.
  const conversationHistory = [];
  let lockedScrollY = 0;
  function lockBackground() {
    if (document.body.dataset.platanitoLocked === "1") return;
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.dataset.platanitoLocked = "1";
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }
  function unlockBackground() {
    if (document.body.dataset.platanitoLocked !== "1") return;
    document.body.dataset.platanitoLocked = "0";
    document.documentElement.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, lockedScrollY);
  }
  const open = () => { lockBackground(); backdrop.classList.add("open"); panel.classList.add("open"); };
  const close = () => { panel.classList.remove("open"); backdrop.classList.remove("open"); unlockBackground(); };

  function addMessage(text, kind = "bot") {
    const el = document.createElement("div");
    el.className = "platanito-msg " + kind;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  fab.addEventListener("click", () => panel.classList.contains("open") ? close() : open());
  panel.querySelector(".platanito-close").addEventListener("click", close);

  // Cola secuencial: permite escribir y enviar nuevos mensajes mientras
  // PLATANITO responde, conservando el orden y el contexto de la conversación.
  const requestQueue = [];
  let processingQueue = false;

  async function processQueue() {
    if (processingQueue) return;
    processingQueue = true;
    try {
      while (requestQueue.length) {
        const job = requestQueue.shift();
        conversationHistory.push({ role: "user", content: job.question });
        try {
          const response = await fetch(SUPABASE_URL + "/functions/v1/platanito-chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify({
              question: job.question,
              employee_code: job.code,
              conversation_history: conversationHistory.slice(-8)
            })
          });
          const data = await response.json().catch(() => ({}));
          job.loading.remove();
          if (!response.ok || !data.ok) {
            throw new Error(data.error || "No fue posible consultar el Reglamento.");
          }
          const reply = data.message || "Consulta completada.";
          addMessage(reply);
          conversationHistory.push({ role: "assistant", content: reply });
          if (conversationHistory.length > 10) {
            conversationHistory.splice(0, conversationHistory.length - 10);
          }
        } catch (error) {
          job.loading.remove();
          addMessage(error?.message || "No fue posible conectar con PLATANITO. Inténtalo nuevamente.", "error");
        }
      }
    } finally {
      processingQueue = false;
      send.disabled = false;
      send.textContent = "➤";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    const employee = window.empleadoActual;
    const code = String(employee?.codigo || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!code || !/^[A-Z0-9]{6,16}$/.test(code)) {
      addMessage("Primero debes ingresar al portal con tu código de colaborador.", "error");
      return;
    }
    if (question.length < 3) {
      input.focus();
      return;
    }

    addMessage(question, "user");
    const loading = addMessage("Consultando el Reglamento Interno…");
    requestQueue.push({ question, code, loading });
    input.value = "";
    input.style.height = "auto";
    send.disabled = false;
    send.textContent = "➤";
    input.focus();
    processQueue();
  });

  const portal = document.getElementById("pantallaPortal");
  const access = document.getElementById("pantallaAcceso");
  function sync() {
    const authenticated = !!(
      portal &&
      portal.classList.contains("active") &&
      access &&
      !access.classList.contains("active") &&
      window.empleadoActual?.codigo
    );
    fab.classList.toggle("visible", authenticated);
    if (!authenticated) close();
  }
  if (portal && access) {
    new MutationObserver(sync).observe(document.querySelector("main") || document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }
  document.getElementById("cerrarSesion")?.addEventListener("click", () => {
    close();
    conversationHistory.length = 0;
    fab.classList.remove("visible");
  });
  sync();
})();