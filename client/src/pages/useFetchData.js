import { useEffect, useState } from 'react';

export const useFetchDepartments = () => {
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
    return departments;
};

export const useFetchSemesters = (selectedDepartmentAcronym) => {
    const [semesters, setSemesters] = useState([]);
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
    return semesters;
};

export const useFetchVerticals = (selectedDepartmentAcronym) => {
    const [electives, setElectives] = useState([]);
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
    return electives;
};


export const fetchStudentData = async (departmentAcronym, batch, section, setStudents, setShowAlert) => {
    if (departmentAcronym && batch && section) {
        try {
            const res = await fetch(`/api/students/getstudents?departmentAcronym=${departmentAcronym}&batch=${batch}&section=${section}`);
            if (!res.ok) {
                setStudents([]);
                setShowAlert(true);
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            if (data.length === 0) {
                setShowAlert(true);
            } else {
                setShowAlert(false);
            }
            setStudents(data);
        } catch (error) {
            setStudents([]);
            setShowAlert(true);
            console.error('Error fetching student data:', error);
        }
    } else {
        setStudents([]);
        setShowAlert(false);
    }
};