import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { singup } from "../api"
import { UserSignup } from "../types"

function SingupElm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const navigate = useNavigate()

    const onSubmit = function (e: FormEvent) {
        e.preventDefault()
        const user: UserSignup = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        }
        singup(user) && navigate("/app")
    }

    return (
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <img
                    alt='Your Company'
                    src='/logo.svg'
                    className='mx-auto h-10 w-auto'
                />
                <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                    Create a new account
                </h2>
            </div>

            <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form action='#' method='POST' className='space-y-6' onSubmit={onSubmit}>
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium leading-6 text-gray-900'>
                            First name
                        </label>
                        <div className='mt-2'>
                            <input
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                }}
                                type='text'
                                autoComplete='last-name'
                                placeholder='John'
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-3'
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium leading-6 text-gray-900'>
                            Last name
                        </label>
                        <div className='mt-2'>
                            <input
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                }}
                                type='text'
                                placeholder='Doe'
                                autoComplete='last-name'
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-3'
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium leading-6 text-gray-900'>
                            Email address
                        </label>
                        <div className='mt-2'>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                                placeholder='johndoe@email.com'
                                required
                                autoComplete='email'
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-3'
                            />
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center justify-between'>
                            <label
                                htmlFor='password'
                                className='block text-sm font-medium leading-6 text-gray-900'>
                                Password
                            </label>
                        </div>
                        <div className='mt-2'>
                            <input
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                type='password'
                                placeholder='*************'
                                required
                                autoComplete='current-password'
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-3'
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'
                            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Sign up
                        </button>
                    </div>
                </form>

                <p className='mt-10 text-center text-sm text-gray-500'>
                    Already a member?{" "}
                    <a
                        href='#'
                        className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                        <Link to='/login'>login</Link>
                    </a>
                </p>
            </div>
        </div>
    )
}

export default SingupElm
