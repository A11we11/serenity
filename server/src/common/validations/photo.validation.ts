import { z } from 'zod';

export const uploadPhotoSchema = z.object({
  consultationId: z.string().uuid().optional(),
  caption: z.string().optional(),
  bodyPart: z.string().optional(),
  angle: z.string().optional(),
});

export type UploadPhotoDto = z.infer<typeof uploadPhotoSchema>;
