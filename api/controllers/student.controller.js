import { errorHandler } from "../utils/error.js";
import Student from "../models/student.model.js";

export const getStudents = async (req, res, next) => {
    try {
        const { departmentAcronym, batch, section } = req.query;

        const departmentData = await Student.findOne({ department_acronym: departmentAcronym });

        if (!departmentData) {
            return res.status(404).json({ message: "Department not found" });
        }

        const batchData = departmentData.batches.find(b => b.batch_year === batch);

        if (!batchData) {
            return res.status(404).json({ message: "Batch not found" });
        }

        const sectionData = batchData.sections.find(s => s.section_name === section);

        if (!sectionData) {
            return res.status(404).json({ message: "Section not found" });
        }

        res.status(200).json(sectionData.students);
    } catch (error) {
        const customError = errorHandler(500, "Internal Server Error");
        next(customError);
    }
};
