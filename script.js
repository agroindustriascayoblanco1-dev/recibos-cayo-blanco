// ======================================================
// COA - RECIBOS DE PAGO
// SISTEMA NUEVO
// ======================================================


// ======================================================
// CONFIGURACIÓN
// ======================================================

const PERIODOS = {

    q1: {

        nombre: "Quincena 1",

        mes: "Julio 2026",

        periodoPago:
            "11 de Junio al 25 de Junio de 2026",

        archivo:
            "RECIBOS QUINCENA 1.pdf"

    },


    q2: {

        nombre: "Quincena 2",

        mes: "Julio 2026",

        periodoPago:
            "26 de Junio al 10 de julio de 2026",

        archivo:
            "RECIBOS QUINCENA 2.pdf"

    }

};


// ======================================================
// VARIABLES
// ======================================================

let empleadoActual = null;

let paginaEncontrada = null;

let pdfActual = null;

let paginaActual = null;

let quincenaSeleccionada = "q1";


// ======================================================
// ACTUALIZAR SELECTOR DE QUINCENAS
// ======================================================

function actualizarSelectorQuincenas() {

    const q1 = PERIODOS.q1;

    const q2 = PERIODOS.q2;


    const nombreQ1 =
        document.getElementById(
            "nombreQ1"
        );


    const mesQ1 =
        document.getElementById(
            "mesQ1"
        );


    const nombreQ2 =
        document.getElementById(
            "nombreQ2"
        );


    const mesQ2 =
        document.getElementById(
            "mesQ2"
        );


    if (nombreQ1) {

        nombreQ1.textContent =
            q1.nombre;

    }


    if (mesQ1) {

        mesQ1.textContent =
            q1.mes;

    }


    if (nombreQ2) {

        nombreQ2.textContent =
            q2.nombre;

    }


    if (mesQ2) {

        mesQ2.textContent =
            q2.mes;

    }

}


// ======================================================
// INICIAR CUANDO EL HTML ESTÉ LISTO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarSistema
);


// ======================================================
// INICIO
// ======================================================

function iniciarSistema() {

    actualizarSelectorQuincenas();


    console.log(
        "COA: sistema iniciado"
    );


    // --------------------------------------------------
    // CONFIGURAR PDF.JS
    // --------------------------------------------------

    if (
        typeof pdfjsLib === "undefined"
    ) {

        console.error(
            "PDF.js no está cargado."
        );


        mostrarMensaje(
            "❌ No se pudo cargar el sistema de recibos.",
            true
        );


        return;

    }


    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


    // --------------------------------------------------
    // BOTÓN BUSCAR
    // --------------------------------------------------

    const boton =
        document.getElementById(
            "buscar"
        );


    if (!boton) {

        console.error(
            "No existe el botón buscar."
        );


        return;

    }


    boton.addEventListener(
        "click",
        consultarEmpleado
    );


    // --------------------------------------------------
    // ENTER
    // --------------------------------------------------

    const codigo =
        document.getElementById(
            "codigo"
        );


    if (codigo) {

        codigo.addEventListener(
            "keydown",
            function(evento) {

                if (
                    evento.key === "Enter"
                ) {

                    evento.preventDefault();

                    consultarEmpleado();

                }

            }
        );

    }


    // --------------------------------------------------
    // QUINCENAS
    // --------------------------------------------------

    document
        .querySelectorAll(
            'input[name="quincena"]'
        )
        .forEach(
            function(radio) {

                radio.addEventListener(
                    "change",
                    cambiarQuincena
                );

            }
        );


    // --------------------------------------------------
    // VER RECIBO
    // --------------------------------------------------

    const ver =
        document.getElementById(
            "verRecibo"
        );


    if (ver) {

        ver.addEventListener(
            "click",
            mostrarRecibo
        );

    }


    // --------------------------------------------------
    // CERRAR
    // --------------------------------------------------

    const cerrar =
        document.getElementById(
            "cerrarVisor"
        );


    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarRecibo
        );

    }


    // --------------------------------------------------
    // NUEVA CONSULTA
    // --------------------------------------------------

    const nueva =
        document.getElementById(
            "nuevaConsulta"
        );


    if (nueva) {

        nueva.addEventListener(
            "click",
            nuevaConsulta
        );

    }


    // --------------------------------------------------
    // GUARDAR
    // --------------------------------------------------

    const guardar =
        document.getElementById(
            "guardarRecibo"
        );


    if (guardar) {

        guardar.addEventListener(
            "click",
            guardarPDF
        );

    }


    // --------------------------------------------------
    // CENTRO DE INFORMACIÓN
    // --------------------------------------------------

    iniciarCentroInformacion();


    console.log(
        "COA: eventos configurados correctamente"
    );

}
// ======================================================
// MENSAJE
// ======================================================

