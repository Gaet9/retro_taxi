import { NavLink } from "react-router-dom";
import { AuthData } from "../context/AuthProvider";
import { IMAGES } from "../config/images";

export const Navigation = ({ color = "text-purple-950" }) => {
    const { user, logout } = AuthData();

    return (
        <div
            className='flex justify-between 
                        pt-5
                        sm:text-sm md:text-md lg:text-lg xl:text-xl
                        md:p-2 lg:p-3 xl:p-4
                        '>
            {/* This part is always visible, logged in or logged out */}
            <div
                className='flex items-center justify-between 
                            pr-5
                            w-3/5'>
                <NavLink to='/' title='home'>
                    <img
                        src={IMAGES.LOGO}
                        alt='logo'
                        className='w-10 h-10 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20
                        hover:scale-110 hover:bg-purple-400 hover:rounded-full
                        transition-all duration-200
                        object-contain aspect-square'
                    />
                </NavLink>
                <div
                    className={`flex w-1/3 justify-center
                                md:text-md lg:text-lg xl:text-xl
                                        ${color}
                                        text-shadow-purple`}>
                    {/* Left side of the nav bar */}
                    <NavLink
                        to='/'
                        title='home'
                        id='homenav-btn-id'
                        className={({ isActive }) =>
                            `mx-1 sm:mx-3 lg:mx-5 p-1 sm:p-3 lg:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
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
                            `mx-1 sm:mx-3 lg:mx-5 p-1 sm:p-3 lg:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
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
                            `mx-1 sm:mx-3 lg:mx-5 p-1 sm:p-3 lg:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
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
                            `mx-1 sm:mx-3 lg:mx-5 p-1 sm:p-3 lg:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                                transition-all duration-200 ease-in-out
                                                ${
                                                    isActive
                                                        ? `bg-purple-950 text-butter border-2 border-butter`
                                                        : "hover:bg-purple-400 hover:rounded-xl"
                                                }`
                        }>
                        Contact
                    </NavLink>
                    <NavLink
                        to='/map'
                        title='map'
                        id='mapnav-btn-id'
                        className={({ isActive }) =>
                            `mx-1 sm:mx-3 lg:mx-5 p-1 sm:p-3 lg:p-5 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                                transition-all duration-200 ease-in-out
                                                ${
                                                    isActive
                                                        ? `bg-purple-950 text-butter border-2 border-butter`
                                                        : "hover:bg-purple-400 hover:rounded-xl"
                                                }`
                        }>
                        Map
                    </NavLink>
                </div>
            </div>
            {/* This part depend on user isLoggedIn and Role */}
            <div
                className='flex m-1 sm:m-2 lg:m-3
                            md:text-md lg:text-lg xl:text-xl'>
                {user.isLoggedIn ? (
                    <>
                        <NavLink
                            to='/profile'
                            title='Profile'
                            id='profile-icon-id'
                            className={({ isActive }) =>
                                `${color} p-1 sm:p-2 lg:p-3
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
                        <NavLink
                            to='#'
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}
                            title='Logout'
                            id='logout-icon-id'
                            className={`
                                text-red-500 p-1 sm:p-2 lg:p-3
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                hover:bg-purple-400 hover:rounded-xl hover:cursor-pointer
                                transition-all duration-200 ease-in-out`}>
                            <i className='fa-solid fa-right-from-bracket'></i>
                        </NavLink>
                        {user.isAdmin && (
                            <NavLink
                                to='/admin-dash'
                                id='admin-icon-id'
                                title='Admin'
                                className={({ isActive }) =>
                                    `${color} p-1 sm:p-2 lg:p-3
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
                                `${color} p-1 sm:p-2 lg:p-3
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
