import { errorHandler } from "../utils/error.js";
import Verticals from "../models/vertical.model.js";

export const getverticals = async (req, res, next) => {
    try {
        const semesters = await Verticals.find({
            ...(req.query.department_acronym) && { department_acronym: req.query.department_acronym }
        });
        res.status(200).json(semesters);
    } catch (error) {
        const customError = errorHandler(500, "Internal Server Error");
        next(customError);
    }
};