import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { consultationsApi } from "../api/consultations.api";
import { useConsultationStore } from "../../../store/index";

export function useConsultations() {
  const queryClient = useQueryClient();
  const { setConsultations } = useConsultationStore();

  const consultationsQuery = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const data = await consultationsApi.getAll();
      setConsultations(data);
      return data;
    },
  });

  const createConsultationMutation = useMutation({
    mutationFn: consultationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
  });

  return {
    consultations: consultationsQuery.data || [],
    isLoading: consultationsQuery.isLoading,
    error: consultationsQuery.error,
    createConsultation: createConsultationMutation.mutate,
    isCreating: createConsultationMutation.isPending,
  };
}

export function useConsultation(id: string) {
  const queryClient = useQueryClient();

  const consultationQuery = useQuery({
    queryKey: ["consultations", id],
    queryFn: () => consultationsApi.getById(id),
    enabled: !!id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: any) => consultationsApi.sendMessage(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations", id] });
    },
  });

  return {
    consultation: consultationQuery.data,
    isLoading: consultationQuery.isLoading,
    error: consultationQuery.error,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
}
