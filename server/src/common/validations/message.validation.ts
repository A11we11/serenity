import { z } from 'zod';

export const createMessageSchema = z.object({
  consultationId: z.string().uuid(),
  type: z.enum(['TEXT', 'VIDEO', 'IMAGE', 'DOCUMENT']).default('TEXT'),
  content: z.string().min(1, 'Message content is required'),
  attachments: z.array(z.string().url()).optional(),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
