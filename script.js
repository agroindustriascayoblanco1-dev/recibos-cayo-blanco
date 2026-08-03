// ===============================
// CONFIGURAR PDF.js
// ===============================
pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ===============================
// ELEMENTOS
// ===============================
const boton = document.getElementById("buscar");
const botonDescargar = document.getElementById("descargar");
const mensaje = document.getElementById("mensaje");
const canvas = document.getElementById("visorPDF");
const ctx = canvas.getContext("2d");

// Ocultar botón al iniciar
if (botonDescargar) {
    botonDescargar.style.display = "none";
}

// ===============================
// EVENTOS
// ===============================
boton.addEventListener("click", buscarRecibo);

if (botonDescargar) {
    botonDescargar.addEventListener("click", descargarRecibo);
}

// ===============================
// BUSCAR RECIBO
// ===============================
async function buscarRecibo() {

    mensaje.innerHTML = "🔍 Buscando...";

    canvas.style.display = "none";

    if (botonDescargar) {
        botonDescargar.style.display = "none";
    }

    const codigo = document
        .getElementById("codigo")
        .value
        .trim()
        .toUpperCase();

    if (codigo === "") {
        mensaje.innerHTML = "Ingrese un código.";
        return;
    }

    try {

        const pdf = await pdfjsLib
            .getDocument("RHRECIBOSDEPAGO.pdf")
            .promise;

        for (let pagina = 1; pagina <= pdf.numPages; pagina++) {

            const page = await pdf.getPage(pagina);

            const contenido = await page.getTextContent();

            for (const item of contenido.items) {

                if (item.str.toUpperCase().includes(codigo)) {

                    mensaje.innerHTML =
                        "✔ Recibo encontrado correctamente.";

                    await mostrarPagina(pdf, pagina);

                    if (botonDescargar) {
                        botonDescargar.style.display = "block";
                    }

                    return;

                }

            }

        }

        mensaje.style.color = "#dc3545";
mensaje.innerHTML = "✖ Recibo no encontrado.";

    } catch (error) {

        console.error(error);

        mensaje.innerHTML = "❌ Error al abrir el PDF.";

    }

}

// ===============================
// MOSTRAR PÁGINA
// ===============================
async function mostrarPagina(pdf, numeroPagina) {

    const page = await pdf.getPage(numeroPagina);

    const viewport = page.getViewport({
        scale: 2
    });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    canvas.style.display = "block";

    await page.render({
        canvasContext: ctx,
        viewport: viewport
    }).promise;

}

// ===============================
// DESCARGAR RECIBO
// ===============================
function descargarRecibo() {

    if (canvas.style.display === "none") {

        alert("Primero busque un recibo.");

        return;

    }

    const codigo = document
        .getElementById("codigo")
        .value
        .trim()
        .toUpperCase();

    const enlace = document.createElement("a");

    enlace.download = "Recibo_" + codigo + ".png";

    enlace.href = canvas.toDataURL("image/png");

    enlace.click();

}