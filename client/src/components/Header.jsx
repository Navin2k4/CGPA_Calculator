import React from 'react';
import { Navbar, Dropdown, DropdownItem } from 'flowbite-react';

const Header = () => {
    const gradeScale = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'U': 0 };

    return (
        <Navbar className=" bg-slate-200 ring-2 ring-slate-300 ">
            < img className='w-16 h-16 rounded-full' src='vcet.jpeg' />
            <h1 className='text-2xl font-bold font-mono'>CGPA CALCULATOR</h1>
            <Dropdown inline label="Grades">
                {Object.keys(gradeScale).map((grade) => (
                    <DropdownItem key={grade}>
                        <div>
                            <table>
                                <tr>
                                    <td>{grade}</td>
                                    <td>:</td>
                                    <td>{gradeScale[grade]}</td>
                                </tr>
                            </table>

                        </div>
                    </DropdownItem>
                ))}
            </Dropdown>
        </Navbar >
    );
};

export default Header;
