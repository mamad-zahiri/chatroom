import { useLocation, useNavigate } from "react-router-dom"
import socket, { get_token } from "../socket/socket"
import { Group } from "../types"

function JoinPageElm() {
    const naviate = useNavigate()
    const { state } = useLocation()
    const group: Group = state.group
    const payload = {
        token: get_token(),
        group: group.name,
    }
    socket.emit("/system/join-group", payload, (res: string) => {
        console.log("join group page elm:", res)
        naviate("/app/group", { state: { group, needReload: true } })
    })

    return <></>
}

export default JoinPageElm
