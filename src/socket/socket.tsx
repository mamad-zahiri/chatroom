import { io } from "socket.io-client"

const get_token = () => localStorage.getItem("access_token")

let socket = io("localhost:80/", {
    reconnectionDelayMax: 10000,
    auth: {
        token: get_token(),
    },
    transports: ["websocket"],
    forceNew: true,
    upgrade: false,
})

export default socket
export { get_token }
