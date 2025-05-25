import { Session } from "next-auth"

export interface UserInfo {
  name: string | null
  image: string | null
}

export interface ExtendedSession extends Session {
  user: {
    id: string
    email?: string | null
    image?: string | null
  }
}

export enum RequestStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface RequestStatusHistory {
  id: string
  status: RequestStatus
  timestamp: Date
  reason?: string
}

export interface RequestWithUser {
  id: string
  title: string
  description: string
  quantity: number
  budget: number
  deadline: Date
  status: RequestStatus
  category: string
  createdAt: Date
  updatedAt: Date
  userId: string
  user: {
    name: string | null
    image: string | null
  }
  _count: {
    offers: number
  }
  statusHistory: RequestStatusHistory[]
  acceptedOfferId?: string | null
}

export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED'
}

export interface OfferStatusHistory {
  id: string
  status: OfferStatus
  timestamp: Date
  reason?: string
}

export interface OfferWithUser {
  id: string
  amount: number
  message: string
  status: OfferStatus
  createdAt: Date
  updatedAt: Date
  userId: string
  requestId: string
  user: UserInfo
  request?: {
    title: string
    status: RequestStatus
    user: UserInfo
  }
  statusHistory?: OfferStatusHistory[]
}
