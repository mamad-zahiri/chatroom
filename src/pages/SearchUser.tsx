import { useState } from "react"
import { Link } from "react-router-dom"
import { creatAvatarLink } from "../helper"
import { search_users } from "../socket/ConnectionTest"
import { User } from "../types"

const UserElm = (user: User) => {
    return (
        <li
            key={user.id}
            className='flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
            <div className='w-12 h-12 bg-gray-300 rounded-full mr-3'>
                <img
                    src={creatAvatarLink(user.email)}
                    alt='User Avatar'
                    className='w-12 h-12 rounded-full'
                />
            </div>
            <div className='flex-1'>
                <h2 className='text-lg font-semibold'>
                    {user.first_name} {user.last_name}
                </h2>
                <p className='text-gray-600'>{user.email}</p>
            </div>
            <div className=''>
                <Link to='/app' state={{ user }}>
                    <div className='text-white bg-indigo-400 font-medium rounded-lg text-sm px-4 py-2'>
                        Chat
                    </div>
                </Link>
            </div>
        </li>
    )
}

function SearchPageElm() {
    const [users, setUsers] = useState<Array<User>>([])

    // const
    return (
        <div className='max-w-md p-4'>
            <div className='w-full mx-auto relative mb-4'>
                <input
                    onChange={(e) => search_users(e.target.value, setUsers)}
                    type='search'
                    id='default-search'
                    className='block w-full p-4 text-sm text-gray-900 border border-indigo-500 rounded-lg bg-gray-50'
                    placeholder='email or group name'
                    required
                />
            </div>

            <ul>{users.map(UserElm)}</ul>
        </div>
    )
}

export default SearchPageElm
