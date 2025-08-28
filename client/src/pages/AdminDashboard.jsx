import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { fetchBlogs, deleteBlogApi } from "../api/blogs";
import { fetchUsers, deleteUserApi, updateUserRole, updateUserNewsletter, approveAdminRequest, denyAdminRequest } from "../api/users";
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
    const [selectedUser, setSelectedUser] = useState(null);
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
        <div className='bg-butter h-screen racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Admin Dashboard</Header>
            {NotificationElement}
            {/* Statistics window */}
            <div className='flex justify-center'>
                <div
                    className='flex flex-col w-3/4 m-5
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        shadow-xl shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col'>
                            <div
                                className='flex px-2
                                    bg-purple-950 text-butter
                                    rounded-br-2xl'>
                                General
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-2 bg-purple-950 text-butter 
                                    rounded-br-2xl'>
                                {/* Icon */}
                                <i className='fa-solid fa-chart-simple'></i>
                            </div>
                        </div>
                    </div>
                    {/* Table headers */}
                    <div
                        className='flex justify-evenly ml-20
                            -mt-5 text-butter text-xl'>
                        <div
                            className='flex w-1/5 max-h-10 justify-center items-center m-1 p-1 bg-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                            Blogs published
                        </div>
                        <div
                            className='flex w-1/5 max-h-10 justify-center items-center m-1 p-1 bg-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                            Blogs pending
                        </div>
                        <div
                            className='flex w-1/5 max-h-10 justify-center items-center m-1 p-1 bg-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                            Users
                        </div>
                    </div>
                    {/* Table first line */}
                    <div
                        className='flex justify-evenly ml-20 mb-5
                            text-butter text-xl'>
                        <div
                            className='flex w-1/5 max-h-10 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                            {blogs.filter((blog) => blog.status === "published").length}
                        </div>
                        <div
                            className='flex w-1/5 max-h-10 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                            {blogs.filter((blog) => blog.status === "draft").length}
                        </div>
                        <div
                            className='flex w-1/5 max-h-10 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
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
                <div className='flex justify-center'>
                    <div
                        className='flex flex-col w-3/4 h-auto m-5 text-md pb-5
                             rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                             shadow-xl shadow-purple-950'>
                        {/* Top left corner of the window */}
                        <div className='flex justify-between text-purple-950 text-2xl'>
                            <div className='flex flex-col'>
                                <div
                                    className='flex justify-center w-fit px-2
                                         bg-purple-950 text-butter
                                         rounded-br-2xl'>
                                    Pending Admin Requests
                                </div>
                                <div
                                    className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                         rounded-br-2xl'>
                                    {/* Icon */}
                                    <i className='fa-solid fa-user-shield'></i>
                                </div>
                            </div>
                        </div>
                        {/* List of pending admin requests */}
                        {users
                            .filter((user) => user.adminrequest)
                            .map((user) => (
                                <div
                                    key={user.id}
                                    className='flex justify-evenly py-2
                                 text-butter'>
                                    <div
                                        className='flex w-1/6 max-h-10 justify-center items-center m-1 p-3 bg-purple-950 opacity-50
                                     rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                     shadow-md shadow-purple-950'>
                                        <h1>{user.name}</h1>
                                    </div>
                                    <div
                                        className='flex w-1/4 max-h-10 justify-center items-center m-1 p-1 bg-pink-800 opacity-50
                                     rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                     shadow-md shadow-purple-950'>
                                        {user.email}
                                    </div>
                                    <div
                                        className='flex w-1/6 max-h-10 justify-center items-center m-1 p-1 bg-yellow-600 opacity-50
                                     rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                     shadow-md shadow-purple-950'>
                                        Pending Approval
                                    </div>
                                    <button
                                        onClick={() => handleApproveAdmin(user.id)}
                                        className='flex w-1/6 max-h-10 justify-center items-center m-1 p-1 bg-emerald-600
                                     rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                     shadow-md shadow-purple-950
                                     hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer'>
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleDenyAdmin(user.id)}
                                        className='flex w-1/6 max-h-10 justify-center items-center m-1 p-1 bg-red-600
                                     rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                     shadow-md shadow-purple-950
                                     hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer'>
                                        Deny
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {/* Manage users */}
            <div className='flex justify-center'>
                <div
                    className='flex flex-col w-3/4 h-auto m-5 text-md pb-5
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        shadow-xl shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col'>
                            <div
                                className='flex justify-center w-fit px-2
                                    bg-purple-950 text-butter
                                    rounded-br-2xl'>
                                User management
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                    rounded-br-2xl'>
                                {/* Icon */}
                                <i className='fa-solid fa-gears'></i>
                            </div>
                        </div>
                        <div className='flex flex-row my-2'></div>
                    </div>
                    {/* List of articles */}
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className='flex justify-around py-0.5
                            text-butter'>
                            <div
                                className='flex w-1/12 max-h-10 justify-center items-center m-1 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                <h1>id : {user.id}</h1>
                            </div>
                            <div
                                className='flex w-1/6 max-h-10 justify-center items-center m-1 p-2 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                <h1>{user.name}</h1>
                            </div>
                            <div
                                className='flex w-1/6 max-h-10 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                Since: {new Date(user.createdat).toLocaleDateString()}
                            </div>
                            <div
                                className='flex w-1/4 max-h-10 justify-center items-center m-1 p-1 bg-pink-800 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                {user.email}
                            </div>
                            <button
                                onClick={() => handleNewsletterChange(user.id, !user.newsletter)}
                                className={`flex w-fit max-h-10 justify-center items-center m-1 px-5
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            shadow-md shadow-purple-950
                                            hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer
                                            ${user.newsletter ? "bg-emerald-600" : "bg-red-500"}`}>
                                {user.newsletter ? "Subscribed" : "Not Subscribed"}
                            </button>
                            <div
                                className={`flex w-1/12 max-h-10 justify-center items-center m-1 p-1
                                ${user.role === "admin" ? "bg-emerald-600 opacity-50" : "bg-purple-800 opacity-50"}
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950`}>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className='w-full h-full bg-transparent text-butter text-center border-none outline-none cursor-pointer
                                        focus:ring-2 focus:ring-butter focus:ring-opacity-50 rounded
                                        transition-all duration-200 ease-in-out'
                                    style={{ fontSize: "inherit" }}>
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
                {/* Confirm window from shadcn */}
                {selectedUser && (
                    <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. It will permanently delete this user and remove its informations from the
                                    database.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(selectedUser)}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {/* Manage articles window */}
            <div className='flex justify-center'>
                <div
                    className='flex flex-col w-3/4 h-auto m-5 text-md
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        shadow-xl shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col'>
                            <div
                                className='flex justify-center w-fit px-2
                                    bg-purple-950 text-butter
                                    rounded-br-2xl'>
                                Blog management
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                    rounded-br-2xl'>
                                {/* Icon */}
                                <i className='fa-solid fa-gears'></i>
                            </div>
                        </div>
                        <div className='flex flex-row mt-2'></div>
                    </div>
                    {/* List of articles */}
                    <div id='listOfBlogs-id'>
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                id={blog.id}
                                className='flex justify-evenly py-0.5
                                text-butter'>
                                <div
                                    className='flex w-1/6 max-h-10 justify-center items-center m-1 p-3 bg-purple-950 opacity-50
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    shadow-md shadow-purple-950'>
                                    <h1>{blog.brand ? blog.brand : blog.title}</h1>
                                </div>
                                <div
                                    className='flex w-1/6 max-h-10 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    shadow-md shadow-purple-950'>
                                    Created on : {new Date(blog.created_at).toLocaleDateString()}
                                </div>
                                <div
                                    className={`flex w-1/6 max-h-10 justify-center items-center m-1 p-1
                                    ${blog.status === "published" ? "bg-purple-800 opacity-50" : "bg-emerald-600 opacity-50"}
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    shadow-md shadow-purple-950`}>
                                    {blog.status}
                                </div>
                                <Link
                                    to={`/update-blog/${blog.id}`}
                                    className='flex w-1/6 max-h-10 justify-center items-center m-1 p-1 bg-cyan-600
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    shadow-md shadow-purple-950
                                    hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-blue-600
                                    transition-all duration-200 ease-in-out'>
                                    Modify
                                </Link>
                                <button
                                    aria-label={`delete-blog-${blog.id}`}
                                    onClick={() => setSelectedBlog(blog.id)}
                                    className='flex w-1/6 max-h-10 justify-center items-center m-1 p-1 bg-red-300
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    shadow-md shadow-purple-950
                                    hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-red-600
                                    transition-all duration-200 ease-in-out'>
                                    Delete
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
                            m-5'></div>
                    {/* Create new blog button */}
                    <div className='flex justify-between items-center m-5'>
                        <button
                            onClick={handleSendNewsletter}
                            className='flex justify-center items-center 
                                px-6 py-2 text-xl 
                                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                                shadow-lg shadow-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl cursor-pointer
                                hover:shadow-2xl hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:rounded-full
                                transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-paper-plane mr-2'></i>
                            Send Newsletter
                        </button>

                        <Link
                            to='/new-blog'
                            id='goToNewblog-btn-id'
                            className='flex justify-center items-center w-1/4 py-2
                                bg-purple-800 text-xl text-butter
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950
                                hover:rounded-full hover:shadow-2xl hover:cursor-pointer
                                transition-all duration-200 ease-in-out'>
                            Create a new article
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contact Form Management Section */}
            <div className='flex justify-center'>
                <div
                    className='flex flex-col w-3/4 h-auto m-5 text-md pb-5
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        shadow-xl shadow-purple-950'>
                    {/* Top left corner of the window */}
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col'>
                            <div
                                className='flex justify-center w-fit px-2
                                    bg-purple-950 text-butter
                                    rounded-br-2xl'>
                                Contact Form Management
                            </div>
                            <div
                                className='flex w-1/2 justify-center p-1 bg-purple-950 text-butter 
                                    rounded-br-2xl'>
                                {/* Icon */}
                                <i className='fa-solid fa-envelope'></i>
                            </div>
                        </div>
                        <div className='flex flex-row my-2'></div>
                    </div>
                    {/* List of contact forms */}
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className='flex justify-evenly py-0.5
                            text-butter'>
                            <div
                                className='flex w-1/12 max-h-10 justify-center items-center m-1 p-3 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                <h1>id : {contact.id}</h1>
                            </div>
                            <div
                                className='flex w-1/12 max-h-10 justify-center items-center m-1 p-3 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                <h1>{contact.name}</h1>
                            </div>
                            <div
                                className='flex w-1/4 max-h-10 justify-center items-center m-1 p-1 bg-pink-800 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                {contact.email}
                            </div>
                            <div
                                className='flex w-1/12 max-h-10 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'>
                                {new Date(contact.submitted_at).toLocaleDateString()}
                            </div>
                            <div
                                className='flex w-1/4 max-h-10 justify-center items-center m-1 p-1 bg-purple-950 opacity-50
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950'
                                title={contact.message}>
                                {contact.message.length > 30 ? `${contact.message.substring(0, 30)}...` : contact.message}
                            </div>
                            <Link
                                to={`/contact-detail/${contact.id}`}
                                className='flex w-1/12 max-h-10 justify-center items-center m-1 p-1 bg-cyan-600
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950
                                hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-blue-600
                                transition-all duration-200 ease-in-out'>
                                View
                            </Link>
                            <button
                                aria-label={`delete-contact-${contact.id}`}
                                onClick={() => setSelectedContact(contact.id)}
                                className='flex w-1/12 max-h-10 justify-center items-center m-1 p-1 bg-red-300
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                shadow-md shadow-purple-950
                                hover:rounded-full hover:shadow-2xl hover:cursor-pointer hover:bg-red-600
                                transition-all duration-200 ease-in-out'>
                                Delete
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
