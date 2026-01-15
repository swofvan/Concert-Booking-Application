import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Concert_list from "./components/Consert_List";
import View_Concert from "./components/View_Concert";

import Register from "./components/auth/register";
import Login from "./components/auth/Login";

const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path: 'concerts', element: <Concert_list/>, },
    { path: '/concerts/:concertid', element: <View_Concert/> },

    { path: 'register', element: <Register/>},
    { path: 'login', element: <Login/> },
]);

export default router;