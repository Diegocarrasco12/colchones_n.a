const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// 🔹 Registro de usuario
const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Verificar si ya existe el usuario
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar nuevo usuario
        await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [fullName, email, hashedPassword]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error); // ✅ Ver en logs
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// 🔹 Inicio de sesión
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email,
            },
        });
    } catch (error) {
        console.error("❌ Error en login:", error); // ✅ Ver en logs
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// 🔹 Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
    try {
        const user = await db.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error("❌ Error al obtener perfil:", error); // ✅ Ver en logs
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = { register, login, getProfile };