function mostrarMensaje(
    texto,
    error = false
) {

    const elemento =
        document.getElementById(
            "mensaje"
        );


    if (!elemento) {
        return;
    }


    elemento.textContent =
        texto;


    elemento.style.color =
        error
            ? "#c62828"
            : "#087a3f";

}


// ======================================================
// NORMALIZAR
// ======================================================

function normalizar(
    texto
) {

    return String(
        texto || ""
    )
        .toUpperCase()
        .replace(
            /\s+/g,
            ""
        )
        .replace(
            /[^A-Z0-9]/g,
            ""
        );

}


// ======================================================
// CAMBIAR QUINCENA
// ======================================================

function cambiarQuincena() {

    const seleccion =
        document.querySelector(
            'input[name="quincena"]:checked'
        );


    quincenaSeleccionada =
        seleccion
            ? seleccion.value
            : "q1";


    limpiarConsulta();


    mostrarMensaje("");

}


// ======================================================
// LIMPIAR CONSULTA
// ======================================================

function limpiarConsulta() {

    empleadoActual = null;

    paginaEncontrada = null;

    pdfActual = null;

    paginaActual = null;


    const resultado =
        document.getElementById(
            "resultado"
        );


    const visor =
        document.getElementById(
            "visor"
        );


    if (resultado) {

        resultado.classList.add(
            "oculto"
        );

    }


    if (visor) {

        visor.classList.add(
            "oculto"
        );

    }

}


// ======================================================
// OBTENER PDF
// ======================================================

async function obtenerPDF(
    archivo
) {

    console.log(
        "Cargando PDF:",
        archivo
    );


    const pdf =
        await pdfjsLib.getDocument(
            {
                url: archivo
            }
        ).promise;


    console.log(
        "PDF cargado:",
        pdf.numPages,
        "páginas"
    );


    return pdf;

}


// ======================================================
// BUSCAR EMPLEADO
// ======================================================

