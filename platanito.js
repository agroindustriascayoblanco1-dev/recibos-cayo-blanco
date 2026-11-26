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
    "body.platanito-fullscreen #pantallaPlatanito{display:flex;flex-direction:column;width:100%;height:100svh;height:100dvh;min-height:0;overflow:hidden;padding-top:0;padding-bottom:env(safe-area-inset-bottom);background:#f7fbf9}",
    "body.platanito-fullscreen #platanito-mount{display:flex;flex:1;min-height:0;width:100%}",
    ".platanito-head{min-height:68px;padding:12px 16px;flex:0 0 auto}",
    ".platanito-back{min-height:48px;min-width:104px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;padding:0 14px;border:1px solid #ffffff65;border-radius:999px;background:#ffffff22;color:#fff;font-size:13px;font-weight:700;white-space:nowrap;touch-action:manipulation;position:relative;z-index:2;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    ".platanito-back:active{background:#ffffff35}",
    ".platanito-head-copy{flex:1;min-width:0}",
    ".platanito-logout{flex:0 0 auto;border:1px solid #ffffff55;border-radius:999px;padding:8px 13px;background:#ffffff18;color:#fff;font-size:12px;font-weight:700;touch-action:manipulation}",
    ".platanito-logout:active{background:#ffffff35}",
    ".platanito-body{padding:18px clamp(14px,4vw,28px)}",
    ".platanito-welcome{max-width:780px;margin:12px auto 18px;padding:18px;border-radius:18px;line-height:1.65;font-size:14px}",
    ".platanito-msg{max-width:min(82%,760px);padding:13px 16px;font-size:14px;line-height:1.6}",
    ".platanito-compose{padding:12px max(14px,env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));gap:10px}",
    "#platanito-question{min-height:52px;max-height:140px;border-radius:16px;padding:14px 16px}",
    "#platanito-send{width:52px;height:52px;flex-basis:52px;border-radius:16px;font-size:21px}",
    "@media(max-width:640px){.platanito-head{min-height:104px;padding:calc(env(safe-area-inset-top) + 18px) 12px 14px;gap:9px}.platanito-head-copy strong{font-size:14px}.platanito-head-copy small{font-size:10px}.platanito-avatar{width:46px;height:46px;flex:0 0 46px}.platanito-back{min-width:100px;min-height:48px;padding:0 12px;font-size:12px}.platanito-body{padding:12px}.platanito-msg{max-width:88%;font-size:14px}.platanito-compose{padding-top:10px;padding-bottom:calc(10px + env(safe-area-inset-bottom))}}",
    ".platanito-head{display:flex;align-items:center;gap:10px;flex:0 0 auto;min-height:104px;box-sizing:border-box;padding:calc(env(safe-area-inset-top) + 18px) 14px 14px;color:#fff;background:linear-gradient(120deg,#062a3a,#0e7c72)}",
    ".platanito-avatar{width:48px;height:48px;display:grid;place-items:center;flex:0 0 48px;overflow:hidden;border-radius:14px;background:#ffffff20;padding:2px}",
    ".platanito-avatar img{width:100%;height:100%;object-fit:contain;border-radius:12px}",
    ".platanito-welcome-brand{display:flex;align-items:center;gap:10px;margin-bottom:10px;color:#17624d;font-size:15px}",
    ".platanito-welcome-brand img{width:58px;height:58px;object-fit:contain;flex:0 0 58px}",
    ".platanito-head strong{display:block;font-size:15px}.platanito-head small{display:block;margin-top:3px;color:#c8e8df;font-size:11px}",
    ".platanito-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;background:#f5faf8;-webkit-overflow-scrolling:touch}",
    ".platanito-welcome{padding:15px;margin-bottom:12px;border-radius:16px 16px 16px 5px;background:#fff;color:#244b48;font-size:13px;line-height:1.6;box-shadow:0 3px 12px #0b4b3510}",
    ".platanito-quick{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}",
    ".platanito-quick button{padding:8px 11px;border:1px solid #cfe9dc;border-radius:999px;background:#effaf4;color:#17624d;font-size:12px;font-weight:700;touch-action:manipulation}",
    ".platanito-quick button:active{background:#d9f3e6;transform:scale(.98)}",
    ".platanito-msg{font-size:14px;line-height:1.6}",
    ".platanito-msg strong{font-weight:800;color:inherit}",
    ".platanito-msg{max-width:90%;padding:11px 13px;margin:9px 0;border-radius:15px;font-size:13px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}",
    ".platanito-msg.user{margin-left:auto;background:#dff5eb;color:#164b3d;border-bottom-right-radius:4px}.platanito-msg.bot{margin-right:auto;background:#fff;color:#244b48;border-bottom-left-radius:4px;box-shadow:0 2px 9px #0b4b350c}",
    ".platanito-msg.error{color:#9d3030;border:1px solid #f0d4d4}",
    ".platanito-compose{display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #e4eeea;background:#fff}",
    ".platanito-status{display:none;flex:0 0 100%;font-size:11px;line-height:1.25;color:#648078;padding:0 2px}.platanito-status.visible{display:block}",
    "#platanito-question{display:block;flex:1 1 0%;width:0;min-width:0;min-height:46px;max-height:110px;resize:vertical;padding:12px;border:1px solid #d7e6df;border-radius:13px;font-size:16px!important;line-height:1.35;outline:none;touch-action:pan-y;pointer-events:auto;-webkit-user-select:text;user-select:text;box-sizing:border-box;background:#fff;color:#173d38}",
    "#platanito-question:focus{border-color:#19a979;box-shadow:0 0 0 3px #19a97918}#platanito-send{width:46px;height:46px;flex:0 0 46px;border:0;border-radius:13px;background:#0b956b;color:#fff;font-size:18px}#platanito-send:disabled{opacity:.5}",
    "@media(max-width:640px){#platanito-app{height:100%;min-height:0;border-radius:0}.platanito-body{padding:12px}.platanito-compose{padding-bottom:calc(10px + env(safe-area-inset-bottom))}}",
    "@media(min-width:900px){body.platanito-fullscreen{background:radial-gradient(circle at 10% 10%,#e0f4eb 0,transparent 32%),linear-gradient(135deg,#eef5f2,#eaf1f3)}body.platanito-fullscreen #pantallaPlatanito{height:100vh;height:100dvh;min-height:620px;justify-content:center;padding:28px 34px;box-sizing:border-box;background:transparent}body.platanito-fullscreen #platanito-mount{flex:0 1 auto;width:min(1180px,100%);height:min(880px,calc(100dvh - 56px));min-height:560px;margin:0 auto;filter:drop-shadow(0 18px 42px #082f3520)}#platanito-app{border:1px solid #dcebe5;border-radius:24px;box-shadow:0 18px 48px #0b4b3518}.platanito-head{min-height:82px;padding:14px 26px;gap:14px}.platanito-avatar{width:54px;height:54px;flex-basis:54px;border-radius:16px}.platanito-head strong{font-size:18px;letter-spacing:.2px}.platanito-head small{font-size:13px}.platanito-back{min-width:118px;min-height:44px;font-size:13px}.platanito-body{padding:28px clamp(28px,5vw,64px)}.platanito-welcome{max-width:900px;margin:8px auto 22px;padding:22px 24px;font-size:15px;line-height:1.7;border-radius:18px 18px 18px 6px}.platanito-welcome-brand{font-size:17px}.platanito-welcome-brand img{width:66px;height:66px;flex-basis:66px}.platanito-quick{gap:9px;margin-top:16px}.platanito-quick button{padding:10px 15px;font-size:13px;cursor:pointer}.platanito-msg{max-width:76%;padding:14px 18px;margin:12px 0;font-size:15px;line-height:1.65;border-radius:17px}.platanito-compose{padding:18px 26px 20px;gap:12px;flex-wrap:nowrap;align-items:flex-end}.platanito-status{order:0;flex-basis:100%}.platanito-compose{position:relative}.platanito-compose:has(.platanito-status.visible){flex-wrap:wrap}#platanito-question{min-height:58px;max-height:160px;padding:16px 18px;border-radius:16px;font-size:16px!important;resize:none}#platanito-send{width:58px;height:58px;flex-basis:58px;border-radius:16px;font-size:22px;cursor:pointer;transition:transform .15s,background .15s}#platanito-send:hover:not(:disabled){background:#087d5a;transform:translateY(-1px)}.platanito-logout{cursor:pointer}}",
    "@media(min-width:641px) and (max-width:899px){body.platanito-fullscreen #pantallaPlatanito{height:100dvh;padding:16px;background:#f2f7f4}body.platanito-fullscreen #platanito-mount{min-height:0}#platanito-app{border:1px solid #dcebe5;border-radius:18px;box-shadow:0 10px 30px #0b4b3512}.platanito-head{min-height:76px;padding:12px 18px}.platanito-body{padding:18px 24px}.platanito-compose{padding:14px 18px 16px}}",
  ].join("\n");
  document.head.appendChild(style);

  mount.innerHTML = '<section id="platanito-app" aria-label="Asistente PLATANITO"><div class="platanito-head"><button type="button" class="platanito-back" id="platanito-back" aria-label="Regresar al portal">← Regresar</button><div class="platanito-avatar"><img src="platanito.png?v=1" alt="Mascota PLATANITO"></div><div class="platanito-head-copy"><strong>PLATANITO</strong><small>Tu asistente virtual de Recursos Humanos</small></div></div><div class="platanito-body" id="platanito-messages" aria-live="polite"><div class="platanito-welcome"><div class="platanito-welcome-brand"><img src="platanito.png?v=1" alt="Mascota PLATANITO"><strong>¡Hola! Soy PLATANITO</strong></div>Tu asistente virtual de Recursos Humanos. Puedo ayudarte a consultar el Reglamento Interno sobre permisos, horarios, vacaciones, derechos, obligaciones y otras disposiciones de trabajo. Mis respuestas se basan en la información del Reglamento.<br><br><strong>Prueba una consulta:</strong><div class="platanito-quick"><button type="button" data-question="¿Cuáles permisos son con goce de sueldo?">Permisos con sueldo</button><button type="button" data-question="¿Qué pasa si llego tarde?">Llegadas tarde</button><button type="button" data-question="¿Cuántos días de vacaciones me corresponden?">Vacaciones</button><button type="button" data-question="¿Cuántos días me dan si fallece un familiar?">Fallecimiento familiar</button></div><br>También puedes escribir tu pregunta como hablas normalmente; no necesitas usar palabras legales.</div></div><form class="platanito-compose" id="platanito-form"><div class="platanito-status" id="platanito-status" role="status" aria-live="polite">Un momento, estoy preparando tu respuesta…</div><textarea id="platanito-question" rows="1" maxlength="500" placeholder="Escribe tu pregunta aquí…" aria-label="Escribe tu pregunta" required></textarea><button id="platanito-send" type="submit" aria-label="Enviar pregunta">➤</button></form></section>';

  const body = mount.querySelector("#platanito-messages");
  const form = mount.querySelector("#platanito-form");
  const input = mount.querySelector("#platanito-question");
  const send = mount.querySelector("#platanito-send");
  const status = mount.querySelector("#platanito-status");
  mount.querySelector("#platanito-back")?.addEventListener("click", () => window.show?.("pantallaPortal"));


  mount.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.question || "";
      input.focus({ preventScroll: true });
    });
  });
  // En computadora, Enter envía y Shift+Enter permite escribir en varias líneas.
  // El ajuste automático de altura se limita al escritorio para conservar el comportamiento móvil.
  const desktopInput = window.matchMedia("(min-width: 641px)");
  function fitDesktopInput() {
    if (!desktopInput.matches) { input.style.height = ""; return; }
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 160) + "px";
  }
  input.addEventListener("input", fitDesktopInput);
  input.addEventListener("keydown", (event) => {
    if (!desktopInput.matches || event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    if (!requestInProgress && input.value.trim()) form.requestSubmit();
  });
  window.addEventListener("resize", fitDesktopInput, { passive: true });
  const conversationHistory = [];
  let requestInProgress = false;

  function addMessage(text, kind = "bot") {
    const el = document.createElement("div");
    el.className = "platanito-msg " + kind;
    // Renderiza **texto** como negrita sin interpretar HTML ni permitir etiquetas externas.
    const parts = String(text ?? "").split(/(\*\*[\s\S]+?\*\*|https:\/\/[^\s]+)/g);
    for (const part of parts) {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        el.appendChild(strong);
      } else if (/^https:\/\//i.test(part)) {
        const link = document.createElement("a");
        link.href = part.replace(/[),.;]+$/, "");
        link.textContent = link.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.color = "#087a59";
        link.style.textDecoration = "underline";
        el.appendChild(link);
      } else if (part) {
        el.appendChild(document.createTextNode(part));
      }
    }
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
    const isReceiptQuestion = /(mi recibo|recibo de pago|recibo|cu[aá]nto (?:recib[ií]|me pagaron|cobr[eé]|me depositaron)|cu[aá]nto (?:me )?(?:pagaron|pagan|est[aá]n pagando)|esta quincena|quincena (?:pasada|anterior|actual)|pago de (?:esta|la) quincena|mi sueldo|mi salario|deducci[oó]n|rebajo|me rebajaron|salario neto|total pagado|total recibido|total devengado|d[ií]as pagados|incapacidad|incapacidades|vacaciones|vacacional|pago de vacaciones|pago por incapacidad|me pagaron por|me pagan por|desglose de pago|detalle de pago)/i.test(question);
    const loading = addMessage(isReceiptQuestion ? "Verificando tu recibo de pago de esta sesión…" : "Revisando el Reglamento y la información del portal…");
    conversationHistory.push({ role: "user", content: question });
    input.value = "";
    status.classList.add("visible");
    send.disabled = true;
    send.textContent = "…";

    try {
      let receiptContext = [];
      if (isReceiptQuestion) {
        const sessionCode = String(window.empleadoActual?.codigo || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (!sessionCode || typeof window.obtenerRecibosDeSesionParaPlatanito !== "function") {
          throw new Error("No pude verificar tu sesión para consultar el recibo. Sal del portal e ingresa nuevamente.");
        }
        receiptContext = await window.obtenerRecibosDeSesionParaPlatanito(sessionCode);
        if (!receiptContext.length) throw new Error("No encontré un recibo disponible para tu código en los períodos publicados.");
      }
      const response = await fetch(SUPABASE_URL + "/functions/v1/platanito-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ question, employee_code: code, conversation_history: conversationHistory.slice(-8), receipt_context: receiptContext }),
        signal: AbortSignal.timeout(45000)
      });
      const data = await response.json().catch(() => ({}));
      loading.remove();
      if (!response.ok || !data.ok) throw new Error(data.error || "No fue posible completar la consulta de Recursos Humanos.");
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