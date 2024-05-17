import React from 'react';
import html2pdf from 'html2pdf.js';
import { Table } from 'flowbite-react';

function Transcript({ studentInfo, selectedCourses, courseGrades, cgpa, numSemesters }) {

    const handleDownloadPDF = () => {
        const element = document.getElementById('transcript-container');

        const studentName = studentInfo.name.replace(/\s+/g, '');
        const rollNumber = studentInfo.rollNumber.replace(/\s+/g, '');

        const fileName = `${studentName}_${rollNumber}_CGPA.pdf`;

        const opt = {
            margin: 0.5,
            filename: fileName,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, logging: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    const renderSemesterDetails = () => {
        return (
            <div>
                <h2 className="text-2xl text-center mb-6 font-semibold">Academic Grades</h2>
                <div className="flex flex-col gap-4">
                    {Array.from({ length: numSemesters }, (_, semesterIndex) => (
                        <div key={semesterIndex} className="bg-white shadow-md rounded-lg overflow-hidden page-break">
                            <div className="p-6 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-xl font-semibold ">
                                    Semester {semesterIndex + 1} -
                                    <span className="text-black text-[20px]">
                                        {semesterIndex % 2 !== 0 ? " EVEN" : " ODD"} Semester
                                    </span>
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-[17px] border-b border-gray-200">
                                            <th className="w-2/5 lg:w-3/5 py-2">Course Title</th>
                                            <th className="w-1/5 lg:w-1/5 py-2">Course Code</th>
                                            <th className="w-1/5 lg:w-1/5 py-2">Credits</th>
                                            <th className="w-1/5 lg:w-1/5 py-2">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseGrades[semesterIndex]?.map((course, courseIndex) => (
                                            <tr key={courseIndex} className="border-b border-gray-200">
                                                <td className="py-3 font-semibold">{course.course_name}</td>
                                                <td className="py-3 font-semibold">{course.course_code}</td>
                                                <td className="py-3 font-semibold">{course.course_credit}</td>
                                                <td className="py-3 font-semibold">{course.grade}</td>
                                            </tr>
                                        ))}
                                        {selectedCourses[semesterIndex]?.map((course, courseIndex) => (
                                            <tr key={courseIndex} className="border-b border-gray-200">
                                                <td className="py-3 font-semibold">{course.elective_name}</td>
                                                <td className="py-3 font-semibold">{course.elective_code}</td>
                                                <td className="py-3 font-semibold">{course.elective_credit}</td>
                                                <td className="py-3 font-semibold">{course.grade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    ))}
                </div>
                <div className="text-center mt-8">
                    <h3 className="text-2xl font-normal ">
                        {cgpa !== null ? `OVERALL CGPA : ${cgpa.toFixed(2)}` : ''}
                    </h3>
                </div>
            </div>
        );
    };

    return (
        <>
            <div id="transcript-container" className="max-w-4xl mx-auto font-sans text-base leading-normal">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row justify-evenly items-center p-4 gap-4">
                        <div>
                            <img className="w-32 h-32 rounded-md" src="vcet.jpeg" alt="VCET Logo" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Velammal College of Engineering and Technology</h1>
                            <h2 className="text-lg">(Autonomous)</h2>
                            <p className="text-lg">Madurai – 625 009</p>
                        </div>
                    </div>

                    <div className="mb-8 p-4">
                        <h2 className="text-2xl font-bold text-center mb-6">Student Detail</h2>
                        <div className="mb-6">
                            <table className="mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="font-semibold py-3 px-6 bg-gray-100 text-gray-600">Student Name:</td>
                                        <td className="py-3 px-6">{studentInfo.name}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="font-semibold py-3 px-6 bg-gray-100 text-gray-600">Roll Number:</td>
                                        <td className="py-3 px-6">{studentInfo.rollNumber}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="font-semibold py-3 px-6 bg-gray-100 text-gray-600">Register Number:</td>
                                        <td className="py-3 px-6">{studentInfo.registerNumber}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="font-semibold py-3 px-6 bg-gray-100 text-gray-600">Department:</td>
                                        <td className="py-3 px-6">{studentInfo.department}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold py-3 px-6 bg-gray-100 text-gray-600">Number of Semesters Attended:</td>
                                        <td className="py-3 px-6">{numSemesters}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {renderSemesterDetails()}
                    </div>
                </div>
            </div>
            <div className="text-center mt-8">
                <button onClick={handleDownloadPDF} className="mb-8 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    DOWNLOAD AS PDF
                </button>
            </div>
        </>
    );
}

export default Transcript;
