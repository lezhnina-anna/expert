import {useCallback, useContext, useState} from "react";
import {AuthContext} from "../context/auth.context";
const config = require('../config.json')

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const auth = useContext(AuthContext);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        url = `${config.server.url}${url}`;

        try {
            if (body && !headers['Content-Type']) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            if (auth.accessToken && !headers['Authorization']) {
                headers['Authorization'] = `Bearer ${auth.accessToken}`;
            }

            const response = await fetch(url, {method, body, headers});
            const string = await response.text();
            const json = string === "" ? {} : JSON.parse(string);

            if (!response.ok) {
                throw new Error(response.status || "Произошла ошибка на сервере")
            }

            setLoading(false);
            return json
        } catch (e) {
            if (e.message === "401") {
                // refresh token
                let refreshHeaders = {};
                refreshHeaders['Authorization'] = `Basic ${config.basicToken}`;
                refreshHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
                const response = await fetch(
                    "/auth/token",
                    {
                        method: 'POST',
                        body: `grant_type=refresh_token&refresh_token=${auth.refreshToken}`,
                        headers: refreshHeaders
                    }
                );

                if (!response.ok) {
                    auth.logout();
                    return;
                }

                const string = await response.text();
                const json = string === "" ? {} : JSON.parse(string);

                auth.setTokens(json.access_token, json.refresh_token);
                return request(url, method, body, {...headers, Authorization: `Bearer ${json.access_token}`});
            }
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [auth]);

    const clearError = () => {
        setError(null);
    }

    return {loading, request, error, clearError}
}