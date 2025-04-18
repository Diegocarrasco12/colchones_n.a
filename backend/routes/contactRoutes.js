const express = require("express");
const router = express.Router();
const { sendContactMessage } = require("../controllers/contactController");

// Ruta POST para enviar mensajes de contacto
router.post("/", sendContactMessage);

module.exports = router;
