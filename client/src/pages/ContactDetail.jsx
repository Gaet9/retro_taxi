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
                <div className='flex justify-center m-2'>
                    <div className='text-purple-950 text-xl'>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen bg-butter racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Contact Form Details</Header>
            {NotificationElement}
            <div className='flex justify-center m-2'>
                <div
                    id='contactDetail-id'
                    className='flex flex-col w-3/4 py-2
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        shadow-xl shadow-purple-950'>
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col w-1/6'>
                            <div
                                className='flex justify-center p-1
                                    bg-purple-950 text-butter
                                    rounded-br-2xl'>
                                Contact
                            </div>
                            <div
                                className='flex w-2/3 p-1 bg-purple-950 text-butter 
                                    rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-envelope'></i>
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
                            <div>
                                <Link
                                    to='/admin-dash'
                                    className='flex justify-center items-center 
                                        px-3 py-1 mr-4 bg-red-300 text-purple-950 text-2xl
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

                    {/* Contact Information Display */}
                    <div className='flex flex-row'>
                        <div className='flex flex-col w-1/4 m-5'>
                            <div className='flex flex-col space-y-4'>
                                <div className='bg-purple-950 text-butter border-4 border-purple-950 p-3 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                    <h3 className='text-lg mb-2'>Contact ID</h3>
                                    <p className='text-xl'>{contact.id}</p>
                                </div>

                                <div className='bg-purple-950 text-butter border-4 border-purple-950 p-3 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                    <h3 className='text-lg mb-2'>Name</h3>
                                    <p className='text-xl'>{contact.name}</p>
                                </div>

                                <div className='bg-purple-950 text-butter border-4 border-purple-950 p-3 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                    <h3 className='text-lg mb-2'>Email</h3>
                                    <p className='text-md break-all'>{contact.email}</p>
                                </div>

                                <div className='bg-purple-950 text-butter border-4 border-purple-950 p-3 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                    <h3 className='text-lg mb-2'>Submitted</h3>
                                    <p className='text-xl'>{new Date(contact.submitted_at).toLocaleDateString()}</p>
                                    <p className='text-sm opacity-75'>{new Date(contact.submitted_at).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className='flex flex-col w-3/4 m-5'>
                            <div className='bg-butter text-purple-950 border-4 border-purple-950 p-4 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl h-full'>
                                <h3 className='text-2xl mb-4'>Message</h3>
                                <div className='bg-butter text-purple-950 p-4 rounded-lg h-64 overflow-y-auto'>
                                    <p className='text-lg whitespace-pre-wrap'>{contact.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex justify-end m-5'>
                        <button
                            onClick={handleDelete}
                            className='flex justify-center items-center 
                                px-6 py-2 mr-4 bg-red-600 text-butter text-xl
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
