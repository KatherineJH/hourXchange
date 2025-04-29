import React, {lazy} from "react"

const Read = lazy(() => import("../component/product/Read.jsx"))
const ListMap = lazy(() => import("../component/product/ListMap.jsx"))
const ListTable = lazy(() => import("../component/product/ListTable.jsx"))
const Save = lazy(() => import("../component/product/Save.jsx"))
const Modify = lazy(() => import("../component/product/Modify.jsx"))


const productRouter = () =>{
    return [
    {
        path: "read/:id",
        element: <Read/>
    },
    {
        path: "ListMap",
        element: <ListMap/>
    },
    {
        path: "listTable",
        element: <ListTable/>
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

export default productRouter