async function consultarEmpleado() {

    console.log(
        "================================"
    );


    console.log(
        "CONSULTA INICIADA"
    );


    console.log(
        "================================"
    );


    const codigoInput =
        document.getElementById(
            "codigo"
        );


    const boton =
        document.getElementById(
            "buscar"
        );


    if (!codigoInput) {

        console.error(
            "No existe el campo código."
        );


        return;

    }


    const codigo =
        codigoInput.value
            .trim()
            .toUpperCase();


    console.log(
        "Código:",
        codigo
    );


    // ==================================================
    // VALIDAR
    // ==================================================

    if (!codigo) {

        mostrarMensaje(
            "⚠️ Escribe tu código completo.",
            true
        );


        codigoInput.focus();


        return;

    }


    if (
        codigo.length < 6
    ) {

        mostrarMensaje(
            "⚠️ Debes escribir el código completo.",
            true
        );


        codigoInput.focus();


        return;

    }


    // ==================================================
    // OBTENER PERIODO
    // ==================================================

    const periodo =
        PERIODOS[
            quincenaSeleccionada
        ];


    if (!periodo) {

        mostrarMensaje(
            "❌ No se encontró la quincena.",
            true
        );


        return;

    }


    // ==================================================
    // LIMPIAR
    // ==================================================

    limpiarConsulta();


    // ==================================================
    // BOTÓN
    // ==================================================

    if (boton) {

        boton.disabled =
            true;


        boton.textContent =
            "Buscando...";

    }


    mostrarMensaje(
        "🔎 Buscando en " +
        periodo.nombre +
        "..."
    );


    try {

        // ==================================================
        // CARGAR PDF
        // ==================================================

        const pdf =
            await obtenerPDF(
                periodo.archivo
            );


        // ==================================================
        // CÓDIGO NORMALIZADO
        // ==================================================

        const codigoBuscado =
            normalizar(
                codigo
            );


        let encontrado =
            null;


        // ==================================================
        // RECORRER PÁGINAS
        // ==================================================

        for (
            let numero = 1;
            numero <= pdf.numPages;
            numero++
        ) {

            mostrarMensaje(
                "🔎 Revisando página " +
                numero +
                " de " +
                pdf.numPages +
                "..."
            );


            const pagina =
                await pdf.getPage(
                    numero
                );


            const contenido =
                await pagina.getTextContent();


            const texto =
                contenido.items
                    .map(
                        function(item) {

                            return item.str || "";

                        }
                    )
                    .join(" ");


            const textoNormalizado =
                normalizar(
                    texto
                );


            // ==================================================
            // COINCIDENCIA
            // ==================================================

            if (
                textoNormalizado.includes(
                    codigoBuscado
                )
            ) {

                encontrado = {

                    pagina:
                        numero,

                    texto:
                        texto

                };


                break;

            }

        }


        // ==================================================
        // NO ENCONTRADO
        // ==================================================

        if (!encontrado) {

            mostrarMensaje(

                "❌ El código " +
                codigo +
                " no fue encontrado en " +
                periodo.nombre +
                ".",

                true

            );


            return;

        }


        // ==================================================
        // OBTENER NOMBRE
        // ==================================================

        let nombre =
            obtenerNombre(
                encontrado.texto
            );


        // ==================================================
        // GUARDAR DATOS
        // ==================================================

        empleadoActual = {

            codigo:
                codigo,

            nombre:
                nombre,

            periodo:
                periodo.nombre,

            mes:
                periodo.mes,

            archivo:
                periodo.archivo

        };


        paginaEncontrada =
            encontrado.pagina;


        pdfActual =
            pdf;


        // ==================================================
        // MOSTRAR DATOS
        // ==================================================

        document
            .getElementById(
                "nombreEmpleado"
            )
            .textContent =
                nombre;


        document
            .getElementById(
                "codigoEmpleado"
            )
            .textContent =
                codigo;


        document
            .getElementById(
                "textoQuincena"
            )
            .textContent =
                (
                    periodo.nombre +
                    " · " +
                    periodo.mes
                ).toUpperCase();


        document
            .getElementById(
                "periodoSeleccionado"
            )
            .textContent =
                (
                    periodo.nombre +
                    " · " +
                    periodo.mes
                ).toUpperCase();


        const periodoPagoElemento =
            document.getElementById(
                "periodoPago"
            );


        if (periodoPagoElemento) {

            periodoPagoElemento.textContent =
                periodo.periodoPago || "";

        }


        // ==================================================
        // MOSTRAR TARJETA
        // ==================================================

        const resultado =
            document.getElementById(
                "resultado"
            );


        resultado.classList.remove(
            "oculto"
        );


        mostrarMensaje(
            "✓ Colaborador encontrado correctamente."
        );


        resultado.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });


    } catch (error) {

        console.error(
            "ERROR:",
            error
        );


        mostrarMensaje(

            "❌ No se pudo cargar el recibo. Verifica que el PDF esté disponible.",

            true

        );


    } finally {

        if (boton) {

            boton.disabled =
                false;


            boton.textContent =
                "🔎 Consultar";

        }

    }

}
// ======================================================
// OBTENER NOMBRE
// ======================================================

function obtenerNombre(
    texto
) {

    // --------------------------------------------------
    // MÉTODO 1
    // --------------------------------------------------

    const resultado1 =
        texto.match(
            /Empleado\s*:\s*(.*?)\s+Sueldo\s+Mensual/i
        );


    if (
        resultado1 &&
        resultado1[1]
    ) {

        return resultado1[1]
            .trim();

    }


    // --------------------------------------------------
    // MÉTODO 2
    // --------------------------------------------------

    const resultado2 =
        texto.match(
            /Empleado\s*:\s*(.*)/i
        );


    if (
        resultado2 &&
        resultado2[1]
    ) {

        return resultado2[1]
            .split(
                "Sueldo"
            )[0]
            .trim();

    }


    return "Colaborador";

}


// ======================================================
// MOSTRAR RECIBO
// ======================================================

