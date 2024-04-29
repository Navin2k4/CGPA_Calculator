import { Button, Navbar } from "flowbite-react";


const Header = () => {
    return (
        <>
            <Navbar fluid rounded className="bg-violet-200 p-5">
                <Navbar.Brand href="#" className="">
                    CALCULATE CGPA
                </Navbar.Brand>
                {/* <div className="flex md:order-2">
                    <Button>Get started</Button>
                    <Navbar.Toggle />
                </div> */}
                {/* <Navbar.Collapse>
                    <Navbar.Link href="#" active>
                        Home
                    </Navbar.Link>
                    <Navbar.Link href="#">About</Navbar.Link>
                    <Navbar.Link href="#">Services</Navbar.Link>
                    <Navbar.Link href="#">Pricing</Navbar.Link>
                    <Navbar.Link href="#">Contact</Navbar.Link>
                </Navbar.Collapse> */}
            </Navbar>
        </>
    )
};

export default Header;