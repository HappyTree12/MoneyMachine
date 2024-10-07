/* eslint-disable n/no-process-exit */
/* eslint-disable unicorn/no-process-exit */
import { execSync } from 'node:child_process';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Please provide a migration name');
  console.error('Usage: yarn generate:migration <migration-name>');
  process.exit(1);
}

// Validate migration name
const validNameRegex = /^[\da-z]+(-[\da-z]+)*$/;

if (!validNameRegex.test(migrationName)) {
  console.error('Error: Invalid migration name.');
  console.error(
    'Migration name must be in lowercase, can include numbers, with words separated by dashes.',
  );
  console.error('Examples: create-user-table, add-column-to-users-table-2');
  process.exit(1);
}

try {
  execSync(
    `yarn typeorm migration:generate src/database/migrations/${migrationName} -d ormconfig`,
    { stdio: 'inherit' },
  );
} catch (error_) {
  console.error(
    'Failed to generate migration:',
    error_ instanceof Error ? error_.message : String(error_),
  );

  throw error_;
}
