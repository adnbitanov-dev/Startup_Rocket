import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// @ts-ignore
import { io } from 'socket.io-client';
import type { Order, Bid, Milestone, OrderStatus, BidStatus, ChatMessage } from '../types';
import { 
  customerOrders as mockCustomerOrders, 
  availableOrders as mockAvailableOrders,
  contractorActiveJobs as mockActiveJobs,
  bidsOnCustomerOrders as mockCustomerBids,
  myBids as mockMyBids
} from '../mock/data';

interface DataContextType {
  orders: Order[];
  bids: Bid[];
  messages: ChatMessage[];
  
  // Getters
  customerOrders: Order[];
  availableOrders: Order[];
  contractorActiveJobs: Order[];
  getBidsForOrder: (orderId: string) => Bid[];
  hasBidOnOrder: (orderId: string) => boolean;
  getMessages: (orderId: string, type: 'direct' | 'dispute') => ChatMessage[];
  
  // Actions
  createOrder: (order: Omit<Order, 'id' | 'customerId' | 'createdAt' | 'status' | 'contractorId'>) => void;
  submitBid: (orderId: string, price: number, message: string) => void;
  acceptBid: (bidId: string) => void;
  updateMilestoneStatus: (orderId: string, milestoneId: string, status: Milestone['status'], photos?: { before: string, after: string }) => void;
  sendMessage: (msg: Omit<ChatMessage, 'id'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

// We combine all mock orders and fix IDs
const initialOrders = [
  ...mockCustomerOrders.map(o => ({ ...o, customerId: 'u-customer' })),
  ...mockAvailableOrders.map(o => ({ ...o, customerId: 'other-user' })),
  ...mockActiveJobs.map(o => ({ ...o, contractorId: 'u-contractor', customerId: 'other-user' }))
];

const initialBids = [
  ...mockCustomerBids,
  ...mockMyBids.map(b => ({ ...b, contractorId: 'u-contractor' }))
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // --- Real-time Sync Logic ---
  useEffect(() => {
    // Determine backend URL (assumes server.js runs on 3001, Vite on 5173/etc)
    const serverUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : `http://${window.location.hostname}:3001`;
      
    const socket = io(serverUrl);

    socket.on('connect', () => {
      console.log('Connected to sync server');
    });

    socket.on('state_sync', (state: { orders: Order[], bids: Bid[], messages: ChatMessage[] }) => {
      console.log('Received state sync from server');
      if (state && state.orders) {
        setOrders(state.orders);
        setBids(state.bids);
        if (state.messages) setMessages(state.messages);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const broadcastState = (newOrders: Order[], newBids: Bid[], newMessages: ChatMessage[]) => {
    const serverUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : `http://${window.location.hostname}:3001`;
    const socket = io(serverUrl);
    socket.emit('update_state', { orders: newOrders, bids: newBids, messages: newMessages });
    setTimeout(() => socket.disconnect(), 500); // Disconnect after emitting
  };
  // -----------------------------

  // Getters
  const customerOrders = orders.filter(o => o.customerId === 'u-customer');
  
  const availableOrders = orders.filter(o => 
    o.status === 'published' && 
    o.customerId !== 'u-contractor' && // Contractor shouldn't see their own orders if they had any
    o.contractorId === null
  );

  const contractorActiveJobs = orders.filter(o => o.contractorId === 'u-contractor');

  const getBidsForOrder = (orderId: string) => bids.filter(b => b.orderId === orderId);
  const hasBidOnOrder = (orderId: string) => bids.some(b => b.orderId === orderId && b.contractorId === 'u-contractor');
  
  const getMessages = (orderId: string, type: 'direct' | 'dispute') => {
    return messages.filter(m => m.orderId === orderId && m.type === type);
  };

  // Actions
  const createOrder = (orderData: Omit<Order, 'id' | 'customerId' | 'createdAt' | 'status' | 'contractorId'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      customerId: 'u-customer',
      contractorId: null,
      status: 'published',
      createdAt: new Date().toISOString()
    };
    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    broadcastState(newOrders, bids, messages);
  };

  const submitBid = (orderId: string, price: number, message: string) => {
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      orderId,
      contractorId: 'u-contractor',
      contractorName: 'Вы (Исполнитель)',
      contractorAvatar: '',
      proposedPrice: price,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const newBids = [...bids, newBid];
    setBids(newBids);
    broadcastState(orders, newBids, messages);
  };

  const acceptBid = (bidId: string) => {
    const bid = bids.find(b => b.id === bidId);
    if (!bid) return;

    // Update order status and set contractor
    const newOrders = orders.map(o => {
      if (o.id === bid.orderId) {
        // Start the first milestone automatically when the job starts
        const updatedMilestones = [...o.milestones];
        if (updatedMilestones.length > 0 && updatedMilestones[0].status === 'pending') {
          updatedMilestones[0] = { ...updatedMilestones[0], status: 'in_progress' };
        }
        
        return {
          ...o,
          status: 'in_progress' as OrderStatus,
          contractorId: bid.contractorId,
          milestones: updatedMilestones
        };
      }
      return o;
    });

    // Update bids
    const newBids = bids.map(b => {
      if (b.orderId === bid.orderId) {
        return { ...b, status: (b.id === bidId ? 'accepted' : 'rejected') as BidStatus };
      }
      return b;
    });

    setOrders(newOrders);
    setBids(newBids);
    broadcastState(newOrders, newBids, messages);
  };

  const updateMilestoneStatus = (orderId: string, milestoneId: string, status: Milestone['status'], photos?: { before: string, after: string }) => {
    const newOrders = orders.map(o => {
      if (o.id === orderId) {
        let updatedMilestones = o.milestones.map(m => {
          if (m.id === milestoneId) {
            return { ...m, status, ...(photos ? { photos } : {}) };
          }
          return m;
        });

        // If a milestone was accepted, automatically start the NEXT pending milestone
        if (status === 'accepted') {
          const nextPendingIndex = updatedMilestones.findIndex(m => m.status === 'pending');
          if (nextPendingIndex !== -1) {
            updatedMilestones[nextPendingIndex] = { ...updatedMilestones[nextPendingIndex], status: 'in_progress' };
          }
        }

        return {
          ...o,
          milestones: updatedMilestones
        };
      }
      return o;
    });
    
    setOrders(newOrders);
    broadcastState(newOrders, bids, messages);
  };

  const sendMessage = (msg: Omit<ChatMessage, 'id'>) => {
    const newMsg: ChatMessage = { ...msg, id: Date.now() };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    broadcastState(orders, bids, newMessages);
  };

  return (
    <DataContext.Provider
      value={{
        orders,
        bids,
        messages,
        customerOrders,
        availableOrders,
        contractorActiveJobs,
        getBidsForOrder,
        hasBidOnOrder,
        getMessages,
        createOrder,
        submitBid,
        acceptBid,
        updateMilestoneStatus,
        sendMessage
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
