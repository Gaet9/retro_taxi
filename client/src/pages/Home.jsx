import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { IMAGES } from "../config/images";

export const Home = () => {
    return (
        <div
            className='bg-cover bg-center bg-no-repeat min-h-screen racing-font'
            title='Retro Taxi'
            style={{ backgroundImage: `url(${IMAGES.HOME_BACKGROUND})` }}>
            <Navigation color='text-butter' />
            <Header>Retro Taxi</Header>
            <div
                className='flex mx-auto w-3/4 mt-5 justify-center 
                            text-3xl text-butter'
                style={{
                    WebkitTextStroke: "1px #3b0764",
                    textShadow: "none",
                }}>
                Let's discover the future of transportation
                <Link
                    to='blogs'
                    className='flex w-fit h-fit mt-30 p-4
                                border-2 rounded-bl-2xl rounded-tr-2xl rounded-br-4xl 
                                border-butter bg-gradient-to-r from-purple-950 via-purple-400 to-blue-500
                                hover:bg-purple-700 hover:rounded-full
                                transition-all duration-200 ease-in-out'>
                    Discover
                </Link>
            </div>
        </div>
    );
};
