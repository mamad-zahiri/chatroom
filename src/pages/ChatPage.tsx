import moment from "moment"
import { FormEvent, useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { creatAvatarLink } from "../helper"
import socket, { get_token } from "../socket/socket"
import { AppState, Chat, HomeChat, PropsWithChildrenAndAvatar, User } from "../types"

function ContactElm(
    name: string,
    avatarLink: string,
    lastMessage: string,
    hasNewMsg: boolean,
) {
    return (
        <div className='flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
            <div className='w-12 h-12 bg-gray-300 rounded-full mr-3'>
                <img
                    src={avatarLink}
                    alt='User Avatar'
                    className='w-12 h-12 rounded-full'
                />
            </div>
            <div className='flex-1'>
                <h2 className='text-lg font-semibold relative'>
                    {hasNewMsg && (
                        <div
                            className='h-4 w-4 border-4 border-green-500 rounded-full bg-white absolute top-2 -left-6'
                            id='new_message_dot'></div>
                    )}
                    {name}
                </h2>
                <p className='text-gray-600'>{lastMessage.slice(0, 50)}</p>
            </div>
        </div>
    )
}

function SideBarContactListElm(appState: AppState) {
    const [chats, setChats] = useState<HomeChat[]>([])

    const home = () => {
        console.log("contact list is:")
        const payload = {
            token: get_token(),
        }
        console.log("home payload:", payload)
        socket.emit("/home", payload, (res: any) => {
            console.log("home:", res)
            setChats(res)
        })
    }

    useEffect(() => {
        home()
    }, [appState.newMsgUsers])

    return (
        <div className='overflow-y-auto w-full h-screen p-3 mb-9 pb-20'>
            {chats.map((chat, index) => {
                const user: User = {
                    email: chat.sender,
                    first_name: chat.first_name,
                    last_name: chat.last_name,
                    id: chat.id,
                }
                return (
                    <div key={index}>
                        <Link to='/app' state={{ user: user, needReload: true }}>
                            {ContactElm(
                                `${chat.first_name} ${chat.last_name}`,
                                creatAvatarLink(user.email),
                                chat.message,
                                appState.newMsgUsers.includes(user.email),
                            )}
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}

function SideBarHeaderElm() {
    return (
        <header className='p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white'>
            <h1 className='text-2xl font-semibold'>Chat App</h1>
        </header>
    )
}

function SideBarNavElm() {
    const cleanTokens = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
    }

    return (
        <div className='h-full w-16 bg-slate-600 flex flex-col pt-5 gap-8 [&>button]:mx-4 [&>button]:cursor-pointer'>
            <button>
                <Link to='/app'>
                    <img src='/user.png' alt='user' />
                </Link>
            </button>
            <button>
                <Link to='/app/group'>
                    <img src='/group.png' alt='group' />
                </Link>
            </button>
            <button>
                <Link to='/search'>
                    <img src='/search.png' alt='search' />
                </Link>
            </button>
            <button onClick={cleanTokens}>
                <Link to='/login'>
                    <img src='/logout.png' alt='logout' />
                </Link>
            </button>
        </div>
    )
}
function SideBarElm(appState: AppState) {
    return (
        <div className='w-96 bg-white border-r border-gray-300 flex flex-col'>
            <SideBarHeaderElm />

            <div className='w-full flex flex-row'>
                {SideBarNavElm()}
                {SideBarContactListElm(appState)}
            </div>
        </div>
    )
}

function IncomingMessageElm(props: PropsWithChildrenAndAvatar) {
    return (
        <div className='flex mb-8 cursor-pointer'>
            <div className='w-9 h-9 rounded-full flex items-center justify-center mr-2'>
                <img
                    src={props.avatar}
                    alt='User Avatar'
                    className='w-8 h-8 rounded-full'
                />
            </div>
            <div className='flex flex-col max-w-96 bg-slate-200 rounded-lg p-3'>
                <p className='text-gray-700 w-full break-words'>{props.children}</p>
                <p className='text-xs text-slate-500 relative -bottom-1.5 text-left'>
                    {props.date} &nbsp; {props.time}
                </p>
            </div>
        </div>
    )
}

function OutgoingMessageElm(props: PropsWithChildrenAndAvatar) {
    return (
        <div className='flex justify-end mb-4 cursor-pointer'>
            <div className='flex flex-col max-w-96 bg-sky-200 text-gray-700 rounded-lg p-3'>
                <p className='w-full break-words'>{props.children}</p>
                <p className='text-xs text-slate-500 relative -bottom-1.5 text-right'>
                    {props.date} &nbsp; {props.time}
                </p>
            </div>
            <div className='w-9 h-9 rounded-full flex items-center justify-center ml-2'>
                <img
                    src={props.avatar}
                    alt='My Avatar'
                    className='w-8 h-8 rounded-full'
                />
            </div>
        </div>
    )
}

function ChatAreaElm(appState: AppState) {
    const { state } = useLocation()
    const user: User | null = state?.user

    if (user && user?.email != appState.curUser) {
        appState.setCurUser(user?.email)
    }

    const [messages, setMessages] = useState<Chat[]>([])
    const [message, setMessage] = useState("")
    const sendBtnRef = useRef<null | HTMLButtonElement>(null)

    const handleMsgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const msg = e.target.value
        setMessage(msg)
    }

    const sendMessage = (e: FormEvent) => {
        e.preventDefault()

        const payload = {
            token: get_token(),
            receiver: user?.email,
            message: message,
        }

        console.log("send message:", payload)

        socket.emit("/private/send_message", payload, (res: Chat) => {
            setMessage("")
            setMessages((olds) => [...olds, res])
        })
    }

    const listPrivateOldMessages = () => {
        const payload = {
            token: get_token(),
            with: user?.email,
        }

        socket.emit("/private/list-messages-with", payload, (res: Chat[]) => {
            setMessages(res)
            console.log(res)
        })
    }

    const chatAreaRef = useRef<null | HTMLDivElement>(null)
    chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight)

    if (state?.needReload) {
        state.needReload = false
        listPrivateOldMessages()
    }

    useEffect(() => {
        socket.on("/private/chat", (msg) => {
            if (msg.sender != appState.curUser) {
                appState.setNewMsgUsers((olds) => [...olds, msg.sender])
            } else {
                setMessages((olds) => [...olds, msg])
                chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight)
            }
            console.log("/private/chat:", msg)
        })

        chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight)

        return () => {
            socket.removeAllListeners("/private/chat")
        }
    }, [messages])

    return (
        <div className='flex flex-col flex-grow'>
            {/* Chat Header */}
            <header className='bg-white border-b-2 p-4 text-gray-700 '>
                <h1 className='text-2xl font-semibold'>
                    {(user && `${user.first_name} ${user.last_name}`) || "Wellcome"}
                </h1>
            </header>
            {/* Chat Messages */}
            <div className='h-screen overflow-y-auto p-4 pb-36' ref={chatAreaRef}>
                {messages?.map((msg) => {
                    if (msg.sender == appState.curUser) {
                        const datetime = moment(msg.timestamp)

                        return (
                            <IncomingMessageElm
                                key={msg.id}
                                avatar={creatAvatarLink(msg.sender)}
                                date={datetime.format("MMM D")}
                                time={datetime.format("HH:mm")}>
                                {msg.message}
                            </IncomingMessageElm>
                        )
                    } else {
                        const datetime = moment(msg.timestamp)
                        return (
                            <OutgoingMessageElm
                                key={msg.id}
                                avatar={creatAvatarLink(msg.sender)}
                                date={datetime.format("MMM D")}
                                time={datetime.format("HH:mm")}>
                                {msg.message}
                            </OutgoingMessageElm>
                        )
                    }
                })}
            </div>
            {/* Chat Input */}
            <footer className='bg-white border-t border-gray-300 p-4'>
                <form className='flex items-center' action='#' onSubmit={sendMessage}>
                    <input
                        onChange={handleMsgInput}
                        type='text'
                        placeholder='Type a message...'
                        className='w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500'
                        value={message}
                    />
                    <button
                        className='bg-indigo-600 text-white px-4 py-2 rounded-md ml-2'
                        ref={sendBtnRef}>
                        Send
                    </button>
                </form>
            </footer>
        </div>
    )
}

function ChatPageElm() {
    const { state } = useLocation()
    const navigate = useNavigate()
    if (state && state?.email) localStorage.setItem("email", state?.email)

    const [loggedInEmail, setLoggedInEmail] = useState<string>("")
    const [curUser, setCurUser] = useState<string | null>(null)
    const [curGroup, setCurGroup] = useState<string | null>(null)
    const [chatAreaOpened, setChatAreaOpened] = useState(false)
    const [searchAreaOpended, setSearchAreaOpened] = useState(false)
    const [newMsgUsers, setNewMsgUsers] = useState<string[]>([])

    const appState: AppState = {
        loggedInEmail,
        curUser,
        curGroup,
        chatAreaOpened,
        searchAreaOpended,
        newMsgUsers,
        setLoggedInEmail,
        setCurUser,
        setCurGroup,
        setChatAreaOpened,
        setSearchAreaOpened,
        setNewMsgUsers,
    }

    useEffect(() => {
        setNewMsgUsers((user) => user.filter((user) => user != curUser))
    }, [curUser])

    useEffect(() => {
        const localStorageEamil = localStorage.getItem("email")

        if (!localStorageEamil && !state?.email) {
            navigate("/login")
        } else setLoggedInEmail(localStorageEamil || state?.email)
    }, [])
    return (
        <div className='flex h-screen overflow-hidden flex-row w-full'>
            {SideBarElm(appState)}
            {ChatAreaElm(appState)}
        </div>
    )
}

export default ChatPageElm
export { SideBarContactListElm }
