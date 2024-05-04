import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import departmentRoutes from './routes/department.route.js';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDB is Connected");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(express.json());


app.use('/api/departments', departmentRoutes);


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
    console.log(`Example app listening on port ${port}`)
})