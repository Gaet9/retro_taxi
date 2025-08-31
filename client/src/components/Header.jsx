import "../index.css";

export const Header = ({ children, color = "text-butter" }) => {
    return (
        <div
            className={`flex justify-self-center w-2/3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ${color}`}
            style={{
                WebkitTextStroke: "2px #3b0764",
                textShadow: "none",
            }}>
            {children}
        </div>
    );
};
