import { errorHandler } from "../utils/error.js";
import Semesters from "../models/semester.model.js";

export const getsemesters = async (req, res, next) => {
    try {
        const semesters = await Semesters.find({ 
            ...(req.query.department_acronym) && { department_acronym: req.query.department_acronym} });

        res.status(200).json(semesters);
    } catch (error) {
        const customError = errorHandler(500, "Internal Server Error");
        next(customError);
    }
};
