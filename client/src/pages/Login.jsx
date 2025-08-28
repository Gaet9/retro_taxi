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
        <div className='bg-butter bg-cover h-screen racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation />
            <Header color='text-purple-950'>Login</Header>
            {NotificationElement}
            <div className='flex justify-center m-5'>
                <form
                    data-testid='login-form'
                    id='login-form-id'
                    onSubmit={handleSubmit}
                    className='flex flex-col w-2/3
                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                    shadow-xl shadow-purple-950'>
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col w-1/5'>
                            <div
                                className='flex p-1 pl-3
                                bg-purple-950 text-butter
                                rounded-br-2xl'>
                                Login Form
                            </div>
                            <div
                                className='flex w-2/3 p-1 bg-purple-950 text-butter 
                                rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-right-to-bracket'></i>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center'>
                        <div className='flex flex-col m-5 w-2/3'>
                            <div className='relative m-5 group'>
                                <input
                                    type='email'
                                    data-testid='email-input'
                                    id='email-id'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='flex justify-center items-center
                                text-xl text-purple-950
                                w-full h-15 px-15
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-105
                                transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-7 left-O text-md text-purple-950'>Email</label>
                                <i className='absolute left-5 top-7 fa-solid fa-at fa-xl px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                            </div>
                            <div className='relative m-5 group'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Password'
                                    data-testid='password-input'
                                    id='pwd-id'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='flex justify-center items-center
                                text-xl text-purple-950
                                w-full h-15 px-15
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                focus:border-purple-400 focus:scale-105
                                transition-all duration-200 ease-in-out'
                                />
                                <label className='absolute -top-7 left-O text-md text-purple-950'>Password</label>
                                <i className='absolute left-5 top-7 fa-solid fa-key fa-xl px-1 text-purple-950 transition-all duration-200 ease-in-out group-focus-within:-translate-x-3'></i>
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-5 top-5 text-purple-950 hover:text-purple-800 transition-all duration-200 ease-in-out group-focus-within:translate-x-3'>
                                    <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div
                            className='flex flex-row gap-2
                                        text-purple-950
                                        justify-center items-center
                                        w-1/4 h-10 mb-3 text-md'>
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
                            className={`flex justify-center items-center 
                        w-1/4 h-10 mb-3 mr-10 ml-10 text-2xl 
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
