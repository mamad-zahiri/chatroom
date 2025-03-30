// import { io } from "socket.io-client"
import socket from "./socket"
const get_token = () => localStorage.getItem("access_token")

// let socket = io("localhost:80/", {
//     reconnectionDelayMax: 10000,
//     auth: {
//         token: get_token(),
//     },
//     transports: ["websocket"],
//     forceNew: true,
//     upgrade: false,
// })

type User = {
    first_name: string
    last_name: string
    email: string
    id: string
}

socket.on("/broadcast/user-disconnect", (data) => {
    console.log("-".repeat(40))
    console.log(`broadcast: ${data}`)
})

const list_users = (success_callback: (users: Array<User>) => any) => {
    socket.emit("/system/list-users", (users: Array<User>) => {
        console.log(users)
        success_callback(users)
    })
}

const search_users = (q: string, success_callback: (users: Array<User>) => any) => {
    console.log(q)
    socket.emit("/system/search-users", { q: q }, (users: Array<User>) => {
        console.log(users)
        success_callback(users)
    })
}

const search_groups = (q: string, success_callback: (users: any) => any) => {
    console.log(q)
    socket.emit("/system/search-groups", { q: q }, (users: any) => {
        console.log(users)
        success_callback(users)
    })
}

const list_online_users = () => {
    socket.emit("/system/list-online-users", (users: Array<User>) => {
        console.log(users)
    })
}

const list_private_old_messages = () => {
    let output: Array<any> = []

    const payload = {
        token: get_token(),
    }

    socket.emit("/private/list-old-messages", payload, (res: any) => {
        // success_callback(res)
        console.log(res)
        output = res
    })
    return output
}

const list_private_new_messages = () => {
    let output: Array<any> = []

    const payload = {
        token: get_token(),
    }

    socket.emit("/private/list-new-messages", payload, (res: any) => {
        console.log(res)
        // success_callback(() => res)
        output = res
    })

    return output
}

const send_message = (to: string, msg: string, success_callback: (res: any) => any) => {
    const payload = {
        token: get_token(),
        receiver: to,
        message: msg,
    }

    socket.emit("/private/send_message", payload, (res: any) => {
        success_callback(res)
        console.log(res)
    })
}

export {
    socket,
    list_online_users,
    list_users,
    list_private_new_messages,
    send_message,
    list_private_old_messages,
    search_users,
    search_groups,
}
