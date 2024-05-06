import express from "express";
import { getsemesters } from "../controllers/semester.controller.js";

const router = express.Router();

router.get('/getsemesters', getsemesters);

export default router;