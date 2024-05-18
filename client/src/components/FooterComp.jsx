const FooterComp = () => {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto text-center">
                <p className="text-[14px] m-2">Velemmal College of Engineering and Technology, Madurai</p>
                <p className="text-[14px] m-2">Department of Computer Science and Engineering</p>
                <hr></hr>
                <p className="text-[12px] m-4">&copy; {new Date().getFullYear()} Navinkumaran O H, 2022-2026 batch, and Mr. S. Murali, AP/CSE. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

export default FooterComp
