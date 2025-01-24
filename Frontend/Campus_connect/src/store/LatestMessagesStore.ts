import { create } from "zustand";

interface LatestMessages {
  _id: string;
  userName: string;
  id: string;
  socketId: string;
  text?: string;
  _v: number;
  file?: boolean;
  mimeType?: string;
  fileName?: string;
  body?: File;
  time: Date;
}

interface StoreStruct {
  isLoggedIn: boolean;
  messages: LatestMessages[];
  insert: (arr: LatestMessages[]) => void;
  logIn: (flag: boolean) => void;
  users_latitude: number;
  users_longitude: number;
  setLocation: (latitude: number, longitude: number) => void;
}

const useMessageStore = create<StoreStruct>((set) => ({
  isLoggedIn: false,
  messages: [],
  users_latitude: 0,
  users_longitude: 0,
  insert: (arr) =>
    set((state) => {
      const set = new Set(state.messages.map((item) => item._id));
      const newMessages = arr.filter((item) => !set.has(item._id));
      return { messages: [...state.messages, ...newMessages] };
    }),
  logIn: (flag) => set(() => ({ isLoggedIn: flag })),
  setLocation: (latitude, longitude) =>
    set(() => ({ users_latitude: latitude, users_longitude: longitude })),
}));

export default useMessageStore;
