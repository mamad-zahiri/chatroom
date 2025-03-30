import { useState } from "react"
import { Link } from "react-router-dom"
import { creatAvatarLink } from "../helper"
import { socket } from "../socket/ConnectionTest"
import { Group } from "../types"

const GroupElm = (group: Group) => {
    return (
        <li
            key={group.id}
            className='flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
            <div className='w-12 h-12 bg-gray-300 rounded-full mr-3'>
                <img
                    src={creatAvatarLink(group.name)}
                    alt='User Avatar'
                    className='w-12 h-12 rounded-full'
                />
            </div>

            <div className='flex-1'>
                <h2 className='text-lg font-semibold'>{group.name}</h2>
            </div>

            <div>
                <Link
                    to='/join-group'
                    state={{ group: group }}
                    className='text-white bg-indigo-400 font-medium rounded-lg text-sm px-4 py-2'>
                    Join
                </Link>
            </div>
        </li>
    )
}

function SearchGroupPageElm() {
    const [groups, setGroups] = useState<Array<Group>>([])

    const search_groups = (q: string) => {
        socket.emit("/system/search-groups", { q: q }, (groups: Array<Group>) => {
            console.log(groups)
            setGroups(groups)
        })
    }

    return (
        <div className='max-w-md p-4'>
            <div className='w-full mx-auto relative mb-4'>
                <input
                    onChange={(e) => {
                        search_groups(e.target.value)
                    }}
                    type='search'
                    id='default-search'
                    className='block w-full p-4 text-sm text-gray-900 border border-indigo-500 rounded-lg bg-gray-50'
                    placeholder='email or group name'
                    required
                />
            </div>

            <ul>{groups.map(GroupElm)}</ul>
        </div>
    )
}

export default SearchGroupPageElm
