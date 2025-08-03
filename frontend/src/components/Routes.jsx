import { useContext, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom"

import Dashboard from "../components/dashboard/Dashboard";
import Signup from "../components/auth/Signup";
import Login from "../components/auth/Login"
import Layout from "./Layout";
import { AuthContext } from "../components/contexts/authContext";
import Shop from "./Techshop/Shop";
import { SearchProvider } from "./contexts/searchContext";
import NewShop from "./Techshop/NewShop";
import UpdateShop from "./Techshop/updateShop";
import NewTechnician from "./technician/NewTechnician";
import NewBooking from "./booking/NewBooking"
import ShowBooking from "./booking/ShowBooking";
import VideoCall from "./VideoCall";

const Routes = () => {
    const navigate = useNavigate()
    const { currUser, setCurrUser } = useContext(AuthContext);

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        if (userId && !currUser) {
            setCurrUser(userId)
        }
        if (!userId && !["/login", "/signup"].includes(window.location.pathname)) {
            navigate("/login");
        }

        if (userId && window.location.pathname === "/login") {
            navigate("/");
        }

    }, [currUser, setCurrUser, navigate])

    let element = useRoutes([
        {
            element:<Layout/>,
            children:[
                {
                    path:'/Shop/:id',
                    element:<Shop/>
                },
                {
                    path:"/newShop",
                    element:<NewShop/>
                },
                {
                    path:'/update/:id',
                    element:<UpdateShop/>
                },
                {
                    path:"/create/:id",
                    element:<NewTechnician/>
                },
                {
                    path:"/bookings/:id/createBooking",
                    element:<NewBooking/>
                },
                {
                    path:"/booking/:id",
                    element:<ShowBooking/>
                },
                {
                    path:"/session/:roomId",
                    element:<VideoCall/>
                }
            ]
        },
        {
            path:"/",
            element:
            <SearchProvider>
                <Dashboard/>
            </SearchProvider>
        },
        {
            path: "/signup",
            element: <Signup />
        },
        {
            path:"/login",
            element:<Login/>
        }
    ]);


    return element;
}
export default Routes;