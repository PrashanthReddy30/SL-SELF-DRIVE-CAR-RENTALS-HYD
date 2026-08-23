import { create } from 'zustand';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Unread' | 'Read' | 'Resolved';
  createdAt: string;
}

interface InquiryState {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
  updateStatus: (id: string, status: Inquiry['status']) => void;
}

export const useInquiryStore = create<InquiryState>((set) => ({
  inquiries: [
    {
      id: 'i1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      message: 'Do you offer monthly car rental plans?',
      status: 'Unread',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'i2',
      name: 'Sarah Smith',
      email: 'sarah.s@example.com',
      phone: '+91 8106698859',
      message: 'I would like to know if cars are available with a driver.',
      status: 'Resolved',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ],
  addInquiry: (inquiry) => set((state) => ({ inquiries: [inquiry, ...state.inquiries] })),
  updateStatus: (id, status) => set((state) => ({
    inquiries: state.inquiries.map(i => i.id === id ? { ...i, status } : i)
  })),
}));
