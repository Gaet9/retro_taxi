import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { fetchBlogById, updateBlog } from "../api/blogs";
import { useNotification } from "../components/Notification";

export const UpdateBlog = () => {
    const { id } = useParams();
    const [blog, setBlogs] = useState(null);

    // Notification component
    const [NotificationElement, showNotification] = useNotification();

    useEffect(() => {
        fetchBlogById(id)
            .then((data) => setBlogs(data.data))
            .catch((err) => console.error("Failed to fetch blog:", err));
    }, [id]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [image_url, setImage_url] = useState("");
    const [user_id, setUser_id] = useState("");

    useEffect(() => {
        if (blog) {
            setTitle(blog.title || "");
            setContent(blog.content || "");
            setCategory(blog.category || "");
            setModel(blog.model || "");
            setBrand(blog.brand || "");
            setImage_url(blog.image_url || "");
            setUser_id(blog.user_id || "");
        }
    }, [blog]);

    const navigate = useNavigate();

    const handleSubmit = async (e, statusToSet) => {
        e.preventDefault();

        const updatedBlog = {
            title,
            content,
            category,
            model,
            brand,
            image_url,
            user_id,
            status: statusToSet,
            last_updated: new Date().toISOString(),
        };
        console.log("Submitting updated blog:", updatedBlog);
        try {
            await updateBlog(id, updatedBlog);
            showNotification("Blog updated!", "success");
            setTimeout(() => navigate("/admin-dash"), 2000);
        } catch (err) {
            console.error("Error updating blog:", err);
            showNotification("Failed to update blog", "error");
        }
    };

    if (!blog) {
        return (
            <div className='min-h-screen bg-butter racing-font'>
                <Navigation color='text-purple-950' />
                <Header color='text-purple-950'>Update Blog</Header>
                <div className='flex justify-center items-center min-h-96'>
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-purple-950 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl mb-4'>
                            <i className='fa-solid fa-edit text-2xl text-purple-600'></i>
                        </div>
                        <h3 className='text-base sm:text-lg md:text-xl font-semibold text-purple-900 mb-2'>Blog not found</h3>
                        <p className='text-sm sm:text-base md:text-lg text-purple-600 mb-4'>Sorry, this blog doesn't exist</p>
                        <Link
                            to='/blogs'
                            className='inline-flex items-center px-6 py-3 bg-purple-950 text-butter rounded-xl
                                hover:bg-purple-800 transform hover:scale-105 transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-arrow-left mr-2'></i>
                            Back to Blogs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-butter racing-font'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Update Blog</Header>

            {NotificationElement}

            {/* Main Content Container */}
            <div className='container mx-auto px-6 py-8'>
                <div className='max-w-6xl mx-auto'>
                    {/* Blog Header Card with Hero Image */}
                    <div className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 mb-8 overflow-hidden'>
                        {/* Hero Image Section */}
                        <div className='relative h-48 sm:h-64 md:h-80 overflow-hidden'>
                            <div className='w-full h-full bg-cover bg-center' style={{ backgroundImage: `url(${blog.image_url})` }} />

                            {/* Top Info Bar */}
                            <div className='absolute top-0 left-0 right-0 p-6'>
                                <div className='flex justify-between items-start'>
                                    {/* Brand and Model */}
                                    <div className='flex flex-col space-y-2'>
                                        <div
                                            className='inline-flex items-center px-4 sm:px-6 md:px-10 py-2 bg-purple-950/90 text-butter text-sm sm:text-base md:text-xl  
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl
                                            backdrop-blur-sm shadow-lg'>
                                            {blog.brand || "Brand"}
                                        </div>
                                        {blog.model && (
                                            <div
                                                className='inline-flex items-center px-4 sm:px-6 md:px-10 py-2 bg-purple-800/80 text-butter text-sm sm:text-base md:text-xl 
                                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl backdrop-blur-sm shadow-lg'>
                                                {blog.model}
                                            </div>
                                        )}
                                    </div>

                                    {/* Close Button */}
                                    <Link
                                        to='/admin-dash'
                                        className='inline-flex items-center justify-center w-10 h-10 bg-red-500/90 text-butter
                                            rounded-bl-2xl rounded-tr-2xl rounded-br-3xl backdrop-blur-sm shadow-lg hover:bg-red-600 transform hover:scale-110 
                                            transition-all duration-300 ease-out'>
                                        <i className='fa-solid fa-times text-lg'></i>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className='p-4 sm:p-6'>
                            <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-950 leading-tight'>
                                Update: {blog.title}
                            </h1>
                        </div>
                    </div>

                    {/* Info Bar - Between Title and Form */}
                    <div className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 mb-8 p-4'>
                        <div className='flex flex-wrap justify-center gap-4'>
                            <div
                                className='inline-flex items-center px-4 py-2 bg-purple-950 text-butter text-sm sm:text-base md:text-lg 
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl shadow-lg'>
                                <i className='fa-solid fa-calendar mr-2'></i>
                                Created: {new Date(blog.created_at || Date.now()).toLocaleDateString()}
                            </div>
                            {blog.last_updated && (
                                <div
                                    className='inline-flex items-center px-4 py-2 bg-purple-800 text-butter text-sm sm:text-base md:text-lg 
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl shadow-lg'>
                                    <i className='fa-solid fa-edit mr-2'></i>
                                    Last Updated: {new Date(blog.last_updated).toLocaleDateString()}
                                </div>
                            )}
                            {blog.category && (
                                <div
                                    className='inline-flex items-center px-4 py-2 bg-purple-800 text-butter text-sm sm:text-base md:text-lg 
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl shadow-lg'>
                                    <i className='fa-solid fa-tag mr-2'></i>
                                    {blog.category}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Update Form Card */}
                    <div className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 overflow-hidden'>
                        <div className='p-4 sm:p-6 md:p-8'>
                            {/* Top Fields Row - Single Line */}
                            <div className='flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-butter rounded-xl'>
                                <div className='flex-1'>
                                    <label
                                        htmlFor='title'
                                        className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-1'>
                                        <i className='fa-solid fa-heading mr-1'></i>Title
                                    </label>
                                    <textarea
                                        id='title'
                                        type='text'
                                        placeholder='Title'
                                        maxLength={50}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className='w-full p-2 text-xs sm:text-sm md:text-base text-purple-900 bg-butter border border-purple-200 
                                            rounded-lg resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                            transition-all duration-200 ease-out readable-font'
                                        rows={2}
                                    />
                                    <div className='text-xs text-purple-600 mt-1 text-right'>{(title || "").length}/50</div>
                                </div>

                                <div className='flex-1'>
                                    <label
                                        htmlFor='brand'
                                        className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-1'>
                                        <i className='fa-solid fa-tag mr-1'></i>Brand
                                    </label>
                                    <textarea
                                        id='brand'
                                        type='text'
                                        placeholder='Brand'
                                        maxLength={30}
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className='w-full p-2 text-xs sm:text-sm md:text-base text-purple-900 bg-butter border border-purple-200 
                                            rounded-lg resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                            transition-all duration-200 ease-out readable-font'
                                        rows={2}
                                    />
                                    <div className='text-xs text-purple-600 mt-1 text-right'>{(brand || "").length}/30</div>
                                </div>

                                <div className='flex-1'>
                                    <label
                                        htmlFor='model'
                                        className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-1'>
                                        <i className='fa-solid fa-car mr-1'></i>Model
                                    </label>
                                    <textarea
                                        id='model'
                                        type='text'
                                        placeholder='Model'
                                        maxLength={30}
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className='w-full p-2 text-xs sm:text-sm md:text-base text-purple-900 bg-butter border border-purple-200 
                                            rounded-lg resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                            transition-all duration-200 ease-out readable-font'
                                        rows={2}
                                    />
                                    <div className='text-xs text-purple-600 mt-1 text-right'>{(model || "").length}/30</div>
                                </div>

                                <div className='flex-1'>
                                    <label
                                        htmlFor='category'
                                        className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-1'>
                                        <i className='fa-solid fa-folder mr-1'></i>Category
                                    </label>
                                    <textarea
                                        id='category'
                                        type='text'
                                        placeholder='Category'
                                        maxLength={30}
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className='w-full p-2 text-xs sm:text-sm md:text-base text-purple-900 bg-butter border border-purple-200 
                                            rounded-lg resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                            transition-all duration-200 ease-out readable-font'
                                        rows={2}
                                    />
                                    <div className='text-xs text-purple-600 mt-1 text-right'>{(category || "").length}/30</div>
                                </div>

                                <div className='flex-1'>
                                    <label
                                        htmlFor='user_id'
                                        className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-1'>
                                        <i className='fa-solid fa-user mr-1'></i>User ID
                                    </label>
                                    <textarea
                                        id='user_id'
                                        type='text'
                                        placeholder='Your user_ID'
                                        maxLength={30}
                                        value={user_id}
                                        onChange={(e) => setUser_id(e.target.value)}
                                        className='w-full p-2 text-xs sm:text-sm md:text-base text-purple-900 bg-butter border border-purple-200 
                                            rounded-lg resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                            transition-all duration-200 ease-out readable-font'
                                        rows={2}
                                    />
                                    <div className='text-xs text-purple-600 mt-1 text-right'>{(user_id || "").length}/30</div>
                                </div>

                                <div className='flex-1'>
                                    <label
                                        htmlFor='image_url'
                                        className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-1'>
                                        <i className='fa-solid fa-image mr-1'></i>Image URL
                                    </label>
                                    <input
                                        value={image_url}
                                        onChange={(e) => setImage_url(e.target.value)}
                                        type='url'
                                        id='image_url'
                                        placeholder='image.jpg'
                                        className='w-full p-2 text-xs sm:text-sm md:text-base text-purple-900 bg-butter border border-purple-200 
                                            rounded-lg cursor-text focus:border-purple-500 focus:ring-1 focus:ring-purple-200 
                                            transition-all duration-200 ease-out'
                                    />
                                    <div className='text-xs text-purple-600 mt-1'>
                                        <i className='fa-solid fa-link mr-1'></i>
                                        Enter your S3 image URL
                                    </div>
                                </div>
                            </div>

                            {/* Wide Content Section - Full Screen Width */}
                            <div className='w-full'>
                                <label htmlFor='content' className='block text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                    <i className='fa-solid fa-file-text mr-2'></i>
                                    Blog Content
                                </label>

                                {/* Content Input Field */}
                                <textarea
                                    id='content'
                                    type='text'
                                    placeholder='Content (JSON format)'
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className='w-full h-64 sm:h-80 md:h-96 p-4 text-sm sm:text-base md:text-lg text-purple-900 bg-butter border-2 border-purple-200 
                                        rounded-xl resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                                        transition-all duration-200 ease-out content-text'
                                />
                                <div className='text-xs text-purple-600 mt-2'>
                                    <i className='fa-solid fa-info-circle mr-1'></i>
                                    Content should be in JSON format. The preview below shows how it will appear when published.
                                </div>
                            </div>

                            {/* Content Preview - Shows formatted content */}
                            {content && (
                                <div className='mb-4 p-4 bg-white/60 rounded-xl border border-purple-200'>
                                    <h4 className='text-xs sm:text-sm md:text-base font-medium text-purple-800 mb-2'>
                                        <i className='fa-solid fa-eye mr-1'></i>Content Preview
                                    </h4>
                                    <div className='max-h-64 sm:max-h-80 overflow-y-auto prose prose-sm max-w-none'>
                                        <div className='text-purple-900 leading-relaxed space-y-3 content-text'>
                                            {(() => {
                                                // Convert JSON data to readable plain text (same function as SingleBlog.jsx)
                                                const jsonToReadableText = (data) => {
                                                    try {
                                                        // If it's a string, try to parse it as JSON
                                                        const jsonData = typeof data === "string" ? JSON.parse(data) : data;

                                                        let result = "";

                                                        // Process each section
                                                        Object.entries(jsonData).forEach(([sectionName, sectionContent]) => {
                                                            // Add section title
                                                            result += `\n\n# ${sectionName}\n\n`;

                                                            if (Array.isArray(sectionContent)) {
                                                                // Handle array content (like Market Insights, Global Hotspots, Sources)
                                                                sectionContent.forEach((item) => {
                                                                    if (typeof item === "string") {
                                                                        // Special handling for Sources section with HTML links
                                                                        if (sectionName === "Sources" && item.includes("<a href=")) {
                                                                            // Extract the link text and URL from HTML
                                                                            const linkMatch = item.match(
                                                                                /<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/
                                                                            );
                                                                            if (linkMatch) {
                                                                                const url = linkMatch[1];
                                                                                const text = linkMatch[2];
                                                                                result += `• <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>\n`;
                                                                            } else {
                                                                                result += `• ${item}\n`;
                                                                            }
                                                                        } else {
                                                                            // Check if it's a source with URL (for non-HTML sources)
                                                                            if (item.includes("http")) {
                                                                                const urlMatch = item.match(/(https?:\/\/[^\s)]+)/);
                                                                                if (urlMatch) {
                                                                                    const text = item
                                                                                        .replace(urlMatch[0], "")
                                                                                        .replace(/[()]/g, "")
                                                                                        .trim();
                                                                                    const url = urlMatch[0];
                                                                                    result += `• ${text} (${url})\n`;
                                                                                } else {
                                                                                    result += `• ${item}\n`;
                                                                                }
                                                                            } else {
                                                                                result += `• ${item}\n`;
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            } else if (typeof sectionContent === "object" && sectionContent !== null) {
                                                                // Handle nested objects (like Regional Breakdown)
                                                                Object.entries(sectionContent).forEach(([subRegion, items]) => {
                                                                    result += `### ${subRegion}\n\n`;

                                                                    if (Array.isArray(items)) {
                                                                        items.forEach((item) => {
                                                                            if (typeof item === "string") {
                                                                                // Check if it's a news item with date
                                                                                if (item.includes("—")) {
                                                                                    const parts = item.split("—");
                                                                                    if (parts.length === 2) {
                                                                                        const headline = parts[0].trim();
                                                                                        const date = parts[1].trim();
                                                                                        result += `• ${headline} : ${date}\n`;
                                                                                    } else {
                                                                                        result += `• ${item}\n`;
                                                                                    }
                                                                                } else {
                                                                                    result += `• ${item}\n`;
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                    result += "\n";
                                                                });
                                                            } else if (typeof sectionContent === "string") {
                                                                // Handle plain string content (like Global News Overview)
                                                                result += `${sectionContent}\n`;
                                                            }

                                                            result += "\n";
                                                        });

                                                        return result.trim();
                                                    } catch (error) {
                                                        console.error("Error parsing JSON data:", error);
                                                        // Fallback: return the original content as plain text
                                                        return typeof data === "string" ? data : JSON.stringify(data, null, 2);
                                                    }
                                                };

                                                const readableText = jsonToReadableText(content);

                                                // Split by double line breaks for sections and render
                                                return readableText.split("\n\n").map(
                                                    (section, idx) =>
                                                        section.trim() && (
                                                            <div key={idx} className='content-text mb-4'>
                                                                {section.split("\n").map((line, lineIdx) => {
                                                                    if (line.startsWith("###")) {
                                                                        // Render subsection headings as h3
                                                                        const text = line.replace(/^###\s*/, "");
                                                                        return (
                                                                            <h3
                                                                                key={lineIdx}
                                                                                className='text-sm sm:text-base md:text-lg font-semibold text-purple-800 mb-2 mt-3'>
                                                                                {text}
                                                                            </h3>
                                                                        );
                                                                    } else if (line.startsWith("# ")) {
                                                                        // Render main section headings as h1
                                                                        const text = line.replace(/^#\s*/, "");
                                                                        return (
                                                                            <h1
                                                                                key={lineIdx}
                                                                                className='text-lg sm:text-xl md:text-2xl font-bold text-purple-900 mb-3 mt-4'>
                                                                                {text}
                                                                            </h1>
                                                                        );
                                                                    } else if (line.startsWith("•")) {
                                                                        // Render list items with HTML support for links
                                                                        const text = line.replace(/^•\s*/, "");
                                                                        return (
                                                                            <li
                                                                                key={lineIdx}
                                                                                className='ml-4 mb-1 list-disc text-xs sm:text-sm md:text-base'>
                                                                                <span dangerouslySetInnerHTML={{ __html: text }} />
                                                                            </li>
                                                                        );
                                                                    } else if (line.trim()) {
                                                                        // Render regular text
                                                                        return (
                                                                            <p
                                                                                key={lineIdx}
                                                                                className='mb-2 leading-relaxed text-xs sm:text-sm md:text-base'>
                                                                                {line}
                                                                            </p>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })}
                                                            </div>
                                                        )
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row justify-end mt-8 gap-4'>
                                <button
                                    type='submit'
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
                                    Save & Publish
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back to Admin Dashboard Button */}
                    <div className='text-center mt-8'>
                        <Link
                            to='/admin-dash'
                            className='inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-purple-800 text-butter text-sm sm:text-base md:text-lg
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                shadow-lg shadow-purple-950/20 hover:shadow-2xl hover:shadow-purple-950
                                hover:rounded-full transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-arrow-left mr-3'></i>
                            Back to Admin Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
