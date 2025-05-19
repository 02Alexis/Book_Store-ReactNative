import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
    try {
        // obtener el token
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "No autorizado" });

        // verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // encontrar usuario
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "No autorizado" });

        req.user = user;
        next();

    } catch (error) {
        console.log("Error al verificar el token", error);
        res.status(401).json({ message: "No autorizado" });
    }
}

export default protectRoute;