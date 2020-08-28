import {useCallback, useEffect} from "react";

const storageName = 'userData'

export const useAuth = () => {
    const setTokens = useCallback((jwtToken, jwtRefreshToken) => {
        const data = JSON.parse(localStorage.getItem(storageName));

        localStorage.setItem(storageName, JSON.stringify({
            ...data, accessToken: jwtToken, refreshToken: jwtRefreshToken
        }))
    }, [])

    const setOwnerId = useCallback(id => {
        const data = JSON.parse(localStorage.getItem(storageName));

        localStorage.setItem(storageName, JSON.stringify({...data, userId: id}))
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(storageName);
        window.location.replace('/auth')
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data && data.accessToken && data.refreshToken) {
            setTokens(data.accessToken, data.refreshToken);
        }

        if (data && data.userId) {
            setOwnerId(data.userId)
        }
    }, [setTokens, setOwnerId])

    const getUserId = () => {
        if (!localStorage.getItem(storageName)) return ;

        return JSON.parse(localStorage.getItem(storageName)).userId
    }

    const getAccessToken = () => {
        if (!localStorage.getItem(storageName)) return ;

        return JSON.parse(localStorage.getItem(storageName)).accessToken
    }

    const getRefreshToken = () => {
        if (!localStorage.getItem(storageName)) return ;

        return JSON.parse(localStorage.getItem(storageName)).refreshToken
    }

    return {setTokens, logout, getAccessToken, getRefreshToken, getUserId, setOwnerId}
}