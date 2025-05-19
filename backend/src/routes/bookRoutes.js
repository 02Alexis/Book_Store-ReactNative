import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;
        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: "Proporcione todos los campos" });
        }

        // cargar la imagen a la nube
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        // Guardar en la db
        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user.id
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.log("Error al crear libro", error);
        res.status(500).json({ message: error.message });
    }
})

router.get("/", protectRoute, async (req, res) => {
    // example call from react native - frontend
    // example: http://localhost:3000/api/books?page=1&limit=10
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
    } catch (error) {
        console.log("Error al obtener todos los libros", error);
        res.status(500).json({ message: error.message });
    }
})

router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 })
        res.json(books);
    } catch (error) {
        console.log("Error al obtener libros del usuario", error);
        res.status(500).json({ message: "Error Interno del Servidor" });
    }
})

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Libro no encontrado" });
        
        // Compruebe si el usuario es el creador del libro
        if (book.user.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "No autorizado" });

        // Eliminar imagen de Cloudinary
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.log("Error al eliminar imagen de Cloudinary", error);
            }
        }

        await book.deleteOne();
        res.status(200).json({ message: "Libro eliminado" });
    } catch (error) {
        console.log("Error al eliminar libro", error);
        res.status(500).json({ message: "Error Interno del Servidor"});
    }
})

export default router;