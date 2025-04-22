import React, {lazy} from "react"

const Read = lazy(() => import("../component/serviceProduct/read.jsx"))


const serviceProduct = () =>{
    return [
    {
        path: "read/:id",
        element: <Read/>
    }
]}

export default serviceProduct