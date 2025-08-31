import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { register } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";
import { useNotification } from "../components/Notification";
import { Footer } from "@/components/Footer";

export const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState("user");
    const [newsletter, setNewsletter] = useState(false);
    const [adminRequest, setAdminRequest] = useState(false);

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
        // Re-validate confirmation of two password fields
        if (passwordConfirm && value !== passwordConfirm) {
            setPasswordConfirmError("Two fields must contain the same password");
        } else {
            setPasswordConfirmError("");
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const value = e.target.value;
        setPasswordConfirm(value);
        if (password !== value) {
            setPasswordConfirmError("Two fields must contain the same password");
        } else {
            setPasswordConfirmError("");
        }
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setRole(selectedRole);
        // If admin is selected, set adminRequest to true
        setAdminRequest(selectedRole === "admin");
    };

    const isFormValid =
        name.trim().length > 0 &&
        email.trim().length > 0 &&
        !emailError &&
        password.trim().length > 0 &&
        !passwordError &&
        passwordConfirm.trim().length > 0 &&
        !passwordConfirmError;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            password,
            role: "user", // Always register as user initially
            newsletter,
            adminRequest, // Include admin request flag
        };

        try {
            await register(userData);

            setName("");
            setEmail("");
            setPassword("");
            setRole("user");
            setNewsletter(false);
            setAdminRequest(false);

            if (adminRequest) {
                showNotification("Account created successfully! Admin role request submitted for approval.", "success");
            } else {
                showNotification("You create an account successfully", "success");
            }
            setTimeout(() => navigate("/blogs"), 2000);
        } catch (err) {
            console.error(err);
            showNotification("Something went wrong", "error");
        }
    };

    return (
        <div className='bg-butter bg-cover h-screen racing-font overflow-y-auto overflow-x-hidden justify-center'>
            <Navigation />
            <Header color='text-purple-950'>Sign Up</Header>
            {NotificationElement}
            <div className='flex justify-center m-2 sm:m-3 md:m-4 lg:m-5 max-w-7xl mx-auto'>
                <form
                    id='signup-form-id'
                    className='flex flex-col w-3/4 sm:w-4/5 md:w-3/4 lg:w-2/3
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        shadow-xl shadow-purple-950'>
                    <div className='flex justify-between text-purple-950 text-lg sm:text-xl md:text-2xl'>
                        <div className='flex flex-col w-2/5'>
                            <div
                                className='flex p-1 px-3 justify-center
                                    bg-purple-950 text-butter
                                    rounded-br-2xl'>
                                Sign-Up
                            </div>
                            <div
                                className='flex w-2/3 p-1 bg-purple-950 text-butter 
                                    rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-user-plus'></i>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center'>
                        <div className='flex flex-col mt-5 m-2 sm:m-3 md:m-4 lg:m-5 w-full sm:w-4/5 md:w-3/4 lg:w-2/3'>
                            {/* Name field */}
                            <div className='relative m-2 sm:m-3 md:m-4 lg:m-5 group'>
                                <input
                                    type='text'
                                    placeholder='Name'
                                    id='name-signup-id'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`flex justify-center items-center
                                    text-base sm:text-lg md:text-xl text-purple-950
                                    w-full h-12 sm:h-14 md:h-15 px-10 sm:px-15
                                    border-2 sm:border-3 md:border-4
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:scale-105
                                    transition-all duration-200 ease-in-out
                                    ${
                                        name.trim().length > 0
                                            ? "border-green-500 focus:border-green-500"
                                            : "border-purple-950 focus:border-purple-400 "
                                    }`}
                                />
                                <label className='absolute -top-6 sm:-top-7 left-0 text-sm sm:text-base md:text-md text-purple-950'>
                                    Name
                                </label>
                                <i className='absolute left-3 sm:left-4 md:left-5 top-6 sm:top-7 fa-solid fa-circle-user fa-lg sm:fa-md px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                            </div>
                            {/* Email field  */}
                            <div className='relative mt-5 m-2 sm:m-3 md:m-4 lg:m-5 group'>
                                <input
                                    type='text'
                                    placeholder='Email'
                                    id='email-signup-id'
                                    value={email}
                                    onChange={(e) => handleEmailChange(e)}
                                    className={`flex justify-center items-center
                                    text-base sm:text-lg md:text-xl text-purple-950
                                    w-full h-12 sm:h-14 md:h-15 px-10 sm:px-15
                                    border-2 sm:border-3 md:border-4
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:scale-105
                                    transition-all duration-200 ease-in-out
                                    ${
                                        emailError
                                            ? "border-red-500 focus:border-red-500"
                                            : email.trim().length > 0
                                            ? "border-green-500 focus:border-green-500"
                                            : "border-purple-950 focus:border-purple-400 "
                                    }`}
                                />
                                <label className='absolute -top-6 sm:-top-7 left-0 text-sm sm:text-base md:text-md text-purple-950'>
                                    Email
                                </label>
                                <i className='absolute left-3 sm:left-4 md:left-5 top-6 sm:top-7 fa-solid fa-at fa-lg sm:fa-md px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                                {emailError && <p className='relative text-red-500 text-sm ml-5'>{emailError}</p>}
                            </div>
                            {/* First password field */}
                            <div className='relative mt-5 m-2 sm:m-3 md:m-4 lg:m-5 group'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Password'
                                    id='pwd-signup-id'
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e)}
                                    className={`flex justify-center items-center
                                    text-base sm:text-lg md:text-xl text-purple-950
                                    w-full h-12 sm:h-14 md:h-15 px-10 sm:px-15
                                    border-2 sm:border-3 md:border-4
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:scale-105
                                    transition-all duration-200 ease-in-out
                                    ${
                                        passwordError
                                            ? "border-red-500 focus:border-red-500"
                                            : password.trim().length > 0
                                            ? "border-green-500 focus:border-green-500"
                                            : "border-purple-950 focus:border-purple-400 "
                                    }`}
                                />
                                {passwordError && <p className='text-red-500 text-sm ml-5'>{passwordError}</p>}
                                <label className='absolute -top-6 sm:-top-7 left-0 text-sm sm:text-base md:text-md text-purple-950'>
                                    Password
                                </label>
                                <i className='absolute left-3 sm:left-4 md:left-5 top-6 sm:top-7 fa-solid fa-key fa-lg sm:fa-md px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 sm:right-4 md:right-5 top-4 sm:top-4 text-purple-950 hover:text-purple-800 transition-all duration-200 ease-in-out group-focus-within:translate-x-3'>
                                    <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg`}></i>
                                </button>
                            </div>
                            {/* Password confirmation field  */}
                            <div className='relative mt-5 m-2 sm:m-3 md:m-4 lg:m-5 group'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='Confirm password'
                                    id='pwdConfirm-signup-id'
                                    value={passwordConfirm}
                                    onChange={(e) => handlePasswordConfirmChange(e)}
                                    className={`flex justify-center items-center
                                    text-base sm:text-lg md:text-xl text-purple-950
                                    w-full h-12 sm:h-14 md:h-15 px-10 sm:px-15
                                    border-2 sm:border-3 md:border-4
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:scale-105
                                    transition-all duration-200 ease-in-out
                                    ${
                                        passwordConfirmError
                                            ? "border-red-500 focus:border-red-500"
                                            : passwordConfirm.trim().length > 0
                                            ? "border-green-500 focus:border-green-500"
                                            : "border-purple-950 focus:border-purple-400 "
                                    }`}
                                />
                                {passwordConfirmError && <p className='text-red-500 text-sm ml-5'>{passwordConfirmError}</p>}
                                <label className='absolute -top-6 sm:-top-7 left-0 text-sm sm:text-base md:text-md text-purple-950'>
                                    Confirm password
                                </label>
                                <i className='absolute left-2 sm:left-3 md:left-4 top-4 sm:top-7 fa-solid fa-key fa-lg sm:fa-md px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                                <i className='absolute left-4 sm:left-6 md:left-7 top-6 sm:top-7 fa-solid fa-key fa-lg sm:fa-md fa-flip-both px-1 text-purple-500 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute right-3 sm:right-4 md:right-5 top-4 sm:top-4 text-purple-950 hover:text-purple-800 transition-all duration-200 ease-in-out group-focus-within:translate-x-3'>
                                    <i className={`fa-solid ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} fa-lg`}></i>
                                </button>
                            </div>
                            {/* Role selection field */}
                            <div className='relative mt-5 m-2 sm:m-3 md:m-4 lg:m-5 group'>
                                <select
                                    id='role-signup-id'
                                    value={role}
                                    onChange={handleRoleChange}
                                    className='flex justify-center items-center
                                    text-md sm:text-lg md:text-xl text-purple-950
                                    w-full h-12 sm:h-14 md:h-15 px-10 sm:px-15
                                    border-2 sm:border-3 md:border-4 border-purple-950
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                    focus:scale-105 focus:border-purple-400
                                    transition-all duration-200 ease-in-out'>
                                    <option value='user' className='text-xs sm:text-md md:text-lg'>
                                        User
                                    </option>
                                    <option value='admin' className='text-xs sm:text-md md:text-lg'>
                                        Admin (Requires Approval)
                                    </option>
                                </select>
                                <label className='absolute -top-6 sm:-top-7 left-0 text-sm sm:text-base md:text-md text-purple-950'>
                                    Role
                                </label>
                                <i className='absolute left-3 sm:left-4 md:left-5 top-6 sm:top-7 fa-solid fa-user-tag fa-lg sm:fa-md px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row w-full justify-around items-center pb-5 gap-4 sm:gap-0'>
                        {/* Newsletter subscription checkbox */}
                        <div className='flex items-center space-x-3'>
                            <input
                                type='checkbox'
                                id='newsletter-signup-id'
                                checked={newsletter}
                                onChange={(e) => setNewsletter(e.target.checked)}
                                className='custom-checkbox'
                            />
                            <label htmlFor='newsletter-signup-id' className='text-sm sm:text-base md:text-lg text-purple-950'>
                                Subscribe to newsletter
                            </label>
                            <i className='fa-solid fa-envelope fa-lg text-purple-950'></i>
                        </div>

                        <div className='flex flex-row gap-2 text-purple-950 justify-center items-center'>
                            <p className='text-sm sm:text-base'>Already have an account?</p>
                            <Link
                                to={"/login"}
                                className='underline text-purple-800
                             hover:text-blue-600 hover:scale-105
                             transition-all duration-200 ease-in-out'>
                                Login
                            </Link>
                        </div>

                        <button
                            type='submit'
                            id='submitSignup-btn-id'
                            title='Fill the form to create your account'
                            onClick={(e) => handleSubmit(e)}
                            disabled={!isFormValid}
                            className={`flex justify-center items-center mx-auto mt-1
                             w-2/3 sm:w-auto px-10 sm:px-20 py-2 text-lg sm:text-xl md:text-xl text-butter 
                             shadow-xs shadow-purple-950
                             rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                             transition-all duration-200 ease-out
                             ${
                                 isFormValid
                                     ? "bg-purple-950 hover:shadow-2xl hover:rounded-full cursor-pointer"
                                     : "bg-gray-400 cursor-not-allowed"
                             }`}>
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};
