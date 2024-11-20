import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class PdfService {
  /**
   * Genera un certificado de participación en un evento
   *
   * @param {Asistente} asistente - Datos del participante
   * @param {Evento} evento - Datos del evento
   * @param {string} logoPath - Ruta del logo de la app
   * @returns {string} La ruta absoluta del archivo PDF generado
   */
  generarCertificado(asistente: IPersona, evento: IEventos): string {
    const doc = new PDFDocument();
    const fileName = `certificado_${asistente.nombre}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../public/certificados", fileName);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const primaryColor = "#FF6600"; // Naranja
    const secondaryColor = "#0056D2"; // Azul
    const textColor = "#000000"; // Negro

    // if (fs.existsSync(logoPath)) {
    //   doc.image(logoPath, doc.page.width / 2 - 50, 30, { width: 100 });
    // }

    doc
      .fillColor(primaryColor)
      .fontSize(26)
      .text("Certificado de Participación", {
        align: "center",
      })
      .moveDown(2);

    doc
      .fillColor(textColor)
      .fontSize(18)
      .text(`Se otorga a:`, { align: "center" })
      .moveDown(0.5)
      .fillColor(secondaryColor)
      .text(`${asistente.nombre} ${asistente.apellido}`, { align: "center" })
      .moveDown(0.5)
      .fillColor(textColor)
      .text(`Con DNI: ${asistente.dni}`, { align: "center" })
      .moveDown(1)
      .text(`Por su participación en el evento:`, { align: "center" })
      .moveDown(0.5)
      .fillColor(secondaryColor)
      .text(`${evento.nombre}`, { align: "center" })
      .moveDown(1);
    doc
      .fillColor(textColor)
      .fontSize(14)
      .text(`Descripción: ${evento.descripcion}`, {
        align: "center",
        width: doc.page.width - 100,
      })
      .moveDown(1)
      .text(`Fecha: ${evento.fecha}`, { align: "center" })
      .moveDown(0.5)
      .text(`Ubicación: ${evento.ubicacion}`, { align: "center" })
      .moveDown(2)
      .fillColor(primaryColor)
      .fontSize(16)
      .text("¡Gracias por participar!", { align: "center" });
    doc.end();

    return filePath;
  }
}
