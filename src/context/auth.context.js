import {createContext} from "react";

function noop() {
}

export const AuthContext = createContext({
    accessToken: null,
    refreshToken: null,
    setTokens: noop(),
    setOwnerId: noop(),
    login: noop(),
    logout: noop(),
    userId: null,
    isAuthenticated: false
})