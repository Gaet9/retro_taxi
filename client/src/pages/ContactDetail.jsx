import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { fetchContactById, deleteContact } from "../api/contact";
import { useNotification } from "../components/Notification";

export const ContactDetail = () => {
    const { id } = useParams();
    const [contact, setContact] = useState(null);

    // Notification component
    const [NotificationElement, showNotification] = useNotification();

    useEffect(() => {
        fetchContactById(id)
            .then((data) => setContact(data.data))
            .catch((err) => {
                console.error("Failed to fetch contact:", err);
                showNotification("Failed to fetch contact details", "error");
            });
    }, [id]);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteContact(contact.id);
            showNotification("Contact form deleted", "info");
            setTimeout(() => navigate("/admin-dash"), 2000);
        } catch (error) {
            console.error("Failed to delete contact:", error);
            showNotification("Error deleting contact form", "error");
        }
    };

    if (!contact) {
        return (
            <div className='h-screen bg-butter racing-font overflow-y-auto overflow-x-hidden'>
                <Navigation color='text-purple-950' />
                <Header color='text-purple-950'>Contact Details</Header>
                {NotificationElement}
                <div className='flex justify-center m-2 sm:m-3 md:m-4 lg:m-5'>
                    <div className='text-purple-950 text-lg sm:text-xl md:text-2xl'>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen bg-butter racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Contact Form Details</Header>
            {NotificationElement}
            <div className='flex justify-center m-2 sm:m-3 md:m-4 lg:m-5'>
                <div
                    id='contactDetail-id'
                    className='flex flex-col w-2/3
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        shadow-xl shadow-purple-950'>
                    {/* Header Section */}
                    <div className='flex sm:flex-row justify-between text-purple-950 text-base sm:text-lg md:text-xl lg:text-2xl p-2 sm:p-3 md:p-4'>
                        <div className='flex flex-col w-full sm:w-1/6'>
                            <div className='flex justify-center p-1 bg-purple-950 text-butter rounded-br-2xl text-sm sm:text-base md:text-lg'>
                                Contact
                            </div>
                            <div className='flex w-2/3 p-1 bg-purple-950 text-butter rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-envelope text-sm sm:text-base md:text-lg'></i>
                            </div>
                        </div>
                        <div className='flex flex-row mt-2'>
                            <div
                                className='flex w-fit max-h-8 sm:max-h-10 p-2 mr-2 sm:mr-5 md:mr-8 lg:mr-10 
                                items-center bg-purple-950 text-butter rounded-2xl text-xs sm:text-sm md:text-base'>
                                {new Date().toLocaleDateString()}
                            </div>
                            <div>
                                <Link
                                    to='/admin-dash'
                                    className='flex justify-center items-center 
                                        px-3 py-1 mr-4 bg-red-300 text-purple-950 text-lg sm:text-xl md:text-2xl
                                        shadow-xs shadow-purple-950
                                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                        cursor-pointer
                                        hover:shadow-lg hover:bg-red-600 hover:rounded-md transform hover:scale-102
                                        transition-all duration-300 ease-out'>
                                    &times;
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Display - Using CSS Grid */}
                    <div
                        className='grid md:grid-cols-1 mt-5 lg:grid-cols-2 
                                gap-4 sm:gap-6 md:gap-8 
                                p-2 sm:p-3 md:p-4'>
                        {/* First Column - Contact Details */}
                        <div className='space-y-4 sm:space-y-6 md:space-y-8'>
                            <div className='bg-purple-950 text-butter border-2 sm:border-3 md:border-4 border-purple-950 p-3 sm:p-4 md:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                <h3 className='text-sm sm:text-base md:text-lg lg:text-xl mb-2'>Contact ID</h3>
                                <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>{contact.id}</p>
                            </div>

                            <div className='bg-purple-950 text-butter border-2 sm:border-3 md:border-4 border-purple-950 p-3 sm:p-4 md:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                <h3 className='text-sm sm:text-base md:text-lg lg:text-xl mb-2'>Name</h3>
                                <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>{contact.name}</p>
                            </div>

                            <div className='bg-purple-950 text-butter border-2 sm:border-3 md:border-4 border-purple-950 p-3 sm:p-4 md:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                <h3 className='text-sm sm:text-base md:text-lg lg:text-xl mb-2'>Email</h3>
                                <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl break-all'>{contact.email}</p>
                            </div>

                            <div className='bg-purple-950 text-butter border-2 sm:border-3 md:border-4 border-purple-950 p-3 sm:p-4 md:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                <h3 className='text-sm sm:text-base md:text-lg lg:text-xl mb-2'>Submitted</h3>
                                <p className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>
                                    {new Date(contact.submitted_at).toLocaleDateString()}
                                </p>
                                <p className='text-xs sm:text-sm opacity-75'>{new Date(contact.submitted_at).toLocaleTimeString()}</p>
                            </div>
                        </div>

                        {/* Second Column - Message Content */}
                        <div className='bg-butter text-purple-950 border-2 sm:border-3 md:border-4 border-purple-950 p-3 sm:p-4 md:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                            <h3 className='text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4'>Message</h3>
                            <div className='bg-butter text-purple-950 p-3 sm:p-4 rounded-lg min-h-[12rem] overflow-y-auto'>
                                <p className='text-sm sm:text-base md:text-lg lg:text-xl whitespace-pre-wrap'>{contact.message}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex justify-center lg:justify-end p-2 sm:p-3 md:p-4'>
                        <button
                            onClick={handleDelete}
                            className='flex justify-center items-center 
                                px-4 sm:px-6 py-2 mr-4 bg-red-600 text-butter 
                                text-sm sm:text-base md:text-lg lg:text-xl
                                shadow-md shadow-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                cursor-pointer
                                hover:shadow-lg hover:bg-red-700 hover:rounded-md transform hover:scale-105
                                transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-trash mr-2'></i>
                            Delete Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
