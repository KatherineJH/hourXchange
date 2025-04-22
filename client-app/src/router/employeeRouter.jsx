import React, {lazy} from "react"

const Chat = lazy(() => import("../component/chat/Chat.jsx"))


const employeeRouter = () =>{
    return [
    {
        path: "chat",
        element: <Chat/>
    }
]}

export default employeeRouter