import axios from "axios"
import { UserSignup } from "../types"

// async function login(email: string, password: string): Promise<boolean> {
//     const payload = { email, password }
//     let isSuccessful = false

//     return isSuccessful
// }

function singup(user: UserSignup) {
    let isSuccessful = true

    axios
        .post("http://localhost/auth/signup", user)
        .then((response) => {
            if (response.status == 200) {
                localStorage.setItem("access_token", response.data.access_token)
                localStorage.setItem("refresh_token", response.data.refresh_token)
            }
            console.log(response)
        })
        .catch((error) => {
            isSuccessful = false
            console.log(error)
        })

    return isSuccessful
}

export { singup }
