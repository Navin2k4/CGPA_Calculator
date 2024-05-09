import React, { useEffect, useState } from 'react';
import Transcript from '../components/Transcript';
import { Select, TextInput, FloatingLabel, Alert, Label } from 'flowbite-react';

function Calculator() {
    const gradeScale = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'U': 0 };
    const [studentInfo, setStudentInfo] = useState({ name: '', rollNumber: '', registerNumber: '', department: '' });
    const [formData, setFormData] = useState([]);
    const [cgpa, setCgpa] = useState(null);
    const [numSemesters, setNumSemesters] = useState(0);
    const [showTranscript, setShowTranscript] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartmentAcronym, setSelectedDepartmentAcronym] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [electives, setElectives] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch(`/api/departments/getdepartments`);
                const data = await res.json();
                if (res.ok) {
                    setDepartments(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await fetch(`/api/semesters/getsemesters?department_acronym=${selectedDepartmentAcronym}`);
                const data = await res.json();
                if (res.ok) {
                    setSemesters(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (selectedDepartmentAcronym) {
            fetchSemesters();
        }
    }, [selectedDepartmentAcronym]);

    useEffect(() => {
        const fetchVerticals = async () => {
            try {
                const res = await fetch(`/api/verticals/getverticals?department_acronym=${selectedDepartmentAcronym}`);
                const data = await res.json();
                if (res.ok) {
                    setElectives(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (selectedDepartmentAcronym) {
            fetchVerticals();
        }
    }, [selectedDepartmentAcronym]);


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
            totalCredits += semesterTotalCredits;
            totalMarks += semesterTotalMarks;
        });
        const currentCgpa = totalMarks / totalCredits;
        setCgpa(currentCgpa);
        setShowTranscript(true);
    };

    const handleStudentInfoChange = (event) => {
        setShowTranscript(false);
        const { name, value } = event.target;
        const capitalizedValue = (name !== 'department' && name !== 'numSemesters') ? value.toUpperCase() : value;
        setStudentInfo((prevStudentInfo) => ({
            ...prevStudentInfo,
            [name]: capitalizedValue
        }));
        if (name === 'department') {
            const acronym = value.split(' - ')[0];
            setSelectedDepartmentAcronym(acronym);
        }
    };

    const handleNumSemestersChange = (event) => {
        setShowTranscript(false);
        const newNumSemesters = parseInt(event.target.value);
        setNumSemesters(newNumSemesters);
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
        setNumSemesters(newNumSemesters);
    };

    const handleNumSubjectsChange = (event, semesterIndex) => {
        setShowTranscript(false);
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


    const handleSubjectChange = (event, semesterIndex, subjectIndex, key) => {
        setShowTranscript(false);

        const { value } = event.target;
        setFormData((prevFormData) => {
            const newFormData = [...prevFormData];
            const newSubject = { ...newFormData[semesterIndex - 1][subjectIndex], [key]: value };
            newFormData[semesterIndex - 1] = [...newFormData[semesterIndex - 1]];
            newFormData[semesterIndex - 1][subjectIndex] = newSubject;
            return newFormData;
        });
    };

    const incrementNumSubjects = (semesterIndex) => {
        const updatedNumSubjects = formData[semesterIndex - 1].length + 1;
        handleNumSubjectsChange({ target: { value: updatedNumSubjects } }, semesterIndex);
    };

    const decrementNumSubjects = (semesterIndex) => {
        if (formData[semesterIndex - 1].length > 0) {
            const updatedNumSubjects = formData[semesterIndex - 1].length - 1;
            handleNumSubjectsChange({ target: { value: updatedNumSubjects } }, semesterIndex);
        }
    };

    const renderSemesterInputs = () => {
        const inputs = [];
        for (let i = 1; i <= numSemesters; i++) {
            inputs.push(
                <div className="w-full bg-white rounded-lg shadow-lg p-3 lg:p-6 mb-8" key={i}>
                    <h3 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-4">SEMESTER {i} {i % 2 === 0 ? "EVEN" : "ODD"}</h3>

                    <div className='flex flex-row items-center '>
                        <Label color='blue' className='text-sm pr-4 md:text-lg'>
                            NUMBER OF SUBJECTS
                        </Label>
                        <div className='flex flex-row items-center gap-4'>
                            <button type='button' className='px-4 py-2 bg-blue-200 text-black font-bold hover:bg-blue-400 rounded-lg' onClick={() => decrementNumSubjects(i)}>-</button>
                            <div className='items-center'>
                                <FloatingLabel
                                    className='text-center items-center w-16'

                                    variant="standard"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={(formData[i - 1] && formData[i - 1].length) || ""}
                                    onChange={(e) => handleNumSubjectsChange(e, i)}
                                    required
                                    disabled
                                />
                            </div>
                            <button type='button' className='px-4 py-2 bg-blue-200 text-black font-bold hover:bg-blue-400 rounded-lg' onClick={() => incrementNumSubjects(i)}>+</button>
                        </div>

                    </div>
                    {renderSubjectInputs(i)}
                </div>
            );
        }
        return inputs;
    };



    const renderSubjectInputs = (semesterIndex) => {
        const subjects = formData[semesterIndex - 1] || [];
        const semesterData = semesters.find(semester => semester.department_acronym === selectedDepartmentAcronym);
        const electiveData = electives.find(elective => elective.department_acronym === selectedDepartmentAcronym);

        const selectedCourses = new Set();

        subjects.forEach(subject => {
            const selectedCourse = `${subject.title} (${subject.code})`;
            selectedCourses.add(selectedCourse);
        });

        const handleCourseSelect = (event, subjectIndex) => {
            const selectedCourse = event.target.value;
            const regularCourse = semesterData?.semesters[semesterIndex - 1]?.courses.find(course =>
                `${course.course_name} (${course.course_code})` === selectedCourse
            );

            if (regularCourse) {
                handleSubjectChange({ target: { value: regularCourse.course_name } }, semesterIndex, subjectIndex, 'title');
                handleSubjectChange({ target: { value: regularCourse.course_code } }, semesterIndex, subjectIndex, 'code');
                handleSubjectChange({ target: { value: regularCourse.course_credits } }, semesterIndex, subjectIndex, 'credits');
            } else {
                const electiveCourse = electiveData?.verticals
                    .flatMap(vertical => vertical.courses)
                    .find(course => `${course.elective_name} (${course.elective_code})` === selectedCourse);

                if (electiveCourse) {
                    handleSubjectChange({ target: { value: electiveCourse.elective_name } }, semesterIndex, subjectIndex, 'title');
                    handleSubjectChange({ target: { value: electiveCourse.elective_code } }, semesterIndex, subjectIndex, 'code');
                    handleSubjectChange({ target: { value: electiveCourse.elective_credit } }, semesterIndex, subjectIndex, 'credits');
                }
            }
        };

        return (
            <div>
                {subjects.map((subject, subjectIndex) => (
                    <div className='flex flex-col flex-wrap w-full' key={subjectIndex}>
                        <div className='w-full py-4'>
                            <h4 className='text-2xl text-teal-800 tracking-wider font-semibold'>SUBJECT {subjectIndex + 1}</h4>
                        </div>
                        <div className='w-full py-3'>
                            <Select
                                name="courseName"
                                required
                                onChange={(e) => handleCourseSelect(e, subjectIndex)}
                            >
                                <option value="">Select Course</option>
                                <optgroup label="REGULAR COURSES">
                                    {(semesterData?.semesters[semesterIndex - 1]?.courses || []).map(course => {
                                        const courseValue = `${course.course_name} (${course.course_code})`;
                                        const isCourseSelected = selectedCourses.has(courseValue);
                                        return (
                                            <option
                                                key={course._id}
                                                value={courseValue}
                                                disabled={isCourseSelected}
                                            >
                                                {isCourseSelected ? course.course_name : `${course.course_code} - ${course.course_name}`}
                                            </option>
                                        );
                                    })}
                                </optgroup>

                                {semesterIndex > 4 && electiveData?.verticals.map(vertical => (
                                    <optgroup key={vertical.vertical_name} label={`VERTICAL ${vertical.vertical_number} - ${vertical.vertical_name}`}>
                                        {vertical.courses.map(course => {
                                            const courseValue = `${course.elective_name} (${course.elective_code})`;
                                            const isCourseSelected = selectedCourses.has(courseValue);
                                            return (
                                                <option
                                                    key={course._id}
                                                    value={courseValue}
                                                    disabled={isCourseSelected}
                                                >
                                                    {isCourseSelected ? course.elective_name : `${course.elective_code} - ${course.elective_name}`}
                                                </option>
                                            );
                                        })}
                                    </optgroup>
                                ))}

                            </Select>
                        </div>

                        <div className='flex flex-row items-center gap-2'>
                            <div className='w-1/3'>
                                <FloatingLabel
                                    variant='filled'
                                    label='Course Code'
                                    type="text"
                                    value={subject.code}
                                    onChange={(e) => handleSubjectChange(e, semesterIndex, subjectIndex, 'code')}
                                    key={`code_${semesterIndex}_${subjectIndex}`}
                                    required
                                    disabled
                                />
                            </div>
                            <div className='w-1/3'>
                                <FloatingLabel
                                    variant='filled'
                                    label='Credits'
                                    type="number"
                                    min='1'
                                    max='4'
                                    value={subject.credits === 0 ? '' : subject.credits}
                                    onChange={(e) => handleSubjectChange(e, semesterIndex, subjectIndex, 'credits')}
                                    key={`credits_${semesterIndex}_${subjectIndex}`}
                                    required
                                    disabled
                                />
                            </div>
                            <div className='w-1/3'>
                                <Select
                                    value={subject.grade}
                                    onChange={(e) => handleSubjectChange(e, semesterIndex, subjectIndex, 'grade')}
                                    key={`grade_${semesterIndex}_${subjectIndex}`}
                                    required
                                    className=''
                                >
                                    <option value="">Grade</option>
                                    {Object.keys(gradeScale).map((grade) => (
                                        <option key={grade} value={grade}>
                                            {grade}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>


                    </div>

                ))}
            </div>
        );
    };


    const incrementNumSemesters = () => {
        const updatedNumSemesters = numSemesters + 1;
        handleNumSemestersChange({ target: { value: updatedNumSemesters } });
    };

    const decrementNumSemesters = () => {
        if (numSemesters > 0) {
            const updatedNumSemesters = numSemesters - 1;
            handleNumSemestersChange({ target: { value: updatedNumSemesters } });
        }
    };



    return (
        <div className='mb-20'>
            <div className="p-3 md:p-6 max-w-3xl mx-auto md:my-7 bg-white md:rounded-lg shadow-md">
                <h1 className="text-xl md:text-3xl font-semibold text-center text-gray-800 mb-6  ">Enter Your Details</h1>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <FloatingLabel

                        variant="filled"
                        type="text"
                        label="Student Name ( Eg : ADAM K ) "
                        value={studentInfo.name}
                        onChange={handleStudentInfoChange}
                        name="name"
                        required
                    />
                    <FloatingLabel
                        variant="filled"
                        type="text"
                        label="Roll Number ( Eg : 22CSEB01)"
                        value={studentInfo.rollNumber}
                        onChange={handleStudentInfoChange}
                        name="rollNumber"
                        required
                    />
                    <FloatingLabel
                        variant="filled"
                        type="number"
                        label="Register Number ( Eg : 91322104100 ) "
                        value={studentInfo.registerNumber}
                        onChange={handleStudentInfoChange}
                        name="registerNumber"
                        required
                    />
                    <Select
                        value={studentInfo.department}
                        onChange={handleStudentInfoChange}
                        name="department"
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map((department) => (
                            <option key={department._id} value={`${department.department_acronym} - ${department.department_name}`}>
                                {`${department.department_name} (${department.department_acronym})`}
                            </option>
                        ))}
                    </Select>

                    <div className='flex flex-col lg:flex-row items-center gap-3 py-2'>
                        <Alert color='blue' className='w-full lg:w-1/3 text-center items-center '>
                            Select number of semesters
                        </Alert>
                        <div className='flex flex-row items-center gap-4'>
                            <button type='button' className=' px-4 py-2 bg-blue-200 items-center text-black font-bold hover:bg-blue-400 rounded-lg' onClick={decrementNumSemesters}>-</button>
                            <div className='w-20 sm:w-40 items-center '>
                                <FloatingLabel
                                    className='text-center  items-center'
                                    variant='standard'
                                    label=''
                                    max='8'
                                    min='0'
                                    type='number'
                                    value={numSemesters === 0 ? '0' : numSemesters}
                                    onChange={handleNumSemestersChange}
                                    required
                                />
                            </div>
                            <button type='button' className='px-4 py-2 bg-blue-200 text-black hover:bg-blue-400 rounded-lg' onClick={incrementNumSemesters}>+</button>
                        </div>
                    </div>


                    {renderSemesterInputs()}
                    <button type="submit" className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                        Submit
                    </button>
                    <TextInput
                        className='my-4'
                        type="text"
                        readOnly
                        value={cgpa !== null ? `CGPA: ${cgpa.toFixed(2)}` : 'Your CGPA Appears here'}
                    />
                </form>
            </div>
            {showTranscript && <Transcript
                studentInfo={studentInfo} numSemesters={numSemesters} semesterData={formData} cgpa={cgpa} />
            }
        </div>
    );
}

export default Calculator;
