import { useState } from "react";
import validator from "validator";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { createContact } from "../api/contact";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/Notification";

export const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    // Notification component
    const [NotificationElement, showNotification] = useNotification();

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!validator.isEmail(value) && value) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    };

    const isFormValid =
        name.trim().length > 0 && email.trim().length > 0 && subject.trim().length > 0 && message.trim().length > 0 && !emailError;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        const contactData = {
            name,
            email,
            subject,
            message,
        };

        try {
            const newContact = await createContact(contactData);
            console.log("Contact form sent:", newContact.subject);

            // Optionally reset the form
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");

            // Optionally redirect or show a success message
            showNotification("Contact form sent successfully!", "success");
            setTimeout(() => navigate("/blogs"), 2000); // or any other route you want
        } catch (error) {
            console.error("Failed to send contact form:", error);
            showNotification("Error sending the contact form", "error");
        }
    };

    return (
        <div className='h-screen bg-butter racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Contact</Header>
            {NotificationElement}
            {/* This window is made like if it was a modal, eventually it will be but i'm not sure yet so I left the close button for example */}
            <div className='flex justify-center m-5'>
                <form
                    onSubmit={handleSubmit}
                    id='formContact-id'
                    className='flex flex-col w-3/4 max-h-130
                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                    shadow-xl shadow-purple-950'>
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col w-1/5'>
                            <div
                                className='flex p-1 pl-3
                                bg-purple-950 text-butter
                                rounded-br-2xl'>
                                Contact form
                            </div>
                            <div
                                className='flex w-2/3 p-1 bg-purple-950 text-butter 
                                rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-sheet-plastic'></i>
                            </div>
                        </div>
                        <div className='flex flex-row mt-2'>
                            <div
                                className='flex w-fit max-h-10 p-2 mr-10 
                                items-center 
                                bg-purple-950 text-butter
                                rounded-2xl'>
                                {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-col w-1/4 m-5'>
                            <div className='relative w-3/4 m-5'>
                                <input
                                    type='text'
                                    data-testid='subjectContact-id'
                                    id='subjectContact-id'
                                    placeholder='Subject of request'
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className='flex justify-center items-center
                                text-xl text-purple-950
                                h-15 p-5
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-105
                                transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-7 left-O text-md text-purple-950'>Subject of request</label>
                            </div>
                            <div className='relative w-3/4 m-5'>
                                <input
                                    type='text'
                                    data-testid='nameContact-id'
                                    id='nameContact-id'
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='flex justify-center items-center
                                text-xl text-purple-950
                                h-15 p-5
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-105
                                transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-7 left-O text-md text-purple-950'>Name</label>
                            </div>
                            <div className='relative w-3/4 m-5'>
                                <input
                                    type='text'
                                    data-testid='emailContact-id'
                                    id='emailContact-id'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => handleEmailChange(e)}
                                    className={`flex justify-center items-center
                                text-xl text-purple-950
                                h-15 p-5
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-105
                                transition-all duration-200 ease-in-out
                            ${emailError ? "border-red-500 focus:border-red-500" : "border-purple-950 focus:border-purple-400"}`}
                                />
                                {emailError && <p className='text-red-500 text-sm ml-5'>{emailError}</p>}
                                <label className='absolute -top-7 left-O text-md text-purple-950'>Email</label>
                            </div>
                        </div>
                        <div className='relative w-3/4 m-5'>
                            <textarea
                                type='text'
                                data-testid='messageContact-id'
                                id='messageContact-id'
                                placeholder='Message'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className='flex justify-start items-start text-xl
                            overflow-auto h-79 p-5
                            w-full text-purple-950
                            border-4 border-purple-950
                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                            focus:border-purple-400 focus:scale-102
                            transition-all duration-200 ease-in-out'
                            />
                            <label className='absolute -top-7 left-O text-md text-purple-950'>Message</label>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type='submit'
                            title='Fill the form to send your request to the admin'
                            data-testid='submitContactBtn-id'
                            id='submitContactBtn-id'
                            disabled={!isFormValid}
                            className={`flex justify-center items-center 
                        w-1/4 h-10 mb-3 mr-10 ml-30 text-2xl 
                        text-butter 
                        shadow-xs shadow-purple-950
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                        transition-all duration-200 ease-out
                        ${
                            isFormValid
                                ? "bg-purple-950 hover:shadow-2xl hover:rounded-full cursor-pointer"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}>
                            Send message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
