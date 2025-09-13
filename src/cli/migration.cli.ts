#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MigrationRunnerService } from '../database/migration-runner.service';

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationRunnerService);

  try {
    console.log('🚀 Starting migration process...');
    await migrationService.runMigrations();
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function revertMigration() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationRunnerService);

  try {
    console.log('🔄 Reverting last migration...');
    await migrationService.revertLastMigration();
    console.log('✅ Last migration reverted successfully!');
  } catch (error) {
    console.error('❌ Revert failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function showStatus() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationRunnerService);

  try {
    console.log('📊 Migration status:');
    const status = await migrationService.getMigrationStatus();
    console.log('Executed migrations:', status.executed);
    console.log('Pending migrations:', status.pending);
  } catch (error) {
    console.error('❌ Failed to get status:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'run':
    runMigrations();
    break;
  case 'revert':
    revertMigration();
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log(`
Usage: npm run migration <command>

Commands:
  run     - Run pending migrations
  revert  - Revert last migration
  status  - Show migration status

Examples:
  npm run migration run
  npm run migration revert
  npm run migration status
    `);
    process.exit(1);
}
