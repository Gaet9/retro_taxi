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
    const [sources, setSources] = useState("");

    const [users, setUsers] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

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
            sources: sources ? sources.split("\n").filter((source) => source.trim()) : [],
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
            setSources("");

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
            setIsGenerating(true);
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
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className='min-h-screen bg-butter racing-font overflow-y-auto overflow-x-hidden'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Create a new blog</Header>
            {NotificationElement}

            {/* Main Content Container */}
            <div className='container mx-auto px-6 py-8'>
                <div className='max-w-6xl mx-auto'>
                    {/* Blog Creation Form Card */}
                    <div
                        className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 overflow-hidden
                                    w-full lg:w-2/3 mx-auto'>
                        <div className='flex justify-end'>
                            <Link
                                to='/admin-dash'
                                className='flex justify-center items-center 
                                                px-3 py-1 bg-red-300 text-butter 
                                                text-sm sm:text-xl md:text-2xl
                                                shadow-xs shadow-purple-950
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                                cursor-pointer
                                                hover:shadow-lg hover:bg-red-600 hover:rounded-md transform hover:scale-102
                                                transition-all duration-300 ease-out'>
                                <i className='fa-solid fa-arrow-left mr-3'></i>
                                Back to dashboard
                            </Link>
                        </div>
                        <div className='p-4 sm:p-6 md:p-8'>
                            {/* Form Header */}
                            <div className='flex flex-row sm:flex-row justify-between text-purple-950 text-lg sm:text-xl md:text-2xl mb-6'>
                                <div className='flex flex-col w-1/6 mb-4 sm:mb-0'>
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
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <div
                                        className='flex w-fit max-h-10 p-2 
                                        items-center 
                                        bg-purple-950 text-butter text-sm sm:text-base md:text-lg
                                        rounded-2xl'>
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            {/* Loading Overlay */}
                            {isGenerating && (
                                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                                    <div className='bg-butter p-8 rounded-2xl shadow-2xl text-center'>
                                        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-purple-950 mx-auto mb-4'></div>
                                        <h3 className='text-xl font-bold text-purple-950 mb-2'>Generating Blog Content</h3>
                                        <p className='text-purple-700'>Please wait while AI creates your blog...</p>
                                        <div className='mt-4 text-sm text-purple-600'>
                                            <i className='fa-solid fa-robot mr-2'></i>
                                            Powered by Perplexity AI
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Fields - Responsive Layout */}
                            <div className='flex flex-col lg:flex-row gap-6'>
                                {/* Left Column - Input Fields */}
                                <div className='flex flex-col w-full space-y-4'>
                                    <div>
                                        <label
                                            htmlFor='titleNewBlog-id'
                                            className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                            <i className='fa-solid fa-heading mr-1'></i>Title
                                        </label>
                                        <textarea
                                            type='text'
                                            id='titleNewBlog-id'
                                            placeholder='Title'
                                            aria-label='Title'
                                            maxLength={50}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className='w-full p-2 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                                transition-all duration-200 ease-out'
                                            rows={3}
                                        />
                                        <div className='text-xs text-purple-600 mt-1 text-right'>{(title || "").length}/50</div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='brandNewBlog-id'
                                            className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                            <i className='fa-solid fa-tag mr-1'></i>Brand
                                        </label>
                                        <textarea
                                            type='text'
                                            id='brandNewBlog-id'
                                            placeholder='Brand'
                                            aria-label='Brand'
                                            maxLength={30}
                                            value={brand}
                                            onChange={(e) => setBrand(e.target.value)}
                                            className='w-full p-2 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                                transition-all duration-200 ease-out'
                                            rows={2}
                                        />
                                        <div className='text-xs text-purple-600 mt-1 text-right'>{(brand || "").length}/30</div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='modelNewBlog-id'
                                            className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                            <i className='fa-solid fa-car mr-1'></i>Model
                                        </label>
                                        <textarea
                                            type='text'
                                            id='modelNewBlog-id'
                                            placeholder='Model'
                                            aria-label='Model'
                                            maxLength={30}
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            className='w-full p-2 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                                transition-all duration-200 ease-out'
                                            rows={2}
                                        />
                                        <div className='text-xs text-purple-600 mt-1 text-right'>{(model || "").length}/30</div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='categoryNewBlog-id'
                                            className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                            <i className='fa-solid fa-folder mr-1'></i>Category
                                        </label>
                                        <textarea
                                            type='text'
                                            id='categoryNewBlog-id'
                                            placeholder='Category'
                                            aria-label='Category'
                                            maxLength={30}
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className='w-full p-2 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                                transition-all duration-200 ease-out'
                                            rows={2}
                                        />
                                        <div className='text-xs text-purple-600 mt-1 text-right'>{(category || "").length}/30</div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='userNewBlog-id'
                                            className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                            <i className='fa-solid fa-user mr-1'></i>User
                                        </label>
                                        <select
                                            id='userNewBlog-id'
                                            value={user_id}
                                            onChange={(e) => setUser_id(e.target.value)}
                                            className='w-full p-2 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                                transition-all duration-200 ease-out'>
                                            <option value=''>Select a user</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.id} - {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='imageNewBlog-id'
                                            className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                            <i className='fa-solid fa-image mr-1'></i>Image URL
                                        </label>
                                        <input
                                            type='text'
                                            id='imageNewBlog-id'
                                            placeholder='Enter image URL'
                                            value={image_url}
                                            onChange={(e) => setImage_url(e.target.value)}
                                            className='w-full p-2 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                                transition-all duration-200 ease-out'
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Content */}
                                <div className='flex flex-col w-full'>
                                    <label
                                        htmlFor='contentNewBlog-id'
                                        className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                        <i className='fa-solid fa-file-text mr-2'></i>Blog Content
                                    </label>
                                    <textarea
                                        type='text'
                                        id='contentNewBlog-id'
                                        placeholder='Your content here (JSON format)'
                                        aria-label='content'
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className='w-full h-64 sm:h-80 md:h-96 p-4 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                                            transition-all duration-200 ease-out'
                                    />
                                    <div className='text-xs text-purple-600 mt-2'>
                                        <i className='fa-solid fa-info-circle mr-1'></i>
                                        Content should be in JSON format for proper formatting.
                                    </div>
                                </div>
                            </div>

                            {/* Sources Section */}
                            <div className='w-full mt-6'>
                                <label
                                    htmlFor='sourcesNewBlog-id'
                                    className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                    <i className='fa-solid fa-link mr-2'></i>Sources
                                </label>
                                <textarea
                                    id='sourcesNewBlog-id'
                                    type='text'
                                    placeholder='Enter sources (one per line)'
                                    value={sources}
                                    onChange={(e) => setSources(e.target.value)}
                                    className='w-full h-32 sm:h-40 md:h-48 p-4 text-sm sm:text-base md:text-lg text-purple-950 bg-butter border-2 sm:border-3 md:border-4 border-purple-950
                                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                                        transition-all duration-200 ease-out'
                                />
                                <div className='text-xs text-purple-600 mt-2'>
                                    <i className='fa-solid fa-info-circle mr-1'></i>
                                    Enter one source per line. URLs will be automatically converted to clickable links.
                                </div>
                            </div>

                            {/* Sources Preview */}
                            {sources && (
                                <div className='mb-4 p-4 bg-white/60 rounded-xl border border-purple-200'>
                                    <h4 className='text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                        <i className='fa-solid fa-eye mr-1'></i>Sources Preview
                                    </h4>
                                    <div className='max-h-32 sm:max-h-40 overflow-y-auto prose prose-sm max-w-none'>
                                        <div className='text-purple-900 leading-relaxed space-y-2'>
                                            {sources
                                                .split("\n")
                                                .filter((source) => source.trim())
                                                .flatMap((source, idx) => {
                                                    // Handle comma-separated sources
                                                    if (source.includes(",")) {
                                                        return source.split(",").map((s, i) => ({ source: s.trim(), key: `${idx}-${i}` }));
                                                    }
                                                    return [{ source, key: idx }];
                                                })
                                                .map(({ source, key }) => {
                                                    // Check if it's an HTML anchor tag (from Perplexity)
                                                    if (source.includes("<a href=")) {
                                                        const linkMatch = source.match(/<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/);
                                                        if (linkMatch) {
                                                            const url = linkMatch[1];
                                                            const text = linkMatch[2];
                                                            return (
                                                                <li
                                                                    key={key}
                                                                    className='ml-4 mb-1 list-disc text-xs sm:text-sm md:text-base'>
                                                                    <a
                                                                        href={url}
                                                                        target='_blank'
                                                                        rel='noopener noreferrer'
                                                                        className='text-blue-600 hover:text-blue-800 underline'>
                                                                        {text}
                                                                    </a>
                                                                </li>
                                                            );
                                                        }
                                                    }
                                                    // Check if it's a plain URL
                                                    else if (source.includes("http")) {
                                                        const urlMatch = source.match(/(https?:\/\/[^\s)]+)/);
                                                        if (urlMatch) {
                                                            const text = source.replace(urlMatch[0], "").replace(/[()]/g, "").trim();
                                                            const url = urlMatch[0];
                                                            return (
                                                                <li
                                                                    key={key}
                                                                    className='ml-4 mb-1 list-disc text-xs sm:text-sm md:text-base'>
                                                                    <a
                                                                        href={url}
                                                                        target='_blank'
                                                                        rel='noopener noreferrer'
                                                                        className='text-blue-600 hover:text-blue-800 underline'>
                                                                        {text || url}
                                                                    </a>
                                                                </li>
                                                            );
                                                        }
                                                    }
                                                    return (
                                                        <li key={key} className='ml-4 mb-1 list-disc text-xs sm:text-sm md:text-base'>
                                                            <span className='underline'>{source}</span>
                                                        </li>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row justify-between mt-8 gap-4 w-2/3 mx-auto'>
                                <button
                                    onClick={handlePerplexityGenerate}
                                    disabled={isGenerating}
                                    className={`flex justify-center items-center 
                                        px-4 sm:px-6 md:px-10 py-2 sm:py-3 text-sm sm:text-base md:text-xl
                                        text-white shadow-lg shadow-purple-950
                                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                        transition-all duration-300 ease-out
                                        ${
                                            isGenerating
                                                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer hover:shadow-2xl hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:rounded-full"
                                        }`}>
                                    {isGenerating ? (
                                        <>
                                            <div className='animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 border-b-2 border-white mr-2'></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <i className='fa-solid fa-magic mr-2'></i>
                                            Generate with AI
                                        </>
                                    )}
                                </button>

                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <button
                                        type='submit'
                                        id='submitNewBlog-id'
                                        onClick={(e) => handleSubmit(e, "draft")}
                                        className='flex justify-center items-center 
                                            px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg
                                            bg-purple-800 text-butter opacity-80
                                            shadow-lg shadow-purple-950/20
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl cursor-pointer
                                            hover:shadow-2xl hover:shadow-purple-950 hover:opacity-100 hover:rounded-full 
                                            transition-all duration-300 ease-out'>
                                        <i className='fa-solid fa-save mr-2'></i>
                                        Save as Draft
                                    </button>
                                    <button
                                        type='submit'
                                        onClick={(e) => handleSubmit(e, "published")}
                                        className='flex justify-center items-center 
                                            px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg
                                            bg-purple-950 text-butter 
                                            shadow-lg shadow-purple-950/20
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl cursor-pointer
                                            hover:shadow-2xl hover:shadow-purple-950 hover:rounded-full 
                                            transition-all duration-300 ease-out'>
                                        <i className='fa-solid fa-paper-plane mr-2'></i>
                                        Publish
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
