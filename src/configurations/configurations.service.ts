import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
}
