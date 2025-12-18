import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'liteclient-ui-theme' }
  )
);


// +------------------+-------------------+----------------------------+
// | Element          | Light Mode Class  | Dark Mode Class (dark:)    |
// +------------------+-------------------+----------------------------+
// | Main App Bg      | bg-white          | dark:bg-[#09090b]          |
// | Sidebar / Panels | bg-[#fafafa]      | dark:bg-[#121212]          |
// | Navbar Bg        | bg-white          | dark:bg-[#09090b]          |
// | Primary Text     | text-[#18181b]    | dark:text-[#fafafa]        |
// | Muted Text       | text-[#71717a]    | dark:text-[#a1a1aa]        |
// | Borders          | border-[#e4e4e7]  | dark:border-[#27272a]      |
// | Primary Blue     | bg-[#2563eb]      | dark:bg-[#3b82f6]          |
// +------------------+-------------------+----------------------------+