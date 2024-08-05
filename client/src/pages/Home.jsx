import { useState, useEffect } from 'react';
import { Select, FloatingLabel, Alert } from 'flowbite-react';
import { useFetchDepartments, fetchStudentData } from './useFetchData';
import { useNavigate } from 'react-router-dom';
import CookieConsent from "react-cookie-consent";

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
    // const departments = useFetchDepartments();
    const [departments, setDepartments] = useState([]);
    console.log(departments);
    
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
        const storedStudentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        const storedRollNumber = storedStudentInfo ? storedStudentInfo.rollNumber : null;
        if (storedRollNumber && storedRollNumber !== studentInfo.rollNumber) {
            localStorage.removeItem('courseGrades');
            localStorage.removeItem('numSemesters');
        }

        localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
        navigate('/studentData', { state: { studentInfo } });
    };

    return (
        <div className='mx-4 my-16 md:m-20 items-center justify-center min-h-screen'>
<div className="p-6 max-w-3xl mx-auto bg-[#244784] rounded-lg shadow-lg">
  <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-100 mb-6">Enter Your Details</h1>
  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    
    <Select
      className="bg-[#1f2937] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
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

    <div className="flex flex-col sm:flex-row gap-4">
      <Select
        name="batch"
        value={studentInfo.batch}
        onChange={handleStudentInfoChange}
        required
        className="w-full bg-[#1f2937] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
      >
        <option value="">Select Batch</option>
        {years.map((year) => (
          <option key={year} value={`${year}-${year + 4}`}>
            {year}-{year + 4}
          </option>
        ))}
      </Select>

      <Select
        name="year"
        value={studentInfo.year}
        onChange={handleStudentInfoChange}
        required
        className="w-full bg-[#1f2937] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
      >
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
        className="w-full bg-[#1f2937] text-gray-100 border border-gray-700 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
      >
        <option value="">Select Section</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </Select>
    </div>

    {showAlert && (
      <Alert className="text-center bg-red-600 text-white p-3 rounded-lg">
        Data not yet uploaded !
      </Alert>
    )}

    <Select
      className="bg-[#1f2937] text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
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
<div>

    <FloatingLabel
      variant="filled"
      className="bg-[#1f2937] text-gray-100 border border-gray-700 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
      type="text"
      label="Student Name"
      value={studentInfo.name}
      onChange={handleStudentInfoChange}
      name="name"
      required
      disabled
    />

    <FloatingLabel
      variant="filled"
      type="number"
      className="bg-[#1f2937] text-gray-100 border border-gray-700 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
      label="Register Number"
      value={studentInfo.registerNumber}
      onChange={handleStudentInfoChange}
      name="registerNumber"
      required
      disabled
      />

</div>
    <button
      type="submit"
      className="bg-gradient-to-br from-blue-500 to-blue-800 text-gray-100 text-lg py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
      >
      Next
    </button>
  </form>
</div>


            
            <CookieConsent
                style={{
                    background: '#f2f2f2',
                    color: '#333',
                    fontSize: '16px',
                    textAlign: 'left',
                    borderRadius: '10px',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                }}
                buttonStyle={{
                    background: '#0066ff',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '8px 20px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                This website uses cookies to enhance the user experience.
            </CookieConsent>
        </div>
    );
};

export default Home;
