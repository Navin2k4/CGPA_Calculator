import React, { useState } from 'react';
import Transcript from '../components/Transcript';
import { Select, TextInput, Button, FloatingLabel, Alert, Label, Radio } from 'flowbite-react';

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

    const [studentInfo, setStudentInfo] = useState({
        name: '',
        rollNumber: '',
        registerNumber: '',
        department: ''
    });

    const [formData, setFormData] = useState([]);
    const [cgpa, setCgpa] = useState(null);
    const [numSemesters, setNumSemesters] = useState(0);
    const [showTranscript, setShowTranscript] = useState(false);
    const [showElectiveFields, setShowElectiveFields] = useState([]);
    const [numElectives, setNumElectives] = useState([]);
    const [electiveData, setElectiveData] = useState([]);

    console.log("StudentInfo : ", studentInfo);
    console.log("formData : ", formData);
    console.log("electiveData : ", electiveData);
    console.log("NumSemester : ", numSemesters);
    console.log("NumElective : ", numElectives);
    console.log("CGPA :", cgpa);

    const handleSubmit = (event) => {
        event.preventDefault();
        let totalCredits = 0;
        let totalMarks = 0;
        const selectedCourses = new Set();
        formData.forEach((semesterSubjects, semesterIndex) => {
            let semesterTotalCredits = 0;
            let semesterTotalMarks = 0;
            semesterSubjects.forEach((subject) => {
                const course = `${subject.title} (${subject.code})`;
                if (selectedCourses.has(course)) {
                    alert('You cannot select the same course in multiple semesters.');
                    return;
                }
                selectedCourses.add(course);
                const credits = parseFloat(subject.credits);
                semesterTotalCredits += credits;
                semesterTotalMarks += gradeScale[subject.grade] * credits;
            });

            // Include elective subjects in the calculation
            electiveData[semesterIndex].forEach((elective) => {
                const course = `${elective.name} (${elective.code})`;
                if (selectedCourses.has(course)) {
                    alert('You cannot select the same course in multiple semesters.');
                    return;
                }
                selectedCourses.add(course);
                const credits = parseFloat(elective.credits);
                semesterTotalCredits += credits;
                semesterTotalMarks += gradeScale[elective.grade] * credits;
            });

            totalCredits += semesterTotalCredits;
            totalMarks += semesterTotalMarks;
        });
        const currentCgpa = totalMarks / totalCredits;
        setCgpa(currentCgpa);
        setShowTranscript(true);
    };

    const handleStudentInfoChange = (event) => {
        const { name, value } = event.target;
        // Check if the name is not 'department' or 'numSemesters'
        const capitalizedValue = (name !== 'department' && name !== 'numSemesters') ? value.toUpperCase() : value;
        setStudentInfo((prevStudentInfo) => ({
            ...prevStudentInfo,
            [name]: capitalizedValue
        }));
    };


    const handleNumSemestersChange = (event) => {
        const newNumSemesters = parseInt(event.target.value);
        setNumSemesters(newNumSemesters);

        setShowElectiveFields((prevShowElectiveFields) => {
            const newShowElectiveFields = [...prevShowElectiveFields];

            // Preserve existing values for previously rendered semesters
            for (let i = 0; i < prevShowElectiveFields.length; i++) {
                if (i >= newNumSemesters) {
                    break; // Stop updating when reaching the new number of semesters
                }
                newShowElectiveFields[i] = prevShowElectiveFields[i];
            }

            // Fill remaining slots with false for new semesters
            for (let i = prevShowElectiveFields.length; i < newNumSemesters; i++) {
                newShowElectiveFields.push(false);
            }

            return newShowElectiveFields;
        });
        setNumElectives((prevNumElectives) => {
            const newNumElectives = [...prevNumElectives];

            // Preserve existing values for previously rendered semesters
            for (let i = 0; i < prevNumElectives.length; i++) {
                if (i >= newNumSemesters) {
                    break; // Stop updating when reaching the new number of semesters
                }
                newNumElectives[i] = prevNumElectives[i];
            }

            // Fill remaining slots with 0 for new semesters
            for (let i = prevNumElectives.length; i < newNumSemesters; i++) {
                newNumElectives.push(0);
            }

            return newNumElectives;
        });
        setFormData((prevFormData) => {
            let newFormData = [...prevFormData];

            if (newNumSemesters < newFormData.length) {
                newFormData = newFormData.slice(0, newNumSemesters);
            }

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
            setFormData((prevFormData) => {
                let newFormData = [...prevFormData];

                if (numSubjects < 1) {
                    newFormData[semesterIndex - 1] = [];
                } else {
                    newFormData[semesterIndex - 1] = newFormData[semesterIndex - 1].slice(0, numSubjects);
                }

                return newFormData;
            });
        } else {
            setFormData((prevFormData) => {
                const newFormData = [...prevFormData];
                const existingSubjects = newFormData[semesterIndex - 1] || [];
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

    const handleNumElectivesChange = (event, semesterIndex) => {
        const { value } = event.target;
        const numElectives = parseInt(value);

        if (isNaN(numElectives) || numElectives < 0) {
            // Prevent increasing number of electives beyond 0
            return;
        }

        setNumElectives((prevNumElectives) => {
            const newNumElectives = [...prevNumElectives];
            newNumElectives[semesterIndex - 1] = numElectives;

            // If number of electives is set to 0, clear elective data
            if (numElectives === 0) {
                setElectiveData((prevElectiveData) => {
                    const newElectiveData = [...prevElectiveData];
                    newElectiveData[semesterIndex - 1] = [];
                    return newElectiveData;
                });
            } else {
                // Initialize elective data if not already initialized
                if (!electiveData[semesterIndex - 1]) {
                    setElectiveData((prevElectiveData) => {
                        const newElectiveData = [...prevElectiveData];
                        newElectiveData[semesterIndex - 1] = new Array(numElectives).fill({
                            name: '',
                            code: '',
                            credits: 0,
                            grade: ''
                        });
                        return newElectiveData;
                    });
                } else {
                    // If elective data already exists, adjust its length
                    setElectiveData((prevElectiveData) => {
                        const newElectiveData = [...prevElectiveData];
                        const existingElectives = newElectiveData[semesterIndex - 1] || [];
                        const newElectiveArray = new Array(numElectives).fill(null).map((_, index) => {
                            if (existingElectives[index]) {
                                return existingElectives[index];
                            } else {
                                return {
                                    name: '',
                                    code: '',
                                    credits: 0,
                                    grade: ''
                                };
                            }
                        });
                        newElectiveData[semesterIndex - 1] = newElectiveArray;
                        return newElectiveData;
                    });
                }
            }

            return newNumElectives;
        });
    };



    const handleSubjectChange = (event, semesterIndex, subjectIndex, key) => {
        const { value } = event.target;
        setFormData((prevFormData) => {
            const newFormData = [...prevFormData];
            const newSubject = { ...newFormData[semesterIndex - 1][subjectIndex], [key]: value };
            newFormData[semesterIndex - 1] = [...newFormData[semesterIndex - 1]];
            newFormData[semesterIndex - 1][subjectIndex] = newSubject;
            return newFormData;
        });
    };

    const handleElectiveSubjectChange = (event, semesterIndex, electiveIndex, key) => {
        const { value } = event.target;
        setElectiveData((prevElectiveData) => {
            const newElectiveData = [...prevElectiveData];
            const newElective = { ...newElectiveData[semesterIndex - 1][electiveIndex], [key]: value };
            newElectiveData[semesterIndex - 1][electiveIndex] = newElective;
            return newElectiveData;
        });
    };

    const renderSemesterInputs = () => {
        const inputs = [];
        for (let i = 1; i <= numSemesters; i++) {
            inputs.push(
                <div className={`w-full`} key={i}>
                    <h3 className='text-black font-bold text-2xl text-center py-6'>SEMESTER {i} {i % 2 === 0 ? "EVEN" : "ODD"}</h3>
                    <div>
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

                    {/* Only electives are fro 5th semesters for CSE */}
                    {(i > 4) && (
                        <div className="flex items-center gap-2 py-4" >
                            <Label htmlFor={`elective-${i}`} className=' font-bold'>Having Elective in Semester {i}</Label>
                            <Radio id={`elective-${i}`} name={`elective-${i}`} value="yes" onChange={() => setShowElectiveFields((prevShowElectiveFields) => prevShowElectiveFields.map((value, index) => index === i - 1 ? true : value))} />
                            <Label>Yes</Label>
                            <Radio
                                required
                                id={`elective-${i}`}
                                name={`elective-${i}`}
                                value="no"
                                onChange={() => {
                                    setShowElectiveFields((prevShowElectiveFields) => prevShowElectiveFields.map((value, index) => index === i - 1 ? false : value));
                                    // Clear elective data for this semester
                                    setElectiveData((prevElectiveData) => {
                                        const newElectiveData = [...prevElectiveData];
                                        newElectiveData[i - 1] = []; // Set to empty array
                                        return newElectiveData;
                                    });
                                }}
                            />
                            <Label>No</Label>
                        </div>
                    )}

                    {showElectiveFields[i - 1] && (
                        <div className='w-full'>
                            <FloatingLabel
                                className='w-full'
                                variant='filled'
                                label={`Number of Electives in Semester ${i}`}
                                type="number"
                                min='0'
                                value={numElectives[i - 1]}
                                onChange={(e) => handleNumElectivesChange(e, i)}
                            />
                            {renderElectiveInputs(i, numElectives[i - 1])}
                        </div>
                    )}
                </div>
            );
        }
        return inputs;
    };


    const renderSubjectInputs = (semesterIndex) => {
        const subjects = formData[semesterIndex - 1] || [];
        return (
            <div>
                {subjects.map((subject, subjectIndex) => (
                    <div className='flex flex-wrap w-full' key={subjectIndex}>
                        <div className='w-full py-4'>
                            <h4 className='text-2xl text-violet-600 font-semibold'>SUBJECT {subjectIndex + 1}</h4>
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
                            <Alert color="warning" className='w-full md:auto font-bold'>This will be reflected on your CGPA !</Alert>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderElectiveInputs = (semesterIndex) => {
        const electives = electiveData[semesterIndex - 1] || [];
        return (
            <div>
                {electives.map((elective, electiveIndex) => (
                    <div key={`elective-${semesterIndex}-${electiveIndex}`}>
                        <div className='w-full py-4'>

                            <h4 className='text-2xl text-orange-600 font-semibold'>ELECTIVE {electiveIndex + 1}</h4>
                        </div>
                        <div className='w-full'>
                            <FloatingLabel
                                variant='filled'
                                label={`Elective Name ${electiveIndex + 1}`}
                                type="text"
                                required
                                value={elective.name}
                                onChange={(e) => handleElectiveSubjectChange(e, semesterIndex, electiveIndex, 'name')}
                            />
                        </div>
                        <div className='w-full'>
                            <FloatingLabel
                                variant='filled'
                                label={`Elective Code ${electiveIndex + 1}`}
                                type="text"
                                required
                                value={elective.code}
                                onChange={(e) => handleElectiveSubjectChange(e, semesterIndex, electiveIndex, 'code')}
                            />
                        </div>
                        <div className='flex flex-col md:flex-row justify-start items-center gap-4 w-full'>
                            <div className="w-full md:w-1/3">
                                <FloatingLabel
                                    variant='filled'
                                    label={`Total Credits ${electiveIndex + 1}`}
                                    type="number"
                                    min='1'
                                    required
                                    value={elective.credits}
                                    onChange={(e) => handleElectiveSubjectChange(e, semesterIndex, electiveIndex, 'credits')}
                                />
                            </div>
                            <div className='w-full md:w-1/2'>
                                <Select
                                    required
                                    value={elective.grade}
                                    onChange={(e) => handleElectiveSubjectChange(e, semesterIndex, electiveIndex, 'grade')}
                                >
                                    <option value="">Select Grade</option>
                                    {Object.keys(gradeScale).map((grade) => (
                                        <option key={grade} value={grade}>
                                            {grade}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <Alert color="warning" className='w-full md:auto font-bold'>This will be reflected on your CGPA !</Alert>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 max-w-3xl mx-auto min-h-screen ">
            <h1 className="text-2xl text-center pb-6 font-bold">YOUR DETAILS</h1>
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
                    type="number"
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


                <Alert className='font-bold items-center'>TODO: To Add for any additional courses made during the academic year and other details </Alert>
                <Alert className='font-bold items-center'>TODO: To display the subjects seperately which are "U"</Alert>

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
                    electiveData={electiveData}

                />
            )}
        </div>
    );
}

export default Calculator;
