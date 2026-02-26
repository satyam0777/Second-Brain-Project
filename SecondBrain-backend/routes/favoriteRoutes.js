
import express from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:id", removeFavorite);

export default router;
