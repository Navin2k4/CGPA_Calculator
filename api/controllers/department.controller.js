import Department from "../models/department.model.js";
import { errorHandler } from "../utils/error.js";

export const getdepartments = async (req, res, next) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        const customError = errorHandler(500, "Internal Server Error");
        next(customError);
    }
};