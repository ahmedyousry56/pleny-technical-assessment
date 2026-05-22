import { Module } from '@nestjs/common';
import { ConfigurationsModule } from './configurations/configurations.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { ConfigurationsService } from './configurations/configurations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configurationsService: ConfigurationsService) => ({
        fallbackLanguage: configurationsService.app.defaultLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
        typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
      }),
      resolvers: [
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigurationsService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configurationsService: ConfigurationsService) => ({
        uri: configurationsService.database.uri,
        ...configurationsService.database.options,
      }),
      inject: [ConfigurationsService],
    }),
    ConfigurationsModule,
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
