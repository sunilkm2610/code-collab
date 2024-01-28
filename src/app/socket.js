import { io } from "socket.io-client";

export const initSocket = async () => {
//   console.log('url',process.env.API_URL);
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io('https://code-collab-api-two.vercel.app', options);
};
