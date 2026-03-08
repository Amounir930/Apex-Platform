import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errorDetails = JSON.stringify(result.error.format(), null, 2);
  throw new Error(`S1 Violation: Invalid environment variables:\n${errorDetails}`);
}

export const config = result.data;
export type Config = z.infer<typeof envSchema>;
