import { useState } from 'react';
import { URLS } from "../constants";

export const useApiClient = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const sendRequest = async (config) => {
        const { url_index, url, method, params, headers, body, requestType } = config;
        
        console.log(config);

        setLoading(true);
        setResponse(null);

        try {
            const res = await fetch(URLS[url_index], {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url,
                    method,
                    params: params.filter(p => p.key.trim() !== ""),
                    headers: headers.filter(h => h.key.trim() !== ""),
                    body: (method !== 'GET' && body) ? JSON.parse(body) : null,
                    requestType: requestType,
                }),
            });

            const result = await res.json();
            setResponse(result);

        } catch (err) {
            setResponse({
                error: true,
                message: err.message,
                status: 500,
                data: null,
                time: 0,
                size: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const abortRequest = () => {
        setLoading(false);
    };

    return { sendRequest, loading, response, setResponse, abortRequest };
};