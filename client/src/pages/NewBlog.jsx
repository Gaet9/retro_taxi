import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { createBlog } from "../api/blogs";
import { fetchUsers } from "../api/users";
import { useNotification } from "../components/Notification";
import { createNewsletter } from "../api/newsletter";

export const NewBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [image_url, setImage_url] = useState("");
    const [user_id, setUser_id] = useState("");

    const [users, setUsers] = useState([]);

    // Notification component
    const [NotificationElement, showNotification] = useNotification();

    useEffect(() => {
        fetchUsers()
            .then((data) => setUsers(data.data))
            .catch((err) => console.error("Failed to fetch Users:", err));
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (e, statusToSet) => {
        e.preventDefault(); // Prevent page reload

        const blogData = {
            title,
            content,
            category,
            model,
            brand,
            image_url,
            user_id,
            status: statusToSet,
        };

        try {
            const newBlog = await createBlog(blogData);
            console.log("Blog created:", newBlog.title);

            // Optionally reset the form
            setTitle("");
            setContent("");
            setCategory("");
            setModel("");
            setBrand("");
            setImage_url("");
            setUser_id("");

            // Optionally redirect or show a success message
            if (statusToSet === "draft") {
                showNotification("Blog saved to draft", "warning");
            } else {
                showNotification("Blog published successfully", "success");
            }
            setTimeout(() => navigate("/admin-dash"), 2000);
        } catch (error) {
            console.error("Failed to create blog:", error);
            showNotification("Error creating blog", "error");
        }
    };

    const handlePerplexityGenerate = async () => {
        try {
            showNotification("Generating blog with Perplexity...", "info");

            const response = await createNewsletter();

            const generatedBlog = response;

            // Populate form fields with generated content
            setTitle(generatedBlog.title || "");
            setContent(generatedBlog.content || "");
            setCategory(generatedBlog.category || "");
            setModel(generatedBlog.model || "");
            setBrand(generatedBlog.brand || "");
            setImage_url(generatedBlog.image_url || "");

            if (response) {
                showNotification("Blog generated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to generate blog with Perplexity:", error);
            showNotification("Error generating blog with Perplexity", "error");
        }
    };

    return (
        <div className='h-screen bg-butter racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Create a new blog</Header>
            {NotificationElement}
            <div className='flex justify-center m-2'>
                <div
                    id='formNewBlog-id'
                    className='flex flex-col w-3/4 py-2
                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                    shadow-xl shadow-purple-950'>
                    <div className='flex justify-between text-purple-950 text-2xl'>
                        <div className='flex flex-col w-1/6'>
                            <div
                                className='flex justify-center p-1
                                bg-purple-950 text-butter
                                rounded-br-2xl'>
                                Form
                            </div>
                            <div
                                className='flex w-2/3 p-1 bg-purple-950 text-butter 
                                rounded-br-2xl justify-center'>
                                <i className='fa-solid fa-sheet-plastic'></i>
                            </div>
                        </div>
                        <div className='flex flex-row mt-2'>
                            <div
                                className='flex w-fit max-h-10 p-2 mr-10 
                                items-center 
                                bg-purple-950 text-butter
                                rounded-2xl'>
                                {new Date().toLocaleDateString()}
                            </div>
                            <div>
                                <Link
                                    to='/admin-dash'
                                    className='flex justify-center items-center 
                                        px-3 py-1 mr-4 bg-red-300 text-butter text-2xl
                                        shadow-xs shadow-purple-950
                                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                        cursor-pointer
                                        hover:shadow-lg hover:bg-red-600 hover:rounded-md transform hover:scale-102
                                        transition-all duration-300 ease-out'>
                                    &times;
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-col w-1/4 m-5'>
                            <label htmlFor='name' className='sr-only'>
                                Title
                            </label>
                            <textarea
                                type='text'
                                id='titleNewBlog-id'
                                placeholder='Title'
                                aria-label='Title'
                                maxLength={50}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className='flex justify-center items-center
                                text-xl text-purple-950
                                m-2 p-2 max-h-32
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                whitespace-normal break-words resize-none
                                overflow-y-hidden'
                            />
                            <label htmlFor='name' className='sr-only'>
                                Brand
                            </label>
                            <textarea
                                type='text'
                                id='brandNewBlog-id'
                                placeholder='Brand'
                                aria-label='Brand'
                                maxLength={30}
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className='flex justify-center items-center
                                text-xl text-purple-950
                                m-2 pl-2 max-h-10
                                resize-none
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'
                            />
                            <label htmlFor='name' className='sr-only'>
                                Model
                            </label>
                            <textarea
                                type='text'
                                id='modelNewBlog-id'
                                placeholder='Model'
                                aria-label='Model'
                                maxLength={30}
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className='flex justify-center items-center
                                text-xl text-purple-950
                                m-2 pl-2 max-h-10
                                resize-none
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'
                            />
                            <label htmlFor='name' className='sr-only'>
                                Category
                            </label>
                            <textarea
                                type='text'
                                id='categoryNewBlog-id'
                                placeholder='Category'
                                aria-label='Category'
                                maxLength={30}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='flex justify-center items-center
                                text-xl text-purple-950
                                m-2 pl-2 max-h-10
                                resize-none
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'
                            />
                            <select
                                type='text'
                                id='userNewBlog-id'
                                placeholder='Your user_ID'
                                aria-label='user_ID'
                                value={user_id}
                                onChange={(e) => setUser_id(e.target.value)}
                                className='flex justify-center items-center
                                text-xl text-purple-950
                                m-2 pl-2 max-h-10
                                resize-none
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'>
                                <option value=''>Select a user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.id} - {user.name}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor='name' className='sr-only'>
                                File
                            </label>
                            <input
                                type='file'
                                className='flex justify-center items-center
                                text-xl text-purple-950
                                m-2 pl-2 cursor-pointer
                                border-4 border-purple-950
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'
                            />
                        </div>
                        <label htmlFor='name' className='sr-only'>
                            Content
                        </label>
                        <textarea
                            type='text'
                            id='contentNewBlog-id'
                            placeholder='Your content here'
                            aria-label='content'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className='flex justify-start items-start text-md
                            overflow-auto p-2
                            w-3/4 m-5 text-purple-950
                            border-4 border-purple-950
                            resize-none
                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl'
                        />
                    </div>
                    <div className='flex justify-between px-5 mb-3'>
                        <button
                            onClick={handlePerplexityGenerate}
                            className='flex justify-center items-center 
                                        px-10 py-3 text-xl ml-2
                                        bg-gradient-to-r from-blue-600 to-purple-600 text-white
                                        shadow-lg shadow-purple-950
                                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl cursor-pointer
                                        hover:shadow-2xl hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:rounded-full 
                                        transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-magic mr-2'></i>
                            Generate with AI
                        </button>
                        <button
                            type='submit'
                            id='submitNewBlog-id'
                            onClick={(e) => handleSubmit(e, "draft")}
                            className='flex justify-center items-center 
                        w-1/5 py-1 text-2xl  ml-70
                        bg-purple-800 text-butter opacity-50
                        shadow-xs shadow-purple-950
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl cursor-pointer
                        hover:shadow-2xl hover:rounded-full 
                        transition-all duration-200 ease-out'>
                            Save as draft
                        </button>
                        <button
                            type='submit'
                            onClick={(e) => handleSubmit(e, "published")}
                            className='flex justify-center items-center 
                        w-1/5 py-1 text-2xl 
                        bg-purple-950 text-butter 
                        shadow-xs shadow-purple-950
                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl cursor-pointer
                        hover:shadow-2xl hover:rounded-full 
                        transition-all duration-200 ease-out'>
                            Publish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
