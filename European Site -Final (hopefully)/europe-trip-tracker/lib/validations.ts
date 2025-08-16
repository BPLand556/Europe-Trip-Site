import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  bodyMD: z.string().optional(),
  takenAt: z.date().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export const mediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO']),
  cldId: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
  order: z.number().default(0),
});

export const postWithMediaSchema = postSchema.extend({
  media: z.array(mediaSchema).min(1),
});

export const uploadSignatureSchema = z.object({
  timestamp: z.number(),
  signature: z.string(),
  apiKey: z.string(),
  cloudName: z.string(),
  uploadPreset: z.string(),
});

export type PostInput = z.infer<typeof postSchema>;
export type MediaInput = z.infer<typeof mediaSchema>;
export type PostWithMediaInput = z.infer<typeof postWithMediaSchema>;
export type UploadSignature = z.infer<typeof uploadSignatureSchema>;
