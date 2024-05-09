import React from 'react'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

const IssueForm = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const serviceId = 'service_ys9e0xn';
        const templateId = 'template_fibp2oc';
        const publicKey = 'azfTQSTn5roYmIK5H';

        const tempateParams = {
            from_name: name,
            from_email: email,
            to_name: 'Navin Kumaran',
            message: message,
        };

        emailjs.send(serviceId, templateId, tempateParams, publicKey)
            .then((response) => {
                console.log("Email sent Successfully !", response);
                setName('');
                setEmail('');
                setMessage('');
            })
            .catch((error) => {
                console.error("Error sending email", error);
            });
    };



    return (
        <footer className="bg-gray-900 pt-5 px-3">
            <form onSubmit={handleSubmit} className='emailForm'>
                <div className="max-w-xl mx-auto bg-gray-500 shadow-md rounded-xl px-4 py-3">
                    <h2 className="text-lg font-bold mb-2 text-white text-center p-2">SUBMIT AN ISSUE</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        <input
                            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required
                        />
                        <input
                            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <textarea
                        className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue"
                        required
                    ></textarea>
                    <button
                        className="inline-block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        SUBMIT ISSUE
                    </button>
                </div>
            </form>
        </footer >
    )
}

export default IssueForm
