import { useEffect } from 'react'
import { Navbar, Sidebar, ApiClientLayout, ApiMock, ApiTest } from './components'
import { useSidebarStore, useThemeStore } from './zustand'

function App() {
  const { isDark } = useThemeStore()
  const { activeTab } = useSidebarStore();

  useEffect(() => {
    const root = document.documentElement
    if (isDark) { root.classList.add('dark') } 
    else { root.classList.remove('dark') }
  }, [isDark])

  return (
    <div className='h-screen w-full flex flex-col overflow-hidden'>
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#09090b]"> 
        <Sidebar />
        <main className="flex-1 overflow-hidden relative">
            {activeTab === 0 ? <ApiClientLayout /> : activeTab === 1 ? <ApiMock /> : <ApiTest />}
        </main>
      </div>
    </div>
  )
}

export default App