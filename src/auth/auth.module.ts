import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MysqldbModule } from 'src/mysqldb/mysqldb.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [MysqldbModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
