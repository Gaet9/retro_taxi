import { useState, useEffect } from "react";

const Notification = ({ message, type, visible, onClose }) => {
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => {
            onClose();
        }, 2000);
        return () => clearTimeout(timer);
    }, [visible, onClose]);

    const base =
        "racing-font fixed bottom-5 right-5 px-5 py-3 border-l-8 rounded-bl-2xl rounded-tr-2xl rounded-br-3xl text-butter text-3xl shadow-xl z-[99999] transition-transform duration-500 ease-in-out";
    const colors = {
        success: "bg-gray-600 border-green-600 shadow-green-600",
        error: "bg-gray-600 border-red-600 shadow-red-600",
        info: "bg-gray-600 border-blue-600 shadow-blue-600",
        warning: "bg-gray-600 border-orange-600 shadow-orange-600",
    };

    const slideIn = visible ? "translate-x-0" : "translate-x-[150%]";

    return <div className={`${base} ${colors[type]} transform ${slideIn}`}>{message}</div>;
};

export const useNotification = () => {
    const [state, setState] = useState({
        visible: false,
        message: "",
        type: "",
    });

    const showNotification = (message, type) => setState({ visible: true, message, type });
    const hideNotification = () => setState((s) => ({ ...s, visible: false }));

    const NotificationElement = (
        <Notification visible={state.visible} message={state.message} type={state.type} onClose={hideNotification} />
    );

    return [NotificationElement, showNotification];
};

export default Notification;
