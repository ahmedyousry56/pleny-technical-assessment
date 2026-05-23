import { Logger, Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { BrandsService } from '../brands.service';

@Injectable()
@Command({
  name: 'brands:seed',
  description: 'Insert brand documents',
})
export class SeedCommand extends CommandRunner {
  constructor(private readonly BrandsService: BrandsService) {
    super();
  }

  async run(): Promise<void> {
    const logger = new Logger('brands:seed');
    try {
      await this.BrandsService.seedBrands();
      logger.log('Brand seeding completed successfully');
    } catch (error) {
      logger.error('Brand seeding failed:', error);
      process.exit(1);
    }
  }
}
