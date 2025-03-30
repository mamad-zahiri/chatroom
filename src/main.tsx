import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./index.css"
import ChatPageElm from "./pages/ChatPage.tsx"
import CreateGroupElm from "./pages/CreateGroup.tsx"
import GroupPageElm from "./pages/GroupPage.tsx"
import LandingElm from "./pages/Landing.tsx"
import LoginElm from "./pages/Login.tsx"
import SearchGroupPageElm from "./pages/SearchGroup.tsx"
import SearchPageElm from "./pages/SearchUser.tsx"
import SingupElm from "./pages/Signup.tsx"
import JoinPageElm from "./pages/joinPage.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={LandingElm} />
                <Route path='/login' Component={LoginElm} />
                <Route path='/signup' Component={SingupElm} />
                <Route path='/app' Component={ChatPageElm} />
                <Route path='/app/group' Component={GroupPageElm} />
                <Route path='/search' Component={SearchPageElm} />
                <Route path='/search/group' Component={SearchGroupPageElm} />
                <Route path='/create-group' Component={CreateGroupElm} />
                <Route path='/join-group' Component={JoinPageElm} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
