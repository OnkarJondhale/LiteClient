import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSidebarStore = create(
    persist(
        (set) => ({
            activeTab: 0,
            sideBarActive: false,
            setActiveTab: (tabIndex) => set({ activeTab: tabIndex }),
            setSideBar: () => set((state) => ({sideBarActive: !state.sideBarActive})),
        }),
        { name: 'liteclient-sidebar' }
    )
)