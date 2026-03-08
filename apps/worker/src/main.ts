import { validateEnv } from '@apex/config';

// Protocol Alpha 1: SOLE source of truth.
// Protocol Gamma 2: Fall-fast with colorized tables if config is invalid.
const config = validateEnv('worker');

async function startWorker() {
  console.log('\x1b[32m👷 Starting Apex Worker...\x1b[0m');
  console.log(`\x1b[34mQueue Prefix:\x1b[0m ${config.QUEUE_PREFIX}`);
  
  // Real Worker logic would follow here
  console.log('\x1b[32m✅ Worker Bootstrap successful (Validation Passed)\x1b[0m');
}

startWorker();
export { config };
