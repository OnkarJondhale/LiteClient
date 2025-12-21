import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useMockStore = create(
  persist(
    (set, get) => ({
      mocks: [
        {
          id: 1,
          method: 'GET',
          path: '/api/users',
          status: 200,
          headers: [{ key: "Content-Type", value: "application/json" }],
          params: [{ key: "", value: "" }],
          body: '',
          isActive: false
        }
      ],
      activeMockId: 1,

      setActiveMockId: (id) => set({ activeMockId: id }),
      
      addMock: () => {
        const id = Date.now();
        const newMock = {
          id,
          method: 'GET',
          path: '/new-api',
          status: 200,
          headers: [{ key: "", value: "" }],
          params: [{ key: "", value: "" }],
          body: '',
          isActive: false
        };
        set((state) => ({ 
          mocks: [...state.mocks, newMock],
          activeMockId: id 
        }));
      },

      removeMock: (id) => set((state) => {
        const filtered = state.mocks.filter(m => m.id !== id);
        let nextId = state.activeMockId;
        if (state.activeMockId === id && filtered.length > 0) {
          nextId = filtered[0].id;
        }
        return { mocks: filtered, activeMockId: nextId };
      }),

      updateActiveMock: (fields) => set((state) => ({
        mocks: state.mocks.map(m => 
          m.id === state.activeMockId ? { ...m, ...fields } : m
        )
      })),

      getActiveMock: () => {
        const state = get();
        return state.mocks.find(m => m.id === state.activeMockId) || state.mocks[0];
      }
    }),
    {
      name: 'lite-client-api-mock-storage', 
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);