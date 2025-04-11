const { createMessage } = require("../models/Contact");

const handleContactForm = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const savedMessage = await createMessage({ name, email, message });
    res.status(201).json({ message: "Mensaje enviado con éxito", data: savedMessage });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
};

module.exports = { handleContactForm };

