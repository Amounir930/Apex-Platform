import { z } from 'zod';

/**
 * App-specific environment variables for the API, Worker, and Storefront.
 * Protocols:
 * 1. NO defaults for sensitive data (Secrets).
 * 2. Mandatory fields must be z.string().min(1).
 * 3. Add descriptions for the Error Formatter.
 */

const apiSchema = z.object({
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters for security")
    .describe('Secret key used for signing JWT tokens. Required for authentication.'),
  
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid PostgreSQL URL")
    .describe('PostgreSQL connection string. Sole source of truth for DB access.'),
  
  REDIS_URL: z
    .string()
    .url("REDIS_URL must be a valid Redis URL")
    .describe('Redis connection string for caching and task queue.'),
});

const workerSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .describe('PostgreSQL connection string for the worker background tasks.'),
  
  REDIS_URL: z
    .string()
    .url()
    .describe('Redis connection string for the worker task queue.'),
  
  QUEUE_PREFIX: z
    .string()
    .default('apex-worker')
    .describe('Prefix for BullMQ queue names to avoid collisions.'),
});

const storefrontSchema = z.object({
  API_URL: z
    .string()
    .url()
    .describe('The public-facing URL of the API gateway for the storefront frontend.'),
  
  MAINTENANCE_MODE: z.coerce
    .boolean()
    .default(false)
    .describe('Enable global maintenance page for the storefront.'),
});

export const appSchemas = {
  api: apiSchema,
  worker: workerSchema,
  storefront: storefrontSchema,
};

export type AppType = keyof typeof appSchemas;