async function mostrarRecibo() {

    if (
        !empleadoActual ||
        !paginaEncontrada
    ) {

        return;

    }


    const visor =
        document.getElementById(
            "visor"
        );


    const resultado =
        document.getElementById(
            "resultado"
        );


    const titulo =
        document.getElementById(
            "visorTitulo"
        );


    const visorPDF =
        document.querySelector(
            ".visor-pdf"
        );


    // ==================================================
    // MOSTRAR VISOR
    // ==================================================

    visor.classList.remove(
        "oculto"
    );


    // ==================================================
    // OCULTAR TARJETA
    // ==================================================

    resultado.classList.add(
        "oculto"
    );


    titulo.textContent =
        empleadoActual.periodo +
        " · " +
        empleadoActual.mes;


    visorPDF.innerHTML = `

        <div class="visor-mensaje">

            🔄 Cargando recibo...

        </div>

    `;


    visor.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });


    try {

        // ==================================================
        // CARGAR PÁGINA
        // ==================================================

        const pagina =
            await pdfActual.getPage(
                paginaEncontrada
            );


        paginaActual =
            pagina;


        // ==================================================
        // ESCALA
        // ==================================================

        const viewportBase =
            pagina.getViewport({

                scale:
                    1

            });


        const ancho =
            visorPDF.clientWidth ||
            900;


        const escala =
            Math.min(

                2,

                Math.max(

                    1,

                    ancho /
                    viewportBase.width

                )

            );


        const viewport =
            pagina.getViewport({

                scale:
                    escala

            });


        // ==================================================
        // CANVAS
        // ==================================================

        const canvas =
            document.createElement(
                "canvas"
            );


        const contexto =
            canvas.getContext(
                "2d"
            );


        canvas.width =
            viewport.width;


        canvas.height =
            viewport.height;


        canvas.style.width =
            "100%";


        canvas.style.height =
            "auto";


        visorPDF.innerHTML =
            "";


        visorPDF.appendChild(
            canvas
        );


        // ==================================================
        // RENDER
        // ==================================================

        await pagina.render({

            canvasContext:
                contexto,

            viewport:
                viewport

        }).promise;


    } catch (error) {

        console.error(
            "Error mostrando PDF:",
            error
        );


        visorPDF.innerHTML = `

            <div
                class="visor-mensaje"
                style="color:#c62828;"
            >

                ❌ No se pudo mostrar el recibo.

            </div>

        `;

    }

}


// ======================================================
// CERRAR RECIBO
// ======================================================

function cerrarRecibo() {

    const visor =
        document.getElementById(
            "visor"
        );


    const resultado =
        document.getElementById(
            "resultado"
        );


    visor.classList.add(
        "oculto"
    );


    if (empleadoActual) {

        resultado.classList.remove(
            "oculto"
        );

    }


    paginaActual =
        null;

}


// ======================================================
// NUEVA CONSULTA
// ======================================================

function nuevaConsulta() {

    const codigo =
        document.getElementById(
            "codigo"
        );


    limpiarConsulta();


    codigo.value =
        "";


    mostrarMensaje("");


    codigo.focus();


    window.scrollTo({

        top:
            0,

        behavior:
            "smooth"

    });

}


// ======================================================
// GUARDAR RECIBO
// ======================================================

