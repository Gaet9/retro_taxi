import { useEffect, useState } from "react";
import { fetchBlogById } from "../api/blogs";
import { Header } from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "@/components/Footer";

export const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlogs] = useState(null);

    useEffect(() => {
        fetchBlogById(id)
            .then((data) => setBlogs(data.data))
            .catch((err) => console.error("Failed to fetch blogs:", err));
    }, [id]);

    if (!blog) {
        return (
            <div className='min-h-screen bg-butter racing-font'>
                <Navigation color='text-purple-950' />
                <Header color='text-purple-950'>Retro Taxi</Header>
                <div className='flex justify-center items-center min-h-96'>
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl mb-4'>
                            <i className='fa-solid fa-newspaper text-2xl text-purple-600'></i>
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
                <Footer />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-butter racing-font'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>{blog.title}</Header>

            {/* Main Content Container */}
            <div className='container mx-auto px-6 py-8'>
                <div className='max-w-6xl mx-auto'>
                    {/* Close Button - Positioned above dates */}
                    <div className='flex justify-end mb-4'>
                        <Link
                            to='/blogs'
                            className='inline-flex items-center py-1 px-5 bg-red-500 text-butter
                                        rounded-bl-2xl rounded-tr-2xl rounded-br-3xl backdrop-blur-sm shadow-lg
                                        text-xs sm:text-sm md:text-md
                                        hover:bg-red-600 transform hover:scale-110 hover:rounded-full
                                        transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-arrow-left mr-3'></i>
                            Back to blogs
                        </Link>
                    </div>
                    {/* Info Bar - Between Title and Content */}
                    <div
                        className='flex flex-row justify-center bg-butter 
                                    rounded-2xl shadow-lg shadow-purple-950/20 
                                    text-[9px] sm:text-sm md:text-md
                                    mb-8 p-4'>
                        <div className='flex flex-wrap justify-center gap-4'>
                            <div
                                className='inline-flex items-center 
                                px-4 py-2 bg-purple-950 text-butter 
                                text-[9px] sm:text-sm md:text-md 
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl shadow-lg'>
                                <i className='fa-solid fa-calendar mr-2'></i>
                                Published: {new Date(blog.created_at).toLocaleDateString()}
                            </div>
                            {blog.last_updated && (
                                <div
                                    className='inline-flex items-center 
                                    px-4 py-2 bg-purple-800 text-butter 
                                    text-[9px] sm:text-sm md:text-md 
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl shadow-lg'>
                                    <i className='fa-solid fa-edit mr-2'></i>
                                    Updated: {new Date(blog.last_updated).toLocaleDateString()}
                                </div>
                            )}
                            {blog.category && (
                                <div
                                    className='inline-flex items-center 
                                    px-4 py-2 bg-purple-800 text-butter 
                                    text-[9px] sm:text-sm md:text-md 
                                    rounded-bl-2xl rounded-tr-2xl rounded-br-3xl shadow-lg'>
                                    <i className='fa-solid fa-tag mr-2'></i>
                                    {blog.category}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Blog Content Card */}
                    <div className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 overflow-hidden'>
                        <div className='p-8'>
                            <div className='prose prose-lg max-w-none'>
                                <div className='text-purple-950 leading-relaxed space-y-6 content-text'>
                                    {(() => {
                                        // Convert JSON data to readable plain text
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

                                        const readableText = jsonToReadableText(blog.content);

                                        // Split by double line breaks for sections and render
                                        return readableText.split("\n\n").map(
                                            (section, idx) =>
                                                section.trim() && (
                                                    <div key={idx} className='content-text mb-6'>
                                                        {section.split("\n").map((line, lineIdx) => {
                                                            if (line.startsWith("###")) {
                                                                // Render subsection headings as h3
                                                                const text = line.replace(/^###\s*/, "");
                                                                return (
                                                                    <h3
                                                                        key={lineIdx}
                                                                        className='text-lg sm:text-xl md:text-2xl font-semibold text-purple-800 mb-3 mt-4'>
                                                                        {text}
                                                                    </h3>
                                                                );
                                                            } else if (line.startsWith("# ")) {
                                                                // Render main section headings as h1
                                                                const text = line.replace(/^#\s*/, "");
                                                                return (
                                                                    <h1
                                                                        key={lineIdx}
                                                                        className='text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 mb-6 mt-8'>
                                                                        {text}
                                                                    </h1>
                                                                );
                                                            } else if (line.startsWith("•")) {
                                                                // Render list items with HTML support for links
                                                                const text = line.replace(/^•\s*/, "");
                                                                return (
                                                                    <li
                                                                        key={lineIdx}
                                                                        className='ml-6 mb-2 list-disc text-sm sm:text-base md:text-lg'>
                                                                        <span dangerouslySetInnerHTML={{ __html: text }} />
                                                                    </li>
                                                                );
                                                            } else if (line.trim()) {
                                                                // Render regular text
                                                                return (
                                                                    <p
                                                                        key={lineIdx}
                                                                        className='mb-3 leading-relaxed text-sm sm:text-base md:text-lg'>
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
                    </div>

                    {/* Sources Section */}
                    {blog.sources && (
                        <div className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 overflow-hidden mt-8'>
                            <div className='p-8'>
                                <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 mb-6'>
                                    <i className='fa-solid fa-link mr-3'></i>
                                    Sources
                                </h2>
                                <div className='prose prose-lg max-w-none'>
                                    <div className='text-purple-950 leading-relaxed space-y-4'>
                                        {(() => {
                                            // Handle different sources data types
                                            let sourcesArray = [];

                                            if (Array.isArray(blog.sources)) {
                                                sourcesArray = blog.sources;
                                            } else if (typeof blog.sources === "string") {
                                                // If sources is a string, try to parse it as JSON
                                                try {
                                                    const parsed = JSON.parse(blog.sources);
                                                    // Check if the parsed result is still a string (double-encoded)
                                                    if (typeof parsed === "string") {
                                                        sourcesArray = JSON.parse(parsed);
                                                    } else if (Array.isArray(parsed)) {
                                                        sourcesArray = parsed;
                                                    } else {
                                                        sourcesArray = [parsed];
                                                    }
                                                } catch {
                                                    // If JSON parsing fails, split by commas
                                                    sourcesArray = blog.sources.split(",").map((s) => s.trim());
                                                }
                                            } else if (blog.sources && typeof blog.sources === "object") {
                                                // If it's an object, convert to array
                                                sourcesArray = Object.values(blog.sources);
                                            }

                                            return sourcesArray
                                                .flatMap((source, idx) => {
                                                    // Handle comma-separated sources
                                                    if (typeof source === "string" && source.includes(",")) {
                                                        return source.split(",").map((s, i) => ({ source: s.trim(), key: `${idx}-${i}` }));
                                                    }
                                                    return [{ source, key: idx }];
                                                })
                                                .map(({ source, key }) => {
                                                    // Handle different source formats
                                                    if (typeof source === "string") {
                                                        // Check if it's an HTML anchor tag (from Perplexity)
                                                        if (source.includes("<a href=")) {
                                                            const linkMatch = source.match(/<a\s+href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/);
                                                            if (linkMatch) {
                                                                const url = linkMatch[1];
                                                                const text = linkMatch[2];
                                                                return (
                                                                    <li
                                                                        key={key}
                                                                        className='ml-6 mb-2 list-disc text-sm sm:text-base md:text-lg'>
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
                                                                        className='ml-6 mb-2 list-disc text-sm sm:text-base md:text-lg'>
                                                                        <a
                                                                            href={url}
                                                                            target='_blank'
                                                                            rel='noopener noreferrer'
                                                                            className='text-blue-600 hover:text-blue-800 underline'>
                                                                            {text || url}
                                                                        </a>
                                                                    </li>
                                                                );
                                                            } else {
                                                                return (
                                                                    <li
                                                                        key={key}
                                                                        className='ml-6 mb-2 list-disc text-sm sm:text-base md:text-lg'>
                                                                        <span className='underline'>{source}</span>
                                                                    </li>
                                                                );
                                                            }
                                                        } else {
                                                            return (
                                                                <li
                                                                    key={key}
                                                                    className='ml-6 mb-2 list-disc text-sm sm:text-base md:text-lg'>
                                                                    <span className='underline'>{source}</span>
                                                                </li>
                                                            );
                                                        }
                                                    } else if (typeof source === "object" && source !== null) {
                                                        // Handle object format with title and url
                                                        return (
                                                            <li key={key} className='ml-6 mb-2 list-disc text-sm sm:text-base md:text-lg'>
                                                                <a
                                                                    href={source.url}
                                                                    target='_blank'
                                                                    rel='noopener noreferrer'
                                                                    className='text-blue-600 hover:text-blue-800 underline'>
                                                                    {source.title || source.url}
                                                                </a>
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                });
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Back to Blogs Button */}
                    <div className='text-center mt-8'>
                        <Link
                            to='/blogs'
                            className='inline-flex items-center px-8 py-4 bg-red-500 text-butter text-sm sm:text-base md:text-lg
                                rounded-bl-2xl rounded-tr-2xl rounded-br-3xl 
                                shadow-lg shadow-purple-950/20 hover:shadow-2xl hover:shadow-purple-950 hover:bg-red-600
                                hover:rounded-full transition-all duration-300 ease-out'>
                            <i className='fa-solid fa-arrow-left mr-3'></i>
                            Back to All Blogs
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
