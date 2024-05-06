import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    elective_code: {
        type: String,
        required: true
    },
    elective_name: {
        type: String,
        required: true
    },
    elective_credit: {
        type: Number,
        required: true
    }
});

const verticalSchema = new mongoose.Schema({
    vertical_number: {
        type: Number,
        required: true
    },
    vertical_name: {
        type: String,
        required: true
    },
    courses: [courseSchema]
});

const departmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true
    },
    department_acronym: {
        type: String,
        required: true
    },
    verticals: [verticalSchema]
});

const Verticals = mongoose.model('Verticals', departmentSchema);

export default Verticals;
