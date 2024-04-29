import { useState } from 'react';
import Transcript from '../components/Transcript';
import { Select, TextInput, Button, FloatingLabel, Alert } from 'flowbite-react';

function Calculator() {
    const gradeScale = {
        'O': 10,
        'A+': 9,
        'A': 8,
        'B+': 7,
        'B': 6,
        'C': 5,
        'U': 0 // Re Attempt(Areer) or Absent
    };

    const [formData, setFormData] = useState([]);
    const [cgpa, setCgpa] = useState(null);
    const [numSemesters, setNumSemesters] = useState(0);
    const [studentInfo, setStudentInfo] = useState({
        name: '',
        rollNumber: '',
        registerNumber: '',
        department: ''
    });
    console.log(formData, numSemesters, cgpa, studentInfo);
    const [showTranscript, setShowTranscript] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        let totalCredits = 0;
        let totalMarks = 0;
        const selectedCourses = new Set(); // To ensure uniqueness of selected courses

        formData.forEach((semesterSubjects) => {
            let semesterTotalCredits = 0;
            let semesterTotalMarks = 0;

            semesterSubjects.forEach((subject) => {
                const course = `${subject.title} (${subject.code})`;
                if (selectedCourses.has(course)) {
                    alert('You cannot select the same course in multiple semesters.');
                    return;
                }
                selectedCourses.add(course);
                // Parse credits as a number
                const credits = parseFloat(subject.credits);
                semesterTotalCredits += credits;
                semesterTotalMarks += gradeScale[subject.grade] * credits;
            });

            // Add semester total credits and marks to overall totals
            totalCredits += semesterTotalCredits;
            totalMarks += semesterTotalMarks;
            console.log(totalCredits, totalMarks);
        });

        const currentCgpa = totalMarks / totalCredits;
        setCgpa(currentCgpa);

        setShowTranscript(true);
    };

    const handleStudentInfoChange = (event) => {
        const { name, value } = event.target;
        setStudentInfo((prevStudentInfo) => ({
            ...prevStudentInfo,
            [name]: value
        }));
    };

    const handleNumSemestersChange = (event) => {
        const newNumSemesters = parseInt(event.target.value);
        setNumSemesters(newNumSemesters);

        setFormData(prevFormData => {
            let newFormData = [...prevFormData];

            // Remove extra semesters if reducing the number of semesters
            if (newNumSemesters < newFormData.length) {
                newFormData = newFormData.slice(0, newNumSemesters);
            }

            // Preserve existing form data
            for (let i = newFormData.length; i < newNumSemesters; i++) {
                newFormData.push([]);
            }

            return newFormData;
        });

    };

    const handleNumSubjectsChange = (event, semesterIndex) => {
        const { value } = event.target;
        const numSubjects = parseInt(value);

        if (isNaN(numSubjects) || numSubjects < 1) {
            setFormData(prevFormData => {
                let newFormData = [...prevFormData];

                // Remove all subjects if reducing the number of subjects to 0 or less
                if (numSubjects < 1) {
                    newFormData[semesterIndex - 1] = [];
                } else {
                    // Otherwise, remove extra subjects if reducing the number of subjects
                    newFormData[semesterIndex - 1] = newFormData[semesterIndex - 1].slice(0, numSubjects);
                }

                return newFormData;
            });
        } else {
            // Otherwise, set the number of subjects as specified
            setFormData(prevFormData => {
                const newFormData = [...prevFormData];
                const existingSubjects = newFormData[semesterIndex - 1] || []; // Get existing subjects
                const newSubjects = new Array(numSubjects).fill({
                    title: '',
                    code: '',
                    credits: 0,
                    grade: ''
                });

                for (let i = 0; i < Math.min(existingSubjects.length, numSubjects); i++) {
                    newSubjects[i] = { ...existingSubjects[i] };
                }

                newFormData[semesterIndex - 1] = newSubjects;
                return newFormData;
            });
        }
    };


    const handleSubjectChange = (event, semesterIndex, subjectIndex, key) => {
        const { value } = event.target;
        setFormData(prevFormData => {
            const newFormData = [...prevFormData];
            const newSubject = { ...newFormData[semesterIndex - 1][subjectIndex], [key]: value };
            newFormData[semesterIndex - 1] = [...newFormData[semesterIndex - 1]]; // Ensure immutability
            newFormData[semesterIndex - 1][subjectIndex] = newSubject;
            return newFormData;
        });
    };

    const renderSemesterInputs = () => {
        const inputs = [];
        for (let i = 1; i <= formData.length; i++) {
            inputs.push(
                <div className={`w-full`} key={i}>
                    <h3 className='text-violet-700 font-bold text-xl text-center py-6'>SEMESTER {i} {i % 2 === 0 ? "Even" : "Odd"}</h3>
                    <div className={`slide-${i <= numSemesters ? 'down-enter' : 'up-leave'}`}>
                        <FloatingLabel
                            variant='filled'
                            type="number"
                            label='Number of Subjects'
                            min='1'
                            max='20'
                            value={(formData[i - 1] && formData[i - 1].length) || ''}
                            onChange={(e) => handleNumSubjectsChange(e, i)}
                        />
                    </div>
                    {renderSubjectInputs(i)}
                </div>
            );
        }
        return inputs;
    };


    const renderSubjectInputs = (semesterIndex) => {
        const subjects = formData[semesterIndex - 1] || [];
        return (
            <div className={`slide-${semesterIndex <= numSemesters ? 'down-enter' : 'up-leave'}`}>
                {subjects.map((subject, subjectIndex) => (
                    <div className='flex flex-wrap w-full' key={subjectIndex}>
                        <div className='w-full'>
                            <h4 className='text-lg text-violet-600 font-semibold'>SUBJECT {subjectIndex + 1}</h4>
                        </div>
                        <div className='w-full'>
                            <FloatingLabel
                                variant='filled'
                                label='Course Name'
                                type="text"
                                value={subject.title}
                                onChange={(e) => handleSubjectChange(e, semesterIndex, subjectIndex, 'title')}
                                key={`title_${semesterIndex}_${subjectIndex}`}
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <FloatingLabel
                                variant='filled'
                                label='Course Code'
                                type="text"
                                value={subject.code}
                                onChange={(e) => handleSubjectChange(e, semesterIndex, subjectIndex, 'code')}
                                key={`code_${semesterIndex}_${subjectIndex}`}
                                required
                            />
                        </div>
                        <div className='flex flex-col md:flex-row justify-start items-center gap-4 w-full'>
                            <div className="w-full md:w-1/3">
                                <FloatingLabel
                                    variant='filled'
                                    label='Total Credits'
                                    type="number"
                                    min='1'
                                    value={subject.credits}
                                    onChange={(e) => handleSubjectChange(e, semesterIndex, subjectIndex, 'credits')}
                                    key={`credits_${semesterIndex}_${subjectIndex}`}
                                    required
                                />
                            </div>
                            <div className='w-full md:w-1/2'>
                                <Select
                                    value={subject.grade}
                                    onChange={(e) => handleSubjectChange(e, semesterIndex, subjectIndex, 'grade')}
                                    key={`grade_${semesterIndex}_${subjectIndex}`}
                                    required
                                    className='w-full md:w-auto md:ml-4'
                                >
                                    <option value="">Select Grade</option>
                                    {Object.keys(gradeScale).map((grade) => (
                                        <option key={grade} value={grade}>
                                            {grade}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <Alert className='w-full md:auto'>This will be reflected on your CGPA</Alert>
                        </div>


                    </div>
                ))}
            </div>
        );
    };



    return (
        <div className="p-4 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center mb-4">Enter Your Details</h1>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <FloatingLabel
                    variant='filled'
                    type="text"
                    label='Student Name'
                    value={studentInfo.name}
                    onChange={handleStudentInfoChange}
                    name="name"
                    helperText="Example : Adam K"
                    required
                />
                <FloatingLabel
                    variant='filled'
                    type="text"
                    label='Roll Number'
                    value={studentInfo.rollNumber}
                    onChange={handleStudentInfoChange}
                    name="rollNumber"
                    helperText="Example : 22CSEB01"
                    required
                />
                <FloatingLabel
                    variant='filled'
                    type="text"
                    label='Register Number'
                    value={studentInfo.registerNumber}
                    onChange={handleStudentInfoChange}
                    name="registerNumber"
                    helperText="Example : 913122101100"
                    required
                />
                <Select
                    value={studentInfo.department}
                    onChange={handleStudentInfoChange}
                    name="department"
                    required
                >
                    <option value="">Select Department</option>
                    <option value="CSE - Computer Science and Engineering">Computer Science and Engineering (CSE)</option>
                    <option value="ECE - Electronics and Communication Engineering">Electronics and Communication Engineering (ECE)</option>
                    <option value="EEE - Electrical and Electronics Engineering">Electrical and Electronics Engineering (EEE)</option>
                    <option value="IT - Information Technology">Information Technology (IT)</option>
                    <option value="MECH - Mechanical Engineering">Mechanical Engineering (MECH)</option>
                    <option value="CIVIL - Civil Engineering">Civil Engineering (CIVIL)</option>
                </Select>
                <FloatingLabel
                    variant='filled'
                    label='Number Of Semesters'
                    max='8'
                    min='0'
                    type="number"
                    value={numSemesters}
                    onChange={handleNumSemestersChange}
                    required
                />

                {renderSemesterInputs()}
                <Button type='submit' className='bg-violet-500'>Submit</Button>

                <TextInput
                    type="text"
                    readOnly
                    value={cgpa !== null ? `CGPA: ${cgpa.toFixed(2)}` : 'Your CGPA Appears here'}
                />
            </form>

            {showTranscript && (
                <Transcript
                    studentInfo={studentInfo}
                    numSemesters={numSemesters}
                    semesterData={formData}
                    cgpa={cgpa}
                />
            )}
        </div>

    );
}

export default Calculator;
