// src/features/consultations/components/intake-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { ArrowRight, Upload } from "lucide-react";

interface IntakeFormData {
  chiefComplaint: string;
  duration: string;
  severity: string;
  symptoms: string[];
  medications: string;
  allergies: string;
  previousTreatment: string;
  photos?: FileList;
}

interface IntakeFormProps {
  onSubmit: (data: IntakeFormData) => void;
  onSaveDraft?: (data: IntakeFormData) => void;
}

export function IntakeForm({ onSubmit, onSaveDraft }: IntakeFormProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IntakeFormData>();

  const totalSteps = 4;
  const formData = watch();

  // Auto-save to local storage
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      handleSaveDraft();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t("smartIntakeForm")}</CardTitle>
        <div className="flex gap-2 mt-4">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < step ? "bg-primary" : "bg-muted"
              }`}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${i + 1} of ${totalSteps}`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Chief Complaint */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="chiefComplaint">{t("whatBringsYouIn")} *</Label>
                <Textarea
                  id="chiefComplaint"
                  {...register("chiefComplaint", { required: true })}
                  placeholder={t("describeYourSymptoms")}
                  rows={4}
                  className="mt-2"
                  aria-required="true"
                  aria-invalid={errors.chiefComplaint ? "true" : "false"}
                />
                {errors.chiefComplaint && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {t("fieldRequired")}
                  </p>
                )}
              </div>

              <div>
                <Label>{t("howLongSymptoms")} *</Label>
                <RadioGroup
                  {...register("duration", { required: true })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="today" id="today" />
                    <Label htmlFor="today">{t("today")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="week" id="week" />
                    <Label htmlFor="week">{t("thisWeek")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="month" id="month" />
                    <Label htmlFor="month">{t("thisMonth")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="longer" id="longer" />
                    <Label htmlFor="longer">{t("longerThanMonth")}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>{t("severityLevel")} *</Label>
                <RadioGroup
                  {...register("severity", { required: true })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">{t("mild")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">{t("moderate")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">{t("severe")}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 2: Additional Symptoms */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label>{t("additionalSymptoms")}</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    "fever",
                    "cough",
                    "pain",
                    "nausea",
                    "fatigue",
                    "dizziness",
                  ].map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        value={symptom}
                        {...register("symptoms")}
                      />
                      <Label htmlFor={symptom} className="font-normal">
                        {t(symptom)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical History */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="medications">{t("currentMedications")}</Label>
                <Textarea
                  id="medications"
                  {...register("medications")}
                  placeholder={t("listMedications")}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="allergies">{t("allergies")}</Label>
                <Input
                  id="allergies"
                  {...register("allergies")}
                  placeholder={t("listAllergies")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="previousTreatment">
                  {t("previousTreatment")}
                </Label>
                <Textarea
                  id="previousTreatment"
                  {...register("previousTreatment")}
                  placeholder={t("describeAnyPreviousTreatment")}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 4: Photo Upload */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="photos">{t("uploadPhotos")}</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("photoHelpsDoctor")}
                </p>
                <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("photos")}
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                {t("back")}
              </Button>
            )}

            <div className="ml-auto flex gap-2">
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  {t("next")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">{t("submitConsultation")}</Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
