import { useState, useEffect } from 'react';
import { useMockStore } from "../zustand";

export const useApiMock = () => {
    const {
        mocks,
        activeMockId,
        setActiveMockId,
        addMock,
        removeMock,
        updateActiveMock,
        getActiveMock
    } = useMockStore();

    const activeMock = getActiveMock();
    const [isCopied, setIsCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("Params");

    useEffect(() => {
        if (!activeMock) return;

        const syncWithBackend = async () => {
            try {
                await fetch('http://localhost:9090/apimock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mocks, requestType: 'apimock' })
                });
            } catch (err) {
                console.error("Sync failed:", err);
            }
        };

        const timer = setTimeout(() => {
            const lastAction = sessionStorage.getItem('last-mock-action');
            if (activeMock.isActive || lastAction === 'toggle' || lastAction === 'remove') {
                syncWithBackend();
                sessionStorage.removeItem('last-mock-action');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [mocks]);

    const handleUpdateActiveMock = (fields) => {
        if ('isActive' in fields) {
            sessionStorage.setItem('last-mock-action', 'toggle');
        } else {
            sessionStorage.setItem('last-mock-action', 'edit');
        }

        updateActiveMock(fields);
    };
    const updateKVRow = (isParam, idx, field, val) => {
        sessionStorage.setItem('last-mock-action', 'edit');
        const list = isParam ? [...activeMock.params] : [...activeMock.headers];
        list[idx] = { ...list[idx], [field]: val };
        handleUpdateActiveMock(isParam ? { params: list } : { headers: list });
    };

    const removeRow = (isParam, idx) => {
        sessionStorage.setItem('last-mock-action', 'edit');
        const list = isParam ? activeMock.params : activeMock.headers;
        if (list.length > 1) {
            const next = list.filter((_, i) => i !== idx);
            handleUpdateActiveMock(isParam ? { params: next } : { headers: next });
        }
    };

    const addRow = (isParam) => {
        sessionStorage.setItem('last-mock-action', 'edit');
        const list = isParam ? activeMock.params : activeMock.headers;
        handleUpdateActiveMock(isParam
            ? { params: [...list, { key: "", value: "" }] }
            : { headers: [...list, { key: "", value: "" }] }
        );
    };

    const copyMockUrl = () => {
        const baseUrl = "http://localhost:9090";
        const path = activeMock.path.startsWith('/') ? activeMock.path : `/${activeMock.path}`;
        navigator.clipboard.writeText(`${baseUrl}${path}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return {
        mocks, activeMock, activeMockId, activeTab, isCopied,
        setActiveTab, setActiveMockId, addMock,
        removeMock: (id) => {
            sessionStorage.setItem('last-mock-action', 'remove');
            removeMock(id);
        },
        updateActiveMock: handleUpdateActiveMock,
        updateKVRow, removeRow, addRow, copyMockUrl
    };
};