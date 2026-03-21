import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres' as const,
    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', 5432),
    username: config.get<string>('DB_USERNAME', 'safepet_user'),
    password: config.get<string>('DB_PASSWORD', 'safepet_secret'),
    database: config.get<string>('DB_NAME', 'safepet_db'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsRun: false,
  }),
};
