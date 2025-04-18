const nodemailer = require("nodemailer");
require("dotenv").config();

// 📬 Ruta para recibir mensajes del formulario de contacto
const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Configura el transporter
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

    // Contenido del correo
    const mailOptions = {
      from: `"Sitio Web Colchones" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: "Nuevo mensaje desde el formulario de contacto",
      html: `
        <h3>Has recibido un nuevo mensaje</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mensaje enviado con éxito" });

  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

module.exports = { sendContactMessage };

