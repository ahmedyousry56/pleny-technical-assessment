import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

@Injectable()
export class ConfigurationsService {
    constructor(
        private readonly ConfigService: ConfigService,
    ) {}

    get app() {
        return {
            name: this.ConfigService.get('APP_NAME', 'Restaurant API'),
            description: this.ConfigService.get('APP_DESCRIPTION', 'Restaurant API documentation'),
            version: this.ConfigService.get('APP_VERSION', '1.0.0'),
            port: this.ConfigService.get('PORT', 3000),
            environment: this.ConfigService.get('ENVIRONMENT', 'development'),
            defaultLanguage: this.ConfigService.get('DEFAULT_LANGUAGE', 'en'),
        };
    }
    
    get database(): {
        uri: string;
        options: MongooseModuleFactoryOptions;
    } {
        return {
            uri: this.ConfigService.getOrThrow('MONGODB_URI'),
            options: {
                maxPoolSize: 15,
                minPoolSize: 2,
                retryAttempts: 5,
                retryDelay: 2000,
            },
        };
    }
}
