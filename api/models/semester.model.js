import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    course_credits: {
        type: Number,
        required: true
    }
});

const semesterSchema = new mongoose.Schema({
    courses: [courseSchema]
});

const departmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true
    },
    department_acronym: {
        type: String,
        required: true,
        unique: true
    },
    semesters: [semesterSchema]
});

const Semesters = mongoose.model('Semesters', departmentSchema);

export default Semesters;
