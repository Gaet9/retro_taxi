import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { loginApi } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { AuthData } from "../context/AuthProvider";
import { fetchUserWithToken } from "../api/users";
import { useNotification } from "../components/Notification";
import { Footer } from "@/components/Footer";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = AuthData();

    const isFormValid = email.trim().length > 0 && password.trim().length > 0;

    // Notification component
    const [NotificationElement, showNotification] = useNotification();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        try {
            // Authenticate the blacklist, creating cookie with JWT token
            await loginApi(userData);

            // fetch user details (using the token cookie)
            const response = await fetchUserWithToken();

            // 3. Update context state
            login(response.data);

            setEmail("");
            setPassword("");

            showNotification("Login successful", "success");
            setTimeout(() => navigate("/blogs"), 2000);
        } catch (err) {
            console.error("login failed", err);
            showNotification("login failed, check your credentials", "error");
        }
    };

    return (
        <div className='bg-butter bg-cover h-screen racing-font overflow-y-auto overflow-x-hidden justify-center'>
            <Navigation />
            <Header color='text-purple-950'>Login</Header>
            {NotificationElement}
            <div className='flex justify-center m-2 sm:m-3 md:m-4 lg:m-5 max-w-7xl mx-auto'>
                <form
                    data-testid='login-form'
                    id='login-form-id'
                    onSubmit={handleSubmit}
                    className='flex flex-col w-3/4 sm:w-4/5 md:w-3/4 lg:w-2/3
                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                    shadow-xl shadow-purple-950'>
                    <div className='flex justify-between text-purple-950 text-lg sm:text-xl md:text-2xl'>
                        <div className='flex flex-col w-1/5'>
                            <div
                                className='flex p-1 px-3
                                bg-purple-950 text-butter
                                rounded-br-2xl'>
                                Login
                            </div>
                            <div
                                className='flex w-2/3 p-1 bg-purple-950 text-butter 
                                rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-right-to-bracket'></i>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center'>
                        <div className='flex flex-col mt-5 m-2 sm:m-3 md:m-4 lg:m-5 w-full sm:w-4/5 md:w-3/4 lg:w-2/3'>
                            <div className='relative m-2 sm:m-3 md:m-4 lg:m-5 group'>
                                <input
                                    type='email'
                                    data-testid='email-input'
                                    id='email-id'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='flex justify-center items-center
                                text-base sm:text-lg md:text-xl text-purple-950
                                w-full h-12 sm:h-14 md:h-15 px-10 sm:px-15
                                border-2 sm:border-3 md:border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-105
                                transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-6 sm:-top-7 left-0 text-sm sm:text-base md:text-md text-purple-950'>
                                    Email
                                </label>
                                <i className='absolute left-3 sm:left-4 md:left-5 top-6 sm:top-7 fa-solid fa-at fa-lg sm:fa-xl px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                            </div>
                            <div className='relative mt-5 m-2 sm:m-3 md:m-4 lg:m-5 group'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Password'
                                    data-testid='password-input'
                                    id='pwd-id'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='flex justify-center items-center
                                text-base sm:text-lg md:text-xl text-purple-950
                                w-full h-12 sm:h-14 md:h-15 px-10 sm:px-15
                                border-2 sm:border-3 md:border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-105
                                transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-6 sm:-top-7 left-0 text-sm sm:text-base md:text-md text-purple-950'>
                                    Password
                                </label>
                                <i className='absolute left-3 sm:left-4 md:left-5 top-6 sm:top-7 fa-solid fa-key fa-lg sm:fa-xl px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 sm:right-4 md:right-5 top-4 sm:top-5 text-purple-950 hover:text-purple-800 transition-all duration-200 ease-in-out group-focus-within:translate-x-3'>
                                    <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-0'>
                        <div
                            className='flex flex-row gap-2 mx-auto
                                        text-purple-950
                                        justify-center items-center
                                        w-3/4 sm:w-1/4 h-10 mb-3 text-sm sm:text-base md:text-md'>
                            <p>Don't have an account?</p>
                            <Link
                                to={"/sign-up"}
                                id='signup-btn-id'
                                className='underline text-purple-800
                            hover:text-blue-600 hover:scale-105
                            transition-all duration-200 ease-in-out'>
                                Sign Up
                            </Link>
                        </div>
                        <button
                            type='submit'
                            id='submitLogin-btn-id'
                            disabled={!isFormValid}
                            className={`flex justify-center items-center mx-auto
                        w-3/4 sm:w-1/4 h-10 mb-3 sm:mr-10 sm:ml-10 text-lg sm:text-xl md:text-2xl 
                        text-butter 
                        shadow-xs shadow-purple-950
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                        transition-all duration-200 ease-out                            
                        ${
                            isFormValid
                                ? "bg-purple-950 hover:shadow-2xl hover:rounded-full cursor-pointer"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};
