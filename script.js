const PERIODOS={
 q1:{nombre:"Quincena 1",mes:"Agosto del 11 de Julio al 25 de Julio del 2026",archivo:"RECIBOS QUINCENA 1.pdf"},
 q2:{nombre:"Quincena 2",mes:"Agosto del 26 de Julio al 9 de Agosto del 2026",archivo:"RECIBOS QUINCENA 2.pdf"}
};
let empleadoActual=null,pdfActual=null,paginaEncontrada=null,quincenaActual=null;
const $=id=>document.getElementById(id);
document.addEventListener("DOMContentLoaded",init);

function init(){
 if(window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
 $("mesQ1").textContent=PERIODOS.q1.mes;$("mesQ2").textContent=PERIODOS.q2.mes;
 $("buscar").onclick=acceder;
  $("codigo").addEventListener("input",e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"")});
  $("codigo").onkeydown=e=>{if(e.key==="Enter")acceder()};
 document.querySelectorAll("[data-screen]").forEach(b=>b.onclick=()=>show(b.dataset.screen));
 document.querySelectorAll(".period-card").forEach(b=>b.onclick=()=>abrirRecibo(b.dataset.q));
 $("btnCarnet").onclick=()=>{cargarCarnet();show("pantallaCarnet")};
 $("btnRecibos").onclick=()=>show("pantallaRecibos");
 $("cerrarSesion").onclick=logout;
 $("guardarRecibo").onclick=guardarRecibo;
 document.querySelectorAll("[data-open-sheet]").forEach(b=>b.onclick=()=>abrirSheet(b.dataset.openSheet));
 document.querySelectorAll("[data-info]").forEach(b=>b.onclick=()=>mostrarInfo(b.dataset.info));
 $("sheetClose").onclick=closeSheet;
 $("sheetOverlay").addEventListener("click",e=>{if(e.target===$("sheetOverlay"))closeSheet()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
}


/* ProtecciÃ³n bÃ¡sica de interfaz: evita clic derecho y atajos comunes de inspecciÃ³n.
   Esto NO sustituye la seguridad del servidor. */
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("keydown",e=>{
  const k=String(e.key||"").toLowerCase();
  if(
    e.key==="F12" ||
    (e.ctrlKey && e.shiftKey && (k==="i" || k==="j" || k==="c")) ||
    (e.ctrlKey && k==="u")
  ){
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});


async function cargarJsPDF(){
  if(window.jspdf?.jsPDF)return window.jspdf.jsPDF;
  await new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
  });
  return window.jspdf.jsPDF;
}

