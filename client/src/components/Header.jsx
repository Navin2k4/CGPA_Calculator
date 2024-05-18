import React from 'react';
import { Navbar } from 'flowbite-react';

const Header = () => {
    return (
        <Navbar className=" bg-slate-200 ring-2 ring-slate-300 px-5">
            <img className='w-16 h-16 rounded-full' src='vcet.jpeg' />
            <h1 className='text-2xl font-semibold'>CGPA Calculator</h1>
        </Navbar>
    );
};

export default Header;
