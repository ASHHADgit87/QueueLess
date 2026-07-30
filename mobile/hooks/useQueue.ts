import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queueService } from "../services/queueService";
import { QueueEntry, QueueUpdatePayload } from "../types/queue";
import { CreateQueueFormValues } from "../utils/validation";
import { useSocket } from "./useSocket";
import { SOCKET_EVENTS } from "../utils/constants";

export const useQueueLive = (queueId: string | undefined) => {
  const { socket, connected } = useSocket();
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!queueId) return;
    setIsLoading(true);
    queueService
      .getEntries(queueId)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setIsLoading(false));
  }, [queueId]);

  useEffect(() => {
    if (!socket || !connected || !queueId) return;

    socket.emit(SOCKET_EVENTS.SUBSCRIBE, queueId);

    const handleUpdate = (payload: QueueUpdatePayload) => {
      if (payload.queueId === queueId) setEntries(payload.entries);
    };
    socket.on(SOCKET_EVENTS.UPDATE, handleUpdate);

    return () => {
      socket.emit(SOCKET_EVENTS.UNSUBSCRIBE, queueId);
      socket.off(SOCKET_EVENTS.UPDATE, handleUpdate);
    };
  }, [socket, connected, queueId]);

  return { entries, isLoading };
};

export const useJoinQueue = () => {
  return useMutation({
    mutationFn: (queueId: string) => queueService.join(queueId),
  });
};

export const useLeaveQueue = () => {
  return useMutation({
    mutationFn: (queueId: string) => queueService.leave(queueId),
  });
};

export const useCallNext = () => {
  return useMutation({
    mutationFn: (queueId: string) => queueService.callNext(queueId),
  });
};

export const useAddWalkIn = () => {
  return useMutation({
    mutationFn: ({ queueId, name }: { queueId: string; name: string }) =>
      queueService.addWalkIn(queueId, name),
  });
};

export const useMarkNoShow = () => {
  return useMutation({
    mutationFn: (entryId: string) => queueService.markNoShow(entryId),
  });
};

export const useQueuesForBusiness = (businessId: string | undefined) => {
  return useQuery({
    queryKey: ["queues", businessId],
    queryFn: () => queueService.getForBusiness(businessId as string),
    enabled: !!businessId,
  });
};

export const useCreateQueue = (businessId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CreateQueueFormValues) =>
      queueService.createForBusiness(businessId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues", businessId] });
    },
  });
};

export const useUpdateQueue = (businessId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      queueId,
      values,
    }: {
      queueId: string;
      values: Partial<CreateQueueFormValues & { status: string }>;
    }) => queueService.update(queueId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queues", businessId] });
    },
  });
};

export const useMyQueuePosition = (
  entries: QueueEntry[],
  userId: string | undefined,
) => {
  const getPosition = useCallback(() => {
    if (!userId) return null;
    const waitingOnly = entries.filter(
      (e) => e.status === "waiting" || e.status === "called",
    );
    const index = waitingOnly.findIndex(
      (e) => (typeof e.user === "object" ? e.user?._id : e.user) === userId,
    );
    return index === -1 ? null : index + 1;
  }, [entries, userId]);

  return getPosition();
};
