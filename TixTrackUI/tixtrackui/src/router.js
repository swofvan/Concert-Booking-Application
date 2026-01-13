import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Concert_list from "./components/Consert_List";
import View_Concert from "./components/View_Concert";

const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path: 'concerts', element: <Concert_list/>, },
    { path: '/concerts/:concertid', element: <View_Concert/> }
]);

export default router;