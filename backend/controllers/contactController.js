const nodemailer = require("nodemailer");
require("dotenv").config();

const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 1. Correo al cliente (Nancy)
    const adminMail = {
      from: `"Sitio Web Colchones" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: "📬 Nuevo mensaje desde el formulario de contacto",
      html: `
        <h3>Has recibido un nuevo mensaje</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${message}</p>
      `,
    };

    // 2. Confirmación automática al usuario que llenó el formulario
    const userConfirmationMail = {
      from: `"Nancy Angulo Colchones" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Gracias por comunicarte con nosotros 🙌",
      html: `
        <p>Hola <strong>${name}</strong>,</p>
        <p>Gracias por comunicarte con <strong>Nancy Angulo Colchones para Camiones</strong>. Nuestro equipo se pondrá en contacto contigo lo antes posible.</p>
        <p>También puedes escribirnos directamente a nuestro WhatsApp: <a href="https://wa.me/56989785828">+56 9 8978 5828</a></p>
        <hr>
        <p><strong>Tu mensaje:</strong><br/>${message}</p>
        <p style="margin-top: 20px;">Saludos cordiales,<br/>Equipo Nancy Angulo</p>
      `,
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userConfirmationMail);

    res.status(200).json({ message: "Mensaje enviado con éxito" });

  } catch (error) {
    console.error("❌ Error al enviar los correos:", error);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

module.exports = { sendContactMessage };
