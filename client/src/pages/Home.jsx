import { useState, useEffect } from 'react';
import { Select, TextInput, FloatingLabel } from 'flowbite-react';
import { useFetchDepartments } from './useFetchData';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const departments = useFetchDepartments();
    const navigate = useNavigate();
    const [studentInfo, setStudentInfo] = useState({
        name: '',
        rollNumber: '',
        registerNumber: '',
        department: '',
        departmentAcronym: ''
    });

    useEffect(() => {
        const savedStudentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        if (savedStudentInfo) {
            setStudentInfo(savedStudentInfo);
        }
    }, []);

    const handleStudentInfoChange = (event) => {
        const { name, value } = event.target;
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
            return updatedInfo;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
        navigate('/studentData', { state: { studentInfo } });
    };

    return (
        <div className='py-10 mx-7'>
            <div className="p-3 md:p-6 max-w-6xl mx-auto md:my-7 bg-white rounded-sm md:rounded-lg shadow-md">
                <h1 className="text-xl md:text-3xl font-semibold text-center text-gray-800 mb-6">Enter Your Details</h1>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <FloatingLabel
                        variant="filled"
                        type="text"
                        label="Student Name (Eg: ADAM K)"
                        value={studentInfo.name}
                        onChange={handleStudentInfoChange}
                        name="name"
                        required
                    />
                    <FloatingLabel
                        variant="filled"
                        type="text"
                        label="Roll Number (Eg: 22CSEB01)"
                        value={studentInfo.rollNumber}
                        onChange={handleStudentInfoChange}
                        name="rollNumber"
                        required
                    />
                    <FloatingLabel
                        variant="filled"
                        type="number"
                        label="Register Number (Eg: 91322104100)"
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

                    <button type="submit" className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
