import {useCallback} from "react";

export const useRedirect = () => {
    const main = useCallback(() => {
        window.location.replace('/')
    }, [])

    const register = useCallback(() => {
        window.location.replace('/register')
    },[])

    const initCard = useCallback(() => {
        window.location.replace('/init-card')
    },[])

    const collapse = useCallback(() => {
        window.location.replace('/collapse')
    },[])

    const authorization = useCallback(() => {
        window.location.replace('/auth')
    },[])


return {main, register, initCard, collapse, authorization}
}