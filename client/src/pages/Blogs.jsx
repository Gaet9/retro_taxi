import { useState, useEffect } from "react";
import { fetchBlogsPublished } from "../api/blogs";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { Footer } from "@/components/Footer";
import CruiseImg from "../assets/Cruise.jpg";
import TeslaImg from "../assets/Tesla.jpg";
import WaymoImg from "../assets/Waymo.jpg";
import ZooxImg from "../assets/zoox.jpg";
import BaiduImg from "../assets/baidu.jpg";

export const Blogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBlogsPublished()
            .then((data) => setBlogs(data.data))
            .catch((err) => console.error("Failed to fetch blogs:", err));
    }, []);

    const images = {
        Tesla: TeslaImg,
        Amazon: ZooxImg,
        Google: WaymoImg,
        GM: CruiseImg,
        Baidu: BaiduImg,
    };

    return (
        <div className='h-screen bg-butter racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation />
            <Header color='text-purple-950'>Retro Taxi</Header>
            <div className='grid grid-cols-1 xl:grid-cols-2 justify-self-center w-3/4 justify-items-center justify-between gap-10'>
                {blogs.map((blog) => (
                    <Link key={blog.id} to={`./${blog.id}`} id={`blog-card-${blog.id}`}>
                        {" "}
                        {/* list of cards */}
                        <div
                            className=' flex flex-row bg-cover bg-center justify-between w-md h-60 text-purple-950
                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                            shadow-md shadow-purple-950
                            hover:shadow-2xl transform hover:scale-102 hover:ml-2
                            transition-all duration-300 ease-out'
                            style={{ backgroundImage: `url(${images[blog.brand]})` }}>
                            <div className='flex flex-col w-1/3'>
                                <div
                                    className='flex bg-butter pl-3
                                border-l-2 border-t-2 border-butter rounded-br-2xl'>
                                    {blog.brand ? blog.brand : blog.title}
                                </div>
                                <div
                                    className='flex w-2/3 pl-3 bg-butter 
                                border-l-2 border-t-2 border-butter rounded-br-2xl'>
                                    {blog.model}
                                </div>
                            </div>
                            <div className='flex flex-col items-center mt-2 mr-2'>
                                <div
                                    className='flex w-fit max-h-5 p-1 m-1 
                                    text-xs items-center 
                                    bg-purple-950 text-butter
                                    rounded-2xl'>
                                    <p>{new Date(blog.created_at).toLocaleDateString()}</p>
                                </div>
                                <div
                                    className='flex w-fit max-h-5 p-1 
                                    text-xs items-center 
                                    bg-purple-950 text-butter
                                    rounded-2xl'>
                                    {blog.category}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <Footer />
        </div>
    );
};
