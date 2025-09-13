import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationRunnerService {
  private readonly logger = new Logger(MigrationRunnerService.name);

  constructor(private dataSource: DataSource) {}

  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Starting database migrations...');
      
      const pendingMigrations = await this.dataSource.showMigrations();
      
      if (pendingMigrations) {
        this.logger.log('Running pending migrations...');
        await this.dataSource.runMigrations();
        this.logger.log('Migrations completed successfully');
      } else {
        this.logger.log('No pending migrations found');
      }
    } catch (error) {
      this.logger.error('Error running migrations:', error);
      throw error;
    }
  }

  async revertLastMigration(): Promise<void> {
    try {
      this.logger.log('Reverting last migration...');
      await this.dataSource.undoLastMigration();
      this.logger.log('Last migration reverted successfully');
    } catch (error) {
      this.logger.error('Error reverting migration:', error);
      throw error;
    }
  }

  async getMigrationStatus(): Promise<{
    executed: string[];
    pending: string[];
  }> {
    try {
      const executedMigrations = await this.dataSource.showMigrations();
      const pendingMigrations = await this.dataSource.showMigrations();
      
      return {
        executed: executedMigrations ? [] : [],
        pending: pendingMigrations ? [] : [],
      };
    } catch (error) {
      this.logger.error('Error getting migration status:', error);
      throw error;
    }
  }
}
