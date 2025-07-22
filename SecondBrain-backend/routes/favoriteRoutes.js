// routes/favoriteRoutes.js
import express from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:itemId", removeFavorite);

export default router;
