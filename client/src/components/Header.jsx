import { useState } from 'react';
import { Navbar, Modal, Button, TextInput, Label } from 'flowbite-react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

const Header = () => {
    const [openModal, setOpenModal] = useState(false);

    function onCloseModal() {
        setOpenModal(false);
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isnotSubmitted, setIsNotSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log(name, email, message);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const serviceId = 'service_ys9e0xn';
        const templateId = 'template_fibp2oc';
        const publicKey = 'azfTQSTn5roYmIK5H';
        const templateParams = {
            from_name: name,
            from_email: email,
            to_name: 'Navin Kumaran',
            message: message,
        };
        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                setName('');
                setEmail('');
                setMessage('');
                setIsSubmitted(true);
                setIsNotSubmitted(false);
            })
            .catch((error) => {
                setIsSubmitting(false);
                setIsNotSubmitted(true);
                setIsSubmitted(false);
            });
    };



    return (
        <Navbar className="bg-[#1f3a6e] px-4 md:px-7 py-4 ring-4 ring-slate-800/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <img className="w-12 h-12 md:w-14 md:h-14 rounded-full" src="vcet.jpeg" alt="Logo" />
                <h1 className="md:text-xl lg:text-2xl font-semibold text-white">CGPA Calculator</h1>
            </div>
            <div className='flex items-center justify-center gap-3'>
                
            <Link to='https://leavemanagementsystemvcetmadurai.onrender.com/' target="_blank" rel="noopener noreferrer">
            <Button size="md" color="gray">Leave Application</Button>
            </Link>
            <Link to='https://cgpa-calculator-general.onrender.com/' target="_blank" rel="noopener noreferrer">
            <Button size="md" color="gray">General Calculator</Button>
            </Link>
            <Button size="md" color="gray" onClick={() => setOpenModal(true)}>Submit Report</Button>
            </div>

            <Modal className="transition-opacity duration-500" dismissible position="center" show={openModal} size="lg" onClose={() => setOpenModal(false)} popup>
                <Modal.Header className="m-3">Submit Report</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Label htmlFor="name" value="Your Name" className="block mb-2 text-sm" />
                        <TextInput id="name" placeholder="Adam K" value={name} onChange={(event) => setName(event.target.value)} className="tracking-widest text-sm" required />

                        <Label htmlFor="email" value="Your Email" className="block mb-2 text-sm" />
                        <TextInput id="email" placeholder="example@mail.com" value={email} onChange={(event) => setEmail(event.target.value)} className="tracking-widest text-sm" required />

                        <Label htmlFor="message" value="Describe Your Issue" className="block mb-2 text-sm" />
                        <textarea id="message" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="..." className="block w-full my-2 tracking-widest border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-sm md:text-md" required></textarea>

                        <Button type="submit" className="w-full bg-blue-300 text-black font-medium hover:bg-blue-600 hover:text-white hover:tracking-widest transition-all duration-300 tracking-wider py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            {isSubmitting ? "Submitting..." : "SUBMIT ISSUE"}
                        </Button>

                        {isSubmitted && <p className="bg-white rounded-md text-center p-2 mt-2 font-bold text-green-500 text-sm mb-2">Your issue has been submitted!</p>}
                        {isnotSubmitted && <p className="bg-white rounded-md text-center p-2 mt-2 font-bold text-red-500 text-sm mb-2">Failed to submit issue. Try again later!</p>}
                    </form>
                </Modal.Body>
            </Modal>
        </Navbar >
    );
};

export default Header;
