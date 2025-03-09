const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("❌ ERROR: VITE_API_BASE_URL no está definida. Revisa las variables de entorno.");
} else {
  console.log("✅ API_BASE_URL cargada correctamente:", API_BASE_URL);
}
console.log(import.meta.env)
export default API_BASE_URL;

