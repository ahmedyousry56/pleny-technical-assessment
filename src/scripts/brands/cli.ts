import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandFactory } from 'nest-commander';
import { ConfigurationsModule } from '../../configurations/configurations.module';
import { ConfigurationsService } from '../../configurations/configurations.service';
import { BrandsModule } from './brands.module';
import { TransformCommand } from './commands/transform.command';
import { SeedCommand } from './commands/seed.command';
import { ExportCommand } from './commands/export.command';

@Module({
  imports: [
    ConfigurationsModule,
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigurationsService) => ({
        uri: config.database.uri,
        ...config.database.options,
      }),
      inject: [ConfigurationsService],
    }),
    BrandsModule,
  ],
  providers: [
    TransformCommand,
    SeedCommand,
    ExportCommand,
  ],
})
export class BrandsCliModule {}

async function bootstrap() {
  await CommandFactory.run(BrandsCliModule, ['warn', 'error', 'log']);
}

bootstrap();