async function guardarPDF() {

    if (
        !paginaActual
    ) {

        alert(
            "Primero abre el recibo."
        );


        return;

    }


    if (
        !window.jspdf
    ) {

        alert(
            "No se pudo cargar la función para guardar el PDF."
        );


        return;

    }


    const boton =
        document.getElementById(
            "guardarRecibo"
        );


    try {

        boton.disabled =
            true;


        boton.textContent =
            "Guardando...";


        // ==================================================
        // CREAR CANVAS
        // ==================================================

        const viewport =
            paginaActual.getViewport({

                scale:
                    2

            });


        const canvas =
            document.createElement(
                "canvas"
            );


        const contexto =
            canvas.getContext(
                "2d"
            );


        canvas.width =
            viewport.width;


        canvas.height =
            viewport.height;


        await paginaActual.render({

            canvasContext:
                contexto,

            viewport:
                viewport

        }).promise;


        // ==================================================
        // CONVERTIR A IMAGEN
        // ==================================================

        const imagen =
            canvas.toDataURL(
                "image/jpeg",
                0.95
            );


        // ==================================================
        // CREAR PDF
        // ==================================================

        const {
            jsPDF
        } =
            window.jspdf;


        const pdf =
            new jsPDF({

                orientation:
                    viewport.width >
                    viewport.height
                        ? "landscape"
                        : "portrait",

                unit:
                    "mm",

                format:
                    "a4"

            });


        // ==================================================
        // TAMAÑO DE PÁGINA
        // ==================================================

        const anchoPagina =
            pdf.internal.pageSize.getWidth();


        const altoPagina =
            pdf.internal.pageSize.getHeight();


        const margen =
            8;


        const anchoDisponible =
            anchoPagina -
            margen * 2;


        const altoDisponible =
            altoPagina -
            margen * 2;


        const escala =
            Math.min(

                anchoDisponible /
                viewport.width,

                altoDisponible /
                viewport.height

            );


        const anchoImagen =
            viewport.width *
            escala;


        const altoImagen =
            viewport.height *
            escala;


        const x =
            (
                anchoPagina -
                anchoImagen
            ) / 2;


        const y =
            (
                altoPagina -
                altoImagen
            ) / 2;


        // ==================================================
        // AGREGAR IMAGEN
        // ==================================================

        pdf.addImage(

            imagen,

            "JPEG",

            x,

            y,

            anchoImagen,

            altoImagen,

            undefined,

            "FAST"

        );


        // ==================================================
        // NOMBRE DEL ARCHIVO
        // ==================================================

        const nombre =
            empleadoActual.nombre
                .replace(
                    /[\\/:*?"<>|]/g,
                    ""
                );


        const archivo =
            "Recibo - " +
            nombre +
            " - " +
            empleadoActual.periodo +
            ".pdf";


        pdf.save(
            archivo
        );


        boton.textContent =
            "✓ Guardado";


        setTimeout(
            function() {

                boton.textContent =
                    "📥 Guardar recibo";

            },
            2000
        );


    } catch (error) {

        console.error(
            "Error guardando:",
            error
        );


        alert(
            "No se pudo guardar el recibo."
        );


    } finally {

        boton.disabled =
            false;

    }

}
// ======================================================
// CENTRO DE INFORMACIÓN
// VENTANAS MODALES
// ======================================================

function iniciarCentroInformacion() {

    const tarjetas =
        document.querySelectorAll(
            ".centro-card"
        );


    const modales =
        document.querySelectorAll(
            ".centro-modal"
        );


    // ==================================================
    // ABRIR VENTANA
    // ==================================================

    tarjetas.forEach(
        function(tarjeta) {

            tarjeta.addEventListener(
                "click",
                function() {

                    const idModal =
                        tarjeta.dataset.modal;


                    const modal =
                        document.getElementById(
                            idModal
                        );


                    if (!modal) {

                        console.warn(
                            "No se encontró el modal:",
                            idModal
                        );

                        return;

                    }


                    // ------------------------------------------
                    // CERRAR TODAS LAS VENTANAS
                    // ------------------------------------------

                    modales.forEach(
                        function(otroModal) {

                            otroModal.classList.add(
                                "oculto"
                            );

                        }
                    );


                    // ------------------------------------------
                    // ABRIR LA SELECCIONADA
                    // ------------------------------------------

                    modal.classList.remove(
                        "oculto"
                    );


                    // ------------------------------------------
                    // BLOQUEAR SCROLL
                    // ------------------------------------------

                    document.body.classList.add(
                        "centro-modal-abierto"
                    );

                }
            );

        }
    );


    // ==================================================
    // CONFIGURAR CADA MODAL
    // ==================================================

    modales.forEach(
        function(modal) {

            // ----------------------------------------------
            // BOTÓN CERRAR
            // ----------------------------------------------

            const botonCerrar =
                modal.querySelector(
                    "[data-cerrar-modal]"
                );


            if (botonCerrar) {

                botonCerrar.addEventListener(
                    "click",
                    function() {

                        cerrarCentroModal(
                            modal
                        );

                    }
                );

            }


            // ----------------------------------------------
            // CERRAR AL TOCAR EL FONDO
            // ----------------------------------------------

            modal.addEventListener(
                "click",
                function(evento) {

                    if (
                        evento.target === modal
                    ) {

                        cerrarCentroModal(
                            modal
                        );

                    }

                }
            );

        }
    );


    // ==================================================
    // CERRAR CON ESC
    // ==================================================

    document.addEventListener(
        "keydown",
        function(evento) {

            if (
                evento.key !== "Escape"
            ) {

                return;

            }


            modales.forEach(
                function(modal) {

                    if (
                        !modal.classList.contains(
                            "oculto"
                        )
                    ) {

                        cerrarCentroModal(
                            modal
                        );

                    }

                }
            );

        }
    );


    console.log(
        "COA: Centro de Información iniciado"
    );

}


// ======================================================
// CERRAR MODAL
// ======================================================

function cerrarCentroModal(
    modal
) {

    if (!modal) {
        return;
    }


    modal.classList.add(
        "oculto"
    );


    document.body.classList.remove(
        "centro-modal-abierto"
    );

}
