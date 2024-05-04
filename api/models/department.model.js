import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true,
    },
    department_acronym: {
        type: String,
        required: true,
    },
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
