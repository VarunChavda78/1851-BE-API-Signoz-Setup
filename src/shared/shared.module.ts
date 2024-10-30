import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from './config/module-options';
import { HttpModule } from '@nestjs/axios';
import { EnvironmentConfigService } from './config/environment-config.service';

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
        synchronize: false,
        autoLoadEntities: true,
        debug: configService.get<string>('env') === 'development',
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'mysqldb',
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        replication: {
          master: {
            host: configService.get<string>('mysqldb.writeHost'),
            port: configService.get<number | undefined>('mysqldb.port'),
            database: configService.get<string>('mysqldb.name'),
            username: configService.get<string>('mysqldb.user'),
            password: configService.get<string>('mysqldb.pass'),
          },
          slaves: [
            {
              host: configService.get<string>('mysqldb.readHost'),
              port: configService.get<number | undefined>('mysqldb.port'),
              database: configService.get<string>('mysqldb.name'),
              username: configService.get<string>('mysqldb.user'),
              password: configService.get<string>('mysqldb.pass'),
            },
          ],
        },
        entities: [__dirname + '/../mysqldb/entities/*.entity{.ts,.js}'],
        timezone: 'Z',
        synchronize: false,
        autoLoadEntities: true,
        debug: configService.get<string>('env') === 'development',
      }),
    }),
    HttpModule,
  ],
  exports: [ConfigModule, EnvironmentConfigService],
  providers: [ConfigService, EnvironmentConfigService],
})
export class SharedModule {}
