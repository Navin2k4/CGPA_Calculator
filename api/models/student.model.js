import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    student_name: {
        type: String,
        required: true
    },
    roll_no: {
        type: String,
        required: true
    },
    register_no: {
        type: String,
        required: true
    }
});

const sectionSchema = new mongoose.Schema({
    section_name: {
        type: String,
        required: true
    },
    students: [studentSchema]
});

const batchSchema = new mongoose.Schema({
    batch_year: {
        type: String,
        required: true
    },
    sections: [sectionSchema]
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
    batches: [batchSchema]
});

const Student = mongoose.model('Students', departmentSchema);

export default Student;
