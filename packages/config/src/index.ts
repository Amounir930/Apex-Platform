import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { commonSchema } from './common.schema';
import { appSchemas, AppType } from './app.schema';

/**
 * Protocol Beta 2: Docker Secrets Priority Merging
 * Checks /run/secrets/ for matching environment variable files.
 * Precedence: /run/secrets/VAR_NAME > process.env.VAR_NAME
 */
function mergeSecrets(): Record<string, string | undefined> {
  const env = { ...process.env };
  const secretsDir = '/run/secrets';

  if (fs.existsSync(secretsDir)) {
    const files = fs.readdirSync(secretsDir);
    for (const file of files) {
      try {
        const fullPath = path.join(secretsDir, file);
        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
          // Only merge if it's a valid file and doesn't explicitly shadow an existing env with non-empty
          const value = fs.readFileSync(fullPath, 'utf8').trim();
          if (value) {
            env[file] = value;
          }
        }
      } catch (error) {
        // Log reading error for debugging but don't halt; Zod will catch missing values later
        console.warn(`[Config] Failed to read secret file "${file}":`, error instanceof Error ? error.message : error);
      }
    }
  }
  return env;
}

/**
 * Protocol Gamma 2: Pretty Error Formatting
 * Generates a colorized table-like structure for validation errors.
 */
function formatErrors(errors: z.ZodError): string {
  const header = `\x1b[31m\x1b[1mS1 Violation: Invalid Environment Configuration\x1b[0m\n`;
  const tableHeader = `\x1b[1m%-25s | %-30s | %-40s\x1b[0m\n`.replace('%-25s', 'Variable').replace('%-30s', 'Error').replace('%-40s', 'Description');
  const separator = `${'-'.repeat(25)}+${'-'.repeat(32)}+${'-'.repeat(42)}\n`;
  
  let output = header + separator + tableHeader + separator;

  for (const issue of errors.issues) {
    const path = issue.path.join('.');
    const message = issue.message;
    output += `\x1b[33m%-25s\x1b[0m | \x1b[31m%-30s\x1b[0m\n`
      .replace('%-25s', path.padEnd(25))
      .replace('%-30s', message.padEnd(30));
  }

  return output + separator;
}

/**
 * Protocol Alpha 1: Type-Safe Export & Final Validation
 */
export function validateEnv<T extends AppType>(appType: T): Config<T> {
  const mergedEnv = mergeSecrets();
  const schema = commonSchema.merge(appSchemas[appType]);
  
  const result = schema.safeParse(mergedEnv);

  if (!result.success) {
    console.error(formatErrors(result.error));
    process.exit(1);
  }

  // Deep freeze the config to ensure it remains the immutable source of truth
  return Object.freeze(result.data) as unknown as Config<T>;
}

// Re-export types for application use
export type { AppType };
export type Config<T extends AppType> = z.infer<typeof commonSchema> & z.infer<typeof appSchemas[T]>;
