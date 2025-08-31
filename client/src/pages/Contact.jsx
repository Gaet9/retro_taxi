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
            <div className='flex justify-center m-2 sm:m-3 md:m-4 lg:m-5'>
                <form
                    onSubmit={handleSubmit}
                    id='formContact-id'
                    className='flex flex-col w-2/3
                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                    shadow-xl shadow-purple-950'>
                    {/* Header Section */}
                    <div className='flex sm:flex-row justify-between text-purple-950 text-xs sm:text-sm md:text-md lg:text-lg p-2 sm:p-3 md:p-4'>
                        <div className='flex flex-col w-full sm:w-1/5'>
                            <div className='flex p-1 pl-2 sm:pl-3 bg-purple-950 text-butter rounded-br-2xl text-sm sm:text-base md:text-lg'>
                                Contact form
                            </div>
                            <div className='flex w-2/3 p-1 bg-purple-950 text-butter rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-sheet-plastic text-sm sm:text-base md:text-lg'></i>
                            </div>
                        </div>
                        <div className='flex flex-row mt-2'>
                            <div
                                className='flex w-fit max-h-8 sm:max-h-10 p-2 mr-2 sm:mr-5 md:mr-8 lg:mr-10 
                                items-center bg-purple-950 text-butter rounded-2xl text-xs sm:text-sm md:text-base'>
                                {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Form Fields Section - Using CSS Grid */}
                    <div
                        className='grid md:grid-cols-1 mt-5 lg:grid-cols-2 
                                    gap-4 sm:gap-6 md:gap-8 
                                    p-2 sm:p-3 md:p-4'>
                        {/* First Column - Input Fields */}
                        <div className='space-y-8 sm:space-y-10 md:space-y-12'>
                            {/* Subject Input */}
                            <div className='relative'>
                                <input
                                    type='text'
                                    data-testid='subjectContact-id'
                                    id='subjectContact-id'
                                    placeholder='Subject of request'
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className='flex justify-center items-center w-full
                                    text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-purple-950
                                     p-3 sm:p-4 md:p-5
                                    border-2 sm:border-3 md:border-4 border-purple-950
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:border-purple-400 focus:scale-105
                                    transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-6 sm:-top-7 left-0 text-xs sm:text-sm md:text-base lg:text-lg text-purple-950'>
                                    Subject of request
                                </label>
                            </div>

                            {/* Name Input */}
                            <div className='relative'>
                                <input
                                    type='text'
                                    data-testid='nameContact-id'
                                    id='nameContact-id'
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='flex justify-center items-center w-full
                                    text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-purple-950
                                     p-3 sm:p-4 md:p-5
                                    border-2 sm:border-3 md:border-4 border-purple-950
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:border-purple-400 focus:scale-105
                                    transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-6 sm:-top-7 left-0 text-xs sm:text-sm md:text-base lg:text-lg text-purple-950'>
                                    Name
                                </label>
                            </div>

                            {/* Email Input */}
                            <div className='relative'>
                                <input
                                    type='text'
                                    data-testid='emailContact-id'
                                    id='emailContact-id'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => handleEmailChange(e)}
                                    className={`flex justify-center items-center w-full
                                    text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-purple-950
                                     p-3 sm:p-4 md:p-5
                                    border-2 sm:border-3 md:border-4 border-purple-950
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:border-purple-400 focus:scale-105
                                    transition-all duration-200 ease-in-out
                                    ${emailError ? "border-red-500 focus:border-red-500" : "border-purple-950 focus:border-purple-400"}`}
                                />
                                {emailError && <p className='text-red-500 text-xs sm:text-sm ml-2 sm:ml-3 md:ml-4'>{emailError}</p>}
                                <label className='absolute -top-6 sm:-top-7 left-0 text-xs sm:text-sm md:text-base lg:text-lg text-purple-950'>
                                    Email
                                </label>
                            </div>
                        </div>

                        {/* Second Column - Message Textarea */}
                        <div className='relative'>
                            <textarea
                                type='text'
                                data-testid='messageContact-id'
                                id='messageContact-id'
                                placeholder='Message'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className='flex justify-start items-start w-full mt-3
                                text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-purple-950
                                overflow-auto min-h-[12rem] p-3 sm:p-4 md:p-5
                                border-2 sm:border-3 md:border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-102
                                transition-all duration-200 ease-in-out'
                            />
                            <label className='absolute -top-2 sm:-top-7 left-0 text-xs sm:text-sm md:text-base lg:text-lg text-purple-950'>
                                Message
                            </label>
                        </div>
                    </div>

                    {/* Submit Button Section */}
                    <div className='flex justify-center lg:justify-end p-2 sm:p-3 md:p-4'>
                        <button
                            type='submit'
                            title='Fill the form to send your request to the admin'
                            data-testid='submitContactBtn-id'
                            id='submitContactBtn-id'
                            disabled={!isFormValid}
                            className={`flex justify-center items-center 
                            w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4
                            h-10 sm:h-12 md:h-14 lg:h-16
                            text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
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
