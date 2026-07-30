import { api } from "./api";
import { Business, BusinessAnalytics, Review } from "../types/business";
import { Queue } from "../types/queue";
import {
  CreateBusinessFormValues,
  ReviewFormValues,
} from "../utils/validation";

export const businessService = {
  list: async (search?: string, category?: string): Promise<Business[]> => {
    const { data } = await api.get("/businesses", {
      params: { search, category },
    });
    return data.businesses;
  },

  getById: async (
    id: string,
  ): Promise<{ business: Business; queues: Queue[] }> => {
    const { data } = await api.get(`/businesses/${id}`);
    return { business: data.business, queues: data.queues };
  },

  getMine: async (): Promise<Business[]> => {
    const { data } = await api.get("/businesses/mine");
    return data.businesses;
  },

  create: async (values: CreateBusinessFormValues): Promise<Business> => {
    const { data } = await api.post("/businesses", values);
    return data.business;
  },

  update: async (
    id: string,
    values: Partial<CreateBusinessFormValues>,
  ): Promise<Business> => {
    const { data } = await api.patch(`/businesses/${id}`, values);
    return data.business;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/businesses/${id}`);
  },

  getAnalytics: async (id: string): Promise<BusinessAnalytics> => {
    const { data } = await api.get(`/businesses/${id}/analytics`);
    return data.analytics;
  },

  getReviews: async (id: string): Promise<Review[]> => {
    const { data } = await api.get(`/businesses/${id}/reviews`);
    return data.reviews;
  },

  createReview: async (
    id: string,
    values: ReviewFormValues,
  ): Promise<Review> => {
    const { data } = await api.post(`/businesses/${id}/reviews`, values);
    return data.review;
  },
};
