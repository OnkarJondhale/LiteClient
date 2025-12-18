import { useState, useEffect } from "react";
import ApiClient from "./ApiClient";

export default function ApiClientLayout() {
    const TABS_KEY = "liteclient_tabs_list";
    const ACTIVE_INDEX_KEY = "liteclient_active_tab_idx";

    const [tabs, setTabs] = useState(() => {
        const saved = sessionStorage.getItem(TABS_KEY);
        return saved ? JSON.parse(saved) : [{ id: Date.now(), name: "New Request", data: {} }];
    });

    const [activeIdx, setActiveIdx] = useState(() => {
        return parseInt(sessionStorage.getItem(ACTIVE_INDEX_KEY)) || 0;
    });

    useEffect(() => {
        sessionStorage.setItem(TABS_KEY, JSON.stringify(tabs));
    }, [tabs]);

    useEffect(() => {
        sessionStorage.setItem(ACTIVE_INDEX_KEY, activeIdx);
    }, [activeIdx]);

    const addTab = () => {
        if (tabs.length >= 10) {
            alert("Maximum of 10 tabs allowed");
            return;
        }
        const newTab = { id: Date.now(), name: "New Request", data: {} };
        setTabs([...tabs, newTab]);
        setActiveIdx(tabs.length);
    };

    const removeTab = (e, index) => {
        e.stopPropagation();
        if (tabs.length === 1) return;
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        setActiveIdx(Math.max(0, index - 1));
    };

    const updateTabData = (index, newData) => {
        const newTabs = [...tabs];
        newTabs[index].data = newData;
        setTabs(newTabs);
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            
            <div className="flex items-center gap-1 border-b border-[#e4e4e7] dark:border-[#27272a] px-4 bg-[#fafafa] dark:bg-[#121212] shrink-0">
                <div className="flex overflow-x-auto no-scrollbar">
                    {tabs.map((tab, i) => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveIdx(i)}
                            className={`group flex items-center gap-2 px-4 py-2.5 cursor-pointer border-t-2 text-[12px] font-bold transition-all min-w-30 max-w-50 ${
                                activeIdx === i 
                                ? "bg-white dark:bg-[#09090b] border-blue-600 text-blue-600 shadow-sm" 
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                        >
                            <span className="truncate flex-1">{tab.data.url || tab.name}</span>
                            {tabs.length > 1 && (
                                <button 
                                    onClick={(e) => removeTab(e, i)}
                                    className="hover:text-red-500 opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                                >✕</button>
                            )}
                        </div>
                    ))}
                </div>
                
                {tabs.length < 10 && (
                    <button 
                        onClick={addTab}
                        className="px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-lg font-bold"
                        title="Add Tab (Max 10)"
                    > + </button>
                )}
            </div>

            <div className="flex-1 relative overflow-hidden">
                {tabs.map((tab, i) => (
                    <div key={tab.id} className={activeIdx === i ? "h-full w-full" : "hidden"}>
                        <ApiClient 
                            initialData={tab.data} 
                            onUpdate={(newData) => updateTabData(i, newData)} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}