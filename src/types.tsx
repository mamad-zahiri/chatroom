import { Dispatch, PropsWithChildren, SetStateAction } from "react"

export interface User {
    first_name: string
    last_name: string
    email: string
    id: string
}

export interface PairToken {
    access_token: string
    refresh_token: string
}

export interface UserSignup {
    first_name: string
    last_name: string
    email: string
    password: string
}

export interface AppState {
    loggedInEmail: string
    curUser: string | null
    curGroup: string | null
    chatAreaOpened: boolean
    searchAreaOpended: boolean
    newMsgUsers: string[]
    setLoggedInEmail: Dispatch<SetStateAction<string>>
    setCurUser: Dispatch<SetStateAction<string | null>>
    setCurGroup: Dispatch<SetStateAction<string | null>>
    setChatAreaOpened: Dispatch<SetStateAction<boolean>>
    setSearchAreaOpened: Dispatch<SetStateAction<boolean>>
    setNewMsgUsers: Dispatch<SetStateAction<string[]>>
}

export interface Chat {
    id: string
    sender: string
    receiver: string
    message: string
    seen: boolean
    timestamp: string
    file: string
}

export interface GroupChat {
    id: string
    sender: User
    receiver: {
        id: string
        name: string
    }
    message: string
    seen: boolean
    timestamp: string
    file: string
}

export interface HomeChat extends Chat {
    first_name: string
    last_name: string
}

export interface GroupHomeChat {
    id: string
    name: string
    message: string
}

export interface PropsWithChildrenAndAvatar extends PropsWithChildren {
    avatar: string
    date: string
    time: string
}

export interface Group {
    id: string
    name: string
}

export interface GroupAppState {
    loggedInEmail: string
    curUser: string | null
    curGroup: string | null
    chatAreaOpened: boolean
    searchAreaOpended: boolean
    newMsgUsers: string[]
    newMsgGroups: string[]
    setLoggedInEmail: Dispatch<SetStateAction<string>>
    setCurUser: Dispatch<SetStateAction<string | null>>
    setCurGroup: Dispatch<SetStateAction<string | null>>
    setChatAreaOpened: Dispatch<SetStateAction<boolean>>
    setSearchAreaOpened: Dispatch<SetStateAction<boolean>>
    setNewMsgUsers: Dispatch<SetStateAction<string[]>>
    setNewMsgGroups: Dispatch<SetStateAction<string[]>>
}
