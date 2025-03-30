import moment from "moment"
import { FormEvent, useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { creatAvatarLink } from "../helper"
import socket, { get_token } from "../socket/socket"
import {
    Group,
    GroupAppState,
    GroupChat,
    GroupHomeChat,
    PropsWithChildrenAndAvatar,
} from "../types"

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

function SideBarGroupListElm(appState: GroupAppState) {
    const [chats, setChats] = useState<GroupHomeChat[]>([])

    const home_group = () => {
        const payload = {
            token: get_token(),
        }
        socket.emit("/home/group", payload, (res: any) => {
            console.log("home group:", res)
            setChats(res)
        })
    }

    useEffect(() => {
        home_group()
    }, [appState.newMsgGroups])

    return (
        <div>
            {chats.map((chat, index) => {
                socket.emit(
                    "/group/attach-group",
                    { token: get_token(), group: chat.name },
                    (res: any) => {
                        console.log(res)
                    },
                )
                const group: Group = {
                    name: chat.name,
                    id: chat.id,
                }

                return (
                    <div key={index}>
                        <Link to='/app/group' state={{ group: group, needReload: true }}>
                            {ContactElm(
                                `${chat.name}`,
                                creatAvatarLink(group.name),
                                chat.message,
                                appState.newMsgGroups.includes(group.name),
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
    const logout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("email")
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
                <Link to='/search/group'>
                    <img src='/search.png' alt='search' />
                </Link>
            </button>
            <button onClick={logout}>
                <Link to='/login'>
                    <img src='/logout.png' alt='logout' />
                </Link>
            </button>
        </div>
    )
}
function SideBarElm(appState: GroupAppState) {
    return (
        <div className='w-96 bg-white border-r border-gray-300 flex flex-col'>
            <SideBarHeaderElm />

            <div className='w-full flex flex-row'>
                {SideBarNavElm()}
                <div className='overflow-y-auto w-full h-screen p-3 mb-9 pb-20'>
                    <button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 text-sm font-medium text-gray-700 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 hover:text-white w-full'>
                        <Link
                            to='/create-group'
                            className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 w-full'>
                            New Group
                        </Link>
                    </button>

                    {SideBarGroupListElm(appState)}
                </div>
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

function ChatAreaElm(appState: GroupAppState) {
    const { state } = useLocation()
    const group: Group | null = state?.group

    if (group && group?.name != appState.curGroup) {
        appState.setCurGroup(group?.name)
        appState.setNewMsgGroups((olds) => olds.filter((g) => g != group.name))
    }

    const [messages, setMessages] = useState<GroupChat[]>([])
    const [message, setMessage] = useState("")
    const sendBtnRef = useRef<null | HTMLButtonElement>(null)

    const sendMessage = (e: FormEvent) => {
        e.preventDefault()

        const payload = {
            token: get_token(),
            group: group?.name,
            message: message,
        }

        console.log("send message:", payload)

        socket.emit("/group/send-message", payload, (res: GroupChat | string) => {
            console.log("send message:", res)
            switch (typeof res) {
                case "string":
                    break
                case "object":
                    setMessage("")
                    break
            }
        })
    }

    const listGroupOldMessages = () => {
        const payload = {
            token: get_token(),
            group: group?.name,
        }
        if (group)
            socket.emit("/group/get-messages", payload, (res: GroupChat[]) => {
                console.log("old messages:", res)
                setMessages(res)
            })
    }

    const chatAreaRef = useRef<null | HTMLDivElement>(null)
    chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight)

    if (state?.needReload) {
        state.needReload = false
        listGroupOldMessages()
    }

    useEffect(() => {
        listGroupOldMessages()
    }, [])

    useEffect(() => {
        socket.on("/group/send-message", (msg: GroupChat) => {
            console.log("loaded messages:", messages)
            setMessages((olds) => [...olds, msg])

            if (appState.curGroup != msg.receiver.name)
                appState.setNewMsgGroups((olds) => [...olds, msg.receiver.name])

            chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight)

            console.log("/group/chat:", msg)
        })

        chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight)

        return () => {
            socket.removeAllListeners("/group/send-message")
        }
    }, [messages])

    useEffect(() => {
        const payload = { token: get_token(), group: group?.name }
        socket.emit("/group/attach-group", payload, (res: string) => {
            if (res == "ok") {
                console.log(`attach to ${group?.name} is successfull.`)
            }
        })
    }, [])

    return (
        <div className='flex flex-col flex-grow'>
            {/* Chat Header */}
            <header className='bg-white border-b-2 p-4 text-gray-700 '>
                <h1 className='text-2xl font-semibold'>
                    {(group && `${group.name}`) || "Wellcome"}
                </h1>
            </header>

            {/* Chat Messages */}
            <div className='h-screen overflow-y-auto p-4 pb-36' ref={chatAreaRef}>
                {messages?.map((msg) => {
                    if (msg.sender.email == appState.loggedInEmail) {
                        const datetime = moment(msg.timestamp)

                        return (
                            <OutgoingMessageElm
                                key={msg.id}
                                avatar={creatAvatarLink(msg.sender.email)}
                                date={datetime.format("MMM D")}
                                time={datetime.format("HH:mm")}>
                                {msg.message}
                            </OutgoingMessageElm>
                        )
                    } else {
                        const datetime = moment(msg.timestamp)
                        return (
                            <IncomingMessageElm
                                key={msg.id}
                                avatar={creatAvatarLink(msg.sender.email)}
                                date={datetime.format("MMM D")}
                                time={datetime.format("HH:mm")}>
                                {msg.message}
                            </IncomingMessageElm>
                        )
                    }
                })}
            </div>

            {/* Chat Input */}
            <footer className='bg-white border-t border-gray-300 p-4'>
                <form className='flex items-center' action='#' onSubmit={sendMessage}>
                    <input
                        onChange={(e) => setMessage(e.target.value)}
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

function GroupPageElm() {
    const { state } = useLocation()
    const navigate = useNavigate()
    if (state && state?.email) localStorage.setItem("email", state?.email)

    const [loggedInEmail, setLoggedInEmail] = useState<string>("")
    const [curUser, setCurUser] = useState<string | null>(null)
    const [curGroup, setCurGroup] = useState<string | null>(null)
    const [chatAreaOpened, setChatAreaOpened] = useState(false)
    const [searchAreaOpended, setSearchAreaOpened] = useState(false)
    const [newMsgUsers, setNewMsgUsers] = useState<string[]>([])
    const [newMsgGroups, setNewMsgGroups] = useState<string[]>([])

    const appState: GroupAppState = {
        loggedInEmail,
        curUser,
        curGroup,
        chatAreaOpened,
        searchAreaOpended,
        newMsgUsers,
        newMsgGroups,
        setLoggedInEmail,
        setCurUser,
        setCurGroup,
        setChatAreaOpened,
        setSearchAreaOpened,
        setNewMsgUsers,
        setNewMsgGroups,
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

export default GroupPageElm
