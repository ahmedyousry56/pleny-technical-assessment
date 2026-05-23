import { Logger, Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { BrandsService } from '../brands.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
@Command({
  name: 'brands:export',
  description: 'Exports the entire brands collection as a JSON file.',
})
export class ExportCommand extends CommandRunner {
  constructor(private readonly brandsService: BrandsService) {
    super();
  }

  async run(): Promise<void> {
    const logger = new Logger('brands:export');
    try {
      const brands = await this.brandsService.findAll();
      const outputPath = path.resolve(process.cwd(), 'data/export-brands.json');
      const dirPath = path.dirname(outputPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(outputPath, JSON.stringify(brands, null, 2), 'utf-8');
      logger.log(`Exported ${brands.length} brands to ${outputPath}`);
    } catch (error) {
      logger.error('Brand export failed:', error);
      process.exit(1);
    }
  }
}
