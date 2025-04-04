import { FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import socket, { get_token } from "../socket/socket"

function CreateGroupElm() {
    const [createGroupSuccess, setCreateGroupSuccess] = useState(false)
    const [createGroupErrMsg, setCreateGroupErrMsg] = useState("")
    const [group, setGroup] = useState("")
    const navigate = useNavigate()

    const onSubmit = async function (e: FormEvent) {
        e.preventDefault()
        const payload = { token: get_token(), group: group }

        socket.emit("/system/create-group", payload, (res: String) => {
            if (res.endsWith("created")) setCreateGroupSuccess(true)
            else if (res.endsWith("exists")) setCreateGroupErrMsg("group already exists")
        })
    }

    useEffect(() => {
        createGroupSuccess && navigate("/app/group")
    }, [createGroupSuccess])

    return (
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <img alt='Your Company' src='logo.svg' className='mx-auto h-10 w-auto' />
                <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                    Create new group
                </h2>
            </div>

            <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form action='#' method='POST' className='space-y-6' onSubmit={onSubmit}>
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium leading-6 text-gray-900'>
                            Group Name
                        </label>
                        <div className='mt-2'>
                            <input
                                onChange={(e) => {
                                    setGroup(e.target.value)
                                }}
                                id='email'
                                type='text'
                                required
                                placeholder='group name'
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-3'
                            />
                        </div>
                    </div>

                    <div>{createGroupErrMsg}</div>

                    <div>
                        <button
                            type='submit'
                            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Create
                        </button>
                    </div>
                </form>

                <p className='mt-10 text-center text-sm text-gray-500'>
                    <a
                        href='#'
                        className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                        <Link to='/app/group'>{"<- "}back</Link>
                    </a>
                </p>
            </div>
        </div>
    )
}

export default CreateGroupElm
