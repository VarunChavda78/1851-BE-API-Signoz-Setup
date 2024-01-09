import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from './config/module-options';
import { CommonService } from './services/common.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number | undefined>('database.port'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        timezone: 'Z',
        synchronize: true,
        autoLoadEntities: true,
        debug: configService.get<string>('env') === 'development',
      }),
    }),
    HttpModule,
  ],
  exports: [ConfigModule, CommonService],
  providers: [CommonService, ConfigService],
})
export class SharedModule {}
