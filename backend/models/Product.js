const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  medidas: [String],
  precios: [
    {
      medida: String,
      precio: Number
    }
  ],
  fichaTecnica: {
    tipoColchon: String,
    tipoCubierta: String,
    tipoRelleno: String,
    fajaLateral: String,
    rellenoAcolchado: String,
    ladosUso: String,
    largo: String
  },
  imagenes: [String]
});

module.exports = mongoose.model("Producto", productSchema);
