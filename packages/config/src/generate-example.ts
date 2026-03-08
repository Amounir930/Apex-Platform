import * as fs from 'fs';
import * as path from 'path';
import { commonSchema } from './common.schema';
import { appSchemas } from './app.schema';
import { z } from 'zod';

/**
 * Protocol Delta 4: Automated .env.example Generation
 * Iterates through all schemas and generates a comprehensive template.
 */
function generateEnvExample() {
  const lines: string[] = [
    '# Apex Platform - Environment Template',
    '# Generated automatically from Zod schemas',
    '# Protocol Alpha 1: DO NOT USE DEFAULTS FOR SECRETS',
    '',
  ];

  const processSchema = (schema: z.ZodObject<z.ZodRawShape>, title: string) => {
    lines.push(`# --- ${title} ---`);
    const shape = schema.shape;
    
    for (const key in shape) {
      const field = shape[key];
      if (!field) continue;
      
      const description = field.description || '';
      
      // Add comment if description exists
      if (description) {
        lines.push(`# ${description}`);
      }
      
      let value = 'YOUR_VALUE_HERE';
      
      // Try to determine a safe default or placeholder
      if (field instanceof z.ZodDefault) {
        value = field._def.defaultValue();
      } else if (field instanceof z.ZodEnum) {
        value = field._def.values[0];
      } else if (key.toLowerCase().includes('secret') || key.toLowerCase().includes('password') || key.toLowerCase().includes('key')) {
        value = 'changeme_in_production';
      } else if (key.toLowerCase().includes('url')) {
        value = 'postgres://user:pass@localhost:5432/db';
      }

      lines.push(`${key}=${value}`);
      lines.push('');
    }
  };

  // 1. Process Common Schema
  processSchema(commonSchema, 'COMMON VARIABLES');

  // 2. Process App Specific Schemas
  for (const app in appSchemas) {
    processSchema(appSchemas[app as keyof typeof appSchemas], `${app.toUpperCase()} SPECIFIC`);
  }

  const outputPath = path.join(__dirname, '../../../.env.example');
  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log(`\x1b[32m✅ .env.example generated successfully at: ${outputPath}\x1b[0m`);
}

generateEnvExample();
