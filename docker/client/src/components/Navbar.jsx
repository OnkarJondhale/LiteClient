import { useThemeStore } from "../zustand";

function Navbar() {
    const { isDark, toggleTheme } = useThemeStore();

    function handleTheme() {
        const root = document.documentElement;
        if (!isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        toggleTheme();
    }

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white dark:bg-[#09090b] border-b border-[#e4e4e7] dark:border-[#27272a] shrink-0">
            <div className="flex items-center gap-2">
                <div className="bg-[#2563eb] text-white px-2 py-0.5 rounded font-black text-sm">
                    LC
                </div>
                <span className="font-mono font-bold text-lg text-[#18181b] dark:text-[#fafafa]">
                    LiteClient
                </span>
            </div>

            <button 
                onClick={handleTheme}
                className="p-2 rounded-md hover:bg-[#f4f4f5] dark:hover:bg-[#18181b] transition-colors"
            >
                {isDark ? '☀️' : '🌙'}
            </button>
        </nav>
    );
}

export default Navbar;