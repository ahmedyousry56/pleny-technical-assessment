import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationsService {
    constructor(
        private readonly ConfigService: ConfigService,
    ) {}

    get app() {
        return {
            port: this.ConfigService.get('PORT', 3000),
            environment: this.ConfigService.get('ENVIRONMENT', 'development'),
            defaultLanguage: this.ConfigService.get('DEFAULT_LANGUAGE', 'en'),
        };
    }
}
