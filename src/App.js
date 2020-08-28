import React from 'react';
import './styles/App.scss';
import {BrowserRouter as Router,} from "react-router-dom";
import useRoutes from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
    const {getAccessToken, getRefreshToken, login, logout, getUserId, setTokens, setOwnerId} = useAuth();

    const isAuthenticated = !!getAccessToken() && !!getUserId();

    const routes = useRoutes(isAuthenticated);
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const userId = getUserId();

    return (
        <AuthContext.Provider value={{
            accessToken, refreshToken, setTokens, setOwnerId, login, logout, userId, isAuthenticated
        }}>
            <Router>
                <Header/>
                {routes}
                <Footer/>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
