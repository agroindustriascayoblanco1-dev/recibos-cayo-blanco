
(function(){
  const CONTACTOS = [
    {nombre:"Cristhian Osorio Acosta",cargo:"Auxiliar de RRHH",tel:"32258230",display:"+504 3225-8230",icon:"👤"},
    {nombre:"Mayda Yanely Palma",cargo:"Auxiliar de RRHH",tel:"31623652",display:"+504 3162-3652",icon:"👤"},
    {nombre:"Mariano Alejandro Perez",cargo:"Auxiliar de RRHH",tel:"32857896",display:"+504 3285-7896",icon:"👤"},
    {nombre:"Tirsa Lizeht Paz",cargo:"Coordinadora de RRHH",tel:"88633324",display:"+504 8863-3324",icon:"👩‍💼"},
    {nombre:"Dilcia Maribel Vazques",cargo:"Enfermera",tel:"87562088",display:"+504 8756-2088",icon:"🩺"}
  ];

  const DATA = {
    rap:{
      kicker:"INFORMACIÓN PARA EMPLEADOS",
      title:"RAP",
      icon:"🏛️",
      html:`<div class="mobile-hint">Conoce de forma sencilla tus aportaciones, ahorro y opciones disponibles como afiliado.</div>
      <h4>¿Qué es el RAP?</h4>
      <p>El Régimen de Aportaciones Privadas (RAP) es una institución hondureña que ofrece servicios relacionados con ahorro, vivienda y financiamiento para sus afiliados.</p>
      <h4>¿Para qué sirve?</h4>
      <ul><li>Ahorro para el trabajador.</li><li>Opciones de financiamiento para vivienda.</li><li>Préstamos y productos financieros según los requisitos aplicables.</li><li>Administración de las aportaciones registradas a nombre del afiliado.</li></ul>
      <h4>📌 Recuerda</h4>
      <ul><li>Revisa que tus datos estén correctos.</li><li>Conserva tus documentos laborales.</li><li>Consulta periódicamente la información de tus aportaciones.</li><li>Para montos, requisitos y condiciones, consulta la información oficial del RAP o RRHH.</li></ul>`
    },
    ihss:{
      kicker:"INFORMACIÓN PARA EMPLEADOS",
      title:"IHSS",
      icon:"🏥",
      html:`<div class="mobile-hint">Información práctica para saber qué hacer cuando necesites utilizar los servicios del Seguro Social.</div>
      <h4>¿Qué es el IHSS?</h4>
      <p>El Instituto Hondureño de Seguridad Social brinda servicios de seguridad social a trabajadores afiliados y sus beneficiarios, de acuerdo con la cobertura y condiciones establecidas.</p>
      <h4>🩺 Servicios y prestaciones</h4>
      <ul><li>Atención médica y consultas.</li><li>Atención por enfermedad y maternidad.</li><li>Servicios relacionados con accidentes y otras situaciones cubiertas.</li><li>Prestaciones económicas cuando corresponda.</li></ul>
      <h4>🏥 Si necesitas atención médica</h4>
      <ol><li>Informa a tu jefe inmediato cuando corresponda.</li><li>Acude al centro de atención que corresponda.</li><li>Presenta tu identificación y documentación requerida.</li><li>Sigue las indicaciones del personal.</li></ol>
      <h4>📄 Si recibes una incapacidad</h4>
      <p>Presenta la documentación correspondiente a Recursos Humanos dentro del plazo y siguiendo el procedimiento establecido por la empresa.</p>
      <div class="mobile-hint">⚠️ Los requisitos y la cobertura pueden variar según el tipo de atención y las disposiciones vigentes. Si tienes dudas, consulta con RRHH.</div>`
    },
    contactos:{
      kicker:"ATENCIÓN AL EMPLEADO",
      title:"Contactos de RRHH",
      icon:"📞",
      html:`<div class="mobile-hint">Toca <b>Llamar</b> para iniciar una llamada o <b>WhatsApp</b> para abrir una conversación.</div>
      ${CONTACTOS.map(c=>`<div class="contact-card">
        <div class="contact-avatar">${c.icon}</div>
        <div class="contact-main"><strong>${c.nombre}</strong><small>${c.cargo}</small><small>${c.display}</small></div>
        <div class="contact-actions">
          <a class="contact-call" href="tel:+504${c.tel}">📞 Llamar</a>
          <a class="contact-wa" href="https://wa.me/504${c.tel}" target="_blank" rel="noopener">💬 WhatsApp</a>
        </div>
      </div>`).join("")}`
    },
    reglamento:{
      kicker:"DOCUMENTO GENERAL",
      title:"Reglamento Interno",
      icon:"📕",
      html:`<div class="mobile-hint">Consulta el Reglamento Interno de Trabajo directamente desde tu teléfono.</div>
      <div class="sheet-document"><iframe src="DocumentosGenerales/reglamento-interno.pdf#toolbar=0&navpanes=0" title="Reglamento Interno"></iframe></div>
      <a class="sheet-open-link" href="DocumentosGenerales/reglamento-interno.pdf" target="_blank" rel="noopener">Abrir documento completo ↗</a>`
    }
  };

  function openSheet(key){
    const data=DATA[key], overlay=document.getElementById("sheetOverlay");
    if(!data||!overlay)return;
    document.getElementById("sheetTitleWrap").innerHTML=`<div class="sheet-title-kicker">${data.kicker}</div><div class="sheet-title">${data.icon} ${data.title}</div>`;
    document.getElementById("sheetContent").innerHTML=data.html;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("sheet-open");
  }
  function closeSheet(){
    const overlay=document.getElementById("sheetOverlay");
    if(!overlay)return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
    document.body.classList.remove("sheet-open");
  }

  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll("[data-info]").forEach(btn=>{
      btn.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();openSheet(btn.dataset.info);},{capture:true});
    });
    document.querySelectorAll("[data-open-sheet]").forEach(btn=>{
      btn.addEventListener("click",e=>{e.preventDefault();openSheet(btn.dataset.openSheet);});
    });
    document.getElementById("sheetClose")?.addEventListener("click",closeSheet);
    document.getElementById("sheetOverlay")?.addEventListener("click",e=>{
      if(e.target.id==="sheetOverlay")closeSheet();
    });
    document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
    let startY=0;
    document.querySelector(".info-sheet")?.addEventListener("touchstart",e=>{startY=e.touches[0].clientY},{passive:true});
    document.querySelector(".info-sheet")?.addEventListener("touchend",e=>{
      if(e.changedTouches[0].clientY-startY>90)closeSheet();
    },{passive:true});
    // Oculta el panel antiguo de información para que todo use el nuevo bottom sheet.
    const old=document.getElementById("infoDetalle");
    if(old) old.style.display="none";
  });
})();
