import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
    semester_number: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for semester number'
        }
    },
    subjects: [
        {
            course_name: {
                type: String,
                required: true
            },
            course_code: {
                type: String,
                required: true
            },
            alloted_credit: {
                type: Number,
                required: true
            }
        }
    ]
});

const verticalSchema = new mongoose.Schema({
    vertical_number: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for vertical number'
        }
    },
    vertical_name: {
        type: String,
        required: true
    },
    vertical_credit: {
        type: Number,
        required: true
    },
    semester_taken: {
        type: Number,
        required: true
    }
});

const streamSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    semesters: [semesterSchema],
    verticals: [verticalSchema]
});

const Department = mongoose.model('Department', streamSchema);

export default Department;
