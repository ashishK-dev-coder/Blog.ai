import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'


// Define the state interface (optional, for type safety)

// const initialState: UserState = {
//   currentUser: null,
//   loading: false,
//   error: null,
// };



const useStore = create(persist((set , get) => ({
  currentUser: null,
  loading: false,
  error: null,
  signInStart: () => set({ loading: true }),
  signInSuccess: (currentUser) =>
    set({ currentUser, loading: false, error: null }),
  signInFailure: (error) => set({ loading: false, error }),
  updateUserStart: () => set({ loading: true }),
  updateUserSuccess: (currentUser) =>
    set({ currentUser, loading: false, error: false }),
  updateUserFailure: (error) => set({ loading: false, error }),
  deleteUserStart: () => set({ loading: true }),
  deleteUserSuccess: () =>
    set({ currentUser: null, loading: false, error: false }),
  deleteUserFailure: (error) => set({ loading: false, error }),
  signOut: () => set({ currentUser: null, loading: false, error: null }),
}),
{
  name: 'zustand-storage', // name of the item in the storage (must be unique)
  storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
},)
)

export default useStore;
