import React from 'react';
import { Navbar, Dropdown, DropdownItem } from 'flowbite-react';

const Header = () => {
    const gradeScale = { 'O': '10 Points', 'A+': '9 Points', 'A': '8 Points', 'B+': '7 Points', 'B': '6 Points', 'C': '5 Points', 'U': 'Absent / Arrear' };

    return (
        <Navbar className=" bg-slate-200 ring-2 ring-slate-300 ">
            <img className='w-16 h-16 rounded-full' src='vcet.jpeg' />
            <h1 className='text-2xl font-bold font-mono'>CGPA CALCULATOR</h1>
            <Dropdown inline label="Grades">
                {Object.keys(gradeScale).map((grade) => (
                    <DropdownItem key={grade}>
                        <div className='flex justify-center items-center'>
                            <p className='mr-2'>{grade}</p>
                            <p className=''>:</p>
                            <p className='ml-2'>{gradeScale[grade]}</p>
                        </div>
                    </DropdownItem>
                ))}
            </Dropdown>
        </Navbar >
    );
};

export default Header;
