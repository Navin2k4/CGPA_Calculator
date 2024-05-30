import express from "express";
import { getStudents } from "../controllers/student.controller.js";

const router = express.Router();

router.get('/getstudents', getStudents);

export default router;