function show(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 $(id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"});
 if(id==="pantallaDocumentos")cargarDocumentos();
}
function msg(t,error=false){$("mensajeAcceso").textContent=t;$("mensajeAcceso").className="message"+(error?" error":"")}

async function acceder(){
 const codigo=normalizar($("codigo").value);
 if(!codigo){msg("Escribe tu cÃ³digo de empleado.",true);return}
 if(codigo.length<6){msg("Debes escribir el cÃ³digo completo.",true);return}
 $("buscar").disabled=true;$("buscar").textContent="Buscando...";msg("ð Verificando cÃ³digo...");
 try{
  let r=await buscarEmpleado(PERIODOS.q1,codigo);if(!r)r=await buscarEmpleado(PERIODOS.q2,codigo);
  if(!r){msg("El cÃ³digo no fue encontrado en la informaciÃ³n dispinible.",true);return}
  empleadoActual={codigo,nombre:obtenerNombre(r.texto),departamento:obtenerCampo(r.texto,"Departamento"),puesto:obtenerCampo(r.texto,"Puesto")};
  $("nombreEmpleado").textContent=empleadoActual.nombre;$("codigoEmpleado").textContent=codigo;
  cargarAvatar();cargarCarnet();show("pantallaPortal");
 }catch(e){console.error(e);msg("No se pudo consultar la informaciÃ³n. Verifica que los PDF estÃ©n disponibles.",true)}
 finally{$("buscar").disabled=false;$("buscar").textContent="Continuar"}
}
async function buscarEmpleado(periodo,codigo){
 const pdf=await pdfjsLib.getDocument({url:periodo.archivo}).promise;
 for(let n=1;n<=pdf.numPages;n++){const p=await pdf.getPage(n),c=await p.getTextContent(),texto=c.items.map(x=>x.str||"").join(" ");if(normalizar(texto).includes(normalizar(codigo)))return{pdf,pagina:n,texto}}
 return null;
}
async function abrirRecibo(key){
 if(!empleadoActual)return;quincenaActual=key;const periodo=PERIODOS[key];show("pantallaRecibo");$("visorTitulo").textContent=`${periodo.nombre} Â· ${periodo.mes}`;
 const v=document.querySelector(".pdf-viewer");v.innerHTML='<div class="viewer-message">ð Buscando tu recibo...</div>';
 try{const r=await buscarEmpleado(periodo,empleadoActual.codigo);if(!r){v.innerHTML=`<div class="viewer-message">No hay un recibo disponible para tu cÃ³digo en ${periodo.nombre}.</div>`;return}pdfActual=r.pdf;paginaEncontrada=r.pagina;await renderPage(r.pdf,r.pagina)}
 catch(e){console.error(e);v.innerHTML='<div class="viewer-message">No se pudo cargar el recibo.</div>'}
}
async function renderPage(pdf,n){
 const p=await pdf.getPage(n),v=document.querySelector(".pdf-viewer"),base=p.getViewport({scale:1}),scale=Math.min(2,Math.max(1,(v.clientWidth||900)/base.width)),vp=p.getViewport({scale}),c=document.createElement("canvas");
 c.width=vp.width;c.height=vp.height;c.style.width="100%";v.innerHTML="";v.appendChild(c);
 await p.render({canvasContext:c.getContext("2d"),viewport:vp}).promise
}
async function guardarRecibo(){
  if(!pdfActual||!paginaEncontrada||!empleadoActual)return;
  try{
    const JsPDF=await cargarJsPDF();
    const p=await pdfActual.getPage(paginaEncontrada);
    const vp=p.getViewport({scale:2});
    const c=document.createElement("canvas");
    c.width=Math.ceil(vp.width);c.height=Math.ceil(vp.height);
    await p.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;
    const img=c.toDataURL("image/jpeg",0.95);
    const pdf=new JsPDF({
      orientation:vp.width>vp.height?"landscape":"portrait",
      unit:"pt",
      format:[vp.width,vp.height]
    });
    pdf.addImage(img,"JPEG",0,0,vp.width,vp.height);
    pdf.save(`${empleadoActual.codigo}_${quincenaActual}.pdf`);
  }catch(e){
    console.error(e);
    alert("No fue posible guardar tu recibo en PDF.");
  }
}

function cargarCarnet(){
 if(!empleadoActual)return;
 $("carnetNombre").textContent=empleadoActual.nombre||"Colaborador";$("carnetCodigo").textContent=empleadoActual.codigo||"â";$("carnetDepartamento").textContent=empleadoActual.departamento||"â";$("carnetPuesto").textContent=empleadoActual.puesto||"â";cargarFoto(empleadoActual.codigo)
}
function cargarAvatar(){
 const a=$("avatarMini"),img=new Image();img.onload=()=>{a.innerHTML="";a.appendChild(img)};img.onerror=()=>{a.textContent="ð¤"};img.src=`fotos/${encodeURIComponent(empleadoActual.codigo)}.png?v=60`
}
function cargarFoto(codigo){
 const box=$("fotoCarnet");box.innerHTML="<span>ð¤</span>";let i=0;
 const probar=()=>{if(i>=3)return;const ext=["png","jpg","jpeg"][i++],img=new Image();img.className="foto-empleado";img.alt="FotografÃ­a del empleado";img.onload=()=>{box.innerHTML="";box.appendChild(img)};img.onerror=probar;img.src=`fotos/${encodeURIComponent(codigo)}.${ext}?v=60`};probar()
}
async function cargarDocumentos(){
 if(!empleadoActual)return;
 await Promise.all([cargarDocumentosGenerales(),cargarDocumentosPersonales()]);
}

async function cargarDocumentosGenerales(){
 const box=$("listaDocumentosGenerales");if(!box)return;
 box.innerHTML='<div class="empty">ð Cargando documentos generales...</div>';
 try{
  const r=await fetch("DocumentosGenerales/documentos.json",{cache:"no-store"});
  if(!r.ok)throw new Error("No se pudo cargar documentos.json");
  const docs=await r.json();
  if(!Array.isArray(docs)||!docs.length){
   box.innerHTML='<div class="empty">ð No hay documentos generales publicados por ahora.</div>';return;
  }
  box.innerHTML=docs.map((doc,index)=>{
   const nombre=esc(doc.nombre||"Documento general");
   const descripcion=esc(doc.descripcion||"Documento publicado por Recursos Humanos.");
   const icono=esc(doc.icono||"ð");
   return `<article class="doc-card"><span>${icono}</span><div><strong>${nombre}</strong><small>${descripcion}</small></div><button class="outline general-doc-btn" data-general-doc="${index}">Ver documento</button></article>`;
  }).join("");
  box.querySelectorAll("[data-general-doc]").forEach(btn=>{
   btn.onclick=()=>abrirDocumentoGeneral(docs[Number(btn.dataset.generalDoc)]);
  });
 }catch(e){
  console.error(e);
  box.innerHTML='<div class="empty">â ï¸ No se pudieron cargar los documentos generales.</div>';
 }
}

function abrirDocumentoGeneral(doc){
 if(!doc)return;
 const archivo=String(doc.archivo||"");
 if(!archivo)return;
 const url="DocumentosGenerales/"+encodeURIComponent(archivo).replace(/%2F/g,"/");
 window.open(url,"_blank","noopener");
}

async function cargarDocumentosPersonales(){
 const box=$("listaDocumentos");if(!box)return;
 box.innerHTML='<div class="empty">ð Buscando tus documentos...</div>';
 const tipos=[["constancia","ð","Constancia de trabajo"],["solicitud","ð","Solicitud"],["salario","ð°","Constancia de salario"],["otros","ð","Otros documentos"]];
 const found=[];
 for(const [key,icon,name] of tipos){for(const dir of ["documentos","Documentos"]){const path=`${dir}/${empleadoActual.codigo}_${key}.pdf`;try{const r=await fetch(path,{cache:"no-store"});if(r.ok){found.push({icon,name,path});break}}catch(e){}}}
 if(!found.length){box.innerHTML='<div class="empty">ð No tienes documentos personales disponibles por ahora.</div>';return}
 box.innerHTML=found.map(x=>`<article class="doc-card"><span>${x.icon}</span><div><strong>${x.name}</strong><small>Documento asociado a ${esc(empleadoActual.codigo)}</small></div><a class="outline link" href="${x.path}" target="_blank">Abrir</a></article>`).join("")
}

function abrirSheet(tipo){
 const data=contenidoSheet(tipo);if(!data)return;
 $("sheetTitleWrap").innerHTML=`<span class="eyebrow">${data.eyebrow}</span><h2>${data.title}</h2>`;
 $("sheetContent").innerHTML=data.html;
 $("sheetOverlay").classList.add("open");$("sheetOverlay").setAttribute("aria-hidden","false");document.body.classList.add("sheet-open");
}
function closeSheet(){
 $("sheetOverlay").classList.remove("open");$("sheetOverlay").setAttribute("aria-hidden","true");document.body.classList.remove("sheet-open")
}
function mostrarInfo(tipo){abrirSheet(tipo)}

function contactCard(icon,nombre,cargo,telefono,area){
 const digits=telefono.replace(/\D/g,"");
 const full=`+504 ${telefono}`;
 const wa=`https://wa.me/504${digits}`;
 const tel=`tel:+504${digits}`;
 return `<article class="contact-item contact-item-rich">
   <span>${icon}</span>
   <div class="contact-main"><strong>${esc(nombre)}</strong><small>${esc(cargo)} Â· ${esc(area)}</small><a class="contact-phone" href="${tel}">${full}</a></div>
   <div class="contact-actions"><a class="contact-call" href="${tel}" aria-label="Llamar a ${esc(nombre)}">ð <b>Llamar</b></a><a class="contact-whatsapp" href="${wa}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp a ${esc(nombre)}">ð¬ <b>WhatsApp</b></a></div>
 </article>`
}

function contenidoSheet(tipo){
 const data={
  reglamento:{eyebrow:"DOCUMENTO GENERAL",title:"Reglamento Interno de Trabajo",html:`
   <div class="sheet-document">
    <div class="sheet-icon">ð</div><div><h3>Reglamento Interno de Trabajo</h3><p>Consulta el Reglamento Interno de Trabajo de Agroindustrias Cayo Blanco.</p></div>
   </div>
   <p>Este documento contiene las normas y disposiciones internas aplicables al personal.</p>
   <a class="sheet-action" href="DocumentosGenerales/reglamento-interno.pdf" target="_blank" rel="noopener">ð Abrir reglamento</a>
  `},
  rap:{eyebrow:"INFORMACIÃN PARA EMPLEADOS",title:"RAP",html:`
   <div class="sheet-document"><div class="sheet-icon">ðï¸</div><div><h3>RÃ©gimen de Aportaciones Privadas</h3><p>InformaciÃ³n sencilla para conocer tus aportaciones y los servicios disponibles.</p></div></div>
   <h4>Â¿QuÃ© es el RAP?</h4><p>El RÃ©gimen de Aportaciones Privadas (RAP) es una instituciÃ³n hondureÃ±a que ofrece servicios relacionados con el ahorro, vivienda y financiamiento para sus afiliados.</p>
   <h4>Â¿Para quÃ© sirve?</h4><ul><li>Ahorro para el trabajador.</li><li>Opciones de financiamiento para vivienda.</li><li>PrÃ©stamos y productos financieros, segÃºn los requisitos aplicables.</li><li>AdministraciÃ³n de las aportaciones registradas a nombre del afiliado.</li></ul>
   <h4>Recuerda</h4><ul><li>Revisa que tus datos personales estÃ©n correctos.</li><li>Conserva tus documentos laborales.</li><li>Consulta periÃ³dicamente la informaciÃ³n de tus aportaciones.</li><li>Para conocer montos, requisitos y condiciones, consulta la informaciÃ³n oficial del RAP o solicita orientaciÃ³n a RRHH.</li></ul>
  `},
  ihss:{eyebrow:"INFORMACIÃN PARA EMPLEADOS",title:"IHSS",html:`
   <div class="sheet-document"><div class="sheet-icon">ð¥</div><div><h3>Instituto HondureÃ±o de Seguridad Social</h3><p>Conoce quÃ© hacer cuando necesites utilizar los servicios del Seguro Social.</p></div></div>
   <h4>Â¿QuÃ© es el IHSS?</h4><p>El Instituto HondureÃ±o de Seguridad Social (IHSS) brinda servicios de seguridad social a los trabajadores afiliados y sus beneficiarios, de acuerdo con la cobertura y condiciones establecidas.</p>
   <h4>Servicios y prestaciones</h4><ul><li>AtenciÃ³n mÃ©dica y consultas.</li><li>AtenciÃ³n por enfermedad y maternidad.</li><li>Servicios relacionados con accidentes y otras situaciones cubiertas.</li><li>Prestaciones econÃ³micas cuando corresponda.</li><li>AtenciÃ³n para beneficiarios que cumplan los requisitos establecidos.</li></ul>
   <h4>ð¥ Si necesitas atenciÃ³n mÃ©dica</h4><ol><li>Informa a tu jefe inmediato cuando corresponda.</li><li>Acude al centro de atenciÃ³n del IHSS que corresponda.</li><li>Presenta tu identificaciÃ³n y la documentaciÃ³n requerida.</li><li>Recibe la atenciÃ³n mÃ©dica y sigue las indicaciones del personal.</li></ol>
   <h4>ð Si recibes una incapacidad</h4><p>Presenta la documentaciÃ³n correspondiente a Recursos Humanos dentro del plazo y siguiendo el procedimiento establecido por la empresa, para que pueda registrarse correctamente.</p>
   <div class="notice">â ï¸ Los procedimientos, requisitos y cobertura pueden variar segÃºn el tipo de atenciÃ³n y las disposiciones vigentes. Si tienes dudas, consulta con Recursos Humanos.</div>
  `},
  contactos:{eyebrow:"RECURSOS HUMANOS",title:"Contactos",html:`
   <p>ComunÃ­cate directamente con el Ã¡rea o persona que necesites. Puedes <strong>llamar</strong> o abrir una conversaciÃ³n por <strong>WhatsApp</strong>.</p>
   <div class="contact-sheet">
    ${contactCard("ð¤","Cristhian Osorio Acosta","Auxiliar de RRHH","3225-8230","Recursos Humanos")}
    ${contactCard("ð¤","Mayda Yanely Palma","Auxiliar de RRHH","3162-3652","Recursos Humanos")}
    ${contactCard("ð¤","Mariano Alejandro Perez","Auxiliar de RRHH","3285-7896","Recursos Humanos")}
    ${contactCard("ð©âð¼","Tirsa Lizeht Paz","Coordinadora de RRHH","8863-3324","Recursos Humanos")}
    ${contactCard("ð¥","Dilcia Maribel Vazques","Enfermera","8756-2088","EnfermerÃ­a")}
   </div>
   <div class="notice">ð­ð³ Todos los nÃºmeros corresponden a Honduras (+504). Para WhatsApp se utiliza el mismo nÃºmero.</div>
  `}
 };
 return data[tipo]
}
function obtenerNombre(t){let m=t.match(/Empleado\s*:\s*(.*?)\s+Sueldo\s+Mensual/i);if(m?.[1])return m[1].trim();m=t.match(/Empleado\s*:\s*(.*?)(?=\s+(?:Departamento|Puesto|Sueldo))/i);return m?.[1]?.trim()||"Colaborador"}
function obtenerCampo(t,campo){const next="(?=\\s+(?:Departamento|Puesto|DÃ­as\\s+Trabajados|DÃ­as\\s+Incapacidad|Faltas|Vacaciones|Feriados|Sueldo\\s+Base|Sueldo\\s+Mensual|Salario|Ingreso|Deducciones|Total|$))";const m=t.match(new RegExp(`${campo}\\s*:\\s*(.*?)${next}`,"i"));return m?.[1]?.trim().replace(/\s+/g," ")||""}
function normalizar(t){return String(t||"").toUpperCase().replace(/\s+/g,"").replace(/[^A-Z0-9]/g,"")}
function esc(t){return String(t??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function logout(){empleadoActual=null;pdfActual=null;paginaEncontrada=null;$("codigo").value="";msg("");closeSheet();show("pantallaAcceso")}
