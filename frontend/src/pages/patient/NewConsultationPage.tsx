import { IntakeForm } from "../../features/consultations/components/IntakeForm";
import { useConsultations } from "../../features/consultations/hooks/useConsultation";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NewConsultationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createConsultation, isCreating } = useConsultations();

  const handleSubmit = (data: any) => {
    createConsultation(
      { intakeForm: data, photos: data.photos },
      {
        onSuccess: (consultation: any) => {
          navigate(`/consultations/${consultation.id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">{t("newConsultation")}</h1>
      <IntakeForm onSubmit={handleSubmit} />
    </div>
  );
}
