import { IAssistant } from '@/types/assistant';
import { create } from 'zustand';
import { getAllAssistants } from '@/services/assistant-service';
import type { User } from 'next-auth';

interface AssistantState {
  assistants: IAssistant[];
  isLoading: boolean;
  fetchAssistants: (user: User) => Promise<void>;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  assistants: [] as IAssistant[],
  isLoading: false,
  fetchAssistants: async (user) => {
    set({ isLoading: true });
    try {
      const response = await getAllAssistants({ user });
      set({ assistants: response, isLoading: false });
    } catch (error) {
      console.error('Error fetching assistants:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
