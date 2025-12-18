import { useState } from "react";
import { useSidebarStore } from "../zustand";

function Sidebar() {
    const { activeTab, setActiveTab, sideBarActive, setSideBar } = useSidebarStore();
    const [isSidebar, setIsSidebar] = useState(sideBarActive);

    const menuItems = [
        { label: 'API Client', tabIndex: 0 },
        { label: 'API Mock', tabIndex: 1 },
        { label: 'API Test', tabIndex: 2 },
    ];

    return (
        <aside
            className={`h-[calc(100vh-64px)] bg-[#fafafa] dark:bg-[#121212] border-r border-[#e4e4e7] dark:border-[#27272a] flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebar ? 'w-64' : 'w-20'
                }`}
        >
            <div className={`flex items-center pt-4 pb-2 px-4 ${isSidebar ? 'justify-end' : 'justify-center'}`}>
                <button
                    className="p-1.5 rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#18181b] text-[#71717a] dark:text-[#a1a1aa] transition-colors cursor-pointer"
                    onClick={() => { const newState = !isSidebar; setIsSidebar(newState); setSideBar(newState) }}
                >
                    <svg
                        viewBox="-0.5 -0.5 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                        className={`transition-transform duration-300 ${!isSidebar ? 'rotate-180' : ''}`}
                    >
                        <path d="M12.7769375 14.284625H2.2230625c-0.8326875 0 -1.5076875 -0.675 -1.5076875 -1.5076875l0 -10.553875c0 -0.8326875 0.675 -1.5076875 1.5076875 -1.5076875h10.553875c0.8326875 0 1.5076875 0.675 1.5076875 1.5076875v10.553875c0 0.8326875 -0.675 1.5076875 -1.5076875 1.5076875Z"
                            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
                        <path d="M3.91925 5.9923125 2.6 7.5l1.31925 1.5076875"
                            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
                        <path d="M5.615375 14.284625V0.715375"
                            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
                    </svg>
                </button>
            </div>

            <div className="flex-1 py-4 px-3 overflow-hidden">
                <nav className="space-y-2">
                    {isSidebar && menuItems.map((item) => {
                        const isActive = activeTab === item.tabIndex;
                        return (
                            <button
                                key={item.tabIndex}
                                onClick={() => setActiveTab(item.tabIndex)}
                                className={`flex items-center gap-4 w-full px-4 py-2.5 text-sm font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap
                                    ${isActive
                                        ? "bg-[#2563eb] text-white shadow-md"
                                        : "text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] dark:text-[#a1a1aa] dark:hover:text-[#fafafa] dark:hover:bg-[#18181b]"
                                    }`}
                            >
                                <span className={`transition-opacity duration-300 ${isSidebar ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-[#e4e4e7] dark:border-[#27272a] overflow-hidden whitespace-nowrap">
                <div className={`text-[10px] text-[#71717a] dark:text-[#a1a1aa] font-bold tracking-widest uppercase transition-opacity duration-300 ${isSidebar ? 'opacity-100' : 'opacity-0'}`}>
                    LiteClient v1.0
                </div>
            </div>
        </aside>
    );
}
export default Sidebar;