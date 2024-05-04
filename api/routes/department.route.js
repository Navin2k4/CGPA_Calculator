import express from 'express';
import { getdepartments } from '../controllers/department.controller.js';

const router = express.Router();

router.get('/getdepartments',getdepartments);

export default router;