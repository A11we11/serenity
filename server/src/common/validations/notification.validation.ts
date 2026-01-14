import { z } from 'zod';

export const sendNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['SMS', 'WHATSAPP', 'EMAIL']),
  recipient: z.string(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export type SendNotificationDto = z.infer<typeof sendNotificationSchema>;
