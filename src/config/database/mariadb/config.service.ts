import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MariadbConfigService {
  constructor(private configService: ConfigService) {}

  get DB_HOST(): string {
    return this.configService.get<string>('Mariadb.DB_HOST');
  }

  get DB_PORT(): number {
    return this.configService.get<number>('Mariadb.DB_PORT');
  }

  get DB_USERNAME(): string {
    return this.configService.get<string>('Mariadb.DB_USERNAME');
  }

  get DB_PASSWORD(): string {
    return this.configService.get<string>('Mariadb.DB_PASSWORD');
  }

  get DB_DATABASE(): string {
    return this.configService.get<string>('Mariadb.DB_DATABASE');
  }
}
