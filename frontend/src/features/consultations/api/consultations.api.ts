import { api } from "../../../lib/api/axios.config";

export interface CreateConsultationData {
  intakeForm: any;
  photos?: File[];
}

export const consultationsApi = {
  getAll: async () => {
    const response = await api.get("/consultations");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  create: async (data: CreateConsultationData) => {
    // Handle file uploads with FormData
    const formData = new FormData();
    formData.append("intakeForm", JSON.stringify(data.intakeForm));

    if (data.photos) {
      Array.from(data.photos).forEach((photo) => {
        formData.append("photos", photo);
      });
    }

    const response = await api.post("/consultations", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  sendMessage: async (consultationId: string, message: any) => {
    const response = await api.post(
      `/consultations/${consultationId}/messages`,
      message
    );
    return response.data;
  },

  uploadPhoto: async (consultationId: string, photo: File) => {
    const formData = new FormData();
    formData.append("photo", photo);

    const response = await api.post(
      `/consultations/${consultationId}/photos`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};
