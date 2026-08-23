import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  carName?: string;
  preferredDate?: string;
  message: string;
  status: 'Unread' | 'Read' | 'Resolved';
  createdAt: string;
}

interface InquiryState {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
  updateStatus: (id: string, status: Inquiry['status']) => void;
}

export const useInquiryStore = create<InquiryState>()(
  persist(
    (set) => ({
      inquiries: [],
      addInquiry: (inquiry) => set((state) => ({ inquiries: [inquiry, ...state.inquiries] })),
      updateStatus: (id, status) => set((state) => ({
        inquiries: state.inquiries.map(i => i.id === id ? { ...i, status } : i)
      })),
    }),
    {
      name: 'sl-inquiries-v2',
    }
  )
);
