import { api } from "./api";
import { Queue, QueueEntry } from "../types/queue";
import { CreateQueueFormValues } from "../utils/validation";

export const queueService = {
  createForBusiness: async (
    businessId: string,
    values: CreateQueueFormValues,
  ): Promise<Queue> => {
    const { data } = await api.post(`/businesses/${businessId}/queues`, values);
    return data.queue;
  },

  getForBusiness: async (businessId: string): Promise<Queue[]> => {
    const { data } = await api.get(`/businesses/${businessId}/queues`);
    return data.queues;
  },

  update: async (
    queueId: string,
    values: Partial<CreateQueueFormValues & { status: string }>,
  ): Promise<Queue> => {
    const { data } = await api.patch(`/queues/${queueId}`, values);
    return data.queue;
  },

  remove: async (queueId: string): Promise<void> => {
    await api.delete(`/queues/${queueId}`);
  },

  join: async (queueId: string): Promise<QueueEntry> => {
    const { data } = await api.post(`/queues/${queueId}/join`);
    return data.entry;
  },

  leave: async (queueId: string): Promise<void> => {
    await api.delete(`/queues/${queueId}/leave`);
  },

  addWalkIn: async (queueId: string, name: string): Promise<QueueEntry> => {
    const { data } = await api.post(`/queues/${queueId}/walk-in`, { name });
    return data.entry;
  },

  getEntries: async (queueId: string): Promise<QueueEntry[]> => {
    const { data } = await api.get(`/queues/${queueId}/entries`);
    return data.entries;
  },

  callNext: async (queueId: string): Promise<QueueEntry | null> => {
    const { data } = await api.patch(`/queues/${queueId}/call-next`);
    return data.called;
  },

  markNoShow: async (entryId: string): Promise<QueueEntry> => {
    const { data } = await api.patch(`/queue-entries/${entryId}/no-show`);
    return data.entry;
  },
};
