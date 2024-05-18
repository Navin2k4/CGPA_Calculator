import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const IssueForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isnotSubmitted, setIsNotSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                setIsSubmitting(false);
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
        <footer className="bg-gray-900 pt-5 px-3">
            <form onSubmit={handleSubmit} className='emailForm'>
                <div className="max-w-sm md:max-w-lg mx-auto bg-gray-500 shadow-md rounded-xl px-4 py-3">
                    <h2 className="text-lg font-bold mb-2 text-white text-center p-2">SUBMIT AN ISSUE</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-1">
                        <input
                            className="block w-full border border-gray-300 rounded-md shadow-sm text-sm placeholder-gray-400" 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required
                        />
                        <input
                            className="block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none text-sm"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <textarea
                        className="block w-full my-2  border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-sm"
                        rows="1"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue"
                        required
                    ></textarea>
                    <button
                        className="inline-block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {isSubmitting ? "Submitting..." : "SUBMIT ISSUE"}
                    </button>
                    {isSubmitted && <p className="bg-white rounded-md text-center p-2 mt-2 font-bold text-green-500 text-sm mb-2">Issue submitted successfully!</p>}
                    {isnotSubmitted && <p className="bg-white rounded-md text-center p-2 mt-2 font-bold text-red-500 text-sm mb-2">Failed to submit issue. Try again later!</p>}
                </div>
            </form>
        </footer>
    );
}

export default IssueForm;
