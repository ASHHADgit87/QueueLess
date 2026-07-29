import { Types } from "mongoose";
import QueueEntry from "../models/QueueEntry";

export interface BusinessAnalytics {
  servedToday: number;
  avgWaitMins: number;
  noShowRate: number;
  peakHour: number | null;
}

export const getBusinessAnalytics = async (
  businessId: string,
): Promise<BusinessAnalytics> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const businessObjectId = new Types.ObjectId(businessId);

  const [servedResult] = await QueueEntry.aggregate([
    {
      $match: {
        business: businessObjectId,
        status: "served",
        servedAt: { $gte: startOfDay },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgWaitMs: {
          $avg: { $subtract: ["$servedAt", "$joinedAt"] },
        },
      },
    },
  ]);

  const [noShowResult] = await QueueEntry.aggregate([
    {
      $match: {
        business: businessObjectId,
        joinedAt: { $gte: startOfDay },
        status: { $in: ["served", "no-show"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        noShows: {
          $sum: { $cond: [{ $eq: ["$status", "no-show"] }, 1, 0] },
        },
      },
    },
  ]);

  const peakHourResult = await QueueEntry.aggregate([
    {
      $match: {
        business: businessObjectId,
        joinedAt: { $gte: startOfDay },
      },
    },
    {
      $group: {
        _id: { $hour: "$joinedAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  return {
    servedToday: servedResult?.count ?? 0,
    avgWaitMins: servedResult?.avgWaitMs
      ? Math.round(servedResult.avgWaitMs / 60000)
      : 0,
    noShowRate: noShowResult?.total
      ? Math.round((noShowResult.noShows / noShowResult.total) * 100)
      : 0,
    peakHour: peakHourResult[0]?._id ?? null,
  };
};
