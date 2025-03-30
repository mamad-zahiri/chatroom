import axios from "axios"
import { FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function LoginElm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginSuccess, setLoginSuccess] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async function (e: FormEvent) {
        e.preventDefault()
        const payload = { email, password }

        axios
            .post("http://localhost/auth/token", payload)
            .then((response) => {
                if (response.status == 200) {
                    localStorage.setItem("access_token", response.data.access_token)
                    localStorage.setItem("refresh_token", response.data.refresh_token)
                    setLoginSuccess(true)
                }
                console.log(response)
            })
            .catch((error) => {
                setLoginSuccess(false)
                console.log(error)
            })
            .finally(() => {})
    }

    useEffect(() => {
        loginSuccess && navigate("/app", { state: { email: email } })
    }, [loginSuccess])

    return (
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <img alt='Your Company' src='logo.svg' className='mx-auto h-10 w-auto' />
                <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                    Sign in to your account
                </h2>
            </div>

            <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form action='#' method='POST' className='space-y-6' onSubmit={onSubmit}>
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium leading-6 text-gray-900'>
                            Email address
                        </label>
                        <div className='mt-2'>
                            <input
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                id='email'
                                name='email'
                                type='email'
                                required
                                placeholder='johndoe@email.com'
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
                                id='password'
                                name='password'
                                type='password'
                                placeholder='***********'
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
                            Sign in
                        </button>
                    </div>
                </form>

                <p className='mt-10 text-center text-sm text-gray-500'>
                    Not a member?{" "}
                    <a
                        href='#'
                        className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                        <Link to='/signup'>signup</Link>
                    </a>
                </p>
            </div>
        </div>
    )
}

export default LoginElm
