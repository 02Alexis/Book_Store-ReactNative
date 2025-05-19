import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Se requieren todos los campos" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ message: "El nombre de usuario debe tener al menos 3 caracteres" });
        }

        // Compruebe si el usuario ya existe
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({ message: "El correo ya existe" });
        }

        const existingUsername = await User.findOne({username});
        if (existingUsername) {
            return res.status(400).json({ message: "El nombre de usuario ya existe" });
        }

        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`

        const user = new User({
            username,
            email,
            password,
            profileImage
        });

        await user.save();
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        console.log("Error en la ruta de registro", error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
})
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Se requieren todos los campos" });

        // Compruebe si existe el usuario
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ message: "El correo no existe" });

        // Compruebe si la contraseña es correcta
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) return res.status(400).json({ message: "Contraseña incorrecta" });

        // Generar token
        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        console.log("Error en la ruta de login", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
})

export default router;