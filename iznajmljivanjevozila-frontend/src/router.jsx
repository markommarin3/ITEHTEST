import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
// Import ostalih stranica po potrebi

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/vozila",
                element: <Vehicles />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

export default router;
