import { io } from "socket.io-client";
import { useEffect } from "react";

const NotificationListener = () => {
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        // check if there is no user logged in
        if (!currentUserId) return;

        // Connect to the main port only
        const socket = io("http://localhost:5123");

        socket.on("new_notification", (data) => {
            if (String(data.userId) === String(currentUserId)) {
                alert(`${data.title}: ${data.message}`);
            } 
        });

        return () => {
            socket.off("new_notification");
            socket.disconnect();
        };
    }, [currentUserId]);
    
    return null;
};
export default NotificationListener;