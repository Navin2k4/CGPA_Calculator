import React from 'react';
import html2pdf from 'html2pdf.js';

function Transcript({ studentInfo, numSemesters, semesterData, cgpa }) {
    const handleDownloadPDF = () => {
        const element = document.getElementById('transcript-container');

        // Extract student name and roll number from the form data
        const studentName = studentInfo.name.replace(/\s+/g, ''); // Remove spaces from the name
        const rollNumber = studentInfo.rollNumber.replace(/\s+/g, ''); // Remove spaces from the roll number

        const fileName = `${studentName}_${rollNumber}_CGPA.pdf`;

        const opt = {
            margin: 0.5,
            filename: fileName,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 4, logging: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };


    return (
        <>
            <div id="transcript-container" className="font-sans text-base leading-normal">
                <h2 className="text-2xl text-center mb-6">Student Data</h2>
                <div className="mb-8">
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>Student Name:</strong></td>
                                <td className="p-2"><strong>:</strong></td>
                                <td>{studentInfo.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Roll Number</strong></td>
                                <td className="p-2"><strong>:</strong></td>
                                <td>{studentInfo.rollNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>Register Number</strong></td>
                                <td className="p-2"><strong>:</strong></td>
                                <td>{studentInfo.registerNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>Department</strong></td>
                                <td className="p-2"><strong>:</strong></td>
                                <td>{studentInfo.department}</td>
                            </tr>
                            <tr>
                                <td><strong>Number of Semesters Attended</strong></td>
                                <td className="p-2"><strong>:</strong></td>
                                <td>{numSemesters}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div>
                    <h3 className="mb-2 text-lg"><strong>Semester Details</strong></h3>
                    {semesterData.map((subjects, semesterIndex) => (
                        <div key={semesterIndex} className="mb-8">
                            <h4 className="mb-4"><strong>Semester {semesterIndex + 1}</strong></h4>
                            <table className="w-full border-collapse border border-gray-400">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-400 px-4 py-2 text-left">Course Title</th>
                                        <th className="border border-gray-400 px-4 py-2 text-left">Course Code</th>
                                        <th className="border border-gray-400 px-4 py-2 text-left">Total Credits</th>
                                        <th className="border border-gray-400 px-4 py-2 text-left">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject, subjectIndex) => (
                                        <tr key={subjectIndex}>
                                            <td className="border border-gray-400 px-4 py-2">{subject.title}</td>
                                            <td className="border border-gray-400 px-4 py-2">{subject.code}</td>
                                            <td className="border border-gray-400 px-4 py-2">{subject.credits}</td>
                                            <td className="border border-gray-400 px-4 py-2">{subject.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                    <div>
                        <h3 className="mb-2 text-2xl"><strong>{cgpa !== null ? `CGPA: ${cgpa.toFixed(2)}` : ''}</strong></h3>
                    </div>
                </div>
            </div>
            <div className="text-center m-8">
                <button onClick={handleDownloadPDF} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Download PDF</button>
            </div>
        </>
    );
}

export default Transcript;
