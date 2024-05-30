import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import departmentRoutes from './routes/department.route.js';
import semesterRoutes from './routes/semester.route.js';
import verticalRoutes from './routes/vertical.route.js';
import studentRoutes from './routes/student.route.js';

import path from 'path';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDB is Connected");
    })
    .catch((err) => {
        console.log(err);
    });

const __dirname = path.resolve();

const app = express();

app.use(express.json());


app.use('/api/departments', departmentRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/verticals', verticalRoutes);
app.use('/api/students', studentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})