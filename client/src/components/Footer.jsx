import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className='mt-auto flex flex-col items-center justify-center py-8 px-4'>
            <div className='flex items-center justify-center mb-4'>
                <i className='fa-solid fa-circle-question fa-lg mr-2 text-purple-950'></i>
                <Link
                    to='/contact'
                    className='px-6 py-2 bg-purple-950 text-butter text-sm rounded-lg hover:bg-purple-800 transition-colors duration-200'>
                    Got a question?
                </Link>
            </div>
            <div className='text-center text-purple-950'>
                <p>&copy; 2025 Retro Taxi. All rights reserved.</p>
            </div>
        </footer>
    );
};
