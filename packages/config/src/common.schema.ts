import { z } from 'zod';

/**
 * Common environment variables shared across all services.
 * Includes basic runtime information and standard overrides.
 */
export const commonSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Current application environment (dev/prod/test)'),
  
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error', 'fatal'])
    .default('info')
    .describe('Minimum logging level for the application'),
  
  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(3000)
    .describe('The port on which the server listens'),
  
  HOST: z
    .string()
    .default('0.0.0.0')
    .describe('The host interface to bind the server to'),
});

export type CommonConfig = z.infer<typeof commonSchema>;
