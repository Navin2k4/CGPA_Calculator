import React from 'react';
import html2pdf from 'html2pdf.js';

function Transcript({ studentInfo, numSemesters, semesterData, cgpa }) {
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
                    {semesterData.map((subjects, semesterIndex) => (
                        <div key={semesterIndex} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="p-6 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-xl font-semibold mb-4">Semester {semesterIndex + 1} -
                                    <span className="text-gray-500 text-[18px] ">{semesterIndex % 2 !== 0 ? " EVEN" : " ODD"} Semester</span></h3>
                            </div>
                            <div className="px-6 py-4">
                                <table className="w-full table-fixed">
                                    <thead className=''>
                                        <tr className="text-left font-semibold border-b border-gray-200">
                                            <th className="w-2/5 lg:w-3/5 py-2">Course Title</th>
                                            <th className="w-1/5 lg:w-1/5 py-2">Course Code</th>
                                            <th className="w-1/5 lg:w-1/5 py-2">Credits</th>
                                            <th className="w-1/5 lg:w-1/5 py-2">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjects.map((subject, subjectIndex) => (
                                            <tr key={subjectIndex} className="border-b border-gray-200">
                                                <td className="py-3">{subject.title}</td>
                                                <td className="py-3">{subject.code}</td>
                                                <td className="py-3">{subject.credits}</td>
                                                <td className="py-3">{subject.grade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <h3 className="text-2xl font-semibold mb-10">{cgpa !== null ? `Overall CGPA : ${cgpa.toFixed(2)}` : ''}</h3>
                    <button onClick={handleDownloadPDF} className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700">DOWNLOAD AS PDF</button>
                </div>
            </div>
        );
    };


    return (
        <div id="transcript-container" className="font-sans text-base leading-normal py-4">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-center py-6">
                    <div>
                        <img className="w-32 h-32 my-3 rounded-md" src="vcet.jpeg" alt="VCET Logo" />
                    </div>
                    <div className="text-center items-center px-2">
                        <h1 className="text-2xl font-bold">Velammal College of Engineering and Technology (Autonomous)</h1>
                        <p className="text-lg">Madurai – 625 009</p>
                        <p className="text-xl font-semibold">Department of Computer Science and Engineering</p>
                    </div>
                    <div></div>
                </div>
                <div className="mb-8">
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
    );
}

export default Transcript;
