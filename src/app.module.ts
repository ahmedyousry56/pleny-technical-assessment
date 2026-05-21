import { Module } from '@nestjs/common';
import { ConfigurationsModule } from './configurations/configurations.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { ConfigurationsService } from './configurations/configurations.service';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configurationsService: ConfigurationsService) => ({
        fallbackLanguage: configurationsService.app.defaultLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigurationsService],
    }),
    ConfigurationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
