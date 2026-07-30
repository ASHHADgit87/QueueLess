export type QueueStatus = "active" | "paused" | "closed";
export type QueueEntryStatus =
  | "waiting"
  | "called"
  | "served"
  | "cancelled"
  | "no-show";

export interface Queue {
  _id: string;
  business: string;
  name: string;
  status: QueueStatus;
  avgServiceTimeMins: number;
  waitingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QueueEntryUser {
  _id: string;
  name: string;
  phone?: string;
}

export interface QueueEntry {
  _id: string;
  queue: string;
  business: string;
  user?: QueueEntryUser | string | null;
  isWalkIn: boolean;
  walkInName?: string;
  position: number;
  status: QueueEntryStatus;
  joinedAt: string;
  calledAt?: string;
  servedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueueUpdatePayload {
  queueId: string;
  entries: QueueEntry[];
}
