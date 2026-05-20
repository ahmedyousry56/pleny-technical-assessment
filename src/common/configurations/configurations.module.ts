import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationsService } from './configurations.service';
import { configurationsSchema } from './configurations.schema';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: configurationsSchema,
            validationOptions: {
                abortEarly: false,
                allowUnknown: true,
            },
        }),
    ],
    providers: [ConfigurationsService],
    exports: [ConfigurationsService],
})
export class ConfigurationsModule {}
