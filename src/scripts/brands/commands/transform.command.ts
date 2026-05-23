import { Logger, Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { BrandsService } from '../brands.service';

@Injectable()
@Command({
  name: 'brands:transform',
  description: 'Transforms the existing brands collection in-place',
})
export class TransformCommand extends CommandRunner {
  constructor(private readonly BrandsService: BrandsService) {
    super();
  }

  async run() {
    const logger = new Logger('brands:transform');
    try {
      await this.BrandsService.transform();
      logger.log('Brand transformation completed successfully');
    } catch (error) {
      logger.error('Brand transformation failed:', error);
      process.exit(1);
    }
  }
}
