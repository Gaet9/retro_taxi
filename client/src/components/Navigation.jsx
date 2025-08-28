import { NavLink } from "react-router-dom";
import logo from "../assets/RT-logo.png";
import { AuthData } from "../context/AuthProvider";

export const Navigation = ({ color = "text-purple-950" }) => {
    const { user, logout } = AuthData();

    return (
        <div className='flex justify-between p-4'>
            {/* This part is always visible, logged in or logged out */}
            <div className='flex items-center justify-between space-x-8 w-3/5'>
                <NavLink to='/#' title='home'>
                    <img src={logo} alt='logo' width='75' height='75' />
                </NavLink>
                <div
                    className={`flex w-2/3 justify-around
                                        ${color}
                                        text-2xl
                                        text-shadow-purple`}>
                    {/* Left side of the nav bar */}
                    <NavLink
                        to='/'
                        title='home'
                        id='homenav-btn-id'
                        className={({ isActive }) =>
                            `mr-4 p-2 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                                transition-all duration-200 ease-in-out
                                                ${
                                                    isActive
                                                        ? `bg-purple-950 text-butter border-2 border-butter`
                                                        : "hover:bg-purple-400 hover:rounded-xl"
                                                }`
                        }>
                        Home
                    </NavLink>
                    <NavLink
                        to='/blogs'
                        title='blogs'
                        id='blogsnav-btn-id'
                        className={({ isActive }) =>
                            `mr-4 p-2 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                                transition-all duration-200 ease-in-out
                                                ${
                                                    isActive
                                                        ? `bg-purple-950 text-butter border-2 border-butter`
                                                        : "hover:bg-purple-400 hover:rounded-xl"
                                                }`
                        }>
                        Blogs
                    </NavLink>
                    <NavLink
                        to='/about'
                        title='about'
                        id='aboutnav-btn-id'
                        className={({ isActive }) =>
                            `mr-4 p-2 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                                transition-all duration-200 ease-in-out
                                                ${
                                                    isActive
                                                        ? `bg-purple-950 text-butter border-2 border-butter`
                                                        : "hover:bg-purple-400 hover:rounded-xl"
                                                }`
                        }>
                        About
                    </NavLink>
                    <NavLink
                        to='/contact'
                        title='contact'
                        id='contactnav-btn-id'
                        className={({ isActive }) =>
                            `mr-4 p-2 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                                transition-all duration-200 ease-in-out
                                                ${
                                                    isActive
                                                        ? `bg-purple-950 text-butter border-2 border-butter`
                                                        : "hover:bg-purple-400 hover:rounded-xl"
                                                }`
                        }>
                        Contact
                    </NavLink>
                </div>
            </div>
            {/* This part depend on user isLoggedIn and Role */}
            <div className='flex mr-5 mt-3'>
                {user.isLoggedIn ? (
                    <>
                        <NavLink
                            to='/profile'
                            title='Profile'
                            id='profile-icon-id'
                            className={({ isActive }) =>
                                `text-3xl ${color} p-3
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                    hover:bg-purple-400 hover:rounded-xl
                                    transition-all duration-200 ease-in-out
                                    ${
                                        isActive
                                            ? `bg-purple-950 text-butter border-2 border-butter`
                                            : "hover:bg-purple-400 hover:rounded-xl"
                                    }`
                            }>
                            <i className='fa-solid fa-user'></i>
                        </NavLink>
                        <button
                            onClick={() => logout()}
                            title='Logout'
                            id='logout-icon-id'
                            className='
                                text-3xl text-red-500 p-3
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                hover:bg-purple-400 hover:rounded-xl hover:cursor-pointer
                                transition-all duration-200 ease-in-out'>
                            <i className='fa-solid fa-right-from-bracket'></i>
                        </button>
                        {user.isAdmin && (
                            <NavLink
                                to='/admin-dash'
                                id='admin-icon-id'
                                title='Admin'
                                className={({ isActive }) =>
                                    `text-3xl ${color} p-3
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                    hover:bg-purple-400 hover:rounded-xl
                                    transition-all duration-200 ease-in-out
                                    ${
                                        isActive
                                            ? `bg-purple-950 text-butter border-2 border-butter`
                                            : "hover:bg-purple-400 hover:rounded-xl"
                                    }`
                                }>
                                <i className='fa-solid fa-lock'></i>
                            </NavLink>
                        )}
                    </>
                ) : (
                    <>
                        <NavLink
                            to='/login'
                            id='login-icon'
                            title='Login'
                            className={({ isActive }) =>
                                `text-3xl ${color} p-3
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                    hover:bg-purple-400 hover:rounded-xl
                                    transition-all duration-200 ease-in-out
                                    ${
                                        isActive
                                            ? `bg-purple-950 text-butter border-2 border-butter`
                                            : "hover:bg-purple-400 hover:rounded-xl"
                                    }`
                            }>
                            <i className='fa-solid fa-right-to-bracket'></i>
                        </NavLink>
                    </>
                )}
            </div>
        </div>
    );
};
