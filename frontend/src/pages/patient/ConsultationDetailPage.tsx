// src/pages/patient/consultation-detail-page.tsx
import { useParams } from "react-router-dom";
import { useConsultation } from "../../features/consultations/hooks/useConsultation";
import { ConsultationDetail } from "../../features/consultations/components/ConsultationDetail";
import { Loader2 } from "lucide-react";

export function ConsultationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { consultation, isLoading, sendMessage } = useConsultation(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!consultation) {
    return <div>Consultation not found</div>;
  }

  return (
    <div className="animate-fade-in">
      <ConsultationDetail
        consultation={consultation}
        userRole="patient"
        onSendMessage={(content, type) => {
          sendMessage({ content, type });
        }}
      />
    </div>
  );
}
