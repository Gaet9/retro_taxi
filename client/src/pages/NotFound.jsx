import { Link } from "react-router-dom";
import "../index.css";

export const NotFound = () => {
    return (
        <div
            className='bg-butter h-screen bg-cover racing-font
                    flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center text-purple-950 text-3xl'>
                <p>Sorry this page doesn't exist</p>
                <Link
                    to={"/blogs"}
                    aria-label='link'
                    className='border-4 border-purple-950 m-5 p-2
                                      rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                       hover:bg-purple-400 hover:text-amber-200 hover:rounded-full
                                       transition-all duration-200 ease-in-out '>
                    Go to blogs page
                </Link>
            </div>
        </div>
    );
};
