import { useEffect, useState } from "react";
import { deleteUserApi, fetchUserWithToken, updateUser } from "../api/users";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { AuthData } from "../context/AuthProvider";
import { useNotification } from "../components/Notification";
import validator from "validator";
import { Footer } from "@/components/Footer";
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

export const Profile = () => {
    const { logout } = AuthData();

    const [user, setUser] = useState(null);

    // Notification component
    const [NotificationElement, showNotification] = useNotification();

    useEffect(() => {
        fetchUserWithToken()
            .then((data) => setUser(data.data))
            .catch((err) => console.error("Failed to fetch user details:", err));
    }, []);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(""); // continue implementing
    const [date, setDate] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(""); // continue implementing
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const [newsletter, setNewsletter] = useState(false);
    const [error, setError] = useState("");
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            setId(user.id);
            setName(user.name);
            setEmail(user.email);
            setDate(new Date(user.createdat).toLocaleDateString());
            setPassword("");
            setRole(user.role);
            setNewsletter(user.newsletter || false);
        }
    }, [user]);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!validator.isEmail(value) && value) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (
            !validator.isStrongPassword(value, {
                minLength: 8,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1,
            }) &&
            value
        ) {
            setPasswordError("Password must be at least 8 characters long, 1 uppercase, 1 symbol, 1 number");
        } else {
            setPasswordError("");
        }
    };

    const isFormValid = name.trim().length > 0 && email.trim().length > 0 && !emailError && (!password.trim() || !passwordError);

    const navigate = useNavigate();

    // Finish to implement this function in here and in the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const userData = {
            name,
            email,
            role,
            newsletter,
        };

        // Only include password if it's been changed
        if (password.trim().length > 0) {
            userData.password = password;
        }

        try {
            await updateUser(userData);
            showNotification("Profile updated successfully", "success");
            setTimeout(() => navigate("/blogs"), 2000);
        } catch (err) {
            console.error("Sign up failed", err);
            setError(err.response.data.message || "Something went wrong."); // use backend's message
            showNotification(`Error : ${error}`, "error");
            // use the error directly after extraction, if use of error, error will be one render behind
        }
    };

    const handleDeleteUser = async () => {
        try {
            await deleteUserApi();
            showNotification("profile deleted successfully", "info");
            logout();
            setTimeout(() => navigate("/blogs"), 2000);
        } catch (err) {
            setError(err.response.data.message || "Something went wrong."); // use backend's message
            showNotification(`Error : ${error}`, "error");
        }
    };

    return (
        <div className='bg-butter bg-cover h-screen racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Profile</Header>
            {NotificationElement}
            {user ? (
                <div className='flex justify-center m-2 sm:m-3 md:m-4 lg:m-5 max-w-7xl mx-auto'>
                    <div
                        className='flex flex-col w-full sm:w-4/5 md:w-3/4 lg:w-2/3 py-2 mx-1
                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                            shadow-sm shadow-purple-950'>
                        <div className='flex justify-between text-purple-950 text-lg sm:text-xl md:text-2xl'>
                            <div className='flex flex-col w-1/6'>
                                <div
                                    className='flex justify-center p-1
                                        bg-purple-950 text-butter
                                        rounded-br-2xl'>
                                    Profile
                                </div>
                                <div
                                    className='flex w-2/3 p-1 bg-purple-950 text-butter 
                                        rounded-br-2xl justify-center'>
                                    <i className='fa-solid fa-user'></i>
                                </div>
                            </div>
                            <div className='flex flex-row mt-2'>
                                <div>
                                    <Link
                                        to='/blogs'
                                        className='flex justify-center items-center 
                                                px-3 py-1 mr-4 bg-red-300 text-butter text-lg sm:text-xl md:text-2xl
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
                        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-2 sm:p-3 md:p-4 justify-center'>
                            {/* First Column */}
                            <div className='space-y-1 sm:space-y-2 md:space-y-3'>
                                <label htmlFor='name' className='text-lg sm:text-xl md:text-xl text-purple-950 ml-20'>
                                    Name
                                </label>
                                <div className='text-lg sm:text-xl md:text-xl text-purple-950 '>
                                    <input
                                        type='text'
                                        placeholder='Name'
                                        aria-label='Name'
                                        maxLength={50}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className='flex justify-center justify-self-center items-center
                                            text-base sm:text-lg md:text-xl text-purple-950
                                            m-2 pl-2 h-12 sm:h-14 md:h-16 w-3/4 md:w-1/3
                                            border-2 sm:border-3 md:border-4 border-purple-950
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            focus:border-purple-400 focus:scale-102
                                            transition-all duration-200 ease-in-out'
                                    />
                                </div>
                                <label htmlFor='name' className='text-lg sm:text-xl md:text-xl text-purple-950 ml-20'>
                                    Role
                                </label>
                                <div className='text-lg sm:text-xl md:text-xl text-purple-950'>
                                    <input
                                        type='text'
                                        placeholder='role'
                                        maxLength={50}
                                        value={role}
                                        readOnly
                                        className='flex justify-center justify-self-center items-center
                                            text-base sm:text-lg md:text-xl text-purple-950
                                            m-2 pl-2 h-12 sm:h-14 md:h-16 w-3/4 md:w-1/3
                                            border-2 sm:border-3 md:border-4 border-purple-950
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            focus:border-purple-400 focus:scale-102
                                            transition-all duration-200 ease-in-out'
                                    />
                                </div>
                                <label htmlFor='name' className='text-lg sm:text-xl md:text-xl text-purple-950 ml-20'>
                                    Email
                                </label>
                                <div className='text-lg sm:text-xl md:text-xl text-purple-950'>
                                    <input
                                        type='text'
                                        placeholder='Email'
                                        maxLength={30}
                                        value={email}
                                        onChange={(e) => handleEmailChange(e)}
                                        className={`flex justify-center justify-self-center items-center
                                            text-base sm:text-lg md:text-xl text-purple-950
                                            m-2 pl-2 h-12 sm:h-14 md:h-16 w-3/4 md:w-1/3
                                            resize-none
                                            border-2 sm:border-3 md:border-4 border-purple-950
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            focus:border-purple-400 focus:scale-102
                                            transition-all duration-200 ease-in-out
                                            ${emailError ? "border-red-500 focus:border-red-500" : "border-purple-950"}`}
                                    />
                                </div>
                            </div>
                            {/* Second Column */}
                            <div className='space-y-1 sm:space-y-2 md:space-y-3'>
                                <label htmlFor='name' className='text-lg sm:text-xl md:text-xl text-purple-950 ml-20'>
                                    Id
                                </label>
                                <div className='text-lg sm:text-xl md:text-xl text-purple-950'>
                                    <input
                                        type='text'
                                        placeholder='Id'
                                        maxLength={30}
                                        value={id}
                                        readOnly
                                        className='flex justify-center justify-self-center items-center
                                            text-base sm:text-lg md:text-xl text-purple-950
                                            m-2 pl-2 h-12 sm:h-14 md:h-16 w-3/4 md:w-1/3
                                            resize-none
                                            border-2 sm:border-3 md:border-4 border-purple-950
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            focus:border-purple-400 focus:scale-102
                                            transition-all duration-200 ease-in-out'
                                    />
                                </div>
                                <label htmlFor='name' className='text-lg sm:text-xl md:text-xl text-purple-950 ml-20'>
                                    Date
                                </label>
                                <div className='text-lg sm:text-xl md:text-xl text-purple-950'>
                                    <input
                                        type='text'
                                        placeholder='Profile created on'
                                        maxLength={30}
                                        value={date}
                                        readOnly
                                        className='flex justify-center justify-self-center items-center
                                            text-base sm:text-lg md:text-xl text-purple-950
                                            m-2 pl-2 h-12 sm:h-14 md:h-16 w-3/4 md:w-1/3
                                            resize-none
                                            border-2 sm:border-3 md:border-4 border-purple-950
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            focus:border-purple-400 focus:scale-102
                                            transition-all duration-200 ease-in-out'
                                    />
                                </div>
                                <label htmlFor='name' className='text-lg sm:text-xl md:text-xl text-purple-950 ml-20'>
                                    Password <span className='text-sm text-gray-600'>(leave empty to keep current password)</span>
                                </label>
                                <div className='text-lg sm:text-xl md:text-xl text-purple-950 relative'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={"Enter new password"}
                                        maxLength={30}
                                        value={password}
                                        onChange={(e) => handlePasswordChange(e)}
                                        onFocus={(e) => e.target.select()}
                                        className={`flex justify-center justify-self-center items-center
                                            text-base sm:text-lg md:text-xl text-purple-950
                                            m-2 pl-2 pr-12 h-12 sm:h-14 md:h-16 w-3/4 md:w-1/3
                                            resize-none
                                            border-2 sm:border-3 md:border-4 border-purple-950
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            focus:border-purple-400 focus:scale-102
                                            transition-all duration-200 ease-in-out
                                            ${passwordError ? "border-red-500 focus:border-red-500" : "border-purple-950"}`}
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-14 sm:right-20 md:right-30 lg:right-20 top-6 md:top-8 transform -translate-y-1/2 text-purple-950 hover:text-purple-800 transition-all duration-200 ease-in-out'>
                                        <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg`}></i>
                                    </button>
                                    {passwordError && <p className='text-red-500 text-sm ml-5'>{passwordError}</p>}
                                </div>
                                {/* Newsletter subscription checkbox */}
                                <div className='text-lg sm:text-xl md:text-xl text-purple-950 justify-self-center'>
                                    <div className='flex items-center space-x-3'>
                                        <input
                                            type='checkbox'
                                            id='newsletter-profile-id'
                                            checked={newsletter}
                                            onChange={(e) => setNewsletter(e.target.checked)}
                                            className='custom-checkbox'
                                        />
                                        <label htmlFor='newsletter-profile-id' className='text-sm sm:text-base md:text-lg text-purple-950'>
                                            Subscribe to newsletter
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-center sm:justify-between gap-4 p-2 sm:p-3 md:p-4'>
                            <button
                                type='submit'
                                id='deleteUser-btn-id'
                                onClick={() => setOpenDeleteConfirm(true)}
                                className='flex justify-center items-center mx-auto
                                w-3/4 py-2 sm:py-1 sm:mx-10 text-lg sm:text-xl md:text-2xl 
                                bg-red-600 text-butter 
                                shadow-xs shadow-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                hover:shadow-2xl hover:rounded-full cursor-pointer
                                transition-all duration-200 ease-out'>
                                Delete profile
                            </button>
                            {/* Confirm window from shadcn */}
                            <AlertDialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. It will permanently delete this user and removes its informations
                                            from the database. You will be logged out instantly.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setOpenDeleteConfirm(false)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                handleDeleteUser();
                                                setOpenDeleteConfirm(false);
                                            }}>
                                            Confirm
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <button
                                type='submit'
                                id='logoutUser-btn-id'
                                onClick={logout}
                                className='flex justify-center items-center mx-auto
                                w-3/4 py-2 sm:py-1 sm:mx-10 text-lg sm:text-xl md:text-2xl 
                                bg-emerald-600 text-butter 
                                shadow-xs shadow-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                hover:shadow-2xl hover:rounded-full cursor-pointer
                                transition-all duration-200 ease-out'>
                                Logout
                            </button>
                            <button
                                type='submit'
                                onClick={handleSubmit}
                                disabled={!isFormValid}
                                className={`flex justify-center items-center mx-auto
                                w-3/4 py-2 sm:py-1 sm:mx-10 text-lg sm:text-xl md:text-2xl 
                                text-butter 
                                shadow-xs shadow-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                transition-all duration-200 ease-out
                                ${
                                    isFormValid
                                        ? "bg-purple-950 hover:shadow-2xl hover:rounded-full cursor-pointer"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}>
                                Save profile
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // This isn't right, it displays the not found page inside the page.
                // It should redirect to the actual 404 page
                <div
                    className='bg-butter h-screen bg-cover racing-font
                                         flex justify-center items-center'>
                    <div className='flex flex-col justify-center items-center text-purple-950 text-lg sm:text-xl md:text-2xl lg:text-3xl p-4'>
                        <p>Sorry this user doesn't exist</p>
                        <Link
                            to={"/login"}
                            className='border-2 sm:border-3 md:border-4 border-purple-950 m-2 sm:m-3 md:m-5 p-2
                                                           rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                                            hover:bg-purple-400 hover:text-amber-200 hover:rounded-full
                                                            transition-all duration-200 ease-in-out '>
                            Go back to login page
                        </Link>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};
