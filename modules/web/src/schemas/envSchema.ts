import { z } from 'zod';

export const envSchema = z.object({})

export type envSchemaType = z.infer<typeof envSchema>
