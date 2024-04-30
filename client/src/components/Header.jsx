import { Button, Navbar } from "flowbite-react";


const Header = () => {
    return (
        <>
            <Navbar fluid rounded className="bg-violet-200 p-5">
                <Navbar.Brand href="#" className="">
                    CALCULATE CGPA
                </Navbar.Brand>
            </Navbar>
        </>
    )
};

export default Header;