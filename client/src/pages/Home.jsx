import { useState, useEffect } from 'react';
import { Select, FloatingLabel, Alert } from 'flowbite-react';
import { useFetchDepartments, fetchStudentData } from './useFetchData';
import { useNavigate } from 'react-router-dom';

const yearMapping = {
    1: 'Ist Year',
    2: 'IInd Year',
    3: 'IIIrd Year',
    4: 'IVth Year'
};

const Home = () => {
    const startYear = 2021;
    const endYear = 2025;
    const [years, setYears] = useState([]);
    const [studentInfo, setStudentInfo] = useState({
        name: '',
        rollNumber: '',
        registerNumber: '',
        department: '',
        departmentAcronym: '',
        batch: '',
        year: '',
        section: ''
    });
    const [students, setStudents] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const departments = useFetchDepartments();
    const navigate = useNavigate();

    useEffect(() => {
        const yearOptions = [];
        for (let year = startYear; year <= endYear; year++) {
            yearOptions.push(year);
        }
        setYears(yearOptions);
    }, [startYear, endYear]);

    useEffect(() => {
        const savedStudentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        if (savedStudentInfo) {
            setStudentInfo(savedStudentInfo);
        }
    }, []);

    useEffect(() => {
        fetchStudentData(studentInfo.departmentAcronym, studentInfo.batch, studentInfo.section, setStudents, setShowAlert);
    }, [studentInfo.departmentAcronym, studentInfo.batch, studentInfo.section]);

    const handleStudentInfoChange = (event) => {
        const { name, value } = event.target;
        if (name === 'department' && value === '') {
            setStudentInfo({
                name: '',
                rollNumber: '',
                registerNumber: '',
                department: '',
                departmentAcronym: '',
                batch: '',
                year: '',
                section: ''
            });
            setStudents([]);
            setShowAlert(false);
        } else if (name === 'rollNumber') {
            const selectedStudent = students.find(student => student.roll_no === value);
            if (selectedStudent) {
                setStudentInfo(prevStudentInfo => ({
                    ...prevStudentInfo,
                    name: selectedStudent.student_name,
                    rollNumber: selectedStudent.roll_no,
                    registerNumber: selectedStudent.register_no
                }));
            }
        } else {
            const capitalizedValue = name !== 'department' ? value.toUpperCase() : value;
            setStudentInfo((prevStudentInfo) => {
                const updatedInfo = {
                    ...prevStudentInfo,
                    [name]: capitalizedValue
                };
                if (name === 'department') {
                    const acronym = value.split(' - ')[0];
                    updatedInfo.departmentAcronym = acronym;
                }
                if (name === 'batch' || name === 'section' || name === 'department') {
                    updatedInfo.rollNumber = '';
                    updatedInfo.name = '';
                    updatedInfo.registerNumber = '';
                    setStudents([]);
                    setShowAlert(false);
                }
                return updatedInfo;
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
        navigate('/studentData', { state: { studentInfo } });
    };

    return (
        <div className='mx-4 my-16 md:m-20 items-center justify-center min-h-screen'>
            <div className="p-3 md:p-6 max-w-3xl  mx-auto md:my-7 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl md:text-3xl font-semibold text-center text-black m-4">Enter Your Details</h1>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <Select
                        className='tracking-wider'
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
                    <div className='flex flex-col sm:flex-row gap-2'>
                        <Select
                            name="batch"
                            value={studentInfo.batch}
                            onChange={handleStudentInfoChange}
                            required
                            className='w-full tracking-wider'
                        >
                            <option value="">Select Batch</option>
                            {years.map(year => (
                                <option key={year} value={`${year}-${year + 4}`}>
                                    {year}-{year + 4}
                                </option>
                            ))}
                        </Select>

                        <Select name="year" className='w-full tracking-wider' value={studentInfo.year} onChange={handleStudentInfoChange} required>
                            <option value="">Select Year</option>
                            {Object.entries(yearMapping).map(([yearNumber, yearText]) => (
                                <option key={yearNumber} value={yearNumber}>
                                    {yearText}
                                </option>
                            ))}
                        </Select>

                        <Select
                            name="section"
                            value={studentInfo.section}
                            onChange={handleStudentInfoChange}
                            required
                            className='w-full tracking-wider'
                        >
                            <option value="">Select Section</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </Select>
                    </div>
                    {showAlert && <Alert color='blue' className='text-center capitalize items-center'>Data not yet uploaded</Alert>}
                    <Select
                        className='tracking-wider'
                        value={studentInfo.rollNumber}
                        onChange={handleStudentInfoChange}
                        name="rollNumber"
                        disabled={!students.length}
                        required
                    >
                        <option value="">Select Roll Number</option>
                        {students.map((student) => (
                            <option key={student._id} value={student.roll_no}>
                                {student.roll_no}
                            </option>
                        ))}
                    </Select>
                    <FloatingLabel
                        variant="filled"
                        className='tracking-wider'
                        type="text"
                        label="Student Name (Eg: ADAM K)"
                        value={studentInfo.name}
                        onChange={handleStudentInfoChange}
                        name="name"
                        required
                        disabled
                    />

                    <FloatingLabel
                        variant="filled"
                        type="number"
                        className='tracking-wider'
                        label="Register Number (Eg: 91322104100)"
                        value={studentInfo.registerNumber}
                        onChange={handleStudentInfoChange}
                        name="registerNumber"
                        required
                        disabled
                    />
                    <button type="submit" className="bg-blue-300 text-black text-lg tracking-widest py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
