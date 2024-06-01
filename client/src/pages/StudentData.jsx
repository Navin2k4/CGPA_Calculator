import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Alert } from 'flowbite-react';
import { useFetchSemesters, useFetchVerticals } from './useFetchData';
import { Select, FloatingLabel } from 'flowbite-react';
import Transcript from '../components/Transcript';
import HowToUse from '../components/HowToUse';
const gradeScale = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'U': 0 };
const yearMapping = { 1: 'Ist Year', 2: 'IInd Year', 3: 'IIIrd Year', 4: 'IVth Year' };

const StudentData = () => {
    const location = useLocation();
    const { studentInfo } = location.state || {};
    const initialNumSemesters = parseInt(localStorage.getItem('numSemesters')) || 0;
    const initialNumElectivesPerSemester = JSON.parse(localStorage.getItem('numElectivesPerSemester')) || Array.from({ length: 8 }, () => 0);
    const initialCourseGrades = JSON.parse(localStorage.getItem('courseGrades')) || [];
    const [numSemesters, setNumSemesters] = useState(initialNumSemesters);
    const [departmentAcronym, setDepartmentAcronym] = useState('');
    const semesters = useFetchSemesters(departmentAcronym);
    const electives = useFetchVerticals(departmentAcronym);
    const [numElectivesPerSemester, setNumElectivesPerSemester] = useState(initialNumElectivesPerSemester);
    const [selectedCourses, setSelectedCourses] = useState(Array.from({ length: 8 }, () => []));
    const [selectedElectives, setSelectedElectives] = useState(new Set());
    const [courseGrades, setCourseGrades] = useState(initialCourseGrades);
    const [gpa, setGpa] = useState([]);
    const [cgpa, setCgpa] = useState(null);
    const [showTranscript, setShowTranscript] = useState(false);
    const semesterData = semesters.find(semester => semester.department_acronym === departmentAcronym);
    const electiveData = electives.find(elective => elective.department_acronym === departmentAcronym);

    useEffect(() => {
        const storedStudentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        const storedRollNumber = storedStudentInfo ? storedStudentInfo.rollNumber : null;
        const studentRollNumber = studentInfo?.rollNumber;
        if (storedRollNumber !== studentRollNumber) {
            localStorage.removeItem('courseGrades');
            localStorage.removeItem('numSemesters');
            localStorage.removeItem('numElectivesPerSemester');
        }
        localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
    }, [studentInfo]);


    useEffect(() => {
        if (studentInfo && studentInfo.department) {
            const acronym = studentInfo.department.split(' - ')[0];
            setDepartmentAcronym(acronym);
        }
    }, [studentInfo]);

    useEffect(() => {
        const updatedCourseGrades = courseGrades.slice(0, numSemesters);
        setCourseGrades(updatedCourseGrades);
        localStorage.setItem('courseGrades', JSON.stringify(updatedCourseGrades));
    }, [numSemesters]);

    useEffect(() => {
        localStorage.setItem('numSemesters', numSemesters.toString());
        localStorage.setItem('numElectivesPerSemester', JSON.stringify(numElectivesPerSemester));
        localStorage.setItem('courseGrades', JSON.stringify(courseGrades));
    }, [numSemesters, selectedCourses, courseGrades, numElectivesPerSemester]);

    const handleNumSemestersChange = (event) => {
        setShowTranscript(false);
        const value = Number(event.target.value);
        if (value >= 0 && value <= 8) {
            const updatedSelectedCourses = selectedCourses.slice(0, value);
            const updatedCourseGrades = courseGrades.slice(0, value);
            if (value < numSemesters) {
                updatedSelectedCourses.splice(value);
                updatedCourseGrades.splice(value);
            }
            setNumSemesters(value);
            setSelectedCourses(updatedSelectedCourses);
            setCourseGrades(updatedCourseGrades);
        }
    };


    const handleCourseSelect = (event, semesterIndex, electiveIndex) => {
        const selectedCourseValue = event.target.value;
        const updatedSelectedCourses = [...selectedCourses];
        const updatedSelectedElectives = new Set(selectedElectives);
        const previousCourse = updatedSelectedCourses[semesterIndex][electiveIndex];
        if (previousCourse) {
            updatedSelectedElectives.delete(previousCourse.elective_code);
        }
        if (selectedCourseValue === "") {
            updatedSelectedCourses[semesterIndex][electiveIndex] = {
                elective_name: "",
                elective_code: "",
                elective_credit: "",
                grade: "",
            };
        } else {
            const electiveCourse = electiveData?.verticals
                .flatMap(vertical => vertical.courses)
                .find(course => `${course.elective_name} (${course.elective_code})` === selectedCourseValue);
            if (electiveCourse) {
                updatedSelectedElectives.add(electiveCourse.elective_code);
                updatedSelectedCourses[semesterIndex][electiveIndex] = {
                    elective_name: electiveCourse.elective_name,
                    elective_code: electiveCourse.elective_code,
                    elective_credit: electiveCourse.elective_credit,
                    grade: "",
                };
            }
        }
        setSelectedCourses(updatedSelectedCourses);
        setSelectedElectives(updatedSelectedElectives);
    };

    const handleGradeSelect = (event, semesterIndex, courseIndex) => {

        const selectedGrade = event.target.value;
        const updatedCourseGrades = [...courseGrades];
        const course = semesterData.semesters[semesterIndex].courses[courseIndex];
        const gradeData = {
            course_name: course.course_name,
            course_code: course.course_code,
            course_credit: course.course_credits,
            grade: selectedGrade
        };
        if (!updatedCourseGrades[semesterIndex]) {
            updatedCourseGrades[semesterIndex] = [];
        }
        updatedCourseGrades[semesterIndex][courseIndex] = gradeData;
        setCourseGrades(updatedCourseGrades);
    };

    const handleElectiveGradeSelect = (event, semesterIndex, electiveIndex) => {
        const selectedGrade = event.target.value;
        const updatedSelectedCourses = [...selectedCourses];
        updatedSelectedCourses[semesterIndex][electiveIndex].grade = selectedGrade;
        setSelectedCourses(updatedSelectedCourses);
    };

    const handleChangeNumElectives = (event, index) => {
        
        const newValue = parseInt(event.target.value);
        const updatedNumElectivesPerSemester = [...numElectivesPerSemester];
        const updatedSelectedCourses = [...selectedCourses];
        const updatedSelectedElectives = new Set(selectedElectives);
        if (newValue < numElectivesPerSemester[index]) {
            for (let i = newValue; i < numElectivesPerSemester[index]; i++) {
                const courseToRemove = updatedSelectedCourses[index][i];
                if (courseToRemove) {
                    updatedSelectedElectives.delete(courseToRemove.elective_code);
                }
            }
            updatedSelectedCourses[index] = updatedSelectedCourses[index].slice(0, newValue);
        }
        updatedNumElectivesPerSemester[index] = newValue;
        setNumElectivesPerSemester(updatedNumElectivesPerSemester);
        setSelectedCourses(updatedSelectedCourses);
        setSelectedElectives(updatedSelectedElectives);
    };

    const incrementNumElectives = (index) => {
        
        const updatedNumElectives = [...numElectivesPerSemester];
        updatedNumElectives[index] += 1;
        setNumElectivesPerSemester(updatedNumElectives);
    };

    const decrementNumElectives = (index) => {
     
        if (numElectivesPerSemester[index] > 0) {
            const updatedNumElectives = [...numElectivesPerSemester];
            const updatedSelectedCourses = [...selectedCourses];
            const updatedSelectedElectives = new Set(selectedElectives);
            const lastSelectedIndex = updatedSelectedCourses[index].length - 1;
            if (lastSelectedIndex >= 0) {
                const lastElective = updatedSelectedCourses[index][lastSelectedIndex];
                updatedSelectedElectives.delete(lastElective.elective_code);
                updatedSelectedCourses[index].splice(lastSelectedIndex, 1);
            }
            updatedNumElectives[index] -= 1;
            setNumElectivesPerSemester(updatedNumElectives);
            setSelectedCourses(updatedSelectedCourses);
            setSelectedElectives(updatedSelectedElectives);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let totalCredits = 0;
        let totalMarks = 0;
        const newGpa = [];
        for (let semesterIndex = 0; semesterIndex < Math.min(selectedCourses.length, courseGrades.length); semesterIndex++) {
            let semesterTotalCredits = 0;
            let semesterTotalMarks = 0;

            selectedCourses[semesterIndex].forEach((course) => {
                const grade = course.grade;
                const credits = parseFloat(course.elective_credit);
                semesterTotalMarks += gradeScale[grade] * credits;
                semesterTotalCredits += credits;
            });

            courseGrades[semesterIndex].forEach((gradeData) => {
                const grade = gradeData.grade;
                const credits = parseFloat(gradeData.course_credit);
                semesterTotalMarks += gradeScale[grade] * credits;
                semesterTotalCredits += credits;
            });
            if (semesterTotalCredits > 0) {
                const semesterGpa = semesterTotalMarks / semesterTotalCredits;
                newGpa.push(semesterGpa);
            } else {
                newGpa.push(0);
            }

            totalMarks += semesterTotalMarks;
            totalCredits += semesterTotalCredits;
        }

        const currentCgpa = totalCredits > 0 ? totalMarks / totalCredits : 0;
        setGpa(newGpa);
        setCgpa(currentCgpa);
        setShowTranscript(true);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 md:p-10">
            <div className="bg-white px-3 py-6 rounded-lg shadow-lg w-full max-w-5xl">
                <HowToUse />

                <h1 className="text-xl md:text-3xl tracking-wider text-center text-gray-800">Welcome, {studentInfo.name}!</h1>
                {studentInfo ? (
                    <div className="mx-auto max-w-2xl bg-white shadow-md rounded-lg p-6">
                        <h1 className="text-xl mb-4 text-center font-semibold">Student Information</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <span className="text-gray-600 text-sm sm:text-lg font-semibold mr-2">Name:</span>
                                    <span className="text-sm md:text-lg">{studentInfo.name}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600 text-sm sm:text-lg font-semibold mr-2">Roll Number:</span>
                                    <span className="text-sm md:text-lg">{studentInfo.rollNumber}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600 text-sm sm:text-lg font-semibold mr-2">Register Number:</span>
                                    <span className="text-sm md:text-lg">{studentInfo.registerNumber}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-600 text-sm sm:text-lg font-semibold mr-2">Department:</span>
                                    <span className="text-sm md:text-lg">{studentInfo.department}</span>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <span className="text-gray-600 text-sm sm:text-lg font-semibold mr-2">Year / Section:</span>
                                    <span className="text-sm md:text-lg">{yearMapping[studentInfo.year]} / {studentInfo.section}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600 text-sm sm:text-lg font-semibold mr-2">Batch:</span>
                                    <span className="text-sm md:text-lg">{studentInfo.batch}</span>
                                </div>
                            </div>
                        </div>
                    </div>



                ) : (
                    <p className="text-red-500">No student data available</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 py-4 mt-2">
                        <Alert color="blue" className="w-full lg:w-1/3 text-black text-md text-center items-center">
                            Select number of semesters
                        </Alert>
                        <div className="flex flex-row items-center gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-200 text-black font-bold hover:bg-blue-400 rounded-lg transition-all duration-300"
                                onClick={() => setNumSemesters(prev => Math.max(prev - 1, 0))}
                            > - </button>
                            <div className="w-28 items-center ">
                                <FloatingLabel
                                    className="text-center items-center font-semibold"
                                    variant='standard'
                                    type="number"
                                    value={numSemesters}
                                    onChange={handleNumSemestersChange}
                                    required
                                    style={{ textAlign: 'center' }}
                                    disabled
                                />
                            </div>
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-200 text-black hover:bg-blue-400 rounded-lg transition-all duration-300"
                                onClick={() => setNumSemesters(prev => Math.min(prev + 1, 8))}
                            >+</button>
                        </div>
                    </div>
                    {Array.from({ length: numSemesters }, (_, index) => (
                        <div key={`semester_${index}`} className="w-full bg-white rounded-lg shadow-lg p-3 lg:px-10 mb-8 ">
                            <h3 className="text-[22px] md:text-2xl font-semibold text-center text-gray-800 mb-4 tracking-widest">SEMESTER {index + 1} - {index % 2 === 0 ? " ODD" : " EVEN"}</h3>
                            <div>
                                {semesterData && (
                                    <div>
                                        <div className='flex flex-col flex-wrap w-full space-y-2'>
                                            {semesterData.semesters[index]?.courses.map((course, courseIndex) => (
                                                <div key={`course_${courseIndex}`} className='flex flex-col lg:flex-row gap-2 items-center'>
                                                    <div className='w-full'>
                                                        <FloatingLabel
                                                            className='bg-slate-100 tracking-wide'
                                                            variant='filled'
                                                            label='Course Name'
                                                            type="text"
                                                            value={course.course_name}
                                                            required
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className='flex w-full items-center gap-2'>
                                                        <div className='w-1/2 lg:w-1/3'>
                                                            <FloatingLabel
                                                                variant='filled'
                                                                label='Course Code'
                                                                type="text"
                                                                value={course.course_code}
                                                                required
                                                                disabled />
                                                        </div>
                                                        <div className='w-1/2 lg:w-1/3'>
                                                            <FloatingLabel
                                                                variant='filled'
                                                                label='Credits'
                                                                type="number"
                                                                min='1'
                                                                max='4'
                                                                value={course.course_credits.toString()}
                                                                required
                                                                disabled />
                                                        </div>
                                                        <div className='w-1/2 lg:w-1/3'>
                                                            <Select
                                                                required
                                                                value={courseGrades[index]?.[courseIndex]?.grade || ''}
                                                                onChange={(event) => handleGradeSelect(event, index, courseIndex)}>
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
                                    </div>
                                )}
                                {index >= 4 && electiveData && (
                                    <div className=''>
                                        <div className='px-2 py-3 justify-center flex flex-row items-center gap-2'>
                                            <h3 className='py-2 text-lg md:text-2xl'>Select Number of Electives</h3>
                                            <button
                                                type='button'
                                                className=' px-4 py-2 bg-blue-200 items-center text-black font-bold hover:bg-blue-400 rounded-lg transition-all duration-300'
                                                onClick={() => decrementNumElectives(index)}
                                            >-</button>
                                            <div className='w-20 sm:w-40 items-center '>
                                                <FloatingLabel
                                                    className='text-center items-center font-semibold'
                                                    variant='standard'
                                                    label=''
                                                    min='0'
                                                    type='number'
                                                    value={numElectivesPerSemester[index] === 0 ? '0' : numElectivesPerSemester[index]}
                                                    onChange={(event) => handleChangeNumElectives(event, index)}
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <button
                                                type='button'
                                                className='px-4 py-2 bg-blue-200 text-black hover:bg-blue-400 rounded-lg transition-all duration-300'
                                                onClick={() => incrementNumElectives(index)}
                                            >+</button>
                                        </div>
                                        {[...Array(numElectivesPerSemester[index])].map((_, electiveIndex) => (
                                            <div key={`elective_${electiveIndex}`} className='flex flex-col lg:flex-row gap-2 items-center '>
                                                <div className='w-full '>
                                                    <Select
                                                        required
                                                        defaultValue=""
                                                        onChange={(event) => handleCourseSelect(event, index, electiveIndex)}
                                                        className="bg-slate-100 p-1 rounded-lg">
                                                        <option
                                                            value="" >Select Vertical</option>

                                                        {electiveData.verticals.map(vertical => (
                                                            <optgroup key={vertical._id} label={`VERTICAL ${vertical.vertical_number} - ${vertical.vertical_name}`}>
                                                                {vertical.courses.map(course => {
                                                                    const courseValue = `${course.elective_name} (${course.elective_code})`;
                                                                    const isCourseSelected = selectedElectives.has(course.elective_code);
                                                                    return (
                                                                        <option
                                                                            key={course._id}
                                                                            value={courseValue}
                                                                            disabled={isCourseSelected}
                                                                            className=''
                                                                        >
                                                                            {isCourseSelected ? `${course.elective_name}` : `${course.elective_code} - ${course.elective_name}`}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </optgroup>
                                                        ))}
                                                    </Select>
                                                </div>
                                                <div className='flex w-full items-center gap-2'>
                                                    <div className='w-1/2 lg:w-1/3'>
                                                        <FloatingLabel
                                                            variant='filled'
                                                            label='Course Code'
                                                            type="text"
                                                            value={selectedCourses[index]?.[electiveIndex]?.elective_code || ''}
                                                            required
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className='w-1/2 lg:w-1/3'>
                                                        <FloatingLabel
                                                            variant='filled'
                                                            label='Credits'
                                                            type="number"
                                                            min='1'
                                                            max='4'
                                                            value={selectedCourses[index]?.[electiveIndex]?.elective_credit || ''}
                                                            required
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className='w-1/2 lg:w-1/3'>
                                                        <Select
                                                            required
                                                            onChange={(event) => handleElectiveGradeSelect(event, index, electiveIndex)}
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
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col-reverse sm:flex-row justify-between">
                        <div className="bg-blue-300 text-center p-2 sm:p-4 m-2 sm:m-4 text-base sm:text-lg rounded-lg font-semibold shadow-md text-gray-900 flex items-center justify-center">
                            <span className="mr-2">Your CGPA : </span>
                            <span className="text-lg sm:text-2xl text-blue-900">{cgpa ? parseFloat(cgpa).toFixed(2) : "-"}</span>
                        </div>
                        <button
                            type='submit'
                            className={`text-center p-2 sm:p-4 m-2 sm:m-4 text-base sm:text-lg rounded-lg font-semibold shadow-md transition-all duration-300 ${numSemesters === 0 ? 'bg-slate-100 cursor-not-allowed text-gray-500' : 'bg-blue-300 hover:bg-blue-400  hover:shadow-lg '
                                }`}
                            disabled={numSemesters === 0}
                        >
                            Calculate CGPA
                        </button>


                    </div>

                </form>
                <div>
                    {showTranscript && (
                        <Transcript
                            studentInfo={studentInfo}
                            courseGrades={courseGrades}
                            selectedCourses={selectedCourses}
                            gpa={gpa}
                            cgpa={cgpa}
                            numSemesters={numSemesters}
                        />
                    )}
                </div>
            </div >
        </div >
    );
};
export default StudentData;