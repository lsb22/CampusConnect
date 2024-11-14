import { create } from "zustand";

interface StoreStruct {
  messages: LatestMessages[];
  insert: (arr: LatestMessages[]) => void;
}

interface LatestMessages {
  _id: string;
  userName: string;
  id: string;
  socketId: string;
  text: string;
  _v: number;
}

const useMessageStore = create<StoreStruct>((set) => ({
  messages: [],
  insert: (arr) => set(() => ({ messages: [...arr] })),
}));

export default useMessageStore;
