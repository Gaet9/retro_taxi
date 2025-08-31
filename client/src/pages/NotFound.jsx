import { Link } from "react-router-dom";
import "../index.css";

export const NotFound = () => {
    return (
        <div
            className='bg-butter h-screen bg-cover racing-font
                    flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center text-purple-950 text-lg sm:text-xl md:text-2xl lg:text-3xl p-4 text-center'>
                <p className='mb-4 sm:mb-6 md:mb-8'>Sorry this page doesn't exist</p>
                <Link
                    to={"/blogs"}
                    aria-label='link'
                    className='border-2 sm:border-3 md:border-4 border-purple-950 m-2 sm:m-3 md:m-5 p-2 sm:p-3 md:p-4
                                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                                shadow-lg shadow-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl cursor-pointer
                                hover:shadow-2xl hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:rounded-full 
                                transition-all duration-300 ease-out'>
                    <i className='fa-solid fa-arrow-left mr-3'></i>
                    Back to blogs
                </Link>
            </div>
        </div>
    );
};
