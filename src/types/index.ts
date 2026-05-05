export type UserRole = 'customer' | 'contractor';

export interface User {
  id: string;
  phone: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
}

export type OrderStatus = 'draft' | 'published' | 'in_progress' | 'review' | 'completed' | 'disputed';
export type MilestoneStatus = 'pending' | 'in_progress' | 'review' | 'accepted' | 'disputed';
export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface Order {
  id: string;
  customerId: string;
  contractorId: string | null;
  title: string;
  description: string;
  status: OrderStatus;
  totalBudget: number;
  address: string;
  createdAt: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  orderId: string;
  title: string;
  description: string;
  sortOrder: number;
  amount: number;
  status: MilestoneStatus;
  deadline: string;
  photos?: {
    before: string;
    after: string;
  };
}

export interface EscrowAccount {
  id: string;
  orderId: string;
  totalAmount: number;
  heldAmount: number;
  releasedAmount: number;
}

export interface Bid {
  id: string;
  orderId: string;
  contractorId: string;
  contractorName: string;
  contractorAvatar: string;
  proposedPrice: number;
  message: string;
  status: BidStatus;
  createdAt: string;
}

export interface EscrowTransaction {
  id: string;
  escrowId: string;
  type: 'deposit' | 'release' | 'refund';
  amount: number;
  description: string;
  createdAt: string;
}
