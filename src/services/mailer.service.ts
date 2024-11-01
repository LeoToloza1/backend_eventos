import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno

export class EmailService {
  private readonly transporter: Transporter;

  constructor() {
  /**
   * Constructor de la clase EmailService.
   *
   * Inicializa la propiedad this.transporter con un objeto Transporter
   * configurado para conectarse al servidor de correo electr nico.
   *
   * @throws {Error} - Si no se pueden obtener las variables de entorno
   *                  EMAIL_USER o EMAIL_PASS.
   */
    // Inicializa las propiedades desde las variables de entorno
    const email = process.env.EMAIL_USER as string;
    const password = process.env.EMAIL_PASS as string;
    const host = "smtp-leotoloza.alwaysdata.net";
    const port = 587;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user: email,
        pass: password,
      },
    });
  }
  /**
   * Envia un email a un destinatario con un asunto y texto
   * determinados.
   *
   * @param {string} destinatario - La email del destinatario.
   * @param {string} asunto - El asunto del correo.
   * @param {string} texto - El texto del correo.
   *
   * @returns {Promise<void>} - Una promesa que se resuelve cuando el correo
   *                            es enviado correctamente.
   * @throws {Error} - Si ocurre un error al enviar el correo.
   */

  async enviarCorreo(
    destinatario: string,
    asunto: string,
    texto: string
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Equipo de Gestión de Eventos: " <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: asunto,
        text: texto,
        // html: "<b>Texto en HTML</b>", // la idea es usar un teplate
      });

      console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw new Error("No se pudo enviar el correo electrónico.");
    }
  }
}
