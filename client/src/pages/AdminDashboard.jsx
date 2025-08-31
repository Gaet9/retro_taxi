import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { fetchBlogs, deleteBlogApi } from "../api/blogs";
import { fetchUsers, updateUserRole, updateUserNewsletter, approveAdminRequest, denyAdminRequest } from "../api/users";
import { fetchContact, deleteContact } from "../api/contact";
import { SendNewsletter } from "../api/newsletter";
import { useNotification } from "../components/Notification";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);

    // Notification component
    const [NotificationElement, showNotification] = useNotification();

    useEffect(() => {
        fetchBlogs()
            .then((data) => setBlogs(data.data))
            .catch((err) => console.error("Failed to fetch blogs:", err));

        fetchUsers()
            .then((data) => {
                console.log("Fetched users data:", data.data);
                console.log(
                    "Users with adminRequest:",
                    data.data.filter((user) => user.adminrequest)
                );
                console.log("Total users:", data.data.length);
                setUsers(data.data);
            })
            .catch((err) => console.error("Failed to fetch Users:", err));

        fetchContact()
            .then((data) => setContacts(data.data))
            .catch((err) => console.error("Failed to fetch contacts:", err));
    }, []);

    const handleDeleteBlog = async (id) => {
        try {
            await deleteBlogApi(id);
            showNotification("Blog deleted successfully", "info");
            // Remove deleted blog from the UI
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        } catch (err) {
            console.error("Error deleting blog:", err);
            showNotification("Failed to delete", "error");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            // Update the user role in the local state
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
            showNotification("User role updated successfully", "success");
        } catch (err) {
            console.error("Error updating user role:", err);
            showNotification("Failed to update user role", "error");
        }
    };

    const handleNewsletterChange = async (userId, newNewsletterStatus) => {
        try {
            await updateUserNewsletter(userId, newNewsletterStatus);
            // Update the newsletter status in the local state
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, newsletter: newNewsletterStatus } : user)));
            showNotification("Newsletter subscription updated successfully", "success");
        } catch (err) {
            console.error("Error updating newsletter subscription:", err);
            showNotification("Failed to update newsletter subscription", "error");
        }
    };

    const handleApproveAdmin = async (userId) => {
        try {
            await approveAdminRequest(userId);
            // Update the user role in the local state
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: "admin", adminrequest: false } : user)));
            showNotification("Admin request approved successfully", "success");
        } catch (err) {
            console.error("Error approving admin request:", err);
            showNotification("Failed to approve admin request", "error");
        }
    };

    const handleDenyAdmin = async (userId) => {
        try {
            await denyAdminRequest(userId);
            // Update the user role in the local state
            setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: "user", adminrequest: false } : user)));
            showNotification("Admin request denied successfully", "info");
        } catch (err) {
            console.error("Error denying admin request:", err);
            showNotification("Failed to deny admin request", "error");
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            await deleteContact(id);
            showNotification("Contact form deleted successfully", "info");
            // Remove deleted contact from the UI
            setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
        } catch (err) {
            console.error("Error deleting contact:", err);
            showNotification("Failed to delete contact form", "error");
        }
    };

    const handleSendNewsletter = async () => {
        try {
            showNotification("Sending newsletter...", "info");

            await SendNewsletter();
            showNotification("Newsletter sent successfully!", "success");
        } catch (error) {
            console.error("Failed to send newsletter:", error);
            showNotification("Error sending newsletter", "error");
        }
    };

    return (
        <div
            className='bg-butter min-h-screen racing-font 
                        overflow-y-auto overflow-x-hidden
                        px-2 py-1'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Admin Dashboard</Header>
            {NotificationElement}

            {/* Statistics window */}
            <div className='flex justify-center mb-3'>
                <div
                    className='flex flex-col w-full lg:w-3/4
                        text-xs md:text-md lg:text-xl xl:text-2xl
                        rounded-lg rounded-bl-xl rounded-tr-xl rounded-br-2xl
                        shadow-lg shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div
                        className='flex justify-between text-purple-950 p-1
                                    sm:text-xs md:text-md lg:text-lg xl:text-xl'>
                        <div className='flex flex-col'>
                            <div
                                className='flex px-2 py-1
                                    bg-purple-950 text-butter
                                    rounded-br-lg'>
                                General
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                    rounded-br-lg'>
                                {/* Icon */}
                                <i className='fa-solid fa-chart-simple '></i>
                            </div>
                        </div>
                    </div>
                    {/* Table headers */}
                    <div
                        className='flex justify-evenly ml-4 -mt-2 text-butter gap-1
                                    sm:text-xs md:text-md lg:text-lg xl:text-xl'>
                        <div
                            className='flex w-1/3 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950 '>
                            Blogs published
                        </div>
                        <div
                            className='flex w-1/3 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950 '>
                            Blogs pending
                        </div>
                        <div
                            className='flex w-1/3 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950 '>
                            Users
                        </div>
                    </div>
                    {/* Table first line */}
                    <div
                        className='flex justify-evenly ml-4 mb-2 text-butter gap-1
                                    sm:text-xs md:text-md lg:text-lg xl:text-xl'>
                        <div
                            className='flex w-1/3 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950 '>
                            {blogs.filter((blog) => blog.status === "published").length}
                        </div>
                        <div
                            className='flex w-1/3 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950 '>
                            {blogs.filter((blog) => blog.status === "draft").length}
                        </div>
                        <div
                            className='flex w-1/3 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950 '>
                            {users.length}
                        </div>
                    </div>
                </div>
            </div>
            {/* Admin Requests Section */}
            {(() => {
                const adminRequests = users.filter((user) => user.adminrequest);
                console.log("Filtered admin requests:", adminRequests);
                console.log("Admin requests length:", adminRequests.length);
                return adminRequests.length > 0;
            })() && (
                <div className='flex justify-center mb-3'>
                    <div
                        className='flex flex-col w-full lg:w-3/4
                            sm:text-xs md:text-md lg:text-lg xl:text-xl 
                            h-auto pb-2
                            rounded-lg rounded-bl-xl rounded-tr-xl rounded-br-2xl
                            shadow-lg shadow-purple-950'>
                        {/* Top left corner of the window */}
                        <div
                            className='flex justify-between text-purple-950 p-1
                                    sm:text-xs md:text-md lg:text-lg xl:text-xl'>
                            <div className='flex flex-col'>
                                <div
                                    className='flex justify-center w-fit px-2 py-1
                                         bg-purple-950 text-butter
                                         rounded-br-lg '>
                                    Pending Admin Requests
                                </div>
                                <div
                                    className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                         rounded-br-lg'>
                                    {/* Icon */}
                                    <i className='fa-solid fa-user-shield '></i>
                                </div>
                            </div>
                        </div>
                        {/* List of pending admin requests */}
                        {users
                            .filter((user) => user.adminrequest)
                            .map((user) => (
                                <div
                                    key={user.id}
                                    className='flex justify-evenly py-1 text-butter gap-1
                                text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg
                                '>
                                    <div
                                        className='flex w-1/4 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                     rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                     shadow-md shadow-purple-950'>
                                        <h1 className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>{user.name}</h1>
                                    </div>
                                    <div
                                        className='flex w-1/3 max-h-6 justify-center items-center m-1 p-1 py-1 bg-pink-800 opacity-50
                                     rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                     shadow-md shadow-purple-950'>
                                        <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>{user.email}</span>
                                    </div>
                                    <div
                                        className='flex w-1/4 max-h-6 justify-center items-center m-1 p-1 py-1 bg-yellow-600 opacity-50
                                     rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                     shadow-md shadow-purple-950'>
                                        <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>Pending</span>
                                    </div>
                                    <button
                                        onClick={() => handleApproveAdmin(user.id)}
                                        className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 py-1 bg-emerald-600
                                     rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                     shadow-md shadow-purple-950
                                     hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer'>
                                        <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>✓</span>
                                    </button>
                                    <button
                                        onClick={() => handleDenyAdmin(user.id)}
                                        className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 py-1 bg-red-600
                                     rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                     shadow-md shadow-purple-950
                                     hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer'>
                                        <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>✗</span>
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {/* Manage users */}
            <div className='flex justify-center mb-3'>
                <div
                    className='flex flex-col w-full lg:w-3/4
                        h-auto pb-2
                        rounded-lg rounded-bl-xl rounded-tr-xl rounded-br-2xl
                        shadow-lg shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div
                        className='flex justify-between text-purple-950 p-1
                    text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                        <div className='flex flex-col'>
                            <div
                                className='flex justify-center w-fit px-2 py-1
                                    bg-purple-950 text-butter
                                    rounded-br-lg '>
                                User management
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                    rounded-br-lg'>
                                {/* Icon */}
                                <i className='fa-solid fa-gears '></i>
                            </div>
                        </div>
                        <div className='flex flex-row my-1'></div>
                    </div>
                    {/* List of users */}
                    {users.map((user) => (
                        <div key={user.id} className='flex justify-center text-butter gap-1'>
                            <div
                                className='flex w-1/12 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <h1 className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>id:{user.id}</h1>
                            </div>
                            <div
                                className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <h1 className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>{user.name}</h1>
                            </div>
                            <div
                                className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                                    {new Date(user.createdat).toLocaleDateString()}
                                </span>
                            </div>
                            <div
                                className='flex w-1/6 max-h-6 justify-center items-center m-1 px-2 py-1 bg-pink-800 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                                    {user.email.length > 10 ? `${user.email.substring(0, 10)}...` : user.email}
                                </span>
                            </div>
                            <button
                                onClick={() => handleNewsletterChange(user.id, !user.newsletter)}
                                className={`flex w-1/12 max-h-6 justify-center items-center m-1 px-1 py-1
                                            rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                            shadow-md shadow-purple-950
                                            hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer
                                            ${user.newsletter ? "bg-emerald-600" : "bg-red-500"}`}>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                                    {user.newsletter ? "Sub" : "Not"}
                                </span>
                            </button>
                            <div
                                className={`flex w-1/6 max-h-6 justify-center items-center m-1 p-1 py-1
                                ${user.role === "admin" ? "bg-emerald-600 opacity-50" : "bg-purple-800 opacity-50"}
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950`}>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className='w-full h-10 bg-transparent text-butter text-center border-none outline-none cursor-pointer
                                    text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg    
                                    focus:ring-2 focus:ring-butter focus:ring-opacity-50 rounded
                                        transition-all duration-200 ease-in-out '>
                                    <option value='user' className='bg-purple-800 text-butter'>
                                        User
                                    </option>
                                    <option value='admin' className='bg-emerald-600 text-butter'>
                                        Admin
                                    </option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Manage articles window */}
            <div className='flex justify-center'>
                <div
                    className='flex flex-col w-full lg:w-3/4 h-auto 
                        rounded-lg rounded-bl-xl rounded-tr-xl rounded-br-2xl
                        shadow-lg shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div
                        className='flex justify-between text-purple-950 p-1
                    text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                        <div className='flex flex-col'>
                            <div
                                className='flex justify-center w-fit px-2 py-1
                                    bg-purple-950 text-butter
                                    rounded-br-lg '>
                                Blog management
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                    rounded-br-lg'>
                                {/* Icon */}
                                <i className='fa-solid fa-gears '></i>
                            </div>
                        </div>
                        <div className='flex flex-row mt-1'></div>
                    </div>
                    {/* List of articles */}
                    <div id='listOfBlogs-id'>
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                id={blog.id}
                                className='flex justify-evenly text-butter text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg my-1'>
                                <div
                                    className='flex w-1/6 max-h-6 justify-center items-center m-1 p-2 bg-purple-950 opacity-50
                                    rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                    shadow-md shadow-purple-950'>
                                    <h1 className='text-[8px] sm:text-[8px] md:text-sm lg:text-sm'>
                                        {blog.brand ? blog.brand : blog.title}
                                    </h1>
                                </div>
                                <div
                                    className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 py-1 bg-purple-950 opacity-50
                                    rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                    shadow-md shadow-purple-950'>
                                    <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div
                                    className={`flex w-1/6 max-h-6 justify-center items-center m-1 p-1 py-1
                                    ${blog.status === "published" ? "bg-purple-800 opacity-50" : "bg-emerald-600 opacity-50"}
                                    rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                    shadow-md shadow-purple-950`}>
                                    <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>{blog.status}</span>
                                </div>
                                <Link
                                    to={`/update-blog/${blog.id}`}
                                    className='flex w-fit max-h-6 justify-center items-center m-1 px-5 py-1 bg-cyan-600
                                    rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                    shadow-md shadow-purple-950
                                    hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-blue-600
                                    transition-all duration-200 ease-in-out'>
                                    <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>Modify</span>
                                </Link>
                                <button
                                    aria-label={`delete-blog-${blog.id}`}
                                    onClick={() => setSelectedBlog(blog.id)}
                                    className='flex w-fit max-h-6 justify-center items-center m-1 px-5 py-1 bg-red-300
                                    rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                    shadow-md shadow-purple-950
                                    hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-red-600
                                    transition-all duration-200 ease-in-out'>
                                    <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>Delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Confirm window from shadcn */}
                    {selectedBlog && (
                        <AlertDialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. It will permanently delete this blog and remove its content from the
                                        database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setSelectedBlog(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteBlog(selectedBlog)}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {/* Separating line */}
                    <div
                        className='flex justify-evenly 
                            h-0.5 bg-purple-800 opacity-50 
                            m-2'></div>
                    {/* Create new blog button */}
                    <div className='flex justify-between items-center m-2'>
                        <button
                            onClick={handleSendNewsletter}
                            className='flex justify-center items-center 
                                px-2 py-1 m-2 w-1/3
                                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                                shadow-lg shadow-purple-950
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl cursor-pointer
                                hover:shadow-2xl hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:rounded-full
                                transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-paper-plane mr-1 text-[9px]'></i>
                            <span className='text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>Send Newsletter</span>
                        </button>

                        <Link
                            to='/new-blog'
                            id='goToNewblog-btn-id'
                            className='flex justify-center items-center w-1/3 py-1 m-2
                                bg-purple-800 text-butter
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950
                                hover:rounded-full hover:shadow-2xl hover:cursor-pointer
                                transition-all duration-200 ease-in-out'>
                            <span className='text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>Create a new article</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contact Form Management Section */}
            <div className='flex justify-center mb-3'>
                <div
                    className='flex flex-col w-full lg:w-3/4 h-auto pb-2
                        rounded-lg rounded-bl-xl rounded-tr-xl rounded-br-2xl
                        shadow-lg shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div
                        className='flex justify-between text-purple-950 p-1
                    text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                        <div className='flex flex-col'>
                            <div
                                className='flex justify-center w-fit px-2 py-1
                                    bg-purple-950 text-butter
                                    rounded-br-lg '>
                                Contact Form Management
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                    rounded-br-lg'>
                                {/* Icon */}
                                <i className='fa-solid fa-envelope '></i>
                            </div>
                        </div>
                        <div className='flex flex-row my-1'></div>
                    </div>
                    {/* List of contact forms */}
                    {contacts.map((contact) => (
                        <div key={contact.id} className='flex justify-center text-butter'>
                            <div
                                className='flex w-1/12 max-h-6 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <h1 className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>id: {contact.id}</h1>
                            </div>
                            <div
                                className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <h1 className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>{contact.name}</h1>
                            </div>
                            <div
                                className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 bg-pink-800 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                                    {contact.email.length > 10 ? `${contact.email.substring(0, 10)}...` : contact.email}
                                </span>
                            </div>
                            <div
                                className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                                    {new Date(contact.submitted_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div
                                className='flex w-1/6 max-h-6 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950'
                                title={contact.subject}>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>
                                    {contact.subject.length > 30 ? `${contact.subject.substring(0, 30)}...` : contact.subject}
                                </span>
                            </div>
                            <Link
                                to={`/contact-detail/${contact.id}`}
                                className='flex w-fit max-h-6 justify-center items-center m-1 p-1 bg-cyan-600
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950
                                hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-blue-600
                                transition-all duration-200 ease-in-out'>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>View</span>
                            </Link>
                            <button
                                aria-label={`delete-contact-${contact.id}`}
                                onClick={() => setSelectedContact(contact.id)}
                                className='flex w-fit max-h-6 justify-center items-center m-1 p-1 bg-red-300
                                rounded-lg rounded-bl-lg rounded-tr-lg rounded-br-xl
                                shadow-md shadow-purple-950
                                hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-red-600
                                transition-all duration-200 ease-in-out'>
                                <span className='text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg'>Delete</span>
                            </button>
                        </div>
                    ))}
                </div>
                {/* Confirm window for contact deletion */}
                {selectedContact && (
                    <AlertDialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. It will permanently delete this contact form submission and remove its
                                    information from the database.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSelectedContact(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteContact(selectedContact)}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    );
};
