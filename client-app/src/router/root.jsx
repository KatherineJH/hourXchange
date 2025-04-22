import {createBrowserRouter} from "react-router-dom"
import {lazy} from "react"

const Main = lazy(() => import("../page/Main.jsx"))
import employeeRouter from "./employeeRouter.jsx";


const root = createBrowserRouter([
    {
        path: '',
        element: <Main/>,
        children: [{index: true}]
    },
    {
        path: 'chat',
        element: <Main/>,
        children: employeeRouter()
    }
])

export default root