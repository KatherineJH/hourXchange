import {createBrowserRouter} from "react-router-dom"
import {lazy} from "react"
import serviceProduct from "./serviceProduct.jsx";

const Main = lazy(() => import("../page/Main.jsx"))



const root = createBrowserRouter([
    {
        path: '',
        element: <Main/>,
        children: [{index: true}]
    },
    {
        path: 'serviceProduct',
        element: <Main/>,
        children: serviceProduct()
    }
])

export default root