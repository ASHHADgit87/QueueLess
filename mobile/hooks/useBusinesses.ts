import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessService } from "../services/businessService";
import {
  CreateBusinessFormValues,
  ReviewFormValues,
} from "../utils/validation";

export const useBusinesses = (search?: string, category?: string) => {
  return useQuery({
    queryKey: ["businesses", search, category],
    queryFn: () => businessService.list(search, category),
  });
};

export const useBusinessDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => businessService.getById(id as string),
    enabled: !!id,
  });
};

export const useMyBusinesses = () => {
  return useQuery({
    queryKey: ["businesses", "mine"],
    queryFn: () => businessService.getMine(),
  });
};

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CreateBusinessFormValues) =>
      businessService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
};

export const useBusinessAnalytics = (id: string | undefined) => {
  return useQuery({
    queryKey: ["analytics", id],
    queryFn: () => businessService.getAnalytics(id as string),
    enabled: !!id,
    refetchInterval: 30000,
  });
};

export const useBusinessReviews = (id: string | undefined) => {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => businessService.getReviews(id as string),
    enabled: !!id,
  });
};

export const useCreateReview = (businessId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ReviewFormValues) =>
      businessService.createReview(businessId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", businessId] });
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
    },
  });
};
