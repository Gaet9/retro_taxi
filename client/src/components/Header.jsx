import "../index.css";

export const Header = ({ children, color = "text-butter" }) => {
    return (
        <div
            className={`flex w-2/3 -mt-5 justify-self-center text-8xl ${color}`}
            style={{
                WebkitTextStroke: "2px #3b0764",
                textShadow: "none",
            }}>
            {children}
        </div>
    );
};
