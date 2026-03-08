import { validateEnv } from '@apex/config';

// Protocol Alpha 1: SOLE source of truth. Direct process.env access is forbidden.
// Protocol Gamma 2: Fall-fast with colorized tables if config is invalid.
const config = validateEnv('api');

async function bootstrap() {
  console.log('\x1b[32m🚀 Starting Apex API...\x1b[0m');
  console.log(`\x1b[34mEnvironment:\x1b[0m ${config.NODE_ENV}`);
  console.log(`\x1b[34mPort:\x1b[0m ${config.PORT}`);
  
  // Real NestJS bootstrap would follow here
  // For now, we simulate a healthy start to verify validation
  console.log('\x1b[32m✅ API Bootstrap successful (Validation Passed)\x1b[0m');
}

bootstrap();
export { config };
