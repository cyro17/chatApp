import { Route, Routes } from "react-router";
import App from "../App";
import ChatPage from "./components/ChatPage";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/chat' element={<ChatPage/>} />
            <Route path='/about' element={<h1>About Page</h1>} />
            <Route path='*' element={<h1>Page Not Found</h1>} />
        </Routes>
    )
};