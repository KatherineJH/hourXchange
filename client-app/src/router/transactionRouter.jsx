import React, {lazy} from "react"


const List = lazy(() => import("../component/transaction/List.jsx"))



const serviceProductRouter = () =>{
    return [
        // {
        //     path: "read/:id",
        //     element: <Read/>
        // },
        {
            path: "list",
            element: <List/>
        },
        // {
        //     path: "save",
        //     element: <Save/>
        // },
        // {
        //     path: "modify/:id",
        //     element: <Modify/>
        // },
    ]}

export default serviceProductRouter