import { z } from 'zod';

export const createConsultationSchema = z.object({
  chiefComplaint: z.string().min(10, 'Please describe your concern in detail'),
  symptoms: z.array(z.string()).min(1, 'Please select at least one symptom'),
  duration: z.string().min(1, 'Duration is required'),
  medicalHistory: z
    .object({
      conditions: z.array(z.string()).optional(),
      surgeries: z.array(z.string()).optional(),
      familyHistory: z.array(z.string()).optional(),
    })
    .optional(),
  medications: z
    .array(
      z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
      }),
    )
    .optional(),
  allergies: z
    .array(
      z.object({
        allergen: z.string(),
        reaction: z.string(),
      }),
    )
    .optional(),
  vitalSigns: z
    .object({
      temperature: z.number().optional(),
      bloodPressure: z.string().optional(),
      heartRate: z.number().optional(),
      weight: z.number().optional(),
    })
    .optional(),
  videoUrl: z.string().url().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

export const updateConsultationSchema = z.object({
  status: z
    .enum([
      'PENDING',
      'IN_PROGRESS',
      'AWAITING_RESPONSE',
      'COMPLETED',
      'CANCELLED',
    ])
    .optional(),
  diagnosis: z.string().optional(),
  prescription: z
    .array(
      z.object({
        medication: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        duration: z.string(),
        instructions: z.string().optional(),
      }),
    )
    .optional(),
  recommendations: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().datetime().optional(),
});

export type CreateConsultationDto = z.infer<typeof createConsultationSchema>;
export type UpdateConsultationDto = z.infer<typeof updateConsultationSchema>;
