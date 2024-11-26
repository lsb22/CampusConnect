import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface LatestMessages {
  _id: string;
  userName: string;
  id: string;
  socketId: string;
  text: string;
  _v: number;
}

interface StoreStruct {
  isLoggedIn: boolean;
  messages: LatestMessages[];
  insert: (arr: LatestMessages[]) => void;
  logIn: (flag: boolean) => void;
}

const useMessageStore = create<StoreStruct>((set) => ({
  isLoggedIn: false,
  messages: [],
  insert: (arr) => set(() => ({ messages: [...arr] })),
  logIn: (flag) => set(() => ({ isLoggedIn: flag })),
}));

// const useMessageStore = create<StoreStruct>()(
//   persist(
//     (set) => ({
//       messages: [],
//       insert: (arr) => set(() => ({ messages: [...arr] })),
//     }),
//     {
//       name: "auth-storage",
//       partialize: (state) => ({ messages: state.messages }),
//     }
//   )
// );

export default useMessageStore;
