import React, {lazy} from "react"

const Read = lazy(() => import("../component/serviceProduct/Read.jsx"))
const List = lazy(() => import("../component/serviceProduct/List.jsx"))
const Save = lazy(() => import("../component/serviceProduct/Save.jsx"))
const Modify = lazy(() => import("../component/serviceProduct/Modify.jsx"))


const serviceProduct = () =>{
    return [
    {
        path: "read/:id",
        element: <Read/>
    },
    {
        path: "list",
        element: <List/>
    },
    {
        path: "save",
        element: <Save/>
    },
    {
        path: "modify/:id",
        element: <Modify/>
    },
]}

export default serviceProduct