import express from "express";
import { getverticals } from "../controllers/vertical.controller.js";

const router = express.Router();

router.get('/getverticals', getverticals);

export default router;