import { Module } from '@nestjs/common';
import { ConfigurationsModule } from './configurations/configurations.module';

@Module({
  imports: [ConfigurationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